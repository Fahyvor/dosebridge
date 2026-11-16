import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

function formatScheduleItem(item: any) {
  return {
    id: item.id,
    patientId: item.patientId,
    medicationId: item.medicationId,
    timeSlot: item.timeSlot,
    scheduledTime: item.scheduledTime,
    status: item.status,
    takenAt: item.takenAt || undefined,
    skipReason: item.skipReason || undefined,
    snoozedUntil: item.snoozedUntil || undefined,
    loggedBy: item.loggedBy || undefined,
    loggedByName: item.loggedByName || undefined,
    medication: item.medication
      ? {
          id: item.medication.id,
          patientId: item.medication.patientId,
          name: item.medication.name,
          genericName: item.medication.genericName,
          strength: item.medication.strength,
          form: item.medication.form,
          pillColor: item.medication.pillColor,
          pillShape: item.medication.pillShape,
          imprint: item.medication.imprint || '',
          timesPerDay: item.medication.timesPerDay,
          scheduledTimes: typeof item.medication.scheduledTimes === 'string' ? JSON.parse(item.medication.scheduledTimes) : item.medication.scheduledTimes,
          timeSlots: typeof item.medication.timeSlots === 'string' ? JSON.parse(item.medication.timeSlots) : item.medication.timeSlots,
          foodRule: item.medication.foodRule,
          waterRule: item.medication.waterRule,
          warnings: typeof item.medication.warnings === 'string' ? JSON.parse(item.medication.warnings) : item.medication.warnings,
          totalPills: item.medication.totalPills,
          pillsRemaining: item.medication.pillsRemaining,
          refillThreshold: item.medication.refillThreshold,
          prescribingDoctor: item.medication.prescribingDoctor,
          doctorPhone: item.medication.doctorPhone,
          pharmacyName: item.medication.pharmacyName,
          rxNumber: item.medication.rxNumber,
          instructions: typeof item.medication.instructions === 'string' ? JSON.parse(item.medication.instructions) : item.medication.instructions,
        }
      : null,
  };
}

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const patientId = (req.query.patientId as string) || 'pat-1';
    const items = await prisma.scheduleItem.findMany({
      where: { patientId },
      include: { medication: true },
      orderBy: { scheduledTime: 'asc' },
    });

    return res.json({ success: true, data: items.map(formatScheduleItem) });
  } catch (error: any) {
    console.error('Error fetching schedule:', error);
    return res.status(500).json({ success: false, message: 'Database error fetching schedule' });
  }
};

export const logDose = async (req: Request, res: Response) => {
  try {
    const { scheduleId, action, reason, loggedBy, loggedByName, customTime } = req.body;

    if (!scheduleId || !action) {
      return res.status(400).json({ success: false, message: 'scheduleId and action are required' });
    }

    const scheduleItem = await prisma.scheduleItem.findUnique({
      where: { id: scheduleId },
      include: { medication: true },
    });

    if (!scheduleItem) {
      return res.status(404).json({ success: false, message: 'Schedule item not found' });
    }

    const now = new Date();
    const timeStr = customTime || now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const medName = scheduleItem.medication?.name || 'Medication';
    const medStrength = scheduleItem.medication?.strength || '1 dose';

    if (action === 'taken') {
      const updatedSchedule = await prisma.scheduleItem.update({
        where: { id: scheduleId },
        data: {
          status: 'taken',
          takenAt: timeStr,
          loggedBy: loggedBy || 'patient',
          loggedByName: loggedByName || (loggedBy === 'caregiver' ? 'David Vance (Caregiver)' : 'Eleanor Vance'),
        },
        include: { medication: true },
      });

      // Decrement pill in DB if remaining > 0
      if (scheduleItem.medication && scheduleItem.medication.pillsRemaining > 0) {
        await prisma.medication.update({
          where: { id: scheduleItem.medicationId },
          data: { pillsRemaining: scheduleItem.medication.pillsRemaining - 1 },
        });
      }

      // Record in AdherenceLog DB table
      await prisma.adherenceLog.create({
        data: {
          patientId: scheduleItem.patientId,
          medicationName: medName,
          dosage: medStrength,
          action: 'taken',
          timestamp: `Today at ${timeStr}`,
          scheduledFor: scheduleItem.scheduledTime,
          loggedBy: loggedBy || 'patient',
          loggedByName: loggedByName || (loggedBy === 'caregiver' ? 'Caregiver' : 'Patient'),
        },
      });

      return res.json({
        success: true,
        message: `Great job! Dose of ${medName} marked as taken.`,
        data: {
          scheduleItem: formatScheduleItem(updatedSchedule),
          pillsRemaining: scheduleItem.medication ? scheduleItem.medication.pillsRemaining - 1 : undefined,
        },
      });
    }

    if (action === 'skipped') {
      const updatedSchedule = await prisma.scheduleItem.update({
        where: { id: scheduleId },
        data: {
          status: 'skipped',
          skipReason: reason || 'Patient declined',
          loggedBy: loggedBy || 'patient',
          loggedByName: loggedByName || (loggedBy === 'caregiver' ? 'David Vance (Caregiver)' : 'Eleanor Vance'),
        },
        include: { medication: true },
      });

      await prisma.adherenceLog.create({
        data: {
          patientId: scheduleItem.patientId,
          medicationName: medName,
          dosage: medStrength,
          action: 'skipped',
          timestamp: `Today at ${timeStr}`,
          scheduledFor: scheduleItem.scheduledTime,
          loggedBy: loggedBy || 'patient',
          loggedByName: loggedByName || 'Patient',
          notes: reason ? `Reason: ${reason}` : undefined,
        },
      });

      return res.json({
        success: true,
        message: `Dose recorded as skipped (${reason || 'no reason provided'}).`,
        data: { scheduleItem: formatScheduleItem(updatedSchedule) },
      });
    }

    if (action === 'snoozed') {
      const snoozeTime = new Date(now.getTime() + 15 * 60000);
      const snoozedStr = snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedSchedule = await prisma.scheduleItem.update({
        where: { id: scheduleId },
        data: {
          status: 'snoozed',
          snoozedUntil: snoozedStr,
        },
        include: { medication: true },
      });

      return res.json({
        success: true,
        message: `Reminder snoozed for 15 minutes (until ${snoozedStr}).`,
        data: { scheduleItem: formatScheduleItem(updatedSchedule) },
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid action. Must be taken, skipped, or snoozed.' });
  } catch (error: any) {
    console.error('Error logging dose:', error);
    return res.status(500).json({ success: false, message: 'Database error logging dose' });
  }
};

export const resetDaySchedule = async (req: Request, res: Response) => {
  try {
    await prisma.scheduleItem.updateMany({
      data: {
        status: 'pending',
        takenAt: null,
        skipReason: null,
        snoozedUntil: null,
      },
    });

    const refreshed = await prisma.scheduleItem.findMany({
      include: { medication: true },
      orderBy: { scheduledTime: 'asc' },
    });

    return res.json({
      success: true,
      message: 'Schedule reset to pending for testing',
      data: refreshed.map(formatScheduleItem),
    });
  } catch (error: any) {
    console.error('Error resetting schedule:', error);
    return res.status(500).json({ success: false, message: 'Database error resetting schedule' });
  }
};
