import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL || process.env.MONGODB_ATLAS_URL;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit if can't connect
  }
};

export default connectDB;
