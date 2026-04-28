import express from 'express';
import connectDB from './db/connectdb.js';
import dotenv from 'dotenv';
import router from './routes/auth.js';
import cors from 'cors';
import adminRouter from './routes/admin.js';
import userRouter from './routes/user.js';
import staffRouter from './routes/staff.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8002;
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, 'https://khdzn015-3000.inc1.devtunnels.ms']
    : ['http://localhost:3000', 'https://khdzn015-3000.inc1.devtunnels.ms'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MealShare API is running! 🍽️', status: 'OK' });
});

app.use("/", router);
app.use("/user", userRouter);
app.use("/admin", adminRouter);


app.use("/staff", staffRouter);
app.listen(PORT, async () => {

    await connectDB();
    console.log(`Server is running on port ${PORT}`);
    });
