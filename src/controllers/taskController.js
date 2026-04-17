import Task from '../models/Task.js';
import Project from '../models/Project.js';
import mongoose from 'mongoose';

// Helper function for circular dependency detection using DFS
const checkCircularDependency = async (newTaskId, dependencyIds) => {
  const visited = new Set();
  const stack = [...dependencyIds];

  while (stack.length > 0) {
    const currentId = stack.pop();
    if (currentId.toString() === newTaskId.toString()) return true; // Cycle found!
    
    if (!visited.has(currentId.toString())) {
      visited.add(currentId.toString());
      const task = await Task.findById(currentId);
      if (task && task.dependsOn && task.dependsOn.length > 0) {
        stack.push(...task.dependsOn.map(dep => dep.taskId.toString()));
      }
    }
  }
  return false;
};

export const createTask = async (req, res, next) => {
  try {
    const { title, project_id, assignee_id, due_date, dependency_ids = [] } = req.body;

    // Validate required fields
    if (!title || !project_id || !assignee_id) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'title, project_id, and assignee_id are required'
      });
    }

    // Validate project exists
    const project = await Project.findById(project_id);
    if (!project) {
      return res.status(400).json({ error: 'Invalid project_id' });
    }

    // Validate dependencies belong to same project
    if (dependency_ids.length > 0) {
      const dependencyTasks = await Task.find({ 
        _id: { $in: dependency_ids },
        project_id: project_id 
      });

      if (dependencyTasks.length !== dependency_ids.length) {
        return res.status(400).json({ 
          error: 'Dependencies must be in the same project',
          details: 'One or more dependency tasks not found in the specified project'
        });
      }
    }

    // Create new task ID for circular dependency check
    const newTaskId = new mongoose.Types.ObjectId();

    // Check for circular dependencies
    const hasCircularDependency = await checkCircularDependency(newTaskId, dependency_ids);
    if (hasCircularDependency) {
      return res.status(400).json({ error: 'Circular dependency detected' });
    }

    // Build dependency objects with task titles
    const dependencyObjects = [];
    for (const depId of dependency_ids) {
      const depTask = await Task.findById(depId);
      if (depTask) {
        dependencyObjects.push({
          taskId: depTask._id,
          taskTitle: depTask.title,
          is_completed: depTask.is_completed
        });
      }
    }

    // Create task
    const task = new Task({
      _id: newTaskId,
      title,
      project_id,
      assignee_id,
      due_date: due_date ? new Date(due_date) : null,
      dependsOn: dependencyObjects
    });

    await task.save();

    // Return task with virtual fields
    const taskResponse = task.toObject({ virtuals: true });

    res.status(201).json(taskResponse);
  } catch (error) {
    next(error);
  }
};

export const completeTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and update task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.is_completed) {
      return res.status(400).json({ error: 'Task is already completed' });
    }

    // Mark task as completed
    task.is_completed = true;
    task.updated_at = new Date();
    await task.save();

    // Update dependency status in tasks that depend on this task
    await Task.updateMany(
      { 'dependsOn.taskId': id },
      { $set: { 'dependsOn.$.is_completed': true } }
    );

    // Find tasks that depend on this task
    const dependentTasks = await Task.find({ 
      'dependsOn.taskId': id,
      is_completed: false 
    }).populate('dependsOn.taskId', 'title is_completed');

    // Check which dependent tasks are now unblocked
    const unblockedTasks = [];
    for (const dependentTask of dependentTasks) {
      const allDependenciesComplete = dependentTask.dependsOn.every(
        dep => dep.is_completed
      );
      
      if (allDependenciesComplete) {
        unblockedTasks.push({
          id: dependentTask._id,
          title: dependentTask.title
        });
      }
    }

    const response = {
      id: task._id,
      title: task.title,
      is_completed: task.is_completed,
      unblocked_task_ids: unblockedTasks.map(t => t.id),
      unblocked_task_titles: unblockedTasks.map(t => t.title)
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
