import { Router } from 'express';
import {
  getCaregiverPatients,
  linkPatientByCode,
  getCaregiverNotes,
  createCaregiverNote,
  deleteCaregiverNote,
  getCaregiverAlerts,
} from '../controllers/caregiverController.js';
import { authenticateToken, requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// View caregiver's linked patients (Caregivers, Clinicians, Admins)
router.get('/patients', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), getCaregiverPatients);

// Link a patient via access code (Caregivers, Clinicians, Admins)
router.post('/link', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), linkPatientByCode);

// Read caregiver notes (Patients and Caregivers can read daily notes)
router.get('/notes', getCaregiverNotes);

// Create / Delete caregiver notes (RBAC: Only Caregivers, Clinicians, Admins)
router.post('/notes', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), createCaregiverNote);
router.delete('/notes/:id', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), deleteCaregiverNote);

// Caregiver adherence alerts (Caregivers, Clinicians, Admins)
router.get('/alerts', requireAuth, requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN'), getCaregiverAlerts);

export default router;
