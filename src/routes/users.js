import express from 'express';
import { getDashboard } from '../controllers/userController.js';

const router = express.Router();

// GET /api/users/:id/dashboard
router.get('/:id/dashboard', getDashboard);

export default router;
