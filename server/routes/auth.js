// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// // const { body, validationResult } = require('express-validator');
// const auth = require('../middleware/auth');
// const roleCheck = require('../middleware/roleCheck');
// const User = require('../models/User');
// const MealSharing = require('../models/MealSharing');
// const Redemption = require('../models/Redemption');
// const Settings = require('../models/Settings');
// const Terms = require('../models/Terms');
// const UserTerms = require('../models/UserTerms');
// const Notification = require('../models/Notification');
// const ActivityLog = require('../models/ActivityLog');
// const Stats = require('../models/Stats');
// const QRCode = require('qrcode');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });



import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
// import auth from '../middleware/auth.js';
// import roleCheck from '../middleware/roleCheck.js';
import User from "../models/User.js";
// import MealSharing from '../models/MealSharing.js';
// import Redemption from '../models/Redemption.js';
// import Settings from '../models/Settings.js';
// import Terms from '../models/Terms.js';
// import UserTerms from '../models/UserTerms.js';
// import Notification from '../models/Notification.js';
// import ActivityLog from '../models/ActivityLog.js';
// import Stats from '../models/Stats.js';
// import QRCode from 'qrcode';
// import multer from 'multer';

const router = express.Router();
// const upload = multer({ dest: 'uploads/' });



// ===== AUTH ROUTES =====

/**
 * @route   POST api/auth/signup
 * @desc    Register a user
 * @access  Public
 */
router.post('/auth/signup', async (req, res) => {

  const { name, email, password, role, floor } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }


    // Create new user
    user = new User({
      name,
      email,
      password,
      role: role || 'student', // Default role for signup
      floor
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

   const token =  jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie("jwt", token ,{
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: 'Strict' // Adjust as needed
    })

    res.status(201).json({user: user});
}
   catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   POST api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/auth/login',  async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }


    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token =  jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.cookie("jwt", token ,{
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
          sameSite: 'Strict' // Adjust as needed
      })
  
      res.status(201).json({user: user});
  
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// /**
//  * @route   GET api/auth/me
//  * @desc    Get current user
//  * @access  Private
// //  */
// router.get('/auth/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

/**
 * @route   POST api/auth/logout
 * @desc    Logout user (client-side only, just logs activity)
 * @access  Private
 */
router.post('/auth/logout', async (req, res) => {
  try {
    res.cookie("jwt","",{maxAge:0});
    
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// // ===== USER ROUTES =====

// /**
//  * @route   PUT api/users/profile
//  * @desc    Update user profile
//  * @access  Private
//  */
// router.put('/users/profile', async (req, res) => {
  

//   const { name, floor, password } = req.body;

//   try {
//     const user = await User.findById(req.user.id);
    
//     // Update fields
//     user.name = name;
//     if (floor) user.floor = floor;
    
//     // Update password if provided
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }
    
//     user.updatedAt = Date.now();
    
//     await user.save();
    
//     res.json({
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         floor: user.floor
//       }
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// //Todo 2
// /**
//  * @route   POST api/users/qr-code
//  * @desc    Upload user QR code
//  * @access  Private
//  */
// router.post('/users/qr-code', [auth, upload.single('qrCode')], async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ errors: [{ msg: 'No file uploaded' }] });
//     }
    
//     const user = await User.findById(req.user.id);
//     user.qrCode = req.file.path;
//     user.updatedAt = Date.now();
    
//     await user.save();
    
//     res.json({ qrCode: req.file.path });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ===== MEAL SHARING ROUTES =====

// /**
//  * @route   GET api/meal-sharing/status
//  * @desc    Get user's meal sharing status
//  * @access  Private
//  */
// router.get('/meal-sharing/status', auth, async (req, res) => {
//   try {
//     // Get today's date (start of day)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Get tomorrow's date (start of day)
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Find active meal sharings for the user
//     const mealSharings = await MealSharing.find({
//       student: req.user.id,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     // Format response
//     const status = {
//       breakfast: false,
//       lunch: false,
//       snacks: false,
//       dinner: false
//     };
    
//     const locks = {
//       breakfast: null,
//       lunch: null,
//       snacks: null,
//       dinner: null
//     };
    
//     mealSharings.forEach(sharing => {
//       status[sharing.mealType] = sharing.isActive;
//       locks[sharing.mealType] = sharing.lockedUntil.getTime();
//     });
    
//     res.json({
//       status,
//       locks
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   POST api/meal-sharing/toggle
//  * @desc    Toggle meal sharing status
//  * @access  Private
//  */
// router.post('/meal-sharing/toggle', [auth, [
//   body('meal', 'Meal type is required').isIn(['breakfast', 'lunch', 'snacks', 'dinner'])
// ]], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { meal } = req.body;

//   try {
//     // Get user details
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ errors: [{ msg: 'User not found' }] });
//     }
    
//     // Get today's date (start of day)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Get tomorrow's date (start of day)
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Find existing meal sharing for today
//     let mealSharing = await MealSharing.findOne({
//       student: req.user.id,
//       mealType: meal,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     // Get settings for lock duration
//     const settings = await Settings.findOne({}) || { lockDurationHours: 24 };
    
//     if (mealSharing) {
//       // Check if locked
//       const now = new Date();
//       if (mealSharing.isActive && mealSharing.lockedUntil > now) {
//         return res.status(400).json({ 
//           errors: [{ msg: 'Meal sharing cannot be turned off until the lock expires' }]
//         });
//       }
      
//       // Toggle status
//       mealSharing.isActive = !mealSharing.isActive;
      
//       // If turning on, set lock
//       if (mealSharing.isActive) {
//         const lockUntil = new Date();
//         lockUntil.setHours(lockUntil.getHours() + settings.lockDurationHours);
//         mealSharing.lockedUntil = lockUntil;
//       }
      
//       await mealSharing.save();
//     } else {
//       // Create new meal sharing
//       const lockUntil = new Date();
//       lockUntil.setHours(lockUntil.getHours() + settings.lockDurationHours);
      
//       // Generate QR code data
//       const qrData = {
//         userId: req.user.id,
//         meal,
//         date: today,
//         floor: user.floor,
//         timestamp: Date.now()
//       };
      
//       const qrCodeData = await QRCode.toDataURL(JSON.stringify(qrData));
      
//       mealSharing = new MealSharing({
//         student: req.user.id,
//         mealType: meal,
//         date: today,
//         isActive: true,
//         lockedUntil: lockUntil,
//         qrCodeData,
//         floor: user.floor
//       });
      
//       await mealSharing.save();
      
//       // Update stats
//       let stats = await Stats.findOne({ date: today });
//       if (!stats) {
//         stats = new Stats({ date: today });
//       }
      
//       stats.totalMealsShared += 1;
//       stats.mealTypeBreakdown[meal] += 1;
//       stats.floorBreakdown[user.floor] += 1;
//       stats.updatedAt = Date.now();
      
//       await stats.save();
//     }
    
//     // Get updated status
//     const mealSharings = await MealSharing.find({
//       student: req.user.id,
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     });
    
//     // Format response
//     const status = {
//       breakfast: false,
//       lunch: false,
//       snacks: false,
//       dinner: false
//     };
    
//     const locks = {
//       breakfast: null,
//       lunch: null,
//       snacks: null,
//       dinner: null
//     };
    
//     mealSharings.forEach(sharing => {
//       status[sharing.mealType] = sharing.isActive;
//       locks[sharing.mealType] = sharing.lockedUntil.getTime();
//     });
    
//     // Create activity log
//     const activity = new ActivityLog({
//       user: req.user.id,
//       action: mealSharing.isActive ? 'MEAL_SHARING_ENABLED' : 'MEAL_SHARING_DISABLED',
//       details: { meal },
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent']
//     });

//     await activity.save();
    
//     res.json({
//       status,
//       locks
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   GET api/meal-sharing/stats
//  * @desc    Get user's meal sharing stats
//  * @access  Private
//  */
// router.get('/meal-sharing/stats', auth, async (req, res) => {
//   try {
//     // Count total meals shared by user
//     const totalShared = await MealSharing.countDocuments({
//       student: req.user.id,
//       isActive: true
//     });
    
//     res.json({ smilesShared: totalShared });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ===== STAFF ROUTES =====

// /**
//  * @route   GET api/staff/available-qrs
//  * @desc    Get available QR codes for staff
//  * @access  Private (Staff only)
//  */
// router.get('/staff/available-qrs', [auth, roleCheck('staff')], async (req, res) => {
//   try {
//     // Get today's date (start of day)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Get tomorrow's date (start of day)
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Find active meal sharings that haven't been redeemed
//     const mealSharings = await MealSharing.find({
//       date: {
//         $gte: today,
//         $lt: tomorrow
//       },
//       isActive: true,
//       redeemedBy: null
//     }).populate('student', 'name floor');
    
//     // Format response
//     const availableQRs = mealSharings.map(sharing => ({
//       id: sharing._id,
//       floor: sharing.floor,
//       mealType: sharing.mealType,
//       redeemed: false,
//       studentName: sharing.student.name
//     }));
    
//     res.json(availableQRs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   GET api/staff/redeemed-qrs
//  * @desc    Get redeemed QR codes for staff
//  * @access  Private (Staff only)
//  */
// router.get('/staff/redeemed-qrs', [auth, roleCheck('staff')], async (req, res) => {
//   try {
//     // Get today's date (start of day)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     // Get tomorrow's date (start of day)
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     // Find redemptions made by this staff
//     const redemptions = await Redemption.find({
//       staff: req.user.id,
//       redeemedAt: {
//         $gte: today,
//         $lt: tomorrow
//       }
//     }).populate({
//       path: 'mealSharing',
//       populate: {
//         path: 'student',
//         select: 'name'
//       }
//     });
    
//     // Format response
//     const redeemedQRs = redemptions.map(redemption => ({
//       id: redemption.mealSharing._id,
//       floor: redemption.mealSharing.floor,
//       mealType: redemption.mealSharing.mealType,
//       redeemed: true,
//       redeemedAt: redemption.redeemedAt,
//       studentName: redemption.mealSharing.student.name,
//       qrCodeData: redemption.mealSharing.qrCodeData
//     }));
    
//     res.json(redeemedQRs);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   POST api/staff/redeem-qr/:id
//  * @desc    Redeem a QR code
//  * @access  Private (Staff only)
//  */
// router.post('/staff/redeem-qr/:id', [auth, roleCheck('staff')], async (req, res) => {
//   try {
//     const mealSharing = await MealSharing.findById(req.params.id);
    
//     if (!mealSharing) {
//       return res.status(404).json({ errors: [{ msg: 'QR code not found' }] });
//     }
    
//     if (!mealSharing.isActive) {
//       return res.status(400).json({ errors: [{ msg: 'QR code is not active' }] });
//     }
    
//     if (mealSharing.redeemedBy) {
//       return res.status(400).json({ errors: [{ msg: 'QR code already redeemed' }] });
//     }
    
//     // Update meal sharing
//     mealSharing.redeemedBy = req.user.id;
//     mealSharing.redeemedAt = Date.now();
    
//     await mealSharing.save();
    
//     // Create redemption record
//     const redemption = new Redemption({
//       mealSharing: mealSharing._id,
//       staff: req.user.id,
//       redeemedAt: Date.now()
//     });
    
//     await redemption.save();
    
//     // Create notification for student
//     const notification = new Notification({
//       user: mealSharing.student,
//       message: `Your ${mealSharing.mealType} meal has been redeemed`,
//       type: 'info',
//       relatedTo: mealSharing._id,
//       onModel: 'MealSharing'
//     });
    
//     await notification.save();
    
//     // Create activity log
//     const activity = new ActivityLog({
//       user: req.user.id,
//       action: 'QR_REDEMPTION',
//       details: { 
//         mealSharingId: mealSharing._id,
//         mealType: mealSharing.mealType,
//         studentId: mealSharing.student
//       },
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent']
//     });

//     await activity.save();
    
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   GET api/staff/qr-code/:id
//  * @desc    Get QR code data
//  * @access  Private (Staff only)
//  */
// router.get('/staff/qr-code/:id', [auth, roleCheck('staff')], async (req, res) => {
//   try {
//     const mealSharing = await MealSharing.findById(req.params.id);
    
//     if (!mealSharing) {
//       return res.status(404).json({ errors: [{ msg: 'QR code not found' }] });
//     }
    
//     res.json({ qrCodeData: mealSharing.qrCodeData });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ===== ADMIN ROUTES =====

// /**
//  * @route   GET api/admin/staff
//  * @desc    Get all staff members
//  * @access  Private (Admin only)
//  */
// router.get('/admin/staff', async (req, res) => {
//   try {
//     const staffMembers = await User.find({ role: 'staff' })
//       .select('id name email');
    
//     res.json(staffMembers);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   POST api/admin/staff
//  * @desc    Add a new staff member
//  * @access  Private (Admin only)
//  */
router.post('/admin/create-staff', async (req, res) => {
  

  const { name, email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Create new staff user
    user = new User({
      name,
      email,
      password,
      role: 'staff'
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
        role: user.role
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// /**
//  * @route   PUT api/admin/staff/:id
//  * @desc    Update a staff member
//  * @access  Private (Admin only)
//  */
// router.put('/admin/staff/:id', [
//   auth, 
//   roleCheck('admin'),
//   [
//     body('name', 'Name is required').not().isEmpty(),
//     body('email', 'Please include a valid email').isEmail()
//   ]
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { name, email, password } = req.body;

//   try {
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ errors: [{ msg: 'User not found' }] });
//     }
    
//     if (user.role !== 'staff') {
//       return res.status(400).json({ errors: [{ msg: 'User is not a staff member' }] });
//     }
    
//     // Update fields
//     user.name = name;
//     user.email = email;
    
//     // Update password if provided
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);
//     }
    
//     user.updatedAt = Date.now();
    
//     await user.save();
    
//     // Create activity log
//     const activity = new ActivityLog({
//       user: req.user.id,
//       action: 'STAFF_UPDATED',
//       details: { staffId: user._id, staffEmail: email },
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent']
//     });

//     await activity.save();
    
//     res.json({
//       id: user.id,
//       name: user.name,
//       email: user.email
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   DELETE api/admin/staff/:id
//  * @desc    Delete a staff member
//  * @access  Private (Admin only)
//  */
// router.delete('/admin/staff/:id', [auth, roleCheck('admin')], async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ errors: [{ msg: 'User not found' }] });
//     }
    
//     if (user.role !== 'staff') {
//       return res.status(400).json({ errors: [{ msg: 'User is not a staff member' }] });
//     }
    
//     await user.remove();
    
//     // Create activity log
//     const activity = new ActivityLog({
//       user: req.user.id,
//       action: 'STAFF_DELETED',
//       details: { staffId: req.params.id, staffEmail: user.email },
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent']
//     });

//     await activity.save();
    
//     res.json({ msg: 'Staff member removed' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// /**
//  * @route   POST api/admin/bulk-staff
//  * @desc    Create multiple staff members
//  * @access  Private (Admin only)
//  */
// router.post('/admin/bulk-staff', [
//   auth, 
//   roleCheck('admin'),
//   [
//     body('staffList', 'Staff list is required').isArray()
//   ]
// ], async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { staffList } = req.body;

//   try {
//     const createdStaff = [];
//     const errorList = [];
    
//     for (const staffData of staffList) {
//       const { email, password } = staffData;
      
//       // Check if user exists
//       let user = await User.findOne({ email });
//       if (user) {
//         errorList.push({ email, error: 'User already exists' });
//         continue;
//       }
      
//       // Create new staff user
//       user = new User({
//         name: email.split('@')[0], // Default name from email
//         email,
//         password,
//         role: 'staff'
//       });

//       // Hash password
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(password, salt);

//       await user.save();
      
//       createdStaff.push({
//         id: user.id,
//         name: user.name,
//         email: user.email
//       });
//     }
    
//     // Create activity log
//     const activity = new ActivityLog({
//       user: req.user.id,
//       action: 'BULK_STAFF_CREATED',
//       details: { count: createdStaff.length, errors: errorList.length },
//       ipAddress: req.ip,
//       userAgent: req.headers['user-agent']
//     });

//     await activity.save();
    
//     res.json({
//       success: true,
//       created: createdStaff,
//       errors: errorList
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });


// // Todo : Implement router.put
// /**
//  * @route   PUT api/admin/credentials
//  * @desc    Update admin credentials
//  * @access  Private (Admin only)
//  */
// // router.put('/admin/credentials', {
// //   auth, 
// //   roleCheck('admin'),
// //   [
// //     body('email', ' only)
// //   [
// //     body('email', 'Please include a valid email').isEmail(),
// //     body('password', 'Password is required for verification').exists(),
// //     body('newPassword', 'New password must be at least 6 characters').optional().isLength({ min: 6 })
// //   ]
// // }, async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { email, password, newPassword } = req.body;

// //   try {
// //     const user = await User.findById(req.user.id);
    
// //     // Check password
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
// //     }
    
// //     // Update fields
// //     user.email = email;
    
// //     // Update password if provided
// //     if (newPassword) {
// //       const salt = await bcrypt.genSalt(10);
// //       user.password = await bcrypt.hash(newPassword, salt);
// //     }
    
// //     user.updatedAt = Date.now();
    
// //     await user.save();
    
// //     // Create activity log
// //     const activity = new ActivityLog({
// //       user: req.user.id,
// //       action: 'ADMIN_CREDENTIALS_UPDATED',
// //       ipAddress: req.ip,
// //       userAgent: req.headers['user-agent']
// //     });

// //     await activity.save();
    
// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // ===== TERMS & CONDITIONS ROUTES =====

// // /**
// //  * @route   GET api/terms
// //  * @desc    Get active terms and conditions
// //  * @access  Public
// //  */
// // router.get('/terms', async (req, res) => {
// //   try {
// //     const terms = await Terms.findOne({ isActive: true });
    
// //     if (!terms) {
// //       return res.status(404).json({ errors: [{ msg: 'Terms and conditions not found' }] });
// //     }
    
// //     res.json(terms);
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // /**
// //  * @route   POST api/terms/accept
// //  * @desc    Accept terms and conditions
// //  * @access  Private
// //  */
// // router.post('/terms/accept', [
// //   auth,
// //   [
// //     body('termsId', 'Terms ID is required').not().isEmpty()
// //   ]
// // ], async (req, res) => {
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     return res.status(400).json({ errors: errors.array() });
// //   }

// //   const { termsId } = req.body;

// //   try {
// //     const terms = await Terms.findById(termsId);
    
// //     if (!terms) {
// //       return res.status(404).json({ errors: [{ msg: 'Terms and conditions not found' }] });
// //     }
    
// //     if (!terms.isActive) {
// //       return res.status(400).json({ errors: [{ msg: 'Terms and conditions are not active' }] });
// //     }
    
// //     // Check if already accepted
// //     const existingAcceptance = await UserTerms.findOne({
// //       user: req.user.id,
// //       terms: termsId
// //     });
    
// //     if (existingAcceptance) {
// //       return res.json({ success: true, alreadyAccepted: true });
// //     }
    
// //     // Record acceptance
// //     const userTerms = new UserTerms({
// //       user: req.user.id,
// //       terms: termsId,
// //       acceptedAt: Date.now(),
// //       ipAddress: req.ip
// //     });
    
// //     await userTerms.save();
    
// //     // Create activity log
// //     const activity = new ActivityLog({
// //       user: req.user.id,
// //       action: 'TERMS_ACCEPTED',
// //       details: { termsId, termsVersion: terms.version },
// //       ipAddress: req.ip,
// //       userAgent: req.headers['user-agent']
// //     });

// //     await activity.save();
    
// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // ===== NOTIFICATION ROUTES =====

// // /**
// //  * @route   GET api/notifications
// //  * @desc    Get user notifications
// //  * @access  Private
// //  */
// // router.get('/notifications', auth, async (req, res) => {
// //   try {
// //     const notifications = await Notification.find({ user: req.user.id })
// //       .sort({ createdAt: -1 })
// //       .limit(20);
    
// //     res.json(notifications);
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // /**
// //  * @route   PUT api/notifications/:id/read
// //  * @desc    Mark notification as read
// //  * @access  Private
// //  */
// // router.put('/notifications/:id/read', auth, async (req, res) => {
// //   try {
// //     const notification = await Notification.findById(req.params.id);
    
// //     if (!notification) {
// //       return res.status(404).json({ errors: [{ msg: 'Notification not found' }] });
// //     }
    
// //     if (notification.user.toString() !== req.user.id) {
// //       return res.status(401).json({ errors: [{ msg: 'Not authorized' }] });
// //     }
    
// //     notification.isRead = true;
// //     await notification.save();
    
// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // // ===== STATS ROUTES =====

// // /**
// //  * @route   GET api/stats
// //  * @desc    Get system stats
// //  * @access  Private (Admin only)
// //  */
// // router.get('/stats', [auth, roleCheck('admin')], async (req, res) => {
// //   try {
// //     // Get today's date (start of day)
// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0);
    
// //     // Get stats for today
// //     let todayStats = await Stats.findOne({ date: today });
    
// //     if (!todayStats) {
// //       todayStats = {
// //         totalMealsShared: 0,
// //         mealTypeBreakdown: {
// //           breakfast: 0,
// //           lunch: 0,
// //           snacks: 0,
// //           dinner: 0
// //         },
// //         floorBreakdown: {
// //           ground: 0,
// //           first: 0
// //         },
// //         activeUsers: 0
// //       };
// //     }
    
// //     // Get total users count
// //     const totalUsers = await User.countDocuments();
// //     const studentCount = await User.countDocuments({ role: 'student' });
// //     const staffCount = await User.countDocuments({ role: 'staff' });
    
// //     // Get total meals shared all time
// //     const totalMealsShared = await MealSharing.countDocuments({ isActive: true });
    
// //     // Get total meals redeemed
// //     const totalMealsRedeemed = await MealSharing.countDocuments({ redeemedBy: { $ne: null } });
    
// //     res.json({
// //       today: todayStats,
// //       total: {
// //         users: totalUsers,
// //         students: studentCount,
// //         staff: staffCount,
// //         mealsShared: totalMealsShared,
// //         mealsRedeemed: totalMealsRedeemed
// //       }
// //     });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send('Server error');
// //   }
// // });

// // module.exports = router;

export default router;