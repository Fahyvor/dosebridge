import { Request } from 'express';

export type UserRoleType = 'PATIENT' | 'CAREGIVER' | 'CLINICIAN' | 'ADMIN';

export const USER_ROLES: Record<string, UserRoleType> = {
  PATIENT: 'PATIENT',
  CAREGIVER: 'CAREGIVER',
  CLINICIAN: 'CLINICIAN',
  ADMIN: 'ADMIN',
};

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRoleType;
  patientId?: string | null;
  caregiverId?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}
