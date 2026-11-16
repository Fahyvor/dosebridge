import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { resolvePatientId, isValidObjectId } from '../lib/dbHelpers.js';

function formatMedication(m: any) {
  return {
    id: m.id,
    patientId: m.patientId,
    name: m.name,
    genericName: m.genericName,
    strength: m.strength,
    form: m.form,
    pillColor: m.pillColor,
    pillShape: m.pillShape,
    imprint: m.imprint || '',
    timesPerDay: m.timesPerDay,
    scheduledTimes: typeof m.scheduledTimes === 'string' ? JSON.parse(m.scheduledTimes) : m.scheduledTimes,
    timeSlots: typeof m.timeSlots === 'string' ? JSON.parse(m.timeSlots) : m.timeSlots,
    foodRule: m.foodRule,
    waterRule: m.waterRule,
    warnings: typeof m.warnings === 'string' ? JSON.parse(m.warnings) : m.warnings,
    totalPills: m.totalPills,
    pillsRemaining: m.pillsRemaining,
    refillThreshold: m.refillThreshold,
    prescribingDoctor: m.prescribingDoctor,
    doctorPhone: m.doctorPhone,
    pharmacyName: m.pharmacyName,
    rxNumber: m.rxNumber,
    instructions: typeof m.instructions === 'string' ? JSON.parse(m.instructions) : m.instructions,
  };
}

export const getMedications = async (req: Request, res: Response) => {
  try {
    const rawPatientId = req.query.patientId as string | undefined;
    let where = {};
    if (rawPatientId) {
      const resolvedId = await resolvePatientId(rawPatientId);
      if (resolvedId) {
        where = { patientId: resolvedId };
      }
    }
    const medications = await prisma.medication.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ success: true, data: medications.map(formatMedication) });
  } catch (error: any) {
    console.error('Error fetching medications:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching medications' });
  }
};

export const getMedicationById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    const medication = await prisma.medication.findUnique({
      where: { id },
    });
    if (!medication) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    return res.json({ success: true, data: formatMedication(medication) });
  } catch (error: any) {
    console.error('Error fetching medication:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching medication' });
  }
};

export const createMedication = async (req: Request, res: Response) => {
  try {
    const {
      patientId: rawPatientId,
      name,
      genericName,
      strength,
      form,
      pillColor,
      pillShape,
      imprint,
      timesPerDay,
      scheduledTimes,
      timeSlots,
      foodRule,
      waterRule,
      warnings,
      totalPills,
      pillsRemaining,
      refillThreshold,
      prescribingDoctor,
      doctorPhone,
      pharmacyName,
      rxNumber,
      instructions,
    } = req.body;

    if (!name || !strength) {
      return res.status(400).json({ success: false, message: 'Name and strength are required' });
    }

    const patientId = await resolvePatientId(rawPatientId);

    const defaultInstructions = {
      en: {
        standard: `Take 1 ${form || 'tablet'} of ${name} ${strength} orally as prescribed.`,
        simple: `Take 1 ${form || 'tablet'} of ${name} with a glass of water.`,
        phonetic: name.toLowerCase(),
        purpose: 'Prescribed treatment for your health.',
      },
    };

    const newMed = await prisma.medication.create({
      data: {
        patientId,
        name,
        genericName: genericName || name,
        strength,
        form: form || 'tablet',
        pillColor: pillColor || '#2563eb',
        pillShape: pillShape || 'oval',
        imprint: imprint || '',
        timesPerDay: Number(timesPerDay) || 1,
        scheduledTimes: JSON.stringify(scheduledTimes || ['08:00 AM']),
        timeSlots: JSON.stringify(timeSlots || ['morning']),
        foodRule: foodRule || 'with_food',
        waterRule: waterRule || 'full_glass',
        warnings: JSON.stringify(Array.isArray(warnings) ? warnings : ['Take as directed by doctor']),
        totalPills: Number(totalPills) || 30,
        pillsRemaining: Number(pillsRemaining) || Number(totalPills) || 30,
        refillThreshold: Number(refillThreshold) || 5,
        prescribingDoctor: prescribingDoctor || 'Dr. Healthcare Provider',
        doctorPhone: doctorPhone || '+1 (555) 123-4567',
        pharmacyName: pharmacyName || 'Community Health Pharmacy',
        rxNumber: rxNumber || `RX-${Math.floor(100000 + Math.random() * 900000)}`,
        instructions: JSON.stringify(instructions || defaultInstructions),
      },
    });

    // Auto-create daily schedule item for patient
    const slots = Array.isArray(timeSlots) && timeSlots.length > 0 ? timeSlots : ['morning'];
    const times = Array.isArray(scheduledTimes) && scheduledTimes.length > 0 ? scheduledTimes : ['08:00 AM'];

    for (let i = 0; i < slots.length; i++) {
      await prisma.scheduleItem.create({
        data: {
          patientId: newMed.patientId,
          medicationId: newMed.id,
          timeSlot: slots[i] || 'morning',
          scheduledTime: times[i] || '08:00 AM',
          status: 'pending',
        },
      });
    }

    return res.status(201).json({ success: true, data: formatMedication(newMed) });
  } catch (error: any) {
    console.error('Error creating medication:', error);
    return res.status(500).json({ success: false, message: 'Database error creating medication' });
  }
};

export const updateMedication = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    const body = req.body;

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.genericName !== undefined) data.genericName = body.genericName;
    if (body.strength !== undefined) data.strength = body.strength;
    if (body.form !== undefined) data.form = body.form;
    if (body.pillColor !== undefined) data.pillColor = body.pillColor;
    if (body.pillShape !== undefined) data.pillShape = body.pillShape;
    if (body.imprint !== undefined) data.imprint = body.imprint;
    if (body.timesPerDay !== undefined) data.timesPerDay = Number(body.timesPerDay);
    if (body.scheduledTimes !== undefined) data.scheduledTimes = JSON.stringify(body.scheduledTimes);
    if (body.timeSlots !== undefined) data.timeSlots = JSON.stringify(body.timeSlots);
    if (body.foodRule !== undefined) data.foodRule = body.foodRule;
    if (body.waterRule !== undefined) data.waterRule = body.waterRule;
    if (body.warnings !== undefined) data.warnings = JSON.stringify(body.warnings);
    if (body.totalPills !== undefined) data.totalPills = Number(body.totalPills);
    if (body.pillsRemaining !== undefined) data.pillsRemaining = Number(body.pillsRemaining);
    if (body.prescribingDoctor !== undefined) data.prescribingDoctor = body.prescribingDoctor;
    if (body.doctorPhone !== undefined) data.doctorPhone = body.doctorPhone;
    if (body.pharmacyName !== undefined) data.pharmacyName = body.pharmacyName;
    if (body.rxNumber !== undefined) data.rxNumber = body.rxNumber;
    if (body.instructions !== undefined) data.instructions = JSON.stringify(body.instructions);

    const updated = await prisma.medication.update({
      where: { id },
      data,
    });

    return res.json({ success: true, data: formatMedication(updated) });
  } catch (error: any) {
    console.error('Error updating medication:', error);
    return res.status(500).json({ success: false, message: 'Database error updating medication' });
  }
};

export const deleteMedication = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    const deleted = await prisma.medication.delete({
      where: { id },
    });
    return res.json({ success: true, data: formatMedication(deleted), message: 'Medication removed' });
  } catch (error: any) {
    console.error('Error deleting medication:', error);
    return res.status(500).json({ success: false, message: 'Database error deleting medication' });
  }
};

export const refillMedication = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }
    const med = await prisma.medication.findUnique({ where: { id } });
    if (!med) {
      return res.status(404).json({ success: false, message: 'Medication not found' });
    }

    const refillAmount = req.body.amount ? Number(req.body.amount) : med.totalPills;
    const updated = await prisma.medication.update({
      where: { id },
      data: { pillsRemaining: refillAmount },
    });

    return res.json({
      success: true,
      data: formatMedication(updated),
      message: `Refill confirmed! ${refillAmount} pills restocked for ${med.name}.`,
    });
  } catch (error: any) {
    console.error('Error refilling medication:', error);
    return res.status(500).json({ success: false, message: 'Database error refilling medication' });
  }
};
