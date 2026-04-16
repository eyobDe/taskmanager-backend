import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes will be mounted here in Phase 2

app.use(errorHandler);

export default app;
