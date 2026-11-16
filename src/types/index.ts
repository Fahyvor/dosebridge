export type Language = 'en' | 'es' | 'fr' | 'yo' | 'ar' | 'zh' | 'hi' | 'sw' | 'de';

export type UserRole = 'patient' | 'caregiver';

export type FontSize = 'normal' | 'large' | 'xl' | 'jumbo';

export type ContrastTheme = 'dark' | 'high-contrast-dark' | 'high-contrast-light' | 'soft-calm';

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection' | 'drops';
  pillColor: string;
  pillShape: 'round' | 'capsule' | 'oval' | 'square';
  imprint?: string;
  timesPerDay: number;
  scheduledTimes: string[];
  timeSlots: ('morning' | 'afternoon' | 'evening' | 'bedtime')[];
  foodRule: 'with_food' | 'empty_stomach' | 'after_food' | 'no_restriction';
  waterRule: 'full_glass' | 'normal';
  warnings: string[];
  totalPills: number;
  pillsRemaining: number;
  refillThreshold: number;
  prescribingDoctor: string;
  doctorPhone: string;
  pharmacyName: string;
  rxNumber: string;
  instructions: {
    [key in Language]?: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
  };
}

export interface ScheduleItem {
  id: string;
  medicationId: string;
  patientId: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  scheduledTime: string;
  status: 'pending' | 'taken' | 'snoozed' | 'skipped';
  takenAt?: string;
  skipReason?: string;
  snoozedUntil?: string;
  loggedBy?: 'patient' | 'caregiver';
  loggedByName?: string;
  medication?: Medication;
}

export interface AdherenceLog {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  action: 'taken' | 'skipped' | 'snoozed';
  timestamp: string;
  scheduledFor: string;
  loggedBy: 'patient' | 'caregiver';
  loggedByName: string;
  notes?: string;
}

export interface CaregiverNote {
  id: string;
  patientId: string;
  caregiverId: string;
  caregiverName: string;
  text: string;
  timestamp: string;
  pinned: boolean;
  priority: 'normal' | 'important' | 'emergency';
}

export interface PatientProfile {
  id: string;
  fullName: string;
  preferredName: string;
  age: number;
  gender: string;
  primaryLanguage: Language;
  literacyMode: 'simple' | 'standard' | 'pictogram';
  accessCode: string;
  conditions: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  caregivers: {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }[];
  stats?: {
    totalMeds: number;
    todayTotal: number;
    todayTaken: number;
    todayPending: number;
    lowRefillAlerts: number;
  };
}

export interface EducationalArticle {
  id: string;
  category: 'safety' | 'instructions' | 'interactions' | 'storage' | 'emergency';
  title: Record<string, string>;
  summary: Record<string, string>;
  simpleContent: Record<string, string>;
  keyTakeaways: string[];
  readTime: string;
  iconName: string;
}

export interface AdherenceStats {
  adherenceRate: number;
  streakDays: number;
  totalDosesTaken: number;
  totalDosesSkipped: number;
  weeklyBreakdown: {
    day: string;
    date: string;
    taken: number;
    scheduled: number;
    pct: number;
    current?: boolean;
  }[];
  recentLogs: AdherenceLog[];
  encouragementMessage: string;
}
