import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
} from '../controllers/patientController.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getPatients);
router.get('/:id', getPatientById);

// Create patient (Clinicians, Admins, or onboarding)
router.post('/', createPatient);

// Update patient chart (Patient self-update, Caregivers, Clinicians, Admins)
router.put('/:id', requireAuth, requireRole('PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'), updatePatient);

export default router;
