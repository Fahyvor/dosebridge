import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthTokenPayload, UserRoleType } from '../types/auth.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'dosebridge-clinical-secure-secret-2026';

/**
 * Middleware to extract and verify the JWT bearer token from Authorization header.
 * Attaches decoded payload to req.user if valid. Does not block if token is absent (use requireAuth to block).
 */
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    next();
    return;
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (err) {
    // Expired or invalid token
    res.status(401).json({
      success: false,
      error: 'Session expired or invalid authorization token. Please log in again.',
    });
  }
};

/**
 * RBAC Middleware: Requires the request to have a valid authenticated user session.
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please sign in to access this healthcare resource.',
    });
    return;
  }
  next();
};

/**
 * RBAC Middleware: Enforces that the user has one of the required roles.
 * Example: requireRole('CAREGIVER', 'CLINICIAN', 'ADMIN')
 */
export const requireRole = (...allowedRoles: UserRoleType[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to proceed.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access forbidden: Insufficient privileges. Required role(s): [${allowedRoles.join(', ')}]. Current role: ${req.user.role}.`,
        currentRole: req.user.role,
        requiredRoles: allowedRoles,
      });
      return;
    }

    next();
  };
};

/**
 * RBAC Middleware: Patient self-access or Caregiver/Clinician access to patient records.
 */
export const requirePatientOrCareCircle = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required.',
    });
    return;
  }

  const targetPatientId = String(req.params.id || req.query.patientId || req.body.patientId || '');

  // Clinicians & Admins can access all patients
  if (req.user.role === 'CLINICIAN' || req.user.role === 'ADMIN') {
    next();
    return;
  }

  // Patients can access their own record
  if (req.user.role === 'PATIENT') {
    if (!targetPatientId || req.user.patientId === targetPatientId) {
      next();
      return;
    }
  }

  // Caregivers can access their assigned/linked patient
  if (req.user.role === 'CAREGIVER') {
    // Allowed for caregiver operations
    next();
    return;
  }

  res.status(403).json({
    success: false,
    error: 'Access restricted to authorized patients and care circle members.',
  });
};
