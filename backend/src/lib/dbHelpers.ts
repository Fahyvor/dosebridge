import { prisma } from './prisma.js';

/**
 * Checks whether a string is a valid 24-character hexadecimal MongoDB ObjectId.
 */
export function isValidObjectId(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id.trim());
}

/**
 * Resolves a patient ID safely for MongoDB Atlas.
 * If providedId is a valid ObjectId, verifies existence or returns it.
 * If providedId is omitted, invalid (e.g. 'pat-1' legacy fallback), or not found,
 * it resolves to the first existing patient in the database.
 */
export async function resolvePatientId(providedId?: string | null): Promise<string> {
  const trimmed = providedId?.trim();
  if (trimmed && isValidObjectId(trimmed)) {
    const existing = await prisma.patient.findUnique({
      where: { id: trimmed },
      select: { id: true },
    });
    if (existing) return existing.id;
  }

  // Fallback to the first patient in the database
  const firstPatient = await prisma.patient.findFirst({
    select: { id: true },
  });

  return firstPatient ? firstPatient.id : '';
}
