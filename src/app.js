import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';

const app = express();

// CORS configuration - Allow all origins for testing
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Task Manager Backend is running - Updated',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

app.use(errorHandler);

export default app;
