// ============================================
// MONGOOSE USER MODEL
// Farm to Fork Collective
// Supports Multi-Role Authentication, Notification Preferences,
// and Secure Password Reset with Hashed OTP & Token
// ============================================

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['customer', 'farmer', 'artisan', 'admin'],
    default: 'customer'
  },
  phone: {
    type: String,
    default: '',
    trim: true
  },
  address: {
    type: String,
    default: '',
    trim: true
  },
  city: {
    type: String,
    default: '',
    trim: true
  },
  pincode: {
    type: String,
    default: '',
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  // Farmer specific fields
  farmName: {
    type: String,
    default: ''
  },
  farmLocation: {
    type: String,
    default: ''
  },
  farmCert: {
    type: String,
    default: ''
  },
  certNumber: {
    type: String,
    default: ''
  },
  // Artisan specific fields
  artisanType: {
    type: String,
    default: ''
  },
  artisanExp: {
    type: Number,
    default: 0
  },
  brandName: {
    type: String,
    default: ''
  },
  // OAuth metadata
  googleId: {
    type: String,
    default: '',
    sparse: true
  },
  authProvider: {
    type: String,
    default: 'local'
  },
  oauthProvider: {
    type: String,
    default: ''
  },
  // Multi-Channel Notification Preferences
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    whatsapp: {
      type: Boolean,
      default: true
    }
  },
  // Cryptographically Hashed Password Reset & OTP Fields
  passwordResetTokenHash: {
    type: String,
    default: null
  },
  passwordResetTokenExpiresAt: {
    type: Date,
    default: null
  },
  passwordResetOtpHash: {
    type: String,
    default: null
  },
  passwordResetOtpExpiresAt: {
    type: Date,
    default: null
  },
  passwordResetOtpAttempts: {
    type: Number,
    default: 0
  },
  passwordResetOtpLastSentAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
