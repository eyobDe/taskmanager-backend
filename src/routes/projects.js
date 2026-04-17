import express from 'express';
import { createProject } from '../controllers/projectController.js';
const router = express.Router();

// POST /api/projects - Create new project
router.post('/', createProject);

export default router;
