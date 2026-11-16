import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './slices/patientSlice';
import medicationReducer from './slices/medicationSlice';
import scheduleReducer from './slices/scheduleSlice';
import adherenceReducer from './slices/adherenceSlice';
import caregiverReducer from './slices/caregiverSlice';
import educationReducer from './slices/educationSlice';
import accessibilityReducer from './slices/accessibilitySlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    patients: patientReducer,
    medications: medicationReducer,
    schedule: scheduleReducer,
    adherence: adherenceReducer,
    caregiver: caregiverReducer,
    education: educationReducer,
    accessibility: accessibilityReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
