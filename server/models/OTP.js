import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  emailOrMobile: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['mobile', 'email', 'login'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Automatic collection cleanup in 5 minutes (300s)
  }
});

export default mongoose.model('OTP', otpSchema);
