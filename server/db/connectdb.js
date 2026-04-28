import mongoose from "mongoose";
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    // If no URI provided, skip database connection
    if (!MONGO_URI) {
        console.warn(`⚠️  No MONGO_URI provided. Running without database.`);
        return;
    }

    // Disable buffering so queries fail immediately instead of hanging forever without DB
    mongoose.set('bufferCommands', false);

    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`⚠️  MongoDB Connection Warning: ${error.message}`);
        console.warn(`⚠️  Server running without database. Connect later to enable full functionality.`);
    }
}

export default connectDB;