import {
  PatientProfile,
  Medication,
  ScheduleItem,
  AdherenceStats,
  CaregiverNote,
  EducationalArticle,
  AuthUser,
  RbacRole,
} from '../types';

const API_BASE = '/api';

let token: string | null = typeof window !== 'undefined' ? localStorage.getItem('dosebridge_jwt') : null;

export const setStoredToken = (newToken: string | null) => {
  token = newToken;
  if (typeof window !== 'undefined') {
    if (newToken) {
      localStorage.setItem('dosebridge_jwt', newToken);
    } else {
      localStorage.removeItem('dosebridge_jwt');
    }
  }
};

export const getStoredToken = () => token;

const getHeaders = (extra: Record<string, string> = {}) => {
  const headers: Record<string, string> = { ...extra };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Realistic clinical fallback data if backend is offline or during offline testing
const FALLBACK_PATIENTS: PatientProfile[] = [
  {
    id: 'pat-1',
    fullName: 'Eleanor Vance',
    preferredName: 'Eleanor',
    age: 68,
    gender: 'Female',
    primaryLanguage: 'en',
    literacyMode: 'simple',
    accessCode: 'DB-6821',
    conditions: ['Type 2 Diabetes', 'Hypertension (High Blood Pressure)', 'Mild Knee Arthritis'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    emergencyContact: {
      name: 'David Vance (Son)',
      relationship: 'Son & Primary Caregiver',
      phone: '+1 (555) 234-5678',
    },
    caregivers: [
      {
        id: 'cg-1',
        name: 'David Vance',
        relationship: 'Son',
        phone: '+1 (555) 234-5678',
        email: 'david.vance@example.com',
      },
    ],
  },
  {
    id: 'pat-2',
    fullName: 'Don Mateo Hernandez',
    preferredName: 'Mateo',
    age: 72,
    gender: 'Male',
    primaryLanguage: 'es',
    literacyMode: 'simple',
    accessCode: 'DB-7204',
    conditions: ['High Cholesterol', 'Glaucoma'],
    allergies: ['Aspirin'],
    emergencyContact: {
      name: 'Sofia Hernandez',
      relationship: 'Daughter',
      phone: '+1 (555) 876-5432',
    },
    caregivers: [
      {
        id: 'cg-2',
        name: 'Sofia Hernandez',
        relationship: 'Daughter',
        phone: '+1 (555) 876-5432',
        email: 'sofia.h@example.com',
      },
    ],
  },
];

const FALLBACK_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    patientId: 'pat-1',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    strength: '500 mg',
    form: 'tablet',
    pillColor: '#f1f5f9',
    pillShape: 'oval',
    imprint: 'M 500',
    timesPerDay: 2,
    scheduledTimes: ['08:00 AM', '06:30 PM'],
    timeSlots: ['morning', 'evening'],
    foodRule: 'with_food',
    waterRule: 'full_glass',
    warnings: ['Take with breakfast & dinner', 'Do not drink heavy alcohol', 'Swallow whole with water'],
    totalPills: 60,
    pillsRemaining: 14,
    refillThreshold: 10,
    prescribingDoctor: 'Dr. Sarah Chen, MD (Endocrinology)',
    doctorPhone: '+1 (555) 432-1098',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-994821',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth twice daily with meals to lower blood glucose.',
        simple: 'Take 1 white oval pill with breakfast and 1 with dinner. Eat food first so your tummy feels settled. Drink a full glass of water.',
        phonetic: 'met-FOR-min hye-droe-KLOR-ide',
        purpose: 'Helps balance healthy blood sugar levels for diabetes.',
      },
      es: {
        standard: 'Tome 1 tableta por vía oral dos veces al día con las comidas para controlar la glucosa.',
        simple: 'Tome 1 pastilla blanca ovalada con su desayuno y 1 con su cena. Coma alimentos primero para proteger su estómago.',
        phonetic: 'met-for-MEE-na',
        purpose: 'Ayuda a regular los niveles de azúcar en la sangre.',
      },
    },
  },
  {
    id: 'med-2',
    patientId: 'pat-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril Dihydrate',
    strength: '10 mg',
    form: 'tablet',
    pillColor: '#f97316',
    pillShape: 'round',
    imprint: 'L 10',
    timesPerDay: 1,
    scheduledTimes: ['08:00 AM'],
    timeSlots: ['morning'],
    foodRule: 'no_restriction',
    waterRule: 'full_glass',
    warnings: ['Take every morning at the same hour', 'May cause light dizziness when standing up quickly'],
    totalPills: 30,
    pillsRemaining: 4,
    refillThreshold: 5,
    prescribingDoctor: 'Dr. Marcus Vance, MD (Cardiology)',
    doctorPhone: '+1 (555) 678-9012',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-882190',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth daily in the morning for blood pressure management.',
        simple: 'Take 1 round orange pill every morning with water. It keeps your blood pressure safe and relaxes your heart.',
        phonetic: 'lye-SIN-oh-pril',
        purpose: 'Lowers high blood pressure and protects your heart.',
      },
      es: {
        standard: 'Tome 1 tableta por vía oral diariamente por la mañana para la presión arterial.',
        simple: 'Tome 1 pastilla redonda naranja cada mañana con agua. Mantiene su corazón tranquilo y su presión baja.',
        phonetic: 'li-si-no-PRIL',
        purpose: 'Baja la presión arterial alta y cuida su corazón.',
      },
    },
  },
  {
    id: 'med-3',
    patientId: 'pat-1',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    strength: '20 mg',
    form: 'tablet',
    pillColor: '#e2e8f0',
    pillShape: 'oval',
    imprint: 'AT 20',
    timesPerDay: 1,
    scheduledTimes: ['09:30 PM'],
    timeSlots: ['bedtime'],
    foodRule: 'no_restriction',
    waterRule: 'normal',
    warnings: ['Take before bedtime', 'Avoid eating fresh grapefruit or drinking grapefruit juice'],
    totalPills: 30,
    pillsRemaining: 21,
    refillThreshold: 7,
    prescribingDoctor: 'Dr. Marcus Vance, MD (Cardiology)',
    doctorPhone: '+1 (555) 678-9012',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-773104',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth daily at bedtime to reduce cholesterol.',
        simple: 'Take 1 white oval pill at night before going to bed. Avoid grapefruit while on this medicine.',
        phonetic: 'a-TOR-va-sta-tin',
        purpose: 'Protects blood vessels and keeps cholesterol healthy.',
      },
      es: {
        standard: 'Tome 1 tableta diaria por la noche al acostarse.',
        simple: 'Tome 1 pastilla ovalada blanca por la noche antes de acostarse. Evite la toronja.',
        phonetic: 'a-tor-va-sta-TEE-na',
        purpose: 'Protege las arterias y baja el colesterol.',
      },
    },
  },
];

let localPatients = [...FALLBACK_PATIENTS];
let localMedications = [...FALLBACK_MEDICATIONS];
let localSchedule: ScheduleItem[] = [
  {
    id: 'sched-1',
    medicationId: 'med-1',
    patientId: 'pat-1',
    timeSlot: 'morning',
    scheduledTime: '08:00 AM',
    status: 'taken',
    takenAt: '08:12 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
    medication: FALLBACK_MEDICATIONS[0],
  },
  {
    id: 'sched-2',
    medicationId: 'med-2',
    patientId: 'pat-1',
    timeSlot: 'morning',
    scheduledTime: '08:00 AM',
    status: 'taken',
    takenAt: '08:12 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
    medication: FALLBACK_MEDICATIONS[1],
  },
  {
    id: 'sched-3',
    medicationId: 'med-1',
    patientId: 'pat-1',
    timeSlot: 'evening',
    scheduledTime: '06:30 PM',
    status: 'pending',
    medication: FALLBACK_MEDICATIONS[0],
  },
  {
    id: 'sched-4',
    medicationId: 'med-3',
    patientId: 'pat-1',
    timeSlot: 'bedtime',
    scheduledTime: '09:30 PM',
    status: 'pending',
    medication: FALLBACK_MEDICATIONS[2],
  },
];

let localNotes: CaregiverNote[] = [
  {
    id: 'note-1',
    patientId: 'pat-1',
    caregiverId: 'cg-1',
    caregiverName: 'David Vance (Son)',
    text: 'Good morning Mom! I placed a fresh pitcher of ice water on your kitchen table. Remember to take your morning pill after eating your oatmeal! ❤️',
    timestamp: 'Today at 7:15 AM',
    pinned: true,
    priority: 'important',
  },
  {
    id: 'note-2',
    patientId: 'pat-1',
    caregiverId: 'cg-1',
    caregiverName: 'David Vance (Son)',
    text: 'Dr. Sarah Chen scheduled a follow-up review for next Tuesday at 10:30 AM. I will pick you up at 9:45 AM.',
    timestamp: 'Yesterday at 4:20 PM',
    pinned: false,
    priority: 'normal',
  },
];

export const api = {
  // ----------------------------------------------------
  // Authentication & RBAC API Endpoints
  // ----------------------------------------------------
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; token: string; user: AuthUser; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to sign in. Please verify your credentials.');
    }
    setStoredToken(json.token);
    return json;
  },

  async register(payload: {
    email: string;
    password: string;
    name: string;
    role?: RbacRole;
    accessCode?: string;
  }): Promise<{ success: boolean; token: string; user: AuthUser; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to create user account.');
    }
    setStoredToken(json.token);
    return json;
  },

  async getMe(): Promise<{ success: boolean; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to load user session.');
    }
    return json;
  },

  async switchRole(
    newRole: RbacRole
  ): Promise<{ success: boolean; token: string; user: AuthUser; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ newRole }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Failed to switch role.');
    }
    setStoredToken(json.token);
    return json;
  },

  logout(): void {
    setStoredToken(null);
  },

  // Patients
  async getPatients(): Promise<PatientProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/patients`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localPatients = json.data;
          return json.data;
        }
      }
    } catch {
      // Return synced fallback
    }
    return localPatients;
  },

  async getPatient(id: string): Promise<PatientProfile> {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return localPatients.find((p) => p.id === id) || localPatients[0];
  },

  async updatePatient(id: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const idx = localPatients.findIndex((p) => p.id === id);
    if (idx !== -1) {
      localPatients[idx] = { ...localPatients[idx], ...updates };
      return localPatients[idx];
    }
    return localPatients[0];
  },

  async registerPatient(profile: Partial<PatientProfile>): Promise<PatientProfile> {
    try {
      const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const newPat: PatientProfile = {
      id: `pat-${Date.now()}`,
      fullName: profile.fullName || 'New Patient',
      preferredName: profile.preferredName || profile.fullName || 'Patient',
      age: profile.age || 60,
      gender: profile.gender || 'Female',
      primaryLanguage: profile.primaryLanguage || 'en',
      literacyMode: profile.literacyMode || 'simple',
      accessCode: `DB-${Math.floor(1000 + Math.random() * 9000)}`,
      conditions: profile.conditions || [],
      allergies: profile.allergies || [],
      emergencyContact: profile.emergencyContact || {
        name: 'Family Contact',
        relationship: 'Caregiver',
        phone: '+1 (555) 000-0000',
      },
      caregivers: [],
    };
    localPatients.unshift(newPat);
    return newPat;
  },

  // Medications
  async getMedications(patientId?: string): Promise<Medication[]> {
    try {
      const url = patientId ? `${API_BASE}/medications?patientId=${patientId}` : `${API_BASE}/medications`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localMedications = json.data;
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    if (patientId) {
      return localMedications.filter((m) => m.patientId === patientId);
    }
    return localMedications;
  },

  async createMedication(med: Partial<Medication>): Promise<Medication> {
    try {
      const res = await fetch(`${API_BASE}/medications`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(med),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const newMed: Medication = {
      id: `med-${Date.now()}`,
      patientId: med.patientId || 'pat-1',
      name: med.name || 'New Medicine',
      genericName: med.genericName || med.name || 'Generic Medicine',
      strength: med.strength || '10 mg',
      form: med.form || 'tablet',
      pillColor: med.pillColor || '#3b82f6',
      pillShape: med.pillShape || 'oval',
      imprint: med.imprint || '',
      timesPerDay: med.timesPerDay || 1,
      scheduledTimes: med.scheduledTimes || ['08:00 AM'],
      timeSlots: med.timeSlots || ['morning'],
      foodRule: med.foodRule || 'with_food',
      waterRule: med.waterRule || 'full_glass',
      warnings: med.warnings || ['Take as directed by doctor'],
      totalPills: med.totalPills || 30,
      pillsRemaining: med.pillsRemaining || 30,
      refillThreshold: med.refillThreshold || 5,
      prescribingDoctor: med.prescribingDoctor || 'Dr. Healthcare Provider',
      doctorPhone: med.doctorPhone || '+1 (555) 123-4567',
      pharmacyName: med.pharmacyName || 'Local Community Pharmacy',
      rxNumber: med.rxNumber || `RX-${Math.floor(100000 + Math.random() * 900000)}`,
      instructions: med.instructions || {
        en: {
          standard: `Take 1 ${med.form || 'tablet'} of ${med.name} daily.`,
          simple: `Take 1 pill with a glass of water.`,
          phonetic: (med.name || '').toLowerCase(),
          purpose: 'Prescribed for your ongoing health care.',
        },
      },
    };
    localMedications.push(newMed);
    return newMed;
  },

  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    try {
      const res = await fetch(`${API_BASE}/medications/${id}`, {
        method: 'PUT',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const idx = localMedications.findIndex((m) => m.id === id);
    if (idx !== -1) {
      localMedications[idx] = { ...localMedications[idx], ...updates };
      return localMedications[idx];
    }
    return localMedications[0];
  },

  async deleteMedication(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/medications/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {
      // Fallback
    }
    localMedications = localMedications.filter((m) => m.id !== id);
    localSchedule = localSchedule.filter((s) => s.medicationId !== id);
  },

  async refillMedication(id: string, amount?: number): Promise<{ success: boolean; message: string; data: Medication }> {
    try {
      const res = await fetch(`${API_BASE}/medications/${id}/refill`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ amount }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const target = localMedications.find((m) => m.id === id);
    const addedAmount = amount || target?.totalPills || 30;
    if (target) {
      target.pillsRemaining = addedAmount;
    }
    return {
      success: true,
      message: `Refill confirmed! ${addedAmount} pills restocked for ${target?.name || 'prescription'}.`,
      data: target || localMedications[0],
    };
  },

  // Schedule
  async getSchedule(patientId: string): Promise<ScheduleItem[]> {
    try {
      const res = await fetch(`${API_BASE}/schedule?patientId=${patientId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          localSchedule = json.data;
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return localSchedule
      .filter((s) => s.patientId === patientId)
      .map((s) => ({
        ...s,
        medication: localMedications.find((m) => m.id === s.medicationId) || s.medication,
      }));
  },

  async logDose(payload: {
    scheduleId: string;
    action: 'taken' | 'skipped' | 'snoozed';
    reason?: string;
    loggedBy: 'patient' | 'caregiver';
    loggedByName: string;
  }): Promise<{ success: boolean; message: string; data: unknown }> {
    try {
      const res = await fetch(`${API_BASE}/schedule/log`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const target = localSchedule.find((s) => s.id === payload.scheduleId);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (target) {
      target.status = payload.action;
      if (payload.action === 'taken') {
        target.takenAt = now;
        target.loggedBy = payload.loggedBy;
        target.loggedByName = payload.loggedByName;
        const med = localMedications.find((m) => m.id === target.medicationId);
        if (med && med.pillsRemaining > 0) med.pillsRemaining -= 1;
      } else if (payload.action === 'skipped') {
        target.skipReason = payload.reason || 'Patient declined';
      } else if (payload.action === 'snoozed') {
        const snoozeTime = new Date(Date.now() + 15 * 60000);
        target.snoozedUntil = snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    const medName = target?.medication?.name || 'Medication';
    const message =
      payload.action === 'taken'
        ? `Great job! Dose of ${medName} marked as taken.`
        : payload.action === 'skipped'
        ? `Dose recorded as skipped (${payload.reason || 'patient declined'}).`
        : `Reminder snoozed for 15 minutes.`;
    return { success: true, message, data: { scheduleItem: target } };
  },

  async resetDaySchedule(): Promise<void> {
    try {
      await fetch(`${API_BASE}/schedule/reset-day`, { method: 'POST' });
    } catch {
      // Fallback
    }
    localSchedule = localSchedule.map((s) => ({
      ...s,
      status: 'pending',
      takenAt: undefined,
      skipReason: undefined,
      snoozedUntil: undefined,
    }));
  },

  // Adherence
  async getAdherence(patientId: string): Promise<AdherenceStats> {
    try {
      const res = await fetch(`${API_BASE}/adherence?patientId=${patientId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return {
      adherenceRate: 94,
      streakDays: 6,
      totalDosesTaken: 28,
      totalDosesSkipped: 2,
      weeklyBreakdown: [
        { day: 'Mon', date: 'Nov 10', taken: 4, scheduled: 4, pct: 100 },
        { day: 'Tue', date: 'Nov 11', taken: 4, scheduled: 4, pct: 100 },
        { day: 'Wed', date: 'Nov 12', taken: 3, scheduled: 4, pct: 75 },
        { day: 'Thu', date: 'Nov 13', taken: 4, scheduled: 4, pct: 100 },
        { day: 'Fri', date: 'Nov 14', taken: 4, scheduled: 4, pct: 100 },
        { day: 'Sat', date: 'Nov 15', taken: 2, scheduled: 2, pct: 100 },
        { day: 'Sun', date: 'Nov 16', taken: 2, scheduled: 4, pct: 50, current: true },
      ],
      recentLogs: [
        {
          id: 'log-1',
          patientId,
          medicationName: 'Metformin',
          dosage: '500 mg',
          action: 'taken',
          timestamp: 'Today at 08:12 AM',
          scheduledFor: '08:00 AM',
          loggedBy: 'patient',
          loggedByName: 'Eleanor Vance',
        },
        {
          id: 'log-2',
          patientId,
          medicationName: 'Lisinopril',
          dosage: '10 mg',
          action: 'taken',
          timestamp: 'Today at 08:12 AM',
          scheduledFor: '08:00 AM',
          loggedBy: 'patient',
          loggedByName: 'Eleanor Vance',
        },
      ],
      encouragementMessage: '🌟 Wonderful progress! You are taking great care of your health routine.',
    };
  },

  // Caregiver
  async getCaregiverPatients(caregiverId = 'cg-1'): Promise<PatientProfile[]> {
    try {
      const res = await fetch(`${API_BASE}/caregiver/patients?caregiverId=${caregiverId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return localPatients;
  },

  async linkPatientByCode(payload: {
    accessCode: string;
    caregiverName: string;
    caregiverPhone?: string;
    caregiverEmail?: string;
  }): Promise<{ success: boolean; message: string; data?: PatientProfile }> {
    try {
      const res = await fetch(`${API_BASE}/caregiver/link`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    const found = localPatients.find(
      (p) => p.accessCode.toUpperCase() === payload.accessCode.trim().toUpperCase()
    );
    if (!found) {
      return {
        success: false,
        message: `No patient found with code ${payload.accessCode}. Please double-check with your loved one.`,
      };
    }
    return {
      success: true,
      message: `Connected with ${found.fullName}! You now share live medication visibility.`,
      data: found,
    };
  },

  async linkPatientCaregiver(
    accessCode: string,
    caregiverName: string,
    caregiverPhone?: string,
    caregiverEmail?: string
  ): Promise<{ success: boolean; message: string; data?: PatientProfile }> {
    return this.linkPatientByCode({ accessCode, caregiverName, caregiverPhone, caregiverEmail });
  },

  async getCaregiverNotes(patientId: string): Promise<CaregiverNote[]> {
    try {
      const res = await fetch(`${API_BASE}/caregiver/notes?patientId=${patientId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return localNotes.filter((n) => n.patientId === patientId);
  },

  async createCaregiverNote(payload: {
    patientId: string;
    text: string;
    priority: 'normal' | 'important' | 'emergency';
    caregiverName: string;
  }): Promise<CaregiverNote> {
    try {
      const res = await fetch(`${API_BASE}/caregiver/notes`, {
        method: 'POST',
        headers: getHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    const newNote: CaregiverNote = {
      id: `note-${Date.now()}`,
      patientId: payload.patientId,
      caregiverId: 'cg-1',
      caregiverName: payload.caregiverName || 'David Vance (Caregiver)',
      text: payload.text,
      timestamp: 'Just now',
      pinned: payload.priority === 'important',
      priority: payload.priority,
    };
    localNotes.unshift(newNote);
    return newNote;
  },

  async deleteCaregiverNote(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/caregiver/notes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
    } catch {
      // Fallback
    }
    localNotes = localNotes.filter((n) => n.id !== id);
  },

  async getCaregiverAlerts(patientId: string): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/caregiver/alerts?patientId=${patientId}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'alert-refill-med-2',
        type: 'refill',
        severity: 'warning',
        title: 'Low Supply: Lisinopril',
        message: 'Only 4 pills remaining. Refill recommended soon.',
        rxNumber: 'RX-882190',
        pharmacy: 'Community Health Pharmacy #12',
      },
    ];
  },

  // Educational Resources
  async getResources(category?: string): Promise<EducationalArticle[]> {
    try {
      const url = category && category !== 'all' ? `${API_BASE}/resources?category=${category}` : `${API_BASE}/resources`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'edu-1',
        category: 'instructions',
        title: {
          en: 'How to Read Your Pill Bottle Without Getting Confused',
          es: 'Cómo leer la etiqueta de su receta médica claramente',
          fr: 'Comment lire clairement l’étiquette de votre ordonnance',
          yo: 'Bi a se n ka iwe aami egbogi daadaa',
          ar: 'كيف تقرأ ملصق الوصفة الطبية بوضوح وبساطة',
          zh: '如何清晰读懂处方药瓶标签',
        },
        summary: {
          en: 'Learn what the Rx number, dosage numbers, and warning symbols mean on your pill bottle.',
          es: 'Aprenda qué significan el número de receta, las dosis y los símbolos de advertencia.',
          fr: 'Comprenez le numéro d’ordonnance, les dosages et les symboles d’alerte sur votre boîte.',
          yo: 'Kọ ẹkọ nipa nọmba egbogi, iwọn lilo, ati awọn ami ikilọ lori igo egbogi rẹ.',
          ar: 'تعلم معاني رقم الوصفة وجرعات الدواء ورموز التحذير الموجودة على علبة الدواء.',
          zh: '了解药瓶上的处方编号、剂量数字以及彩色警告图标的含义。',
        },
        simpleContent: {
          en: `1. Medication Name: Tells you what medicine is inside. If there are two names, one is the brand name (like Glucophage) and one is the generic scientific name (like Metformin).\n2. Directions: Look for words like "Take 1 tablet by mouth daily". Follow the exact number.\n3. Rx Number: This is your unique ID number for this prescription bottle. Give this number to the pharmacy when you need a refill.\n4. Warning Stickers: Bright yellow or red stickers tell you if you must take it with food, avoid alcohol, or avoid sunlight.`,
          es: `1. Nombre del medicamento: Le indica qué medicina contiene.\n2. Indicaciones: Busque palabras como "Tome 1 tableta diaria".\n3. Número de Rx: El número de identificación de su receta.\n4. Pegatinas de advertencia: Indican si debe tomarlo con comida.`,
          fr: `1. Nom du médicament: Indique le principe actif et le nom commercial.\n2. Posologie: Lisez attentivement la dose prescrite.\n3. Numéro d’ordonnance: Utilisez ce numéro pour renouveler votre traitement.`,
          yo: `1. Oruko Egbogi: O n so iru oogun to wa ninu re.\n2. Ilana lilo: Wo iye boolu ti won ni ki o mu lojumo.`,
          ar: `1. اسم الدواء: يوضح الاسم التجاري والعلمي.\n2. طريقة الاستعمال: التزم دائماً بالجرعة المحددة بدقة.`,
          zh: `1. 药物名称：标明药品商品名和通用学名。\n2. 服用说明：明确写出频率与用量。`,
        },
        keyTakeaways: [
          'Always verify both brand and generic names',
          'The Rx number is all you need for easy pharmacy refills',
          'Colored stickers contain vital safety warnings',
        ],
        readTime: '3 min read',
        iconName: 'FaPrescriptionBottleAlt',
      },
      {
        id: 'edu-2',
        category: 'safety',
        title: {
          en: 'What to Do If You Forgot Your Morning Pill',
          es: 'Qué hacer si olvidó tomar su medicamento a tiempo',
          fr: 'Que faire en cas d’oubli d’une prise de médicament',
          yo: 'Kini lati se ti o ba gbagbe lati mu oogun re ni asiko',
          ar: 'ماذا تفعل إذا نسيت تناول جرعة الدواء في موعدها',
          zh: '忘记服药时应该怎么处理',
        },
        summary: {
          en: 'Simple rules for safely handling a missed pill — and why you should never take a double dose.',
          es: 'Reglas sencillas para manejar una dosis olvidada sin peligro.',
          fr: 'Directives claires pour gérer un oubli sans danger.',
          yo: 'Awon ofin to rorun lati tele ti o ba gbagbe egbogi re.',
          ar: 'إرشادات واضحة للتعامل مع الجرعات الفائتة بأمان تام.',
          zh: '安全应对漏服药物的实用指引。',
        },
        simpleContent: {
          en: `Rule #1: Never take two pills at once to make up for a missed one! Taking double medication can cause unexpected drops in blood pressure or blood sugar.\n\nRule #2: If it is only an hour or two late, take the pill as soon as you remember. But if it is almost time for your next scheduled pill, skip the missed one completely and stay on your normal routine.`,
          es: `Regla #1: ¡Nunca tome dos pastillas juntas para compensar!\nRegla #2: Si solo han pasado una o dos horas, tómela en cuanto se acuerde.`,
          fr: `Règle #1: Ne prenez jamais deux comprimés à la fois!\nRègle #2: Si le retard est léger, prenez-le immédiatement.`,
          yo: `Ofin kinni: Mase mu boolu meji leekanna!\nOfin keji: Ti asiko ko ba ti koja pupo, mu un lesekese.`,
          ar: `القاعدة الأولى: لا تضاعف الجرعة أبداً لتعويض ما فاتك!\nالقاعدة الثانية: إذا كان التأخير بسيطاً، تناولها فور تذكرك.`,
          zh: `第一条：切勿一次服用双倍剂量！\n第二条：如果仅延迟一两个小时，应立即补服。`,
        },
        keyTakeaways: [
          'Never take two doses at the same time to compensate',
          'Call your pharmacy or caregiver if you are unsure',
          'Keep your pills in sight to build a daily habit',
        ],
        readTime: '2 min read',
        iconName: 'FaClockRotateLeft',
      },
      {
        id: 'edu-3',
        category: 'interactions',
        title: {
          en: 'Why Taking Medicines With Food Actually Matters',
          es: 'Por qué tomar medicamentos con alimentos realmente importa',
          fr: 'Pourquoi la prise avec nourriture est essentielle',
          yo: 'Idi ti o fi ye ki o mu oogun pelu ounje',
          ar: 'لماذا يُعد تناول الأدوية مع الطعام أمراً جوهرياً',
          zh: '为什么随餐服药如此重要',
        },
        summary: {
          en: 'Learn how food protects your stomach lining and helps certain pills absorb smoothly.',
          es: 'Aprenda cómo los alimentos protegen su estómago y mejoran la absorción.',
          fr: 'Découvrez comment les repas protègent votre estomac.',
          yo: 'Kọ ẹkọ bi ounjẹ ṣe n daabobo ikun rẹ.',
          ar: 'اكتشف كيف يساعد الطعام على حماية جدار المعدة.',
          zh: '了解食物如何保护胃黏膜并促进药物吸收。',
        },
        simpleContent: {
          en: `Some medicines, like Metformin or pain relievers, can irritate an empty stomach. Eating a slice of toast, a bowl of oatmeal, or having a meal creates a protective cushion in your stomach. It also slows absorption just enough so you don't feel nauseous or dizzy.`,
          es: `Algunos medicamentos pueden irritar el estómago vacío. Comer una rebanada de pan o un tazón de avena crea un cojín protector.`,
          fr: `Certains comprimés peuvent irriter un estomac vide. Prendre un repas permet de créer une barrière protectrice.`,
          yo: `Awon oogun kan le se ipalara fun inu ti ko ba ti jeun. Jijẹ ounjẹ fẹlẹfẹlẹ kan n daabobo inu rẹ.`,
          ar: `بعض الأدوية قد تسبب اضطراباً في المعدة الفارغة، وتناول وجبة خفيفة يشكل طبقة حماية مريحة.`,
          zh: `空腹服药可能会刺激胃壁，随餐服用能够减轻胃肠不适。`,
        },
        keyTakeaways: [
          'A simple snack is enough to protect your stomach',
          'Always drink a full glass of water with pills',
          'Check bottle labels for food instructions',
        ],
        readTime: '3 min read',
        iconName: 'FaUtensils',
      },
    ];
  },

  async getResource(id: string): Promise<EducationalArticle> {
    const list = await this.getResources();
    return list.find((a) => a.id === id) || list[0];
  },
};
