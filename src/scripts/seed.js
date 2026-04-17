import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE_URL || process.env.MONGODB_ATLAS_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Existing data cleared');

    // Create user with hardcoded ID
    console.log('Creating user...');
    const user = await User.create({
      _id: new mongoose.Types.ObjectId('60d5ecb8b392d700153ee123'),
      name: 'John Doe',
      email: 'john@example.com',
      projects: []
    });
    console.log('User created:', user);

    // Create project
    console.log('Creating project...');
    const project = await Project.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Website Redesign',
      description: 'Complete redesign of the company website',
      created_by: user._id,
      tasks: []
    });
    console.log('Project created:', project);

    // Update user's projects array
    console.log('Updating user projects...');
    user.projects.push(project._id);
    await user.save();
    console.log('User projects updated');

    // Create Task A - Design Mockups (no dependencies)
    console.log('Creating Task A...');
    const taskA = await Task.create({
      _id: new mongoose.Types.ObjectId(),
      title: 'Design Mockups',
      project_id: project._id,
      assignee_id: user._id,
      is_completed: false,
      dependsOn: []
    });
    console.log('Task A created:', taskA);

    // Create Task B - Frontend Implementation (depends on Task A)
    console.log('Creating Task B...');
    const taskB = await Task.create({
      _id: new mongoose.Types.ObjectId(),
      title: 'Frontend Implementation',
      project_id: project._id,
      assignee_id: user._id,
      is_completed: false,
      dependsOn: [{
        taskId: taskA._id,
        taskTitle: taskA.title,
        is_completed: false
      }]
    });
    console.log('Task B created:', taskB);

    // Update project's tasks array
    console.log('Updating project tasks...');
    project.tasks.push(taskA._id, taskB._id);
    await project.save();
    console.log('Project tasks updated');

    console.log('\n=== DATABASE SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('Created:');
    console.log('- User: John Doe (john@example.com)');
    console.log('- Project: Website Redesign');
    console.log('- Task A: Design Mockups (no dependencies)');
    console.log('- Task B: Frontend Implementation (depends on Task A)');
    console.log('\nYou can now test the frontend with this sample data!');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeding function
seedDatabase();
