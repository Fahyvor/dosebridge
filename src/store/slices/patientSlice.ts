import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PatientProfile } from '../../types';
import { api } from '../../services/api';

interface PatientState {
  patients: PatientProfile[];
  activePatient: PatientProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  activePatient: null,
  loading: false,
  error: null,
};

export const fetchPatients = createAsyncThunk(
  'patients/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getPatients();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patients';
      return rejectWithValue(message);
    }
  }
);

export const updatePatientProfile = createAsyncThunk(
  'patients/updatePatientProfile',
  async ({ id, updates }: { id: string; updates: Partial<PatientProfile> }, { rejectWithValue }) => {
    try {
      const updated = await api.updatePatient(id, updates);
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update patient profile';
      return rejectWithValue(message);
    }
  }
);

export const registerPatientProfile = createAsyncThunk(
  'patients/registerPatientProfile',
  async (profile: Partial<PatientProfile>, { rejectWithValue }) => {
    try {
      const created = await api.registerPatient(profile);
      return created;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register patient';
      return rejectWithValue(message);
    }
  }
);

export const linkPatientByAccessCode = createAsyncThunk(
  'patients/linkPatientByAccessCode',
  async (
    payload: { code: string; caregiverName?: string; phone?: string; email?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.linkPatientCaregiver(
        payload.code,
        payload.caregiverName || 'David Vance',
        payload.phone || '+1 (555) 234-5678',
        payload.email || 'david.vance@example.com'
      );
      if (!res.success) {
        return rejectWithValue(res.message);
      }
      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect patient code';
      return rejectWithValue(message);
    }
  }
);

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setActivePatient(state, action: PayloadAction<PatientProfile>) {
      state.activePatient = action.payload;
    },
    setActivePatientById(state, action: PayloadAction<string>) {
      const found = state.patients.find((p) => p.id === action.payload);
      if (found) {
        state.activePatient = found;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
        if (!state.activePatient && action.payload.length > 0) {
          state.activePatient = action.payload[0];
        } else if (state.activePatient) {
          const fresh = action.payload.find((p) => p.id === state.activePatient?.id);
          if (fresh) {
            state.activePatient = fresh;
          } else if (action.payload.length > 0) {
            state.activePatient = action.payload[0];
          }
        }
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updatePatientProfile
      .addCase(updatePatientProfile.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.patients.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.patients[index] = updated;
        }
        if (state.activePatient?.id === updated.id) {
          state.activePatient = updated;
        }
      })
      // registerPatientProfile
      .addCase(registerPatientProfile.fulfilled, (state, action) => {
        const created = action.payload;
        state.patients.unshift(created);
        state.activePatient = created;
      })
      // linkPatientByAccessCode
      .addCase(linkPatientByAccessCode.fulfilled, (state, action) => {
        if (action.payload.data) {
          const linked = action.payload.data;
          const index = state.patients.findIndex((p) => p.id === linked.id);
          if (index !== -1) {
            state.patients[index] = linked;
          } else {
            state.patients.push(linked);
          }
          state.activePatient = linked;
        }
      });
  },
});

export const { setActivePatient, setActivePatientById } = patientSlice.actions;
export default patientSlice.reducer;
