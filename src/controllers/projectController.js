import Project from '../models/Project.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createProject = async (req, res, next) => {
  try {
    const { name, user_id } = req.body; // In real app, user_id comes from auth token
    
    const project = await Project.create({ 
      _id: new mongoose.Types.ObjectId(), 
      name, 
      created_by: user_id 
    });

    // CRITICAL: Must update user's projects array for the 3-query dashboard to work
    await User.findByIdAndUpdate(user_id, {
      $push: { projects: project._id }
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};
