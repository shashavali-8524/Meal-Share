import User from "../models/User.js";
import bcrypt from "bcryptjs";
import express from "express";
const router = express.Router();


export const updateProfile = async (req, res) => {
    const { name, floor, password } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      
      // Update fields
      if (name) user.name = name;
      if (floor) user.floor = floor;
      
      // Update password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      
      user.updatedAt = Date.now();
      
      await user.save();

      const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ user: userResponse });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};




// // Upload QR code
// export const uploadQrCode = async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ errors: [{ msg: 'No file uploaded' }] });
//       }
//       const user = await User.findById(req.user.id);
      
//       if (!user) {
//         return res.status(404).json({ errors: [{ msg: 'User not found' }] });
//       }
      
//       if (user.qrCode) {

  
//       }
      
//       user.qrCode = req.file.path;
//       user.updatedAt = Date.now();
      
//       await user.save();
      
//       res.json({ qrCode: req.file.path });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   };


  // Get user QR code

  const uploadQrCode  = async (req, res) => {
    try {
      const qrBuffer = req.body // this is already a Buffer
      const email = req.headers['x-user-email']
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      user.qrCode = qrBuffer
      await user.save()
      console.log('qr uploaded bro 🔥')
      res.status(200).json({ msg: 'qr uploaded bro 🔥' })
    } catch (err) {

      console.log('error saving qr:', err)
      res.status(500).json({ err: 'failed to save qr' })
    }
  }

  const getQrCode = async (req, res) => {
    try {
      const email = req.headers['x-user-email']
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] })
      }
  
      if (!user.qrCode) {
        return res.status(404).json({ errors: [{ msg: 'QR code not uploaded yet, bro 😭' }] })
      }
  
      console.log('qr fetched like a boss 🧠')
      res.set('Content-Type', 'image/png') // adjust if you’re storing jpeg etc
      res.send(user.qrCode)
    } catch (err) {
      console.log('error fetching qr:', err)
      res.status(500).json({ err: 'failed to fetch qr from DB bro 💀' })
    }
  }


export const getUserQrCode = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('qrCode');
      
      if (!user) {
        return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      
      if (!user.qrCode) {
        return res.status(404).json({ errors: [{ msg: 'QR code not found' }] });
      }
      
      res.json({ qrCode: user.qrCode });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };



export const getQRCodeTime = async (req, res) => {
  try {
      // const user = await User.findById(req.user.id);
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
          return res.status(404).json({ errors: [{ msg: 'User not found' }] });
      }
      const mealTimes = Object.keys(user.qrStatus).filter(mealTime => user.qrStatus[mealTime].enabled );
      if (mealTimes.length === 0) {
          return res.status(404).json({ errors: [{ msg: 'No QR code found for the given criteria' }] });
      }
      console.log(mealTimes);
      const today = new Date().toDateString(); // "Mon Apr 14 2025"
      const lastUpdated = new Date(user.mealLastUpdated).toDateString();

      if (today !== lastUpdated) {
      user.qrStatus = {
        breakfast: { enabled: false, redeemed: false },
        lunch: { enabled: false, redeemed: false },
        snacks: { enabled: false, redeemed: false },
        dinner: { enabled: false, redeemed: false }
        };
      user.mealLastUpdated = new Date();
      await user.save();
    }
      res.json({ mealTimes: mealTimes });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
}

export const setQRCodeTime = async (req, res) => {
    try {
        // const user = await User.findById(req.user.id);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'User not found' }] });
        }
        const mealTime = req.body.mealTime;
        if (!mealTime) {
            return res.status(400).json({ errors: [{ msg: 'Meal time is required' }] });
        }
        if (user.qrStatus[mealTime].enabled) {
            return res.status(400).json({ errors: [{ msg: 'Meal time already set' }] });
        }
        user.qrStatus[mealTime].enabled = true; 
        user.qrStatus[mealTime].redeemed = false;
        user.mealLastUpdated = new Date();
        await user.save();

        res.status(200).json({ message: 'Meal time set successfully', mealTime: user.mealTime });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ errors: [{ msg: 'Server error' }] });
    }
}

router.post('/getQRCodeTime', getQRCodeTime);
router.post('/setQRCodeTime', setQRCodeTime);
router.post('/uploadQR', express.raw({ type: 'application/octet-stream',limit: '10mb' }), uploadQrCode);
router.get('/getQR', getQrCode);
export default router;