import 'dotenv/config';
import app from './src/app.js';
import { connectDB } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

// Connect to database first
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
