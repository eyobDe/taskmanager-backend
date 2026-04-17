import express from 'express';
import { createTask, completeTask } from '../controllers/taskController.js';

const router = express.Router();

// POST /api/tasks
router.post('/', createTask);

// PUT /api/tasks/:id/complete
router.put('/:id/complete', completeTask);

export default router;
