import { Router } from 'express';
import { getAdherence } from '../controllers/adherenceController.js';

const router = Router();

router.get('/', getAdherence);

export default router;
