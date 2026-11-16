import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Medication } from '../../types';
import { api } from '../../services/api';

interface MedicationState {
  medications: Medication[];
  loading: boolean;
  error: string | null;
  refillNotice: string | null;
}

const initialState: MedicationState = {
  medications: [],
  loading: false,
  error: null,
  refillNotice: null,
};

export const fetchMedications = createAsyncThunk(
  'medications/fetchMedications',
  async (patientId: string | undefined, { rejectWithValue }) => {
    try {
      const data = await api.getMedications(patientId);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch medications';
      return rejectWithValue(message);
    }
  }
);

export const addNewMedication = createAsyncThunk(
  'medications/addNewMedication',
  async (med: Partial<Medication>, { rejectWithValue }) => {
    try {
      const created = await api.createMedication(med);
      return created;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create medication';
      return rejectWithValue(message);
    }
  }
);

export const updateExistingMedication = createAsyncThunk(
  'medications/updateExistingMedication',
  async ({ id, updates }: { id: string; updates: Partial<Medication> }, { rejectWithValue }) => {
    try {
      const updated = await api.updateMedication(id, updates);
      return updated;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update medication';
      return rejectWithValue(message);
    }
  }
);

export const deleteExistingMedication = createAsyncThunk(
  'medications/deleteExistingMedication',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.deleteMedication(id);
      return id;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete medication';
      return rejectWithValue(message);
    }
  }
);

export const refillExistingMedication = createAsyncThunk(
  'medications/refillExistingMedication',
  async ({ id, amount }: { id: string; amount?: number }, { rejectWithValue }) => {
    try {
      const res = await api.refillMedication(id, amount);
      return res;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to refill medication';
      return rejectWithValue(message);
    }
  }
);

const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    clearRefillNotice(state) {
      state.refillNotice = null;
    },
    setRefillNotice(state, action: PayloadAction<string | null>) {
      state.refillNotice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMedications
      .addCase(fetchMedications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedications.fulfilled, (state, action) => {
        state.loading = false;
        state.medications = action.payload;
      })
      .addCase(fetchMedications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addNewMedication
      .addCase(addNewMedication.fulfilled, (state, action) => {
        state.medications.push(action.payload);
      })
      // updateExistingMedication
      .addCase(updateExistingMedication.fulfilled, (state, action) => {
        const index = state.medications.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.medications[index] = action.payload;
        }
      })
      // deleteExistingMedication
      .addCase(deleteExistingMedication.fulfilled, (state, action) => {
        state.medications = state.medications.filter((m) => m.id !== action.payload);
      })
      // refillExistingMedication
      .addCase(refillExistingMedication.fulfilled, (state, action) => {
        state.refillNotice = action.payload.message;
        if (action.payload.data) {
          const index = state.medications.findIndex((m) => m.id === action.payload.data.id);
          if (index !== -1) {
            state.medications[index] = action.payload.data;
          }
        }
      });
  },
});

export const { clearRefillNotice, setRefillNotice } = medicationSlice.actions;
export default medicationSlice.reducer;
