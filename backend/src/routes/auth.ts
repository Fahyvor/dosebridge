import { Router } from 'express';
import { register, login, getMe, switchRole } from '../controllers/authController.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';

const router = Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Authenticated endpoints
router.get('/me', authenticateToken, requireAuth, getMe);
router.post('/switch-role', authenticateToken, requireAuth, switchRole);

export default router;
