import mongoose from 'mongoose';

const dependencySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  taskTitle: {
    type: String,
    required: true
  },
  is_completed: {
    type: Boolean,
    default: false
  }
}, { _id: false }); // Embedded, no separate _id needed

const taskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  assignee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assignee ID is required']
  },
  due_date: {
    type: Date,
    default: null
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  dependsOn: [dependencySchema],  // Embedded array of dependencies
  subtasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subtask'
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Virtual field: is_blocked (computed, not stored)
taskSchema.virtual('is_blocked').get(function() {
  // Task is blocked if it has ANY incomplete dependencies
  return this.dependsOn && this.dependsOn.length > 0 && 
         this.dependsOn.some(dep => !dep.is_completed);
});

// Virtual field: blocked_by_titles (compute in-memory)
taskSchema.virtual('blocked_by_titles').get(function() {
  if (!this.dependsOn || this.dependsOn.length === 0) {
    return [];
  }
  return this.dependsOn
    .filter(dep => !dep.is_completed)
    .map(dep => dep.taskTitle);
});

// Ensure virtuals are included in JSON output
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

// Indexes for performance
taskSchema.index({ project_id: 1 });
taskSchema.index({ assignee_id: 1 });
taskSchema.index({ is_completed: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
