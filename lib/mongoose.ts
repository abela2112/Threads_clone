import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log('MongoDB is already connected');
    return;
  }
  const MONGODB_URI = process.env.MONGODB_URI as string 
//   || 'mongodb://localhost:27017/threads_clone';
if(!MONGODB_URI) return console.error('MONGODB_URI is not defined in environment variables. Please set it up.');
  try {
    await mongoose.connect(MONGODB_URI );
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    isConnected = false;
    console.error('MongoDB connection error:', error);
    }
}