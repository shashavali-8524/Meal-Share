// import User from "../models/User.js";
// import express from "express";

// const router = express.Router();
// router.post('/fetchQRsByTime', async (req, res) => {
//     const mealTime = req.headers['x-mealtime']
//     const floor = req.headers['x-floor']

//     try {
//         // validate them bitches
//         if (!mealTime || !floor) {
//             return res.status(400).json({ errors: [{ msg: 'Meal time and floor are required in headers' }] })
//         }

//         if (!['breakfast', 'lunch', 'snacks', 'dinner'].includes(mealTime.toLowerCase())) {
//             return res.status(400).json({ errors: [{ msg: 'Invalid meal time' }] })
//         }

//         // fetch that poor bastard
//         const user = await User.findOne({
//             floor,
//             [`qrStatus.${mealTime}.enabled`]: true,
//             [`qrStatus.${mealTime}.redeemed`]: false,
//         })

//         if (!user) {
//             return res.status(404).json({ errors: [{ msg: 'No QR code found for the given criteria' }] })
//         }

//         // mark QR as redeemed (yeh public nahi hai bro now)
//         user.qrStatus[mealTime].redeemed = true
//         await user.save()

//         // send it like it's hot 🔥
//         if (user.qrCode) {
//             res.setHeader('Content-Type', 'application/octet-stream')
//             return res.send(user.qrCode)
//         } else {
//             return res.status(404).json({ errors: [{ msg: 'QR code not available' }] })
//         }
//     } catch (err) {
//         console.error('backend fked up:', err.message)
//         return res.status(500).send('Server error')
//     }
// })

// export default router


import User from "../models/User.js";
import express from "express";

const router = express.Router();

// Fetch Available QRs for Staff
router.get('/getAvailableQRs', async (req, res) => {
    try {
        const users = await User.find({
            role: 'student',
            $or: [
                { 'qrStatus.breakfast.enabled': true, 'qrStatus.breakfast.redeemed': false },
                { 'qrStatus.lunch.enabled': true, 'qrStatus.lunch.redeemed': false },
                { 'qrStatus.snacks.enabled': true, 'qrStatus.snacks.redeemed': false },
                { 'qrStatus.dinner.enabled': true, 'qrStatus.dinner.redeemed': false }
            ]
        });

        const qrs = [];

        users.forEach(user => {
            ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(mealType => {
                if (user.qrStatus[mealType].enabled && !user.qrStatus[mealType].redeemed) {
                    qrs.push({
                        id: user._id.toString(),
                        floor: user.floor,
                        mealType: mealType.charAt(0).toUpperCase() + mealType.slice(1),
                        redeemed: false
                    });
                }
            });
        });

        res.json({ qrs });
    } catch (err) {
        console.error('Error fetching available QRs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Existing redeem route stays as-is!
router.post('/fetchQRsByTime', async (req, res) => {
    const mealTime = req.headers['x-mealtime'];
    const floor = req.headers['x-floor'];

    try {
        if (!mealTime || !floor) {
            return res.status(400).json({ errors: [{ msg: 'Meal time and floor are required in headers' }] });
        }

        if (!['breakfast', 'lunch', 'snacks', 'dinner'].includes(mealTime.toLowerCase())) {
            return res.status(400).json({ errors: [{ msg: 'Invalid meal time' }] });
        }

        const user = await User.findOne({
            floor,
            [`qrStatus.${mealTime}.enabled`]: true,
            [`qrStatus.${mealTime}.redeemed`]: false,
        });

        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'No QR code found for the given criteria' }] });
        }

        user.qrStatus[mealTime].redeemed = true;
        await user.save();

        if (user.qrCode) {
            res.setHeader('Content-Type', 'application/octet-stream');
            return res.send(user.qrCode);
        } else {
            return res.status(404).json({ errors: [{ msg: 'QR code not available' }] });
        }
    } catch (err) {
        console.error('backend fked up:', err.message);
        return res.status(500).send('Server error');
    }
});

export default router;
