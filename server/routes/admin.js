import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();





router.post('/admin/update', async (req, res) => {
    const{
        email,password
    } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    
        await user.save();
    
    
        res.status(201).json({user: user});
    }
       catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
    });


router.post('/admin/staff-signup', async (req, res) => {

    const { name, email, password, } = req.body;
  
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
        role: 'staff' // Default role for signup
        
      });
  
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
  
      res.status(201).json({user: user});
  }
     catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


  router.get('/admin/all-staff', async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).select('-password');
        res.json({ staff });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
  }
  );

  router.get('/admin/get', async (req, res) => {
    try {
        const user = await User.findOne({ role: 'admin' }).select('-password');
        res.json({ user });
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
      }
}
);

export default router;


