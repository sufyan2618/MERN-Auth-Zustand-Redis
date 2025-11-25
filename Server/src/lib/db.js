import mongoose from 'mongoose';
import { ENV } from '../util/dotenv.js';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(ENV.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};