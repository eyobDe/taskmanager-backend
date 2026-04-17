import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { 
    type: String, 
    required: [true, 'Project name is required'],
    trim: true 
  },
  description: { 
    type: String,
    default: ''
  },
  created_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Created by user is required']
  },
  tasks: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Task' 
    }
  ],
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexes for performance
projectSchema.index({ created_by: 1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
