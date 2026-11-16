import { Router } from 'express';
import {
  getSchedule,
  logDose,
  resetDaySchedule,
} from '../controllers/scheduleController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getSchedule);
router.post('/log', logDose);
router.post('/reset-day', resetDaySchedule);

export default router;
