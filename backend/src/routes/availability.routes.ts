import { Router } from 'express';
import { getAvailabilities, createAvailability, updateAvailability, deleteAvailability } from '../controllers/availability.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware as any);

router.get('/', getAvailabilities as any);
router.post('/', createAvailability as any);
router.put('/:id', updateAvailability as any);
router.delete('/:id', deleteAvailability as any);

export default router; 