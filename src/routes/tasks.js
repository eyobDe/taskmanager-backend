import express from 'express';
import { createTask, completeTask, createSubtask, completeSubtask } from '../controllers/taskController.js';

const router = express.Router();

// POST /api/tasks
router.post('/', createTask);

// PUT /api/tasks/:id/complete
router.put('/:id/complete', completeTask);

// POST /api/tasks/:taskId/subtasks
router.post('/:taskId/subtasks', createSubtask);

// PUT /api/tasks/subtasks/:subtaskId/complete
router.put('/subtasks/:subtaskId/complete', completeSubtask);

export default router;
