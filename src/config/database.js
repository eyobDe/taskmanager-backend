import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Prioritize MongoDB Atlas for production, fallback to local for development
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_ATLAS_URL 
      : process.env.MONGODB_ATLAS_URL || process.env.DATABASE_URL;
    
    if (!mongoURI) {
      throw new Error('MongoDB connection string not found in environment variables');
    }

    // For development with localhost, skip if MongoDB isn't running
    if (process.env.NODE_ENV === 'development' && mongoURI.includes('localhost')) {
      console.log('Development mode: Skipping MongoDB connection (localhost not running)');
      return null;
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Don't exit in development, just warn
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Continuing without database connection');
      return null;
    }
    process.exit(1);
  }
};
