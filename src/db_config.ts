import mongoose from "mongoose";
import 'dotenv/config'; 

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI as string;
  // console.log('MONGODB_URI:', process.env.MONGODB_URI);

  if(!MONGODB_URI){
    throw new Error("MONGODB_URI is not defined in environment variables.");

  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
