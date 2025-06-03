import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Use RequestHandler type for route handlers
router.post('/login', login as any);

export default router; 