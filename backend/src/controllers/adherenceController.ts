import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export const getAdherence = async (req: Request, res: Response) => {
  try {
    const patientId = (req.query.patientId as string) || 'pat-1';

    const logs = await prisma.adherenceLog.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    const totalLogs = logs.length;
    const takenCount = logs.filter((l) => l.action === 'taken').length;
    const skippedCount = logs.filter((l) => l.action === 'skipped').length;
    const adherenceRate = totalLogs > 0 ? Math.round((takenCount / totalLogs) * 100) : 100;

    // Weekly day breakdown
    const weeklyBreakdown = [
      { day: 'Mon', date: 'Nov 10', taken: 4, scheduled: 4, pct: 100 },
      { day: 'Tue', date: 'Nov 11', taken: 4, scheduled: 4, pct: 100 },
      { day: 'Wed', date: 'Nov 12', taken: 3, scheduled: 4, pct: 75 },
      { day: 'Thu', date: 'Nov 13', taken: 4, scheduled: 4, pct: 100 },
      { day: 'Fri', date: 'Nov 14', taken: 4, scheduled: 4, pct: 100 },
      { day: 'Sat', date: 'Nov 15', taken: 2, scheduled: 2, pct: 100 },
      { day: 'Sun', date: 'Nov 16', taken: takenCount > 0 ? 2 : 0, scheduled: 4, pct: adherenceRate, current: true },
    ];

    const encouragementMessage =
      adherenceRate >= 90
        ? '🌟 Wonderful progress! You are keeping your health protected and on track.'
        : adherenceRate >= 70
        ? '👍 Good steady progress. Your care circle is here to help you hit 100%!'
        : '⚠️ Let us help you set up friendly reminders so no dose is missed.';

    return res.json({
      success: true,
      data: {
        adherenceRate,
        streakDays: 6,
        totalDosesTaken: takenCount,
        totalDosesSkipped: skippedCount,
        weeklyBreakdown,
        recentLogs: logs.map((l) => ({
          id: l.id,
          patientId: l.patientId,
          medicationName: l.medicationName,
          dosage: l.dosage,
          action: l.action,
          timestamp: l.timestamp,
          scheduledFor: l.scheduledFor,
          loggedBy: l.loggedBy,
          loggedByName: l.loggedByName,
          notes: l.notes || undefined,
        })),
        encouragementMessage,
      },
    });
  } catch (error: any) {
    console.error('Error fetching adherence:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching adherence' });
  }
};
