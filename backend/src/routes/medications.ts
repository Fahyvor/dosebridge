import { Router } from 'express';
import {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
  refillMedication,
} from '../controllers/medicationController.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Read medications (all authenticated or guest users)
router.get('/', getMedications);
router.get('/:id', getMedicationById);

// Create / Update prescription (Patients, Caregivers, Clinicians, Admins)
router.post('/', requireAuth, requireRole('PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'), createMedication);
router.put('/:id', requireAuth, requireRole('PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'), updateMedication);

// Discontinue / Delete prescription (Clinical oversight: Caregivers, Clinicians, Admins)
router.delete('/:id', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), deleteMedication);

// Request medication refill (Patients, Caregivers, Clinicians, Admins)
router.post('/:id/refill', requireAuth, requireRole('PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'), refillMedication);

export default router;
