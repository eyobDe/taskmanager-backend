import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, 'Subtask title is required'],
    trim: true
  },
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: [true, 'Task ID is required']
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for querying subtasks by task
subtaskSchema.index({ task_id: 1 });

const Subtask = mongoose.model('Subtask', subtaskSchema);
export default Subtask;
