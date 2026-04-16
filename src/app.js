import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://taskmanager-frontend-*.vercel.app']
    : ['http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Task Manager Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Routes will be mounted here in Phase 2

app.use(errorHandler);

export default app;
