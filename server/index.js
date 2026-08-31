import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

import Coordinator from './models/Coordinator.js';
import OTP from './models/OTP.js';
import Log from './models/Log.js';
import RevertedResult from './models/RevertedResult.js';
import Assignment from './models/Assignment.js';
import StudentScript from './models/StudentScript.js';
import ExtractedBlock from './models/ExtractedBlock.js';
import ConsolidatedAnswer from './models/ConsolidatedAnswer.js';

dotenv.config();

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas (with graceful local fallback)
if (MONGODB_URI && !MONGODB_URI.includes('dummy')) {
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => console.log('✅ Connected successfully to MongoDB Atlas.'))
    .catch((err) => {
      console.warn('⚠️ MongoDB Atlas is not reachable. Operating in local JSON storage mode.');
    });
} else {
  console.log('ℹ️ Running in local JSON storage mode.');
}

// ----------------------------------------------------
// Local JSON File Database Fallback (when MongoDB is offline)
// ----------------------------------------------------
const DATA_DIR = path.resolve('server/data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readCollection = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading local collection ${collection}:`, err);
    return [];
  }
};

const writeCollection = (collection, data) => {
  const filePath = getFilePath(collection);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing local collection ${collection}:`, err);
  }
};

const localDB = {
  async findOne(collection, query) {
    const data = readCollection(collection);
    return data.find(item => {
      return Object.entries(query).every(([key, val]) => {
        if (val instanceof RegExp) {
          return val.test(item[key]);
        }
        if (typeof val === 'string' && typeof item[key] === 'string') {
          return val.toLowerCase() === item[key].toLowerCase();
        }
        return item[key] === val;
      });
    });
  },
  async find(collection, query = {}) {
    const data = readCollection(collection);
    return data.filter(item => {
      return Object.entries(query).every(([key, val]) => {
        if (val instanceof RegExp) {
          return val.test(item[key]);
        }
        if (typeof val === 'string' && typeof item[key] === 'string') {
          return val.toLowerCase() === item[key].toLowerCase();
        }
        return item[key] === val;
      });
    });
  },
  async create(collection, doc) {
    const data = readCollection(collection);
    const newDoc = {
      _id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...doc,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    };
    data.push(newDoc);
    writeCollection(collection, data);
    return newDoc;
  },
  async deleteMany(collection, query) {
    let data = readCollection(collection);
    data = data.filter(item => {
      return !Object.entries(query).every(([key, val]) => {
        if (typeof val === 'string' && typeof item[key] === 'string') {
          return val.toLowerCase() === item[key].toLowerCase();
        }
        return item[key] === val;
      });
    });
    writeCollection(collection, data);
    return { deletedCount: data.length };
  },
  async deleteOne(collection, query) {
    const data = readCollection(collection);
    const index = data.findIndex(item => {
      return Object.entries(query).every(([key, val]) => {
        if (typeof val === 'string' && typeof item[key] === 'string') {
          return val.toLowerCase() === item[key].toLowerCase();
        }
        return item[key] === val;
      });
    });
    if (index !== -1) {
      data.splice(index, 1);
      writeCollection(collection, data);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  },
  async findOneAndUpdate(collection, query, update) {
    const data = readCollection(collection);
    const item = data.find(item => {
      const item_id = item._id ? String(item._id) : '';
      const query_id = query._id ? String(query._id) : '';
      if (query._id) {
        return item_id === query_id;
      }
      return Object.entries(query).every(([key, val]) => item[key] === val);
    });
    if (item) {
      Object.assign(item, update);
      writeCollection(collection, data);
      return item;
    }
    return null;
  }
};

let transientOTPs = new Map();

// ----------------------------------------------------
// Endpoints
// ----------------------------------------------------

// 1a. Send OTP for Registration
app.post('/api/auth/register-otp-send', async (req, res) => {
  try {
    const { emailOrMobile, type } = req.body;
    if (!emailOrMobile || !type || !['email', 'mobile'].includes(type)) {
      return res.status(400).json({ error: 'Email or Mobile number and verification type are required.' });
    }

    // Check if email already registered (Strict MongoDB / Local check)
    let existingUser;
    if (mongoose.connection.readyState === 1) {
      existingUser = await Coordinator.findOne({ email: emailOrMobile.toLowerCase() });
    } else {
      existingUser = await localDB.findOne('coordinators', { email: emailOrMobile.toLowerCase() });
    }
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP (DB or local fallback cache)
    if (mongoose.connection.readyState === 1) {
      await OTP.deleteMany({ emailOrMobile, type });
      await OTP.create({ emailOrMobile, otp: code, type });
    } else {
      await localDB.deleteMany('otps', { emailOrMobile, type });
      await localDB.create('otps', { emailOrMobile, otp: code, type });
    }
    
    // Always attempt to send mail if type is email
    if (type === 'email') {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"DeepScript" <${process.env.SMTP_USER}>`,
          to: emailOrMobile,
          subject: 'DeepScript Registration Verification OTP',
          text: `Hello,\n\nYour OTP for registering as a Workspace Coordinator is: ${code}\n\nThis OTP is valid for 10 minutes.\n\nThank you,\nDeepScript Team`,
          html: `<div style="font-family: sans-serif; padding: 20px; background-color: #0c0a1c; color: #fff; border-radius: 8px;">
            <h2 style="color: #00cbd6;">DeepScript Verification Code</h2>
            <p>Your OTP for registering as a Workspace Coordinator is:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid #00cbd6; display: inline-block; border-radius: 6px; margin: 16px 0; color: #00cbd6;">${code}</div>
            <p style="color: #a0a0b0; font-size: 12px;">This OTP is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
          </div>`
        });
        console.log(`[SMTP] Verification email sent successfully to: ${emailOrMobile}`);
      } else {
        console.log(`\n==================================================`);
        console.log(`[EMAIL SEND] To: ${emailOrMobile}`);
        console.log(`[EMAIL SEND] Subject: DeepScript Registration Verification OTP`);
        console.log(`[EMAIL SEND] Verification Code (OTP): ${code}`);
        console.log(`==================================================\n`);
      }
    }
    
    return res.status(200).json({
      message: `Registration ${type} OTP sent successfully.`
    });
  } catch (error) {
    console.error('Error generating registration OTP:', error);
    return res.status(500).json({ error: 'Server error during OTP generation.' });
  }
});

// 1b. Verify OTP for Registration
app.post('/api/auth/register-otp-verify', async (req, res) => {
  try {
    const { emailOrMobile, otp, type } = req.body;
    if (!emailOrMobile || !otp || !type || !['email', 'mobile'].includes(type)) {
      return res.status(400).json({ error: 'Email or Mobile number, OTP, and verification type are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const otpRecord = await OTP.findOne({ emailOrMobile, otp, type });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or incorrect verification OTP.' });
      }
      await OTP.deleteOne({ _id: otpRecord._id });
    } else {
      const otpRecord = await localDB.findOne('otps', { emailOrMobile, otp, type });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or incorrect verification OTP.' });
      }
      await localDB.deleteOne('otps', { _id: otpRecord._id });
    }

    return res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('Error verifying registration OTP:', error);
    return res.status(500).json({ error: 'Server error during OTP verification.' });
  }
});

// 1c. Direct Coordinator Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      mobile, 
      countryCode, 
      institution, 
      department, 
      username,
      verificationCode, 
      password 
    } = req.body;

    if (!name || !email || !mobile || !institution || !department || !username || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Username validation: must contain 1 uppercase letter, and digits/numbers
    const usernameHasUppercase = /[A-Z]/.test(username);
    const usernameHasNumber = /[0-9]/.test(username);
    if (!usernameHasUppercase || !usernameHasNumber) {
      return res.status(400).json({ error: 'Username must contain at least 1 uppercase letter and at least 1 digit/number.' });
    }

    // Password validation: strong password
    const passwordHasUppercase = /[A-Z]/.test(password);
    const passwordHasNumber = /[0-9]/.test(password);
    const passwordHasSpecial = /[^A-Za-z0-9]/.test(password);
    if (!passwordHasUppercase || !passwordHasNumber || !passwordHasSpecial) {
      return res.status(400).json({ error: 'Password must contain at least 1 uppercase letter, at least 1 number, and at least 1 special character.' });
    }

    // Check if email already registered
    let existingUser;
    if (mongoose.connection.readyState === 1) {
      existingUser = await Coordinator.findOne({ email });
    } else {
      existingUser = await localDB.findOne('coordinators', { email });
    }
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    // Check if username already registered (case-insensitive check)
    let existingUsername;
    if (mongoose.connection.readyState === 1) {
      existingUsername = await Coordinator.findOne({ username: new RegExp("^" + username.trim() + "$", "i") });
    } else {
      existingUsername = await localDB.findOne('coordinators', { username: new RegExp("^" + username.trim() + "$", "i") });
    }
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save Coordinator Document to MongoDB Atlas or Local JSON Database
    let newCoordinator;
    if (mongoose.connection.readyState === 1) {
      newCoordinator = await Coordinator.create({
        name,
        email,
        mobile,
        countryCode,
        institution,
        department,
        username: username.trim(),
        verificationCode: verificationCode || 'OTP_VERIFIED',
        password: hashedPassword,
        isVerified: false
      });
      console.log(`✅ Coordinator registered successfully in MongoDB Atlas: ${email}`);
    } else {
      newCoordinator = await localDB.create('coordinators', {
        name,
        email,
        mobile,
        countryCode,
        institution,
        department,
        username: username.trim(),
        verificationCode: verificationCode || 'OTP_VERIFIED',
        password: hashedPassword,
        isVerified: true // Auto-verify offline user so they can immediately login
      });
      console.log(`✅ Coordinator registered successfully in Local JSON Database: ${email}`);
    }

    return res.status(201).json({
      message: 'Account registered successfully.',
      user: {
        id: newCoordinator._id,
        name: newCoordinator.name,
        email: newCoordinator.email,
        role: 'coordinator'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 3. Initiate Coordinator Login (Validate Password and Generate OTP)
app.post('/api/auth/login-initiate', async (req, res) => {
  console.log(`\n📥 [LOGIN INITIATE] Received login request for identifier: ${req.body.emailOrMobile || req.body.mobile}`);
  try {
    const { mobile, countryCode, password, emailOrMobile } = req.body;

    const inputIdentifier = emailOrMobile || mobile;

    if (!inputIdentifier || !password) {
      console.log(`❌ [LOGIN INITIATE] Missing input identifier or password`);
      return res.status(400).json({ error: 'Email/Mobile number/Username and password are required.' });
    }

    let coordinator;
    const cleanMobile = inputIdentifier.replace(/\D/g, '');
    
    console.log(`🔍 [LOGIN INITIATE] Querying database for coordinator...`);
    if (mongoose.connection.readyState === 1) {
      coordinator = await Coordinator.findOne({ email: inputIdentifier.toLowerCase().trim() });
      if (!coordinator) {
        coordinator = await Coordinator.findOne({ username: new RegExp("^" + inputIdentifier.trim() + "$", "i") });
      }
      if (!coordinator && cleanMobile) {
        coordinator = await Coordinator.findOne({ mobile: cleanMobile, countryCode });
        if (!coordinator) {
          coordinator = await Coordinator.findOne({ mobile: cleanMobile });
        }
      }
    } else {
      console.log(`⚠️ [LOGIN INITIATE] MongoDB Atlas offline. Using localDB fallback.`);
      coordinator = await localDB.findOne('coordinators', { email: inputIdentifier.toLowerCase().trim() });
      if (!coordinator) {
        coordinator = await localDB.findOne('coordinators', { username: inputIdentifier.trim() });
      }
      if (!coordinator && cleanMobile) {
        coordinator = await localDB.findOne('coordinators', { mobile: cleanMobile });
      }
    }

    if (!coordinator) {
      console.log(`❌ [LOGIN INITIATE] Coordinator not found for identifier: ${inputIdentifier}`);
      return res.status(404).json({ error: 'Coordinator account not found. Please register first.' });
    }

    const registeredEmail = coordinator.email;
    console.log(`✅ [LOGIN INITIATE] Found coordinator profile: ${coordinator.name} (${registeredEmail})`);

    // Verify password matching
    console.log(`🔑 [LOGIN INITIATE] Verifying password...`);
    const isPasswordValid = await bcrypt.compare(password, coordinator.password);
    if (!isPasswordValid) {
      console.log(`❌ [LOGIN INITIATE] Password verification failed`);
      return res.status(401).json({ error: 'Incorrect password. Access denied.' });
    }
    console.log(`✅ [LOGIN INITIATE] Password verified successfully`);

    // Check verification status
    if (coordinator.isVerified === false) {
      console.log(`⚠️ [LOGIN INITIATE] Coordinator account is not verified by admin`);
      return res.status(403).json({ error: 'Your account is pending administrator verification. Please contact your admin.' });
    }

    // Generate random 4-digit login OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save login OTP (keyed by the registered email)
    console.log(`💾 [LOGIN INITIATE] Saving OTP code to database...`);
    if (mongoose.connection.readyState === 1) {
      await OTP.deleteMany({ emailOrMobile: registeredEmail, type: 'login' });
      await OTP.create({ emailOrMobile: registeredEmail, otp: code, type: 'login' });
    } else {
      await localDB.deleteMany('otps', { emailOrMobile: registeredEmail, type: 'login' });
      await localDB.create('otps', { emailOrMobile: registeredEmail, otp: code, type: 'login' });
    }
    console.log(`✅ [LOGIN INITIATE] OTP saved successfully`);

    // Send login OTP via email
    console.log(`✉️ [LOGIN INITIATE] Sending OTP to email: ${registeredEmail}...`);
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      console.log(`📬 [LOGIN INITIATE] Using Nodemailer/SMTP gateway with user: ${process.env.SMTP_USER}`);
      await transporter.sendMail({
        from: `"DeepScript" <${process.env.SMTP_USER}>`,
        to: registeredEmail,
        subject: 'DeepScript Login Verification OTP',
        text: `Hello,\n\nYour OTP for logging into the Coordinator Portal is: ${code}\n\nThank you,\nDeepScript Team`,
        html: `<div style="font-family: sans-serif; padding: 20px; background-color: #0c0a1c; color: #fff; border-radius: 8px;">
          <h2 style="color: #00cbd6;">DeepScript Login OTP</h2>
          <p>Your OTP for signing in as a Workspace Coordinator is:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid #00cbd6; display: inline-block; border-radius: 6px; margin: 16px 0; color: #00cbd6;">${code}</div>
          <p style="color: #a0a0b0; font-size: 12px;">If you did not request this login code, please secure your account immediately.</p>
        </div>`
      });
      console.log(`[SMTP] Login email sent successfully to: ${registeredEmail}`);
    } else {
      console.log(`\n==================================================`);
      console.log(`[EMAIL SEND] To: ${registeredEmail}`);
      console.log(`[EMAIL SEND] Subject: DeepScript Login Verification OTP`);
      console.log(`[EMAIL SEND] Verification Code (OTP): ${code}`);
      console.log(`==================================================\n`);
    }

    // Return masked email so frontend knows where OTP was dispatched
    const maskEmail = (email) => {
      const [name, domain] = email.split('@');
      if (name.length <= 2) return `${name[0]}*@${domain}`;
      return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
    };

    console.log(`📤 [LOGIN INITIATE] Responding success to client`);
    return res.status(200).json({
      message: `Login OTP sent successfully to your registered email: ${maskEmail(registeredEmail)}`,
      email: registeredEmail,
      maskedEmail: maskEmail(registeredEmail)
    });
  } catch (error) {
    console.error('Login initiate error:', error);
    return res.status(500).json({ error: 'Server error during login initialization.' });
  }
});

// 4. Verify Login OTP and Complete Sign In
app.post('/api/auth/login-verify', async (req, res) => {
  try {
    const { mobile, countryCode, otp, emailOrMobile } = req.body;

    const inputIdentifier = emailOrMobile || mobile;

    if (!inputIdentifier || !otp) {
      return res.status(400).json({ error: 'Email/Mobile number/Username and verification OTP are required.' });
    }

    let coordinator;
    const cleanMobile = inputIdentifier.replace(/\D/g, '');

    if (mongoose.connection.readyState === 1) {
      coordinator = await Coordinator.findOne({ email: inputIdentifier.toLowerCase().trim() });
      if (!coordinator) {
        coordinator = await Coordinator.findOne({ username: new RegExp("^" + inputIdentifier.trim() + "$", "i") });
      }
      if (!coordinator && cleanMobile) {
        coordinator = await Coordinator.findOne({ mobile: cleanMobile, countryCode });
        if (!coordinator) {
          coordinator = await Coordinator.findOne({ mobile: cleanMobile });
        }
      }
    } else {
      coordinator = await localDB.findOne('coordinators', { email: inputIdentifier.toLowerCase().trim() });
      if (!coordinator) {
        coordinator = await localDB.findOne('coordinators', { username: inputIdentifier.trim() });
      }
      if (!coordinator && cleanMobile) {
        coordinator = await localDB.findOne('coordinators', { mobile: cleanMobile });
      }
    }

    if (!coordinator) {
      return res.status(404).json({ error: 'Coordinator account not found.' });
    }

    const registeredEmail = coordinator.email;

    // Verify login OTP record using the registered email
    let otpRecord;
    if (mongoose.connection.readyState === 1) {
      otpRecord = await OTP.findOne({ emailOrMobile: registeredEmail, otp, type: 'login' });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired login verification code.' });
      }
      await OTP.deleteOne({ _id: otpRecord._id });
    } else {
      otpRecord = await localDB.findOne('otps', { emailOrMobile: registeredEmail, otp, type: 'login' });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired login verification code.' });
      }
      await localDB.deleteOne('otps', { _id: otpRecord._id });
    }

    console.log(`✅ Coordinator signed in successfully: ${coordinator.email}`);

    return res.status(200).json({
      message: 'Logged in successfully.',
      user: {
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        mobile: coordinator.mobile,
        countryCode: coordinator.countryCode || '+91',
        role: 'coordinator',
        isVerified: coordinator.isVerified
      }
    });
  } catch (error) {
    console.error('Login verification error:', error);
    return res.status(500).json({ error: 'Server error during login verification.' });
  }
});

// 5. Admin Login Verification
app.post('/api/auth/admin-login', async (req, res) => {
  try {
    const { adminId, password, securityKey } = req.body;

    if (!adminId || !password || !securityKey) {
      return res.status(400).json({ error: 'Admin ID/email, password, and security key are required.' });
    }

    let coordinator;
    try {
      if (mongoose.connection.readyState === 1) {
        if (adminId.includes('@')) {
          coordinator = await Coordinator.findOne({ email: adminId.toLowerCase().trim() });
        } else {
          const cleanMobile = adminId.replace(/\D/g, '');
          if (cleanMobile) {
            coordinator = await Coordinator.findOne({ mobile: cleanMobile });
          }
        }
      } else {
        if (adminId.includes('@')) {
          coordinator = await localDB.findOne('coordinators', { email: adminId.toLowerCase().trim() });
        } else {
          const cleanMobile = adminId.replace(/\D/g, '');
          if (cleanMobile) {
            coordinator = await localDB.findOne('coordinators', { mobile: cleanMobile });
          }
        }
      }
    } catch (dbErr) {
      console.warn('⚠️ Bypassed DB coordinator check:', dbErr.message);
    }

    if (coordinator) {
      const isPasswordValid = await bcrypt.compare(password, coordinator.password);
      if (isPasswordValid) {
        return res.status(403).json({ error: 'Access Denied: Coordinator credentials cannot be used to access the Admin Portal.' });
      }
    }

    const envAdminId = process.env.ADMIN_ID;
    const envAdminPassword = process.env.ADMIN_PASSWORD;
    const envAdminSecurityKey = process.env.ADMIN_SECURITY_KEY;

    if (!envAdminId || !envAdminPassword || !envAdminSecurityKey) {
      console.error('Admin credentials are not set in .env file.');
      return res.status(500).json({ error: 'Server configuration error: Admin credentials not set.' });
    }

    if (
      adminId.toLowerCase().trim() === envAdminId.toLowerCase().trim() && 
      password === envAdminPassword &&
      securityKey.toUpperCase().trim() === envAdminSecurityKey.toUpperCase().trim()
    ) {
      return res.status(200).json({ message: 'Success' });
    }

    return res.status(401).json({ error: 'Invalid Administrator credentials or security key. Access Denied.' });
  } catch (error) {
    console.error('Admin login verification error:', error);
    return res.status(500).json({ error: 'Server error during admin verification.' });
  }
});

// 6. Get all registered coordinators
app.get('/api/auth/coordinators', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const coordinators = await Coordinator.find().sort({ createdAt: -1 });
      return res.status(200).json(coordinators);
    } else {
      const coordinators = await localDB.find('coordinators');
      return res.status(200).json(coordinators.reverse());
    }
  } catch (error) {
    console.error('Error fetching coordinators:', error);
    return res.status(500).json({ error: 'Server error during fetching coordinators.' });
  }
});

// 6b. Get coordinator verification status
app.get('/api/auth/coordinators/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const idStr = String(id);
    let coordinator;
    if (mongoose.connection.readyState === 1 && !idStr.startsWith('local-')) {
      const queryId = mongoose.Types.ObjectId.isValid(idStr) ? new mongoose.Types.ObjectId(idStr) : idStr;
      coordinator = await Coordinator.findById(queryId);
    } else {
      coordinator = await localDB.findOne('coordinators', { _id: idStr });
    }

    if (!coordinator) {
      return res.status(404).json({ error: 'Coordinator not found.' });
    }

    return res.status(200).json({ isVerified: coordinator.isVerified });
  } catch (error) {
    console.error('Error fetching coordinator status:', error);
    return res.status(500).json({ error: 'Server error fetching status.' });
  }
});

// 7. Verify / Toggle a coordinator account access
app.post('/api/auth/coordinators/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    let isVerified = true;
    if (req.body.isVerified !== undefined) {
      isVerified = req.body.isVerified === true || req.body.isVerified === 'true';
    }

    console.log(`[VERIFY ACCESS] Toggle request for ID: ${id}, to new verified status: ${isVerified}`);

    const idStr = String(id);
    if (mongoose.connection.readyState === 1 && !idStr.startsWith('local-')) {
      const queryId = mongoose.Types.ObjectId.isValid(idStr) ? new mongoose.Types.ObjectId(idStr) : idStr;
      const coordinator = await Coordinator.findOneAndUpdate({ _id: queryId }, { isVerified }, { new: true });
      if (!coordinator) {
        return res.status(404).json({ error: 'Coordinator not found.' });
      }
      return res.status(200).json({ message: `Access updated to ${isVerified ? 'granted' : 'stopped'}.`, coordinator });
    } else {
      const coordinator = await localDB.findOneAndUpdate('coordinators', { _id: idStr }, { isVerified });
      if (!coordinator) {
        return res.status(404).json({ error: 'Coordinator not found.' });
      }
      return res.status(200).json({ message: `Access updated to ${isVerified ? 'granted' : 'stopped'} (Local).`, coordinator });
    }
  } catch (error) {
    console.error('Error updating coordinator access:', error);
    return res.status(500).json({ error: 'Server error during coordinator access update.' });
  }
});

// 7b. Send Email OTP for Mobile Number Update
app.post('/api/auth/update-mobile-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Save OTP (DB or localDB fallback)
    if (mongoose.connection.readyState === 1) {
      await OTP.deleteMany({ emailOrMobile: email, type: 'update-mobile' });
      await OTP.create({ emailOrMobile: email, otp: code, type: 'update-mobile' });
    } else {
      await localDB.deleteMany('otps', { emailOrMobile: email, type: 'update-mobile' });
      await localDB.create('otps', { emailOrMobile: email, otp: code, type: 'update-mobile' });
    }

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"DeepScript" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'DeepScript Update Mobile Verification OTP',
        text: `Hello,\n\nYour OTP to verify your email and update your mobile number is: ${code}\n\nThis OTP is valid for 10 minutes.\n\nThank you,\nDeepScript Team`,
        html: `<div style="font-family: sans-serif; padding: 20px; background-color: #0c0a1c; color: #fff; border-radius: 8px;">
          <h2 style="color: #00cbd6;">DeepScript Mobile Update</h2>
          <p>Your OTP to verify your email and update your mobile number is:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid #00cbd6; display: inline-block; border-radius: 6px; margin: 16px 0; color: #00cbd6;">${code}</div>
          <p style="color: #a0a0b0; font-size: 12px;">This OTP is valid for 10 minutes. If you did not request this update, please ignore this email.</p>
        </div>`
      });
      console.log(`[SMTP] Mobile update OTP sent successfully to: ${email}`);
    } else {
      console.log(`\n==================================================`);
      console.log(`[EMAIL SEND] To: ${email}`);
      console.log(`[EMAIL SEND] Subject: DeepScript Update Mobile Verification OTP`);
      console.log(`[EMAIL SEND] Verification Code (OTP): ${code}`);
      console.log(`==================================================\n`);
    }

    return res.status(200).json({ message: 'OTP sent successfully to your email.' });
  } catch (error) {
    console.error('Error generating update-mobile OTP:', error);
    return res.status(500).json({ error: 'Server error during OTP generation.' });
  }
});

// 7c. Verify OTP and Update Mobile Number
app.post('/api/auth/update-mobile-verify', async (req, res) => {
  try {
    const { email, otp, newMobile, newCountryCode } = req.body;
    if (!email || !otp || !newMobile || !newCountryCode) {
      return res.status(400).json({ error: 'Email, OTP, new mobile, and country code are required.' });
    }

    // Verify OTP record
    let otpRecord;
    if (mongoose.connection.readyState === 1) {
      otpRecord = await OTP.findOne({ emailOrMobile: email, otp, type: 'update-mobile' });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired verification code.' });
      }
      await OTP.deleteOne({ _id: otpRecord._id });
    } else {
      otpRecord = await localDB.findOne('otps', { emailOrMobile: email, otp, type: 'update-mobile' });
      if (!otpRecord) {
        return res.status(400).json({ error: 'Invalid or expired verification code.' });
      }
      await localDB.deleteOne('otps', { _id: otpRecord._id });
    }

    // Update coordinator's mobile number
    let updatedCoord;
    if (mongoose.connection.readyState === 1) {
      updatedCoord = await Coordinator.findOneAndUpdate(
        { email: email.toLowerCase() },
        { mobile: newMobile, countryCode: newCountryCode },
        { new: true }
      );
      if (!updatedCoord) {
        return res.status(404).json({ error: 'Coordinator account not found.' });
      }
    } else {
      updatedCoord = await localDB.findOneAndUpdate(
        'coordinators',
        { email: email.toLowerCase() },
        { mobile: newMobile, countryCode: newCountryCode }
      );
      if (!updatedCoord) {
        return res.status(404).json({ error: 'Coordinator account not found.' });
      }
    }

    console.log(`✅ Coordinator mobile number updated successfully: ${email} -> ${newCountryCode} ${newMobile}`);

    return res.status(200).json({
      message: 'Mobile number updated successfully.',
      user: {
        id: updatedCoord._id,
        name: updatedCoord.name,
        email: updatedCoord.email,
        mobile: updatedCoord.mobile,
        countryCode: updatedCoord.countryCode,
        role: 'coordinator'
      }
    });
  } catch (error) {
    console.error('Error updating mobile number:', error);
    return res.status(500).json({ error: 'Server error during mobile number update.' });
  }
});

// 8. Create system log entry
app.post('/api/auth/logs', async (req, res) => {
  try {
    const { action, actorRole, actorName, browser } = req.body;
    if (!action || !actorRole || !actorName || !browser) {
      return res.status(400).json({ error: 'Missing required log fields.' });
    }
    
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
    
    if (mongoose.connection.readyState === 1) {
      const newLog = await Log.create({
        action,
        actorRole,
        actorName,
        browser,
        ipAddress: cleanIp
      });
      console.log(`[LOG] Created log: ${action}`);
      return res.status(201).json(newLog);
    } else {
      const newLog = await localDB.create('logs', {
        action,
        actorRole,
        actorName,
        browser,
        ipAddress: cleanIp
      });
      console.log(`[LOG] Created local log: ${action}`);
      return res.status(201).json(newLog);
    }
  } catch (error) {
    console.error('Error creating log:', error);
    return res.status(500).json({ error: 'Server error during log creation.' });
  }
});

// 9. Get system logs (with filters)
app.get('/api/auth/logs', async (req, res) => {
  try {
    const { role, actionCategory, search } = req.query;
    
    if (mongoose.connection.readyState === 1) {
      let filter = {};
      if (role && role !== 'all') {
        filter.actorRole = role;
      }
      if (actionCategory && actionCategory !== 'all') {
        filter.action = { $regex: new RegExp(String(actionCategory), 'i') };
      }
      if (search) {
        const searchRegex = new RegExp(String(search), 'i');
        filter.$or = [
          { action: searchRegex },
          { actorName: searchRegex },
          { ipAddress: searchRegex }
        ];
      }
      const logs = await Log.find(filter).sort({ timestamp: -1 });
      return res.status(200).json(logs);
    } else {
      let logs = await localDB.find('logs');
      if (role && role !== 'all') {
        logs = logs.filter(log => log.actorRole === role);
      }
      if (actionCategory && actionCategory !== 'all') {
        const catLower = String(actionCategory).toLowerCase();
        logs = logs.filter(log => log.action.toLowerCase().includes(catLower));
      }
      if (search) {
        const searchLower = String(search).toLowerCase();
        logs = logs.filter(log =>
          log.action.toLowerCase().includes(searchLower) ||
          log.actorName.toLowerCase().includes(searchLower) ||
          log.ipAddress.toLowerCase().includes(searchLower)
        );
      }
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return res.status(200).json(logs);
    }
  } catch (error) {
    console.error('Error fetching logs:', error);
    return res.status(500).json({ error: 'Server error during fetching logs.' });
  }
});

// 10. Save / Update Coordinator Reverted Result
app.post(['/api/reverted-results', '/api/auth/reverted-results'], async (req, res) => {
  try {
    const { id, serialNo, studentBookletId, paperName, studentAnswerFileName, coordinatorName, totalScore, maxScore, questionResults, evaluatedAt, status } = req.body;
    if (!serialNo || !paperName || !coordinatorName) {
      return res.status(400).json({ error: 'Missing required evaluation fields (serialNo, paperName, coordinatorName).' });
    }

    const cleanBookletId = studentBookletId || 'N/A';
    const itemData = {
      id: id || (cleanBookletId !== 'N/A' ? `rev-${serialNo}_${cleanBookletId}` : `rev-${serialNo}`),
      serialNo,
      studentBookletId: cleanBookletId,
      paperName,
      studentAnswerFileName: studentAnswerFileName || 'Student_Script.pdf',
      coordinatorName,
      totalScore: Number(totalScore) || 0,
      maxScore: Number(maxScore) || 0,
      questionResults: Array.isArray(questionResults) ? questionResults : [],
      evaluatedAt: evaluatedAt || new Date().toLocaleString(),
      status: status || 'Evaluated & Reverted'
    };

    const searchFilter = (cleanBookletId !== 'N/A' && cleanBookletId !== 'default')
      ? { studentBookletId: cleanBookletId }
      : { serialNo: itemData.serialNo };

    if (mongoose.connection.readyState === 1) {
      const updated = await RevertedResult.findOneAndUpdate(
        searchFilter,
        itemData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✅ [REVERTED RESULT] Saved to MongoDB Atlas for Booklet: ${itemData.studentBookletId} (Serial: ${itemData.serialNo})`);
      return res.status(200).json(updated);
    } else {
      const existingList = await localDB.find('reverted_results', searchFilter);
      if (existingList.length > 0) {
        await localDB.deleteMany('reverted_results', searchFilter);
      }
      const newDoc = await localDB.create('reverted_results', itemData);
      console.log(`✅ [REVERTED RESULT] Saved to LocalDB for Booklet: ${itemData.studentBookletId} (Serial: ${itemData.serialNo})`);
      return res.status(200).json(newDoc);
    }
  } catch (error) {
    console.error('Error saving reverted result:', error);
    return res.status(500).json({ error: 'Server error saving reverted result.' });
  }
});

// 11. Fetch all Coordinator Reverted Results
app.get(['/api/reverted-results', '/api/auth/reverted-results'], async (req, res) => {
  try {
    let rawResults = [];
    if (mongoose.connection.readyState === 1) {
      rawResults = await RevertedResult.find().sort({ createdAt: -1 });
    } else {
      rawResults = await localDB.find('reverted_results');
      rawResults.sort((a, b) => new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime());
    }

    // Deduplicate strictly by booklet identity
    const deduplicated = [];
    const seenBooklets = new Set();
    for (const item of rawResults) {
      const bKey = (item.studentBookletId && item.studentBookletId !== 'N/A' && item.studentBookletId !== 'default')
        ? item.studentBookletId
        : (item.serialNo || item.id);
      if (!seenBooklets.has(bKey)) {
        seenBooklets.add(bKey);
        deduplicated.push(item);
      }
    }

    return res.status(200).json(deduplicated);
  } catch (error) {
    console.error('Error fetching reverted results:', error);
    return res.status(500).json({ error: 'Server error fetching reverted results.' });
  }
});

// 12. Delete a Reverted Result
app.delete(['/api/reverted-results/:id', '/api/auth/reverted-results/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await RevertedResult.deleteOne({ id });
    } else {
      await localDB.deleteMany('reverted_results', { id });
    }
    return res.status(200).json({ success: true, message: 'Reverted result deleted.' });
  } catch (error) {
    console.error('Error deleting reverted result:', error);
    return res.status(500).json({ error: 'Server error deleting reverted result.' });
  }
});

// 13. Save / Update Coordinator Assignments
app.post(['/api/assignments', '/api/auth/assignments'], async (req, res) => {
  try {
    const { coordinatorAssignments, coordinatorId, assignment } = req.body;
    
    // Batch save of entire coordinatorAssignments dictionary
    if (coordinatorAssignments && typeof coordinatorAssignments === 'object') {
      const allEntries = [];
      Object.entries(coordinatorAssignments).forEach(([cId, list]) => {
        if (Array.isArray(list)) {
          list.forEach(item => {
            if (item.serialNo) {
              allEntries.push({
                id: item.id || `${cId}-${item.serialNo}`,
                coordinatorId: cId,
                coordinatorName: item.coordinatorName || 'Coordinator',
                coordinatorEmail: item.coordinatorEmail || '',
                serialNo: item.serialNo,
                studentBookletId: item.studentBookletId || 'N/A',
                paperName: item.paperName || 'Question Paper',
                modelAnswerName: item.modelAnswerName || '',
                studentAnswerFileName: item.studentAnswerFileName || 'Student_Script.pdf',
                rubricName: item.rubricName || 'Custom Interactive Rubric',
                questionPaperText: item.questionPaperText || '',
                modelAnswerText: item.modelAnswerText || '',
                paperDataUrl: item.paperDataUrl || '',
                modelAnswerDataUrl: item.modelAnswerDataUrl || '',
                rubricCriteria: Array.isArray(item.rubricCriteria) ? item.rubricCriteria : [],
                questionSet: item.questionSet || 'Set-A',
                assignedAt: item.assignedAt || new Date().toLocaleString()
              });
            }
          });
        }
      });

      if (mongoose.connection.readyState === 1) {
        for (const item of allEntries) {
          await Assignment.findOneAndUpdate(
            { coordinatorId: item.coordinatorId, serialNo: item.serialNo },
            item,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
        console.log(`✅ [ASSIGNMENTS] Batch saved ${allEntries.length} items to MongoDB Atlas`);
      } else {
        for (const item of allEntries) {
          await localDB.deleteMany('assignments', { coordinatorId: item.coordinatorId, serialNo: item.serialNo });
          await localDB.create('assignments', item);
        }
        console.log(`✅ [ASSIGNMENTS] Batch saved ${allEntries.length} items to LocalDB`);
      }
      return res.status(200).json({ success: true, count: allEntries.length });
    }

    // Single item save
    if (coordinatorId && assignment && assignment.serialNo) {
      const itemData = {
        id: assignment.id || `${coordinatorId}-${assignment.serialNo}`,
        coordinatorId,
        coordinatorName: assignment.coordinatorName || 'Coordinator',
        coordinatorEmail: assignment.coordinatorEmail || '',
        serialNo: assignment.serialNo,
        studentBookletId: assignment.studentBookletId || 'N/A',
        paperName: assignment.paperName || 'Question Paper',
        modelAnswerName: assignment.modelAnswerName || '',
        studentAnswerFileName: assignment.studentAnswerFileName || 'Student_Script.pdf',
        rubricName: assignment.rubricName || 'Custom Interactive Rubric',
        questionPaperText: assignment.questionPaperText || '',
        modelAnswerText: assignment.modelAnswerText || '',
        paperDataUrl: assignment.paperDataUrl || '',
        modelAnswerDataUrl: assignment.modelAnswerDataUrl || '',
        rubricCriteria: Array.isArray(assignment.rubricCriteria) ? assignment.rubricCriteria : [],
        questionSet: assignment.questionSet || 'Set-A',
        assignedAt: assignment.assignedAt || new Date().toLocaleString()
      };

      if (mongoose.connection.readyState === 1) {
        const saved = await Assignment.findOneAndUpdate(
          { coordinatorId, serialNo: itemData.serialNo },
          itemData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`✅ [ASSIGNMENTS] Saved single assignment for Serial No ${itemData.serialNo}`);
        return res.status(200).json(saved);
      } else {
        await localDB.deleteMany('assignments', { coordinatorId, serialNo: itemData.serialNo });
        const saved = await localDB.create('assignments', itemData);
        console.log(`✅ [ASSIGNMENTS] Saved single assignment for Serial No ${itemData.serialNo} to LocalDB`);
        return res.status(200).json(saved);
      }
    }

    return res.status(400).json({ error: 'Invalid assignment payload.' });
  } catch (error) {
    console.error('Error saving assignment:', error);
    return res.status(500).json({ error: 'Server error saving assignment.' });
  }
});

// 14. Fetch all Coordinator Assignments
app.get(['/api/assignments', '/api/auth/assignments'], async (req, res) => {
  try {
    let list = [];
    if (mongoose.connection.readyState === 1) {
      list = await Assignment.find().sort({ createdAt: -1 });
    } else {
      list = await localDB.find('assignments');
      list.sort((a, b) => new Date(b.createdAt || b.timestamp).getTime() - new Date(a.createdAt || a.timestamp).getTime());
    }

    // Group items into Record<coordinatorId, Assignment[]> format
    const grouped = {};
    list.forEach(item => {
      if (!grouped[item.coordinatorId]) {
        grouped[item.coordinatorId] = [];
      }
      grouped[item.coordinatorId].push(item);
    });

    return res.status(200).json(grouped);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ error: 'Server error fetching assignments.' });
  }
});

// 15. Delete / Revoke an Assignment
app.delete(['/api/assignments/:coordinatorId/:serialNo', '/api/auth/assignments/:coordinatorId/:serialNo'], async (req, res) => {
  try {
    const { coordinatorId, serialNo } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Assignment.deleteMany({ coordinatorId, serialNo });
    } else {
      await localDB.deleteMany('assignments', { coordinatorId, serialNo });
    }
    return res.status(200).json({ success: true, message: 'Assignment revoked successfully.' });
  } catch (error) {
    console.error('Error revoking assignment:', error);
    return res.status(500).json({ error: 'Server error revoking assignment.' });
  }
});

// ====================================================================
// 16. Answer Parsing, Consolidation & Coordinator Review Subsystem
// ====================================================================

// Helper: Pipeline - Aggregate Script Blocks into Consolidated Answers
const aggregateScriptBlocks = async (script_id) => {
  let blocks = [];
  if (mongoose.connection.readyState === 1) {
    blocks = await ExtractedBlock.find({ script_id }).sort({ page_number: 1, createdAt: 1 });
  } else {
    blocks = await localDB.find('extracted_blocks', { script_id });
    blocks.sort((a, b) => (a.page_number - b.page_number) || (new Date(a.createdAt) - new Date(b.createdAt)));
  }

  // Group blocks by question_id (ignoring 'UNKNOWN' for consolidation, or creating unassigned bucket)
  const grouped = {};
  blocks.forEach(b => {
    if (!b.question_id || b.question_id === 'UNKNOWN') return;
    if (!grouped[b.question_id]) {
      grouped[b.question_id] = [];
    }
    grouped[b.question_id].push(b);
  });

  const consolidatedList = [];
  const sortedQIds = Object.keys(grouped).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  );

  for (const qId of sortedQIds) {
    const blockGroup = grouped[qId];
    // Sort blocks chronologically by page_number
    blockGroup.sort((a, b) => a.page_number - b.page_number);

    let combined_text = '';
    const block_ids = blockGroup.map(b => b.id);
    let prevPage = null;

    blockGroup.forEach((b, idx) => {
      if (idx === 0) {
        combined_text += `[Text from Page ${b.page_number}]:\n${b.raw_text}`;
      } else {
        if (b.page_number !== prevPage) {
          combined_text += `\n\n[Continuation from Page ${b.page_number}]:\n${b.raw_text}`;
        } else {
          combined_text += `\n\n[Additional Section - Page ${b.page_number}]:\n${b.raw_text}`;
        }
      }
      prevPage = b.page_number;
    });

    const consolidatedId = `cons-${script_id}-${qId}`;
    const consData = {
      id: consolidatedId,
      script_id,
      question_id: qId,
      combined_text,
      block_ids,
      is_manually_overridden: blockGroup.some(b => b.is_continuation || b.confidence_score === 1.0)
    };

    if (mongoose.connection.readyState === 1) {
      await ConsolidatedAnswer.findOneAndUpdate({ id: consolidatedId }, consData, { upsert: true, new: true });
    } else {
      const existing = await localDB.findOne('consolidated_answers', { id: consolidatedId });
      if (existing) {
        await localDB.findOneAndUpdate('consolidated_answers', { id: consolidatedId }, consData);
      } else {
        await localDB.create('consolidated_answers', consData);
      }
    }
    consolidatedList.push(consData);
  }

  return consolidatedList;
};

// Seed sample script data if empty
const seedScriptParsingData = async () => {
  try {
    let count = 0;
    if (mongoose.connection.readyState === 1) {
      count = await StudentScript.countDocuments();
    } else {
      const scripts = await localDB.find('student_scripts');
      count = scripts.length;
    }

    if (count === 0) {
      console.log('🌱 Seeding sample StudentScripts and ExtractedBlocks for Coordinator Review Subsystem...');
      
      const sampleScript1 = {
        id: 'script-101',
        studentId: 'BKT-2026-001',
        studentName: 'Student Answer Script (BCS304)',
        examId: 'BCS304-EXAM-2026',
        paperName: 'BCS304 (1).pdf - Data Structures & Applications',
        totalPages: 6,
        status: 'NEEDS_COORDINATOR_REVIEW',
        pageUrls: [
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop'
        ],
        createdAt: new Date().toISOString()
      };

      const sampleBlocks1 = [
        {
          id: 'blk-101-1',
          script_id: 'script-101',
          page_number: 1,
          question_id: 'Q1a',
          module_number: 1,
          raw_text: 'Q1(a): Define Data Structure. Explain primitive and non-primitive data structures with classification diagram and memory allocation principles.\n\n[Student Hand-Written Response - Page 1]:\nA data structure is a specialized format for organizing, processing, retrieving, and storing data in computer memory efficiently.\n• Primitive Data Structures: Int (4 bytes), Float (4 bytes), Char (1 byte), Double (8 bytes), Pointer.\n• Non-Primitive Data Structures:\n  - Linear: Arrays, Stacks, Queues, Linked Lists (sequential layout).\n  - Non-Linear: Trees, Graphs (hierarchical layout).\n• Memory Allocation: Static allocation uses stack memory at compile-time. Dynamic allocation uses heap memory at runtime via pointers.',
          confidence_score: 0.96,
          is_continuation: false,
          bounding_box: { x: 45, y: 50, width: 710, height: 220 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-2',
          script_id: 'script-101',
          page_number: 1,
          question_id: 'Q1b',
          module_number: 1,
          raw_text: 'Q1(b): Explain Knuth-Morris-Pratt (KMP) pattern matching algorithm. Trace failure function π for P = "ababaca".\n\n[Student Hand-Written Response - Page 1]:\nKMP algorithm avoids backtracking text pointer i by computing prefix function π (failure function) on pattern P.\n• Algorithm Logic: When a mismatch occurs at P[q], set q = π[q-1] to skip redundant comparisons.\n(Answer continued on Page 5...)',
          confidence_score: 0.93,
          is_continuation: false,
          bounding_box: { x: 45, y: 300, width: 710, height: 200 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-2c',
          script_id: 'script-101',
          page_number: 1,
          question_id: 'Q1c',
          module_number: 1,
          raw_text: 'Q1(c): Differentiate between Linear and Non-Linear Data Structures with memory layout examples.\n\n[Student Hand-Written Response - Page 1]:\n• Linear Data Structures: Elements are arranged sequentially in memory (Arrays, Stacks, Queues, Linked Lists). Single-level traversal.\n• Non-Linear Data Structures: Elements are arranged hierarchically or interconnected (Trees, Graphs). Multi-level traversal logic.',
          confidence_score: 0.95,
          is_continuation: false,
          bounding_box: { x: 45, y: 520, width: 710, height: 200 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-3',
          script_id: 'script-101',
          page_number: 2,
          question_id: 'Q2a',
          module_number: 1,
          raw_text: 'Q2(a): Explain dynamic memory allocation functions in C: malloc(), calloc(), realloc(), free().\n\n[Student Hand-Written Response]:\n• malloc(size_t size): Allocates uninitialized memory on heap. Returns void* or NULL.\n• calloc(num, size): Allocates zero-initialized contiguous memory.\n• realloc(ptr, new_size): Resizes existing block.\n• free(ptr): Deallocates memory block to prevent memory leaks.',
          confidence_score: 0.89,
          is_continuation: false,
          bounding_box: { x: 40, y: 50, width: 720, height: 250 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-4',
          script_id: 'script-101',
          page_number: 3,
          question_id: 'Q3a',
          module_number: 2,
          raw_text: 'Q3(a): Define Stack ADT. Explain array implementation of Stack with push(), pop(), display().\n\n[Student Hand-Written Response]:\nStack is LIFO linear list.\n• Push: Check if top == MAX - 1 (Overflow). top++; stack[top] = item;\n• Pop: Check if top == -1 (Underflow). item = stack[top]; top--; return item;',
          confidence_score: 0.95,
          is_continuation: false,
          bounding_box: { x: 45, y: 80, width: 700, height: 310 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-5',
          script_id: 'script-101',
          page_number: 4,
          question_id: 'Q3b',
          module_number: 2,
          raw_text: 'Q3(b): Infix to Postfix conversion for ((A + B) * C - (D - E) ^ (F + G)).\n\n[Student Hand-Written Response - Multi-Page Continuation]:\nStep-by-step operator stack trace table:\nInfix expression: ((A + B) * C - (D - E) ^ (F + G))\nFinal Postfix Result: AB+C*DE-FG+^-',
          confidence_score: 0.88,
          is_continuation: true,
          bounding_box: { x: 45, y: 500, width: 710, height: 220 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-5cont',
          script_id: 'script-101',
          page_number: 5,
          question_id: 'Q1b',
          module_number: 1,
          raw_text: 'Q1(b) [Continuation from Page 1 - Multi-Page KMP Pattern Matching]:\n\n[Student Hand-Written Response - Page 5]:\nTracing KMP failure function π for Pattern P = "ababaca":\n• Index: 1 2 3 4 5 6 7\n• Char:  a b a b a c a\n• π val: 0 0 1 2 3 0 1\nMatching Phase: Searching P in Text T = "abxababaca". Match found starting at index 4 in O(n + m) time complexity.',
          confidence_score: 0.94,
          is_continuation: true,
          bounding_box: { x: 45, y: 50, width: 710, height: 220 },
          createdAt: new Date().toISOString()
        },
        {
          id: 'blk-101-6',
          script_id: 'script-101',
          page_number: 6,
          question_id: 'Q9a',
          module_number: 5,
          raw_text: 'Q9(a): Define Graph Data Structure. Explain Graph representations using Adjacency Matrix and Adjacency List with examples and memory comparison.\n\n[Student Hand-Written Response - Page 6]:\nA Graph G = (V, E) is a non-linear data structure consisting of vertices V and edges E connecting pairs of vertices.\n• Adjacency Matrix: V x V 2D array representation. Fast O(1) edge lookup, but O(V²) space complexity.\n• Adjacency List: Array of linked lists representing adjacent vertices. O(V + E) space complexity; efficient for sparse graphs.\n• Graph Traversals: BFS uses Queue (level-order traversal); DFS uses Stack / Recursion (path discovery).',
          confidence_score: 0.97,
          is_continuation: false,
          bounding_box: { x: 40, y: 50, width: 720, height: 280 },
          createdAt: new Date().toISOString()
        }
      ];

      if (mongoose.connection.readyState === 1) {
        await StudentScript.create(sampleScript1);
        await ExtractedBlock.insertMany(sampleBlocks1);
      } else {
        await localDB.create('student_scripts', sampleScript1);
        for (const b of sampleBlocks1) {
          await localDB.create('extracted_blocks', b);
        }
      }

      await aggregateScriptBlocks('script-101');
      console.log('✅ Sample script & blocks seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding script parsing data:', err);
  }
};

// Seed on server startup
setTimeout(() => {
  seedScriptParsingData();
}, 2000);

// API 1: GET /api/coordinator/scripts/review-queue
app.get('/api/coordinator/scripts/review-queue', async (req, res) => {
  try {
    let scripts = [];
    if (mongoose.connection.readyState === 1) {
      scripts = await StudentScript.find({ status: 'NEEDS_COORDINATOR_REVIEW' }).sort({ createdAt: -1 });
    } else {
      const allScripts = await localDB.find('student_scripts');
      scripts = allScripts.filter(s => s.status === 'NEEDS_COORDINATOR_REVIEW');
    }
    return res.status(200).json(scripts);
  } catch (error) {
    console.error('Error fetching review queue:', error);
    return res.status(500).json({ error: 'Server error fetching coordinator review queue.' });
  }
});

// API 2: GET /api/coordinator/scripts/:id/blocks
app.get('/api/coordinator/scripts/:id/blocks', async (req, res) => {
  try {
    const script_id = req.params.id;
    let script, blocks, consolidatedAnswers;

    if (mongoose.connection.readyState === 1) {
      script = await StudentScript.findOne({ id: script_id });
      blocks = await ExtractedBlock.find({ script_id }).sort({ page_number: 1, createdAt: 1 });
      consolidatedAnswers = await ConsolidatedAnswer.find({ script_id });
    } else {
      script = await localDB.findOne('student_scripts', { id: script_id });
      blocks = await localDB.find('extracted_blocks', { script_id });
      blocks.sort((a, b) => (a.page_number - b.page_number) || (new Date(a.createdAt) - new Date(b.createdAt)));
      consolidatedAnswers = await localDB.find('consolidated_answers', { script_id });
    }

    if (!script) {
      return res.status(404).json({ error: 'Student script not found.' });
    }

    return res.status(200).json({
      script,
      blocks,
      consolidatedAnswers
    });
  } catch (error) {
    console.error('Error fetching script blocks:', error);
    return res.status(500).json({ error: 'Server error fetching script blocks.' });
  }
});

// API 3: POST /api/coordinator/scripts/:id/reassign-block
app.post('/api/coordinator/scripts/:id/reassign-block', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { block_id, new_question_id, new_module } = req.body;

    if (!block_id || !new_question_id) {
      return res.status(400).json({ error: 'block_id and new_question_id are required.' });
    }

    let updatedBlock;
    const updateFields = {
      question_id: new_question_id.trim(),
      confidence_score: 1.0, // Manual human coordinator assignment boosts confidence to 1.0
      is_continuation: false
    };
    if (new_module !== undefined) {
      updateFields.module_number = Number(new_module);
    }

    if (mongoose.connection.readyState === 1) {
      updatedBlock = await ExtractedBlock.findOneAndUpdate({ id: block_id, script_id }, updateFields, { new: true });
    } else {
      updatedBlock = await localDB.findOneAndUpdate('extracted_blocks', { id: block_id, script_id }, updateFields);
    }

    if (!updatedBlock) {
      return res.status(404).json({ error: 'Extracted block not found.' });
    }

    // Re-run aggregation pipeline for script
    const consolidated = await aggregateScriptBlocks(script_id);

    return res.status(200).json({
      message: `Block successfully reassigned to ${new_question_id}`,
      updatedBlock,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error reassigning block:', error);
    return res.status(500).json({ error: 'Server error reassigning block.' });
  }
});

// API 4: POST /api/coordinator/scripts/:id/merge-blocks
app.post('/api/coordinator/scripts/:id/merge-blocks', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { target_question_id, ordered_block_ids } = req.body;

    if (!target_question_id || !Array.isArray(ordered_block_ids)) {
      return res.status(400).json({ error: 'target_question_id and ordered_block_ids array are required.' });
    }

    // Update each block's question_id and mark as continuation if > index 0
    for (let idx = 0; idx < ordered_block_ids.length; idx++) {
      const bId = ordered_block_ids[idx];
      const isCont = idx > 0;
      if (mongoose.connection.readyState === 1) {
        await ExtractedBlock.findOneAndUpdate(
          { id: bId, script_id },
          { question_id: target_question_id, is_continuation: isCont, confidence_score: 1.0 }
        );
      } else {
        await localDB.findOneAndUpdate(
          'extracted_blocks',
          { id: bId, script_id },
          { question_id: target_question_id, is_continuation: isCont, confidence_score: 1.0 }
        );
      }
    }

    // Re-aggregate answers
    const consolidated = await aggregateScriptBlocks(script_id);

    return res.status(200).json({
      message: `Merged ${ordered_block_ids.length} blocks for question ${target_question_id}`,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error merging blocks:', error);
    return res.status(500).json({ error: 'Server error merging blocks.' });
  }
});

// API 5: POST /api/coordinator/scripts/:id/create-block (Manual selection tool)
app.post('/api/coordinator/scripts/:id/create-block', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { page_number, question_id, module_number, raw_text, bounding_box } = req.body;

    if (!page_number || !raw_text) {
      return res.status(400).json({ error: 'page_number and raw_text are required.' });
    }

    const newBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      script_id,
      page_number: Number(page_number),
      question_id: (question_id || 'UNKNOWN').trim(),
      module_number: Number(module_number || 1),
      raw_text,
      confidence_score: 1.0,
      is_continuation: false,
      bounding_box: bounding_box || { x: 50, y: 50, width: 700, height: 200 },
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      await ExtractedBlock.create(newBlock);
    } else {
      await localDB.create('extracted_blocks', newBlock);
    }

    const consolidated = await aggregateScriptBlocks(script_id);

    return res.status(201).json({
      message: 'New manual block created successfully.',
      block: newBlock,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error creating manual block:', error);
    return res.status(500).json({ error: 'Server error creating manual block.' });
  }
});

// API 6: POST /api/coordinator/scripts/:id/approve-and-aggregate
app.post('/api/coordinator/scripts/:id/approve-and-aggregate', async (req, res) => {
  try {
    const script_id = req.params.id;

    // Run final aggregation
    const consolidated = await aggregateScriptBlocks(script_id);

    // Check if there are any UNKNOWN unassigned blocks remaining
    let unassignedBlocks = [];
    if (mongoose.connection.readyState === 1) {
      unassignedBlocks = await ExtractedBlock.find({ script_id, question_id: 'UNKNOWN' });
    } else {
      const allBlocks = await localDB.find('extracted_blocks', { script_id });
      unassignedBlocks = allBlocks.filter(b => b.question_id === 'UNKNOWN');
    }

    if (unassignedBlocks.length > 0) {
      console.warn(`[APPROVE WARNING] Script ${script_id} has ${unassignedBlocks.length} unassigned blocks remaining.`);
    }

    // Update script status to READY_FOR_EVALUATION
    let updatedScript;
    if (mongoose.connection.readyState === 1) {
      updatedScript = await StudentScript.findOneAndUpdate(
        { id: script_id },
        { status: 'READY_FOR_EVALUATION' },
        { new: true }
      );
    } else {
      updatedScript = await localDB.findOneAndUpdate(
        'student_scripts',
        { id: script_id },
        { status: 'READY_FOR_EVALUATION' }
      );
    }

    return res.status(200).json({
      message: 'Script parsing and block consolidation approved! Script status updated to READY_FOR_EVALUATION and pushed to AI grading queue.',
      script: updatedScript,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error approving script:', error);
    return res.status(500).json({ error: 'Server error approving script.' });
  }
});

// API 7: POST /api/coordinator/scripts/:id/update-block (Inline editing / Continuation toggle)
app.post('/api/coordinator/scripts/:id/update-block', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { block_id, raw_text, question_id, module_number, is_continuation, confidence_score } = req.body;

    if (!block_id) {
      return res.status(400).json({ error: 'block_id is required.' });
    }

    const updateFields = {};
    if (raw_text !== undefined) updateFields.raw_text = raw_text;
    if (question_id !== undefined) updateFields.question_id = question_id.trim();
    if (module_number !== undefined) updateFields.module_number = Number(module_number);
    if (is_continuation !== undefined) updateFields.is_continuation = Boolean(is_continuation);
    if (confidence_score !== undefined) updateFields.confidence_score = Number(confidence_score);

    let updatedBlock;
    if (mongoose.connection.readyState === 1) {
      updatedBlock = await ExtractedBlock.findOneAndUpdate({ id: block_id, script_id }, updateFields, { new: true });
    } else {
      updatedBlock = await localDB.findOneAndUpdate('extracted_blocks', { id: block_id, script_id }, updateFields);
    }

    if (!updatedBlock) {
      return res.status(404).json({ error: 'Extracted block not found.' });
    }

    const consolidated = await aggregateScriptBlocks(script_id);
    return res.status(200).json({
      message: 'Block updated successfully.',
      block: updatedBlock,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error updating block:', error);
    return res.status(500).json({ error: 'Server error updating block.' });
  }
});

// API 7B: POST /api/coordinator/scripts/:id/save-all-blocks (Commit all bounding boxes and grab handle resizes)
app.post('/api/coordinator/scripts/:id/save-all-blocks', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { blocks, consolidatedAnswers } = req.body;

    if (!Array.isArray(blocks)) {
      return res.status(400).json({ error: 'blocks array is required.' });
    }

    for (const b of blocks) {
      const bPayload = {
        id: b.id,
        script_id: b.script_id || script_id,
        page_number: b.page_number,
        question_id: b.question_id,
        module_number: b.module_number || 1,
        raw_text: b.raw_text || '',
        confidence_score: b.confidence_score || 1.0,
        is_continuation: Boolean(b.is_continuation),
        bounding_box: b.bounding_box || { x: 4, y: 4, width: 92, height: 92 }
      };

      if (mongoose.connection.readyState === 1) {
        await ExtractedBlock.findOneAndUpdate(
          { id: b.id, script_id },
          bPayload,
          { upsert: true, new: true }
        );
      } else {
        const existing = await localDB.findOne('extracted_blocks', { id: b.id, script_id });
        if (existing) {
          await localDB.findOneAndUpdate('extracted_blocks', { id: b.id, script_id }, bPayload);
        } else {
          await localDB.insertOne('extracted_blocks', bPayload);
        }
      }
    }

    const aggregated = await aggregateScriptBlocks(script_id);

    return res.status(200).json({
      message: 'All bounding box positions, grab handle resizes, and question assignments saved successfully!',
      blocks,
      consolidatedAnswers: aggregated
    });
  } catch (error) {
    console.error('Error saving all blocks:', error);
    return res.status(500).json({ error: 'Server error saving all blocks.' });
  }
});

// API 8: POST /api/coordinator/scripts/:id/delete-block (Delete noise block)
app.post('/api/coordinator/scripts/:id/delete-block', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { block_id } = req.body;

    if (!block_id) {
      return res.status(400).json({ error: 'block_id is required.' });
    }

    if (mongoose.connection.readyState === 1) {
      await ExtractedBlock.deleteOne({ id: block_id, script_id });
    } else {
      await localDB.deleteOne('extracted_blocks', { id: block_id, script_id });
    }

    const consolidated = await aggregateScriptBlocks(script_id);
    return res.status(200).json({
      message: 'Block deleted successfully.',
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error deleting block:', error);
    return res.status(500).json({ error: 'Server error deleting block.' });
  }
});

// API 9: POST /api/coordinator/scripts/:id/split-block (Split block at index)
app.post('/api/coordinator/scripts/:id/split-block', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { block_id, split_index, new_question_id_2 } = req.body;

    if (!block_id || split_index === undefined) {
      return res.status(400).json({ error: 'block_id and split_index are required.' });
    }

    let origBlock;
    if (mongoose.connection.readyState === 1) {
      origBlock = await ExtractedBlock.findOne({ id: block_id, script_id });
    } else {
      origBlock = await localDB.findOne('extracted_blocks', { id: block_id, script_id });
    }

    if (!origBlock) {
      return res.status(404).json({ error: 'Block not found.' });
    }

    const fullText = origBlock.raw_text || '';
    const text1 = fullText.substring(0, split_index).trim();
    const text2 = fullText.substring(split_index).trim();

    if (!text1 || !text2) {
      return res.status(400).json({ error: 'Split point invalid or results in empty text snippet.' });
    }

    // Update block 1
    if (mongoose.connection.readyState === 1) {
      await ExtractedBlock.findOneAndUpdate({ id: block_id }, { raw_text: text1 });
    } else {
      await localDB.findOneAndUpdate('extracted_blocks', { id: block_id }, { raw_text: text1 });
    }

    // Create block 2
    const block2 = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      script_id,
      page_number: origBlock.page_number,
      question_id: (new_question_id_2 || origBlock.question_id || 'UNKNOWN').trim(),
      module_number: origBlock.module_number || 1,
      raw_text: text2,
      confidence_score: 1.0,
      is_continuation: new_question_id_2 ? false : true,
      bounding_box: origBlock.bounding_box || { x: 50, y: 300, width: 700, height: 150 },
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      await ExtractedBlock.create(block2);
    } else {
      await localDB.create('extracted_blocks', block2);
    }

    const consolidated = await aggregateScriptBlocks(script_id);
    return res.status(200).json({
      message: 'Block successfully split into two separate answer blocks.',
      block1_id: block_id,
      block2_id: block2.id,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error splitting block:', error);
    return res.status(500).json({ error: 'Server error splitting block.' });
  }
});

// API 10: POST /api/coordinator/scripts/:id/auto-detect-continuations
app.post('/api/coordinator/scripts/:id/auto-detect-continuations', async (req, res) => {
  try {
    const script_id = req.params.id;
    let blocks = [];

    if (mongoose.connection.readyState === 1) {
      blocks = await ExtractedBlock.find({ script_id }).sort({ page_number: 1, createdAt: 1 });
    } else {
      blocks = await localDB.find('extracted_blocks', { script_id });
      blocks.sort((a, b) => (a.page_number - b.page_number) || (new Date(a.createdAt) - new Date(b.createdAt)));
    }

    // Group blocks by question_id (ignoring UNKNOWN)
    const questionGroups = {};
    blocks.forEach(b => {
      if (b.question_id && b.question_id !== 'UNKNOWN') {
        if (!questionGroups[b.question_id]) questionGroups[b.question_id] = [];
        questionGroups[b.question_id].push(b);
      }
    });

    let detectedCount = 0;
    for (const [qId, qBlks] of Object.entries(questionGroups)) {
      if (qBlks.length > 1) {
        qBlks.sort((a, b) => a.page_number - b.page_number);
        // First block is primary (is_continuation: false), subsequent blocks are continuations (is_continuation: true)
        for (let i = 1; i < qBlks.length; i++) {
          const b = qBlks[i];
          if (!b.is_continuation) {
            b.is_continuation = true;
            b.confidence_score = Math.max(b.confidence_score || 0.9, 0.95);
            detectedCount++;

            if (mongoose.connection.readyState === 1) {
              await ExtractedBlock.findOneAndUpdate({ id: b.id }, { is_continuation: true, confidence_score: b.confidence_score });
            } else {
              await localDB.findOneAndUpdate('extracted_blocks', { id: b.id }, { is_continuation: true, confidence_score: b.confidence_score });
            }
          }
        }
      }
    }

    const consolidated = await aggregateScriptBlocks(script_id);
    return res.status(200).json({
      message: `Auto-detection completed. Linked ${detectedCount} multi-page continuation block(s).`,
      detectedCount,
      consolidatedAnswers: consolidated
    });
  } catch (error) {
    console.error('Error auto-detecting continuations:', error);
    return res.status(500).json({ error: 'Server error auto-detecting continuations.' });
  }
});

// API 11: POST /api/coordinator/scripts/:id/update-consolidated-answer
app.post('/api/coordinator/scripts/:id/update-consolidated-answer', async (req, res) => {
  try {
    const script_id = req.params.id;
    const { question_id, combined_text } = req.body;

    if (!question_id || combined_text === undefined) {
      return res.status(400).json({ error: 'question_id and combined_text are required.' });
    }

    const consolidatedId = `cons-${script_id}-${question_id}`;
    const updateData = {
      combined_text,
      is_manually_overridden: true
    };

    let updatedConsolidated;
    if (mongoose.connection.readyState === 1) {
      updatedConsolidated = await ConsolidatedAnswer.findOneAndUpdate({ id: consolidatedId }, updateData, { upsert: true, new: true });
    } else {
      const existing = await localDB.findOne('consolidated_answers', { id: consolidatedId });
      if (existing) {
        updatedConsolidated = await localDB.findOneAndUpdate('consolidated_answers', { id: consolidatedId }, updateData);
      } else {
        updatedConsolidated = await localDB.create('consolidated_answers', { id: consolidatedId, script_id, question_id, combined_text, block_ids: [], is_manually_overridden: true });
      }
    }

    return res.status(200).json({
      message: `Consolidated answer for ${question_id} updated.`,
      consolidatedAnswer: updatedConsolidated
    });
  } catch (error) {
    console.error('Error updating consolidated answer:', error);
    return res.status(500).json({ error: 'Server error updating consolidated answer.' });
  }
});

// API 12: POST /api/coordinator/scripts/seed (Force re-seed endpoint)
app.post('/api/coordinator/scripts/seed', async (req, res) => {
  try {
    await seedScriptParsingData();
    return res.status(200).json({ message: 'Seed triggered successfully.' });
  } catch (error) {
    return res.status(500).json({ error: 'Error seeding data.' });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express API server running on port ${PORT}`);
});

