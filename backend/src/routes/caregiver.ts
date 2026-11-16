import { Router } from 'express';
import {
  getCaregiverPatients,
  linkPatientByCode,
  getCaregiverNotes,
  createCaregiverNote,
  deleteCaregiverNote,
  getCaregiverAlerts,
} from '../controllers/caregiverController.js';

const router = Router();

router.get('/patients', getCaregiverPatients);
router.post('/link', linkPatientByCode);
router.get('/notes', getCaregiverNotes);
router.post('/notes', createCaregiverNote);
router.delete('/notes/:id', deleteCaregiverNote);
router.get('/alerts', getCaregiverAlerts);

export default router;
