import { Router } from 'express';
import {
  getSchedule,
  logDose,
  resetDaySchedule,
} from '../controllers/scheduleController.js';

const router = Router();

router.get('/', getSchedule);
router.post('/log', logDose);
router.post('/reset-day', resetDaySchedule);

export default router;
