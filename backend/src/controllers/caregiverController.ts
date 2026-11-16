import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getCaregiverPatients = async (req: Request, res: Response) => {
  try {
    const caregiverId = (req.query.caregiverId as string) || 'cg-1';

    const patients = await prisma.patient.findMany({
      include: {
        caregivers: true,
        medications: true,
        scheduleItems: true,
      },
    });

    const summaries = patients.map((patient) => {
      const pSchedule = patient.scheduleItems;
      const pMeds = patient.medications;
      const pendingCount = pSchedule.filter((s) => s.status === 'pending').length;
      const takenCount = pSchedule.filter((s) => s.status === 'taken').length;
      const lowRefillCount = pMeds.filter((m) => m.pillsRemaining <= m.refillThreshold).length;

      return {
        id: patient.id,
        fullName: patient.fullName,
        preferredName: patient.preferredName,
        age: patient.age,
        gender: patient.gender,
        primaryLanguage: patient.primaryLanguage,
        literacyMode: patient.literacyMode,
        accessCode: patient.accessCode,
        conditions: typeof patient.conditions === 'string' ? JSON.parse(patient.conditions) : patient.conditions,
        allergies: typeof patient.allergies === 'string' ? JSON.parse(patient.allergies) : patient.allergies,
        emergencyContact: {
          name: patient.emergencyName,
          relationship: patient.emergencyRelationship,
          phone: patient.emergencyPhone,
        },
        caregivers: patient.caregivers,
        stats: {
          totalMeds: pMeds.length,
          todayTotal: pSchedule.length,
          todayTaken: takenCount,
          todayPending: pendingCount,
          lowRefillAlerts: lowRefillCount,
        },
      };
    });

    return res.json({ success: true, data: summaries });
  } catch (error: any) {
    console.error('Error fetching caregiver patients:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching caregiver patients' });
  }
};

export const linkPatientByCode = async (req: Request, res: Response) => {
  try {
    const { accessCode, caregiverName, caregiverPhone, caregiverEmail } = req.body;

    if (!accessCode) {
      return res.status(400).json({ success: false, message: 'Patient access code is required (e.g. DB-6821)' });
    }

    const patient = await prisma.patient.findUnique({
      where: { accessCode: accessCode.trim().toUpperCase() },
      include: { caregivers: true },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `No patient found with code ${accessCode}. Please check the code with your loved one.`,
      });
    }

    const existingLink = patient.caregivers.find((c) => c.name.toLowerCase() === (caregiverName || '').toLowerCase());
    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: `${patient.fullName} is already connected in your care circle!`,
      });
    }

    const newCaregiver = await prisma.caregiver.create({
      data: {
        name: caregiverName || 'David Vance',
        relationship: 'Family Caregiver',
        phone: caregiverPhone || '+1 (555) 234-5678',
        email: caregiverEmail || 'david.vance@example.com',
        patientId: patient.id,
      },
    });

    const updatedPatient = await prisma.patient.findUnique({
      where: { id: patient.id },
      include: { caregivers: true },
    });

    return res.json({
      success: true,
      message: `Successfully connected with ${patient.fullName}! You now share real-time medication visibility.`,
      data: updatedPatient,
    });
  } catch (error: any) {
    console.error('Error linking patient:', error);
    return res.status(500).json({ success: false, message: 'Database error linking patient' });
  }
};

export const getCaregiverNotes = async (req: Request, res: Response) => {
  try {
    const patientId = (req.query.patientId as string) || 'pat-1';

    const notes = await prisma.caregiverNote.findMany({
      where: { patientId },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });

    return res.json({ success: true, data: notes });
  } catch (error: any) {
    console.error('Error fetching caregiver notes:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching notes' });
  }
};

export const createCaregiverNote = async (req: Request, res: Response) => {
  try {
    const { patientId, text, priority, caregiverName } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty' });
    }

    const newNote = await prisma.caregiverNote.create({
      data: {
        patientId: patientId || 'pat-1',
        caregiverId: 'cg-1',
        caregiverName: caregiverName || 'David Vance (Caregiver)',
        text: text.trim(),
        timestamp: 'Just now',
        pinned: priority === 'important',
        priority: priority || 'normal',
      },
    });

    return res.status(201).json({
      success: true,
      data: newNote,
      message: 'Note saved and visible on patient dashboard!',
    });
  } catch (error: any) {
    console.error('Error creating caregiver note:', error);
    return res.status(500).json({ success: false, message: 'Database error creating note' });
  }
};

export const deleteCaregiverNote = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await prisma.caregiverNote.delete({
      where: { id },
    });
    return res.json({ success: true, message: 'Note removed' });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ success: false, message: 'Database error deleting note' });
  }
};

export const getCaregiverAlerts = async (req: Request, res: Response) => {
  try {
    const patientId = (req.query.patientId as string) || 'pat-1';

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        medications: true,
        scheduleItems: true,
      },
    });

    const alerts: any[] = [];
    if (!patient) return res.json({ success: true, data: alerts });

    // Low supply alerts
    patient.medications.forEach((m) => {
      if (m.pillsRemaining <= m.refillThreshold) {
        alerts.push({
          id: `alert-refill-${m.id}`,
          type: 'refill',
          severity: 'warning',
          title: `Low Supply: ${m.name}`,
          message: `Only ${m.pillsRemaining} pills remaining for ${patient.fullName}. Refill needed soon.`,
          rxNumber: m.rxNumber,
          pharmacy: m.pharmacyName,
        });
      }
    });

    // Pending doses alert
    const pendingCount = patient.scheduleItems.filter((s) => s.status === 'pending').length;
    if (pendingCount > 0) {
      alerts.push({
        id: `alert-pending-today`,
        type: 'schedule',
        severity: 'info',
        title: `${pendingCount} Medication(s) Due Today`,
        message: `${patient.fullName} has ${pendingCount} pending medication(s) to take today.`,
      });
    }

    return res.json({ success: true, data: alerts });
  } catch (error: any) {
    console.error('Error fetching caregiver alerts:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching alerts' });
  }
};
