import { Router } from 'express';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware as any);

router.get('/', getRooms as any);
router.post('/', createRoom as any);
router.put('/:id', updateRoom as any);
router.delete('/:id', deleteRoom as any);

export default router; 