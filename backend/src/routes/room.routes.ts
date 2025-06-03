import { Router } from 'express';
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/room.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validation.middleware';
import { roomSchema } from '../validations/schemas';

const router = Router();

// All routes require authentication
router.use(authMiddleware as any);

router.get('/', getRooms as any);
router.post('/', validate(roomSchema), createRoom as any);
router.put('/:id', validate(roomSchema), updateRoom as any);
router.delete('/:id', deleteRoom as any);

export default router; 