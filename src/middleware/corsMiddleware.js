import cors from 'cors';

export const corsMiddleware = cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3001'],
  credentials: true
});
