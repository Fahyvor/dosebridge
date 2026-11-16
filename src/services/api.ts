import {
  PatientProfile,
  Medication,
  ScheduleItem,
  CaregiverNote,
  EducationalArticle,
  AdherenceStats,
  AuthUser,
  RbacRole,
} from '../types';

const API_BASE = '/api';

const TOKEN_KEY = 'dosebridge_jwt_token';
let token: string | null = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const setStoredToken = (newToken: string | null) => {
  token = newToken;
  if (typeof window !== 'undefined') {
    if (newToken) {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }
};

export const getStoredToken = () => token;

const getHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = { ...extra };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = getHeaders((options.headers as Record<string, string>) || {});
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.success === false) {
    const errorMsg = json.error || json.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return (json.data !== undefined ? json.data : json) as T;
}

export const api = {
  // Patients
  async getPatients(): Promise<PatientProfile[]> {
    return apiRequest<PatientProfile[]>('/patients');
  },

  async getPatient(id: string): Promise<PatientProfile> {
    return apiRequest<PatientProfile>(`/patients/${encodeURIComponent(id)}`);
  },

  async registerPatient(profile: Partial<PatientProfile>): Promise<PatientProfile> {
    return apiRequest<PatientProfile>('/patients', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  },

  async updatePatient(id: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    return apiRequest<PatientProfile>(`/patients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Medications
  async getMedications(patientId?: string): Promise<Medication[]> {
    const query = patientId ? `?patientId=${encodeURIComponent(patientId)}` : '';
    return apiRequest<Medication[]>(`/medications${query}`);
  },

  async createMedication(med: Partial<Medication>): Promise<Medication> {
    return apiRequest<Medication>('/medications', {
      method: 'POST',
      body: JSON.stringify(med),
    });
  },

  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication> {
    return apiRequest<Medication>(`/medications/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteMedication(id: string): Promise<void> {
    await apiRequest<void>(`/medications/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async refillMedication(id: string, amount?: number): Promise<{ success: boolean; message: string; data: Medication }> {
    return apiRequest<{ success: boolean; message: string; data: Medication }>(
      `/medications/${encodeURIComponent(id)}/refill`,
      {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }
    );
  },

  // Schedule
  async getSchedule(patientId: string): Promise<ScheduleItem[]> {
    return apiRequest<ScheduleItem[]>(`/schedule?patientId=${encodeURIComponent(patientId)}`);
  },

  async logDose(payload: {
    scheduleId: string;
    action: 'taken' | 'skipped' | 'snoozed';
    reason?: string;
    loggedBy: 'patient' | 'caregiver';
    loggedByName: string;
  }): Promise<{ success: boolean; message: string; data: any }> {
    return apiRequest<{ success: boolean; message: string; data: any }>('/schedule/log', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async resetDaySchedule(): Promise<void> {
    await apiRequest<void>('/schedule/reset-day', {
      method: 'POST',
    });
  },

  // Adherence
  async getAdherence(patientId: string): Promise<AdherenceStats> {
    return apiRequest<AdherenceStats>(`/adherence?patientId=${encodeURIComponent(patientId)}`);
  },

  // Caregiver
  async getCaregiverPatients(caregiverId?: string): Promise<PatientProfile[]> {
    const query = caregiverId ? `?caregiverId=${encodeURIComponent(caregiverId)}` : '';
    return apiRequest<PatientProfile[]>(`/caregiver/patients${query}`);
  },

  async linkPatientByCode(
    accessCode: string,
    caregiverName?: string,
    caregiverPhone?: string,
    caregiverEmail?: string
  ): Promise<{ success: boolean; message: string; data: PatientProfile }> {
    return apiRequest<{ success: boolean; message: string; data: PatientProfile }>('/caregiver/link-patient', {
      method: 'POST',
      body: JSON.stringify({
        accessCode,
        caregiverName,
        caregiverPhone,
        caregiverEmail,
      }),
    });
  },

  async linkPatientCaregiver(
    accessCode: string,
    caregiverName?: string,
    caregiverPhone?: string,
    caregiverEmail?: string
  ): Promise<{ success: boolean; message: string; data: PatientProfile }> {
    return this.linkPatientByCode(accessCode, caregiverName, caregiverPhone, caregiverEmail);
  },

  async getCaregiverNotes(patientId: string): Promise<CaregiverNote[]> {
    return apiRequest<CaregiverNote[]>(`/caregiver/notes?patientId=${encodeURIComponent(patientId)}`);
  },

  async createCaregiverNote(payload: {
    patientId: string;
    caregiverName?: string;
    text: string;
    priority: 'normal' | 'important' | 'emergency';
  }): Promise<CaregiverNote> {
    return apiRequest<CaregiverNote>('/caregiver/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async deleteCaregiverNote(id: string): Promise<void> {
    await apiRequest<void>(`/caregiver/notes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  async getCaregiverAlerts(patientId: string): Promise<any[]> {
    return apiRequest<any[]>(`/caregiver/alerts?patientId=${encodeURIComponent(patientId)}`);
  },

  // Educational Resources (from MongoDB)
  async getResources(category?: string): Promise<EducationalArticle[]> {
    const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest<EducationalArticle[]>(`/resources${query}`);
  },

  async getResource(id: string): Promise<EducationalArticle> {
    return apiRequest<EducationalArticle>(`/resources/${encodeURIComponent(id)}`);
  },

  // Authentication & RBAC
  async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      throw new Error(json.error || json.message || 'Login failed. Please check your credentials.');
    }

    setStoredToken(json.data.token);
    return json.data;
  },

  async register(payload: {
    email: string;
    password: string;
    name: string;
    role?: RbacRole;
    accessCode?: string;
  }): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      throw new Error(json.error || json.message || 'Registration failed.');
    }

    setStoredToken(json.data.token);
    return json.data;
  },

  async getMe(): Promise<{ user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      throw new Error(json.error || json.message || 'Session expired or unauthenticated.');
    }

    return json.data;
  },

  async switchRole(role: RbacRole): Promise<{ token: string; user: AuthUser }> {
    const res = await fetch(`${API_BASE}/auth/switch-role`, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ role }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) {
      throw new Error(json.error || json.message || 'Failed to switch role.');
    }

    setStoredToken(json.data.token);
    return json.data;
  },

  logout(): void {
    setStoredToken(null);
  },
};
