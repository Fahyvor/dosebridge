import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { resolvePatientId } from '../lib/dbHelpers.js';
import { AuthenticatedRequest, AuthTokenPayload, UserRoleType } from '../types/auth.js';
import { JWT_SECRET } from '../middleware/auth.js';

const VALID_ROLES: UserRoleType[] = ['PATIENT', 'CAREGIVER', 'CLINICIAN', 'ADMIN'];

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'PATIENT', accessCode } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required.',
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
      return;
    }

    const assignedRole = (role ? role.toUpperCase() : 'PATIENT') as UserRoleType;
    if (!VALID_ROLES.includes(assignedRole)) {
      res.status(400).json({
        success: false,
        error: `Invalid role specified. Must be one of: ${VALID_ROLES.join(', ')}`,
      });
      return;
    }

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      res.status(409).json({
        success: false,
        error: 'An account with this email address is already registered.',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let patientId: string | null = null;
    let caregiverId: string | null = null;

    // Role-specific record creation / linkage
    if (assignedRole === 'PATIENT') {
      // Check if access code provided to link existing patient record
      if (accessCode) {
        const foundPatient = await prisma.patient.findUnique({
          where: { accessCode: accessCode.trim().toUpperCase() },
        });
        if (foundPatient) {
          patientId = foundPatient.id;
        }
      }

      // If no existing patient linked, create a new patient profile
      if (!patientId) {
        const generatedCode = `DB-${Math.floor(1000 + Math.random() * 9000)}`;
        const newPatient = await prisma.patient.create({
          data: {
            fullName: name,
            preferredName: name.split(' ')[0] || name,
            age: 65,
            gender: 'Not Specified',
            primaryLanguage: 'en',
            literacyMode: 'simple',
            accessCode: generatedCode,
            conditions: JSON.stringify([]),
            allergies: JSON.stringify([]),
            emergencyName: 'Emergency Contact',
            emergencyRelationship: 'Family Caregiver',
            emergencyPhone: '+1 (555) 000-0000',
          },
        });
        patientId = newPatient.id;
      }
    } else if (assignedRole === 'CAREGIVER') {
      // If accessCode given, find target patient
      let targetPatientId = '';
      if (accessCode) {
        const targetPat = await prisma.patient.findUnique({
          where: { accessCode: accessCode.trim().toUpperCase() },
        });
        if (targetPat) targetPatientId = targetPat.id;
      }
      if (!targetPatientId) {
        targetPatientId = await resolvePatientId();
      }

      const newCaregiver = await prisma.caregiver.create({
        data: {
          name,
          relationship: 'Primary Family Caregiver',
          phone: '+1 (555) 000-0000',
          email: email.toLowerCase().trim(),
          patientId: targetPatientId,
        },
      });
      caregiverId = newCaregiver.id;
      patientId = targetPatientId;
    }

    // Create User record in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name,
        role: assignedRole,
        patientId,
        caregiverId,
      },
    });

    // Generate JWT token
    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRoleType,
      patientId: user.patientId,
      caregiverId: user.caregiverId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: `Account created successfully with role ${user.role}.`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patientId: user.patientId,
        caregiverId: user.caregiverId,
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while creating your account.',
    });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        patient: true,
        caregiver: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
      return;
    }

    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRoleType,
      patientId: user.patientId,
      caregiverId: user.caregiverId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Signed in as ${user.name} (${user.role}).`,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patientId: user.patientId,
        caregiverId: user.caregiverId,
        patient: user.patient
          ? {
              ...user.patient,
              conditions: JSON.parse(user.patient.conditions || '[]'),
              allergies: JSON.parse(user.patient.allergies || '[]'),
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred while signing in.',
    });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        patient: true,
        caregiver: true,
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: 'User record not found.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patientId: user.patientId,
        caregiverId: user.caregiverId,
        patient: user.patient
          ? {
              ...user.patient,
              conditions: JSON.parse(user.patient.conditions || '[]'),
              allergies: JSON.parse(user.patient.allergies || '[]'),
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

export const switchRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { newRole } = req.body;
    const targetRole = (newRole || '').toUpperCase() as UserRoleType;

    if (!VALID_ROLES.includes(targetRole)) {
      res.status(400).json({
        success: false,
        error: `Invalid role specified. Must be one of: ${VALID_ROLES.join(', ')}`,
      });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { role: targetRole },
    });

    const tokenPayload: AuthTokenPayload = {
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role as UserRoleType,
      patientId: updatedUser.patientId,
      caregiverId: updatedUser.caregiverId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      message: `Active role updated to ${updatedUser.role}.`,
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        patientId: updatedUser.patientId,
        caregiverId: updatedUser.caregiverId,
      },
    });
  } catch (error) {
    console.error('Error switching role:', error);
    res.status(500).json({ success: false, error: 'Failed to switch role.' });
  }
};
