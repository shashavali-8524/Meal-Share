import mongoose from 'mongoose';

// User Model - Core model for all users (students, staff, admin)
const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'staff', 'admin'],
      required: true
    },
    floor: {
      type: String,
      enum: ['ground', 'first'],
      required: function() { return this.role === 'student'; }
    },
    profileImage: {
      type: String,
      default: null
    },
    qrCode: {
      type: Buffer, // change from String to Buffer
      default: null
    },
    qrStatus: { 
      breakfast: {
      enabled: { type: Boolean, default: false },
      redeemed: { type: Boolean, default: false }, 
      }, 
      lunch: { 
        enabled: { type: Boolean, default: false },
        redeemed: { type: Boolean, default: false }
      }, 
      snacks: { 
        enabled: { type: Boolean, default: false },
        redeemed: { type: Boolean, default: false }
      },
      dinner: { 
        enabled: { type: Boolean, default: false },
        redeemed: { type: Boolean, default: false }
      },

      
  },
  mealLastUpdated: {
    type: Date,
    default: null
  }
,
    numUsed: {
      type: Number,
      default: 0,
    },
  }, {timestamps: true});
  
  const User = mongoose.model('User', UserSchema);
  export default User;