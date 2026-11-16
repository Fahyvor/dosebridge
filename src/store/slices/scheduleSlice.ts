import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ScheduleItem } from '../../types';
import { api } from '../../services/api';

interface ScheduleState {
  schedule: ScheduleItem[];
  loading: boolean;
  error: string | null;
  activeAlarmItem: ScheduleItem | null;
  lastActionFeedback: string | null;
}

const initialState: ScheduleState = {
  schedule: [],
  loading: false,
  error: null,
  activeAlarmItem: null,
  lastActionFeedback: null,
};

export const fetchSchedule = createAsyncThunk(
  'schedule/fetchSchedule',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const data = await api.getSchedule(patientId);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch schedule';
      return rejectWithValue(message);
    }
  }
);

export const logDoseAction = createAsyncThunk(
  'schedule/logDoseAction',
  async (
    payload: {
      scheduleId: string;
      action: 'taken' | 'skipped' | 'snoozed';
      reason?: string;
      loggedBy: 'patient' | 'caregiver';
      loggedByName: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.logDose(payload);
      return { payload, res };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to log dose';
      return rejectWithValue(message);
    }
  }
);

export const resetSchedule = createAsyncThunk(
  'schedule/resetSchedule',
  async (patientId: string, { rejectWithValue }) => {
    try {
      await api.resetDaySchedule();
      const fresh = await api.getSchedule(patientId);
      return fresh;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset schedule';
      return rejectWithValue(message);
    }
  }
);

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setActiveAlarmItem(state, action: PayloadAction<ScheduleItem | null>) {
      state.activeAlarmItem = action.payload;
    },
    clearActionFeedback(state) {
      state.lastActionFeedback = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSchedule
      .addCase(fetchSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedule = action.payload;
      })
      .addCase(fetchSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // logDoseAction
      .addCase(logDoseAction.fulfilled, (state, action) => {
        state.lastActionFeedback = action.payload.res.message;
        const target = state.schedule.find((s) => s.id === action.payload.payload.scheduleId);
        if (target) {
          target.status = action.payload.payload.action;
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          if (action.payload.payload.action === 'taken') {
            target.takenAt = nowStr;
            target.loggedBy = action.payload.payload.loggedBy;
            target.loggedByName = action.payload.payload.loggedByName;
          } else if (action.payload.payload.action === 'skipped') {
            target.skipReason = action.payload.payload.reason || 'Patient declined';
          } else if (action.payload.payload.action === 'snoozed') {
            const snoozeTime = new Date(Date.now() + 15 * 60000);
            target.snoozedUntil = snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        }
      })
      // resetSchedule
      .addCase(resetSchedule.fulfilled, (state, action) => {
        state.schedule = action.payload;
        state.lastActionFeedback = 'Daily schedule reset to pending';
      });
  },
});

export const { setActiveAlarmItem, clearActionFeedback } = scheduleSlice.actions;
export default scheduleSlice.reducer;
