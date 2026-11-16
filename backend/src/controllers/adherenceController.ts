import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { resolvePatientId } from '../lib/dbHelpers.js';

export const getAdherence = async (req: Request, res: Response) => {
  try {
    const rawPatientId = req.query.patientId as string | undefined;
    const patientId = await resolvePatientId(rawPatientId);

    const logs = await prisma.adherenceLog.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      take: 25,
    });

    const totalLogs = logs.length;
    const takenCount = logs.filter((l: any) => l.action === 'taken').length;
    const skippedCount = logs.filter((l: any) => l.action === 'skipped').length;
    const adherenceRate = totalLogs > 0 ? Math.round((takenCount / totalLogs) * 100) : 100;

    // Total daily scheduled doses for this patient from real ScheduleItem table
    const patientScheduleItems = await prisma.scheduleItem.findMany({
      where: { patientId },
    });
    const scheduledPerDay = patientScheduleItems.length || 1;

    // All logs for the patient to calculate daily stats & real streaks
    const allPatientLogs = await prisma.adherenceLog.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const weeklyBreakdown = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      const monthName = months[d.getMonth()];
      const dateStr = `${monthName} ${d.getDate()}`;
      const isToday = i === 0;

      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const dayLogs = allPatientLogs.filter((log: any) => {
        const logDate = new Date(log.createdAt);
        return logDate >= dayStart && logDate <= dayEnd;
      });

      const dayTaken = dayLogs.filter((l: any) => l.action === 'taken').length;
      const dayScheduled = scheduledPerDay;
      const dayPct = dayScheduled > 0 ? Math.min(100, Math.round((dayTaken / dayScheduled) * 100)) : 100;

      weeklyBreakdown.push({
        day: dayName,
        date: dateStr,
        taken: dayTaken,
        scheduled: dayScheduled,
        pct: dayPct,
        current: isToday,
      });
    }

    // Real streak calculation: consecutive days with taken doses
    let streakDays = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

      const count = allPatientLogs.filter((l: any) => {
        const logDate = new Date(l.createdAt);
        return l.action === 'taken' && logDate >= dayStart && logDate <= dayEnd;
      }).length;

      if (count > 0) {
        streakDays++;
      } else if (i > 0) {
        break;
      }
    }

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
        streakDays: streakDays > 0 ? streakDays : 1,
        totalDosesTaken: takenCount,
        totalDosesSkipped: skippedCount,
        weeklyBreakdown,
        recentLogs: logs.map((l: any) => ({
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
