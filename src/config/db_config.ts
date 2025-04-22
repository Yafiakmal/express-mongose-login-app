import mongoose from "mongoose";
import 'dotenv/config';

export async function connectDB() {
  console.info("Connecting to database ...")
  if (mongoose.connection.readyState === 1) {
    console.info("MongoDB is already connected");
    return;
  }
  const MONGODB_URI = process.env.MONGODB_URI as string;

  if(!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in environment variables.");

  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.info('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}