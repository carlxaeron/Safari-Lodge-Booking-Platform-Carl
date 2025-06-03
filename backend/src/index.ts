import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import roomRoutes from './routes/room.routes';
import availabilityRoutes from './routes/availability.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api', healthRoutes);

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 