import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserRole, Language } from '../../types';

interface UiState {
  role: UserRole;
  language: Language;
  activeTab: 'schedule' | 'medications' | 'caregiver' | 'resources' | 'profile';
  isPrintModalOpen: boolean;
  isSkipModalOpen: boolean;
  skipTargetItem: { id: string; name: string } | null;
  isAccessibilityDrawerOpen: boolean;
}

const getInitialRole = (): UserRole => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('dosebridge_role') as UserRole) || 'patient';
  }
  return 'patient';
};

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('dosebridge_lang') as Language) || 'en';
  }
  return 'en';
};

const initialState: UiState = {
  role: getInitialRole(),
  language: getInitialLanguage(),
  activeTab: 'schedule',
  isPrintModalOpen: false,
  isSkipModalOpen: false,
  skipTargetItem: null,
  isAccessibilityDrawerOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<UserRole>) {
      state.role = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_role', action.payload);
      }
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_lang', action.payload);
      }
    },
    setActiveTab(state, action: PayloadAction<'schedule' | 'medications' | 'caregiver' | 'resources' | 'profile'>) {
      state.activeTab = action.payload;
    },
    setPrintModalOpen(state, action: PayloadAction<boolean>) {
      state.isPrintModalOpen = action.payload;
    },
    openSkipModal(state, action: PayloadAction<{ id: string; name: string }>) {
      state.isSkipModalOpen = true;
      state.skipTargetItem = action.payload;
    },
    closeSkipModal(state) {
      state.isSkipModalOpen = false;
      state.skipTargetItem = null;
    },
    setAccessibilityDrawerOpen(state, action: PayloadAction<boolean>) {
      state.isAccessibilityDrawerOpen = action.payload;
    },
  },
});

export const {
  setRole,
  setLanguage,
  setActiveTab,
  setPrintModalOpen,
  openSkipModal,
  closeSkipModal,
  setAccessibilityDrawerOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
