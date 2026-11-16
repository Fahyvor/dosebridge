import { Router } from 'express';
import {
  getMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  deleteMedication,
  refillMedication,
} from '../controllers/medicationController.js';

const router = Router();

router.get('/', getMedications);
router.get('/:id', getMedicationById);
router.post('/', createMedication);
router.put('/:id', updateMedication);
router.delete('/:id', deleteMedication);
router.post('/:id/refill', refillMedication);

export default router;
