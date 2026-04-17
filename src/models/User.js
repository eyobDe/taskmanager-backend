import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { 
    type: String, 
    required: [true, 'Name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  projects: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Project' 
    }
  ],
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for performance
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);
export default User;
