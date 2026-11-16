import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { resolvePatientId, isValidObjectId } from '../lib/dbHelpers.js';

function formatPatient(p: any) {
  return {
    id: p.id,
    fullName: p.fullName,
    preferredName: p.preferredName || p.fullName.split(' ')[0],
    age: p.age,
    gender: p.gender,
    primaryLanguage: p.primaryLanguage,
    literacyMode: p.literacyMode,
    accessCode: p.accessCode,
    conditions: typeof p.conditions === 'string' ? JSON.parse(p.conditions) : p.conditions,
    allergies: typeof p.allergies === 'string' ? JSON.parse(p.allergies) : p.allergies,
    emergencyContact: {
      name: p.emergencyName,
      relationship: p.emergencyRelationship,
      phone: p.emergencyPhone,
    },
    caregivers: p.caregivers || [],
  };
}

export const getPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      include: { caregivers: true },
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ success: true, data: patients.map(formatPatient) });
  } catch (error: any) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching patients' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const rawId = String(req.params.id);
    const id = await resolvePatientId(rawId);
    if (!id) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: { caregivers: true, medications: true },
    });
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.json({ success: true, data: formatPatient(patient) });
  } catch (error: any) {
    console.error('Error fetching patient:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching patient' });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      preferredName,
      age,
      gender,
      primaryLanguage,
      literacyMode,
      conditions,
      allergies,
      emergencyContact,
    } = req.body;

    if (!fullName) {
      return res.status(400).json({ success: false, message: 'Full name is required' });
    }

    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const accessCode = `DB-${randomCodeNum}`;

    const newPatient = await prisma.patient.create({
      data: {
        fullName,
        preferredName: preferredName || fullName.split(' ')[0],
        age: Number(age) || 60,
        gender: gender || 'Other',
        primaryLanguage: primaryLanguage || 'en',
        literacyMode: literacyMode || 'simple',
        accessCode,
        conditions: JSON.stringify(Array.isArray(conditions) ? conditions : []),
        allergies: JSON.stringify(Array.isArray(allergies) ? allergies : []),
        emergencyName: emergencyContact?.name || 'Emergency Contact',
        emergencyRelationship: emergencyContact?.relationship || 'Family Member',
        emergencyPhone: emergencyContact?.phone || '+1 (555) 000-0000',
      },
      include: { caregivers: true },
    });

    return res.status(201).json({ success: true, data: formatPatient(newPatient) });
  } catch (error: any) {
    console.error('Error registering patient:', error);
    return res.status(500).json({ success: false, message: 'Database error creating patient' });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  try {
    const rawId = String(req.params.id);
    const id = await resolvePatientId(rawId);
    if (!id) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    const {
      fullName,
      preferredName,
      age,
      gender,
      primaryLanguage,
      literacyMode,
      conditions,
      allergies,
      emergencyContact,
    } = req.body;

    const data: any = {};
    if (fullName !== undefined) data.fullName = fullName;
    if (preferredName !== undefined) data.preferredName = preferredName;
    if (age !== undefined) data.age = Number(age);
    if (gender !== undefined) data.gender = gender;
    if (primaryLanguage !== undefined) data.primaryLanguage = primaryLanguage;
    if (literacyMode !== undefined) data.literacyMode = literacyMode;
    if (conditions !== undefined) data.conditions = JSON.stringify(conditions);
    if (allergies !== undefined) data.allergies = JSON.stringify(allergies);
    if (emergencyContact) {
      if (emergencyContact.name) data.emergencyName = emergencyContact.name;
      if (emergencyContact.relationship) data.emergencyRelationship = emergencyContact.relationship;
      if (emergencyContact.phone) data.emergencyPhone = emergencyContact.phone;
    }

    const updated = await prisma.patient.update({
      where: { id },
      data,
      include: { caregivers: true },
    });

    return res.json({ success: true, data: formatPatient(updated) });
  } catch (error: any) {
    console.error('Error updating patient:', error);
    return res.status(500).json({ success: false, message: 'Database error updating patient' });
  }
};
