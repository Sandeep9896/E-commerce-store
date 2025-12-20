import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    console.log('Connecting to MongoDB...');
    
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
