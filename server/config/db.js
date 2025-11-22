import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ mongoDB connected successfully');
  } catch (err) {
    console.error('❌ خطا در اتصال MongoDB:', err.message);
    process.exit(1);
  }
};

export default connectDB;