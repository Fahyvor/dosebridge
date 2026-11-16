import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdherenceStats } from '../../types';
import { api } from '../../services/api';

interface AdherenceState {
  adherence: AdherenceStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdherenceState = {
  adherence: null,
  loading: false,
  error: null,
};

export const fetchAdherence = createAsyncThunk(
  'adherence/fetchAdherence',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const data = await api.getAdherence(patientId);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch adherence stats';
      return rejectWithValue(message);
    }
  }
);

const adherenceSlice = createSlice({
  name: 'adherence',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdherence.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdherence.fulfilled, (state, action) => {
        state.loading = false;
        state.adherence = action.payload;
      })
      .addCase(fetchAdherence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adherenceSlice.reducer;
