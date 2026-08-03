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

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected successfully to MongoDB Atlas.'))
  .catch((err) => console.error('❌ MongoDB Atlas connection error:', err));

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

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express API server running on port ${PORT}`);
});
