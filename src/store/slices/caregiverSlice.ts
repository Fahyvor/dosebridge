import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CaregiverNote, PatientProfile } from '../../types';
import { api } from '../../services/api';

export interface CaregiverAlert {
  id: string;
  type: string;
  severity: 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  rxNumber?: string;
  pharmacy?: string;
}

interface CaregiverState {
  notes: CaregiverNote[];
  alerts: CaregiverAlert[];
  linkedPatients: PatientProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: CaregiverState = {
  notes: [],
  alerts: [],
  linkedPatients: [],
  loading: false,
  error: null,
};

export const fetchCaregiverNotes = createAsyncThunk(
  'caregiver/fetchCaregiverNotes',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const data = await api.getCaregiverNotes(patientId);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch caregiver notes';
      return rejectWithValue(message);
    }
  }
);

export const fetchCaregiverAlerts = createAsyncThunk(
  'caregiver/fetchCaregiverAlerts',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const data = await api.getCaregiverAlerts(patientId);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch alerts';
      return rejectWithValue(message);
    }
  }
);

export const fetchCaregiverPatients = createAsyncThunk(
  'caregiver/fetchCaregiverPatients',
  async (caregiverId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await api.getCaregiverPatients(caregiverId || 'cg-1');
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch linked patients';
      return rejectWithValue(message);
    }
  }
);

export const addCaregiverNote = createAsyncThunk(
  'caregiver/addCaregiverNote',
  async (
    payload: {
      patientId: string;
      text: string;
      priority: 'normal' | 'important' | 'emergency';
      caregiverName?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await api.createCaregiverNote({
        patientId: payload.patientId,
        text: payload.text,
        priority: payload.priority,
        caregiverName: payload.caregiverName || 'David Vance (Caregiver)',
      });
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save note';
      return rejectWithValue(message);
    }
  }
);

export const deleteCaregiverNote = createAsyncThunk(
  'caregiver/deleteCaregiverNote',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteCaregiverNote(id);
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      return rejectWithValue(message);
    }
  }
);

const caregiverSlice = createSlice({
  name: 'caregiver',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCaregiverNotes
      .addCase(fetchCaregiverNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCaregiverNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchCaregiverNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCaregiverAlerts
      .addCase(fetchCaregiverAlerts.fulfilled, (state, action) => {
        state.alerts = action.payload;
      })
      // fetchCaregiverPatients
      .addCase(fetchCaregiverPatients.fulfilled, (state, action) => {
        state.linkedPatients = action.payload;
      })
      // addCaregiverNote
      .addCase(addCaregiverNote.fulfilled, (state, action) => {
        state.notes.unshift(action.payload);
      })
      // deleteCaregiverNote
      .addCase(deleteCaregiverNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((n) => n.id !== action.payload);
      });
  },
});

export default caregiverSlice.reducer;
