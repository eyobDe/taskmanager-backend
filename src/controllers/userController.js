import User from '../models/User.js';
import Task from '../models/Task.js';

export const getDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Query 1: Fetch User and populate Projects
    const user = await User.findById(id).populate('projects');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Query 2: Fetch Tasks + Eager Load Subtasks & Dependencies
    const projectIds = user.projects.map(p => p._id);
    const tasks = await Task.find({ 
      project_id: { $in: projectIds }, 
      assignee_id: id 
    })
    .populate('subtasks')
    .populate('dependsOn.taskId');

    // Query 3: Calculate blocked status in memory via Mongoose virtuals
    const tasksWithVirtuals = tasks.map(task => task.toObject({ virtuals: true }));

    // Group tasks by project
    const projectsWithTasks = user.projects.map(project => {
      const projectTasks = tasksWithVirtuals.filter(task => 
        task.project_id.toString() === project._id.toString()
      );
      
      return {
        id: project._id,
        name: project.name,
        tasks: projectTasks
      };
    });

    const totalTasks = tasksWithVirtuals.length;
    const totalBlocked = tasksWithVirtuals.filter(task => task.is_blocked).length;

    // Assemble final response
    const response = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      projects: projectsWithTasks,
      total_tasks: totalTasks,
      total_blocked: totalBlocked
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

