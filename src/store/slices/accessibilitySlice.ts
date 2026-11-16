import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FontSize, ContrastTheme } from '../../types';

interface AccessibilityState {
  fontSize: FontSize;
  theme: ContrastTheme;
  dyslexicFont: boolean;
  pictogramMode: boolean;
  speechRate: number;
  autoReadEnabled: boolean;
  soundEffectsEnabled: boolean;
  isSpeaking: boolean;
  speakingText: string;
  announcement: string;
}

const getInitialFontSize = (): FontSize => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('dosebridge_font_size') as FontSize) || 'normal';
  }
  return 'normal';
};

const getInitialTheme = (): ContrastTheme => {
  if (typeof window !== 'undefined') {
    // Default to soft-calm for warm human design, or stored preference
    return (localStorage.getItem('dosebridge_theme') as ContrastTheme) || 'soft-calm';
  }
  return 'soft-calm';
};

const initialState: AccessibilityState = {
  fontSize: getInitialFontSize(),
  theme: getInitialTheme(),
  dyslexicFont: typeof window !== 'undefined' ? localStorage.getItem('dosebridge_dyslexic') === 'true' : false,
  pictogramMode: typeof window !== 'undefined' ? localStorage.getItem('dosebridge_pictogram') === 'true' : false,
  speechRate: typeof window !== 'undefined' ? Number(localStorage.getItem('dosebridge_speech_rate')) || 1.0 : 1.0,
  autoReadEnabled: typeof window !== 'undefined' ? localStorage.getItem('dosebridge_autoread') === 'true' : false,
  soundEffectsEnabled: typeof window !== 'undefined' ? localStorage.getItem('dosebridge_soundfx') !== 'false' : true,
  isSpeaking: false,
  speakingText: '',
  announcement: '',
};

// Sync HTML DOM classes with accessibility state
export const syncAccessibilityDom = (state: { fontSize: FontSize; theme: ContrastTheme; dyslexicFont: boolean }) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Theme
  root.classList.remove('theme-dark', 'theme-high-contrast-dark', 'theme-high-contrast-light', 'theme-soft-calm');
  root.classList.add(`theme-${state.theme}`);

  // Font size
  root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl', 'text-size-jumbo');
  root.classList.add(`text-size-${state.fontSize}`);

  // Dyslexic font
  if (state.dyslexicFont) {
    root.classList.add('font-dyslexic');
  } else {
    root.classList.remove('font-dyslexic');
  }
};

const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    setFontSize(state, action: PayloadAction<FontSize>) {
      state.fontSize = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_font_size', action.payload);
      }
      syncAccessibilityDom(state);
    },
    setTheme(state, action: PayloadAction<ContrastTheme>) {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_theme', action.payload);
      }
      syncAccessibilityDom(state);
    },
    setDyslexicFont(state, action: PayloadAction<boolean>) {
      state.dyslexicFont = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_dyslexic', String(action.payload));
      }
      syncAccessibilityDom(state);
    },
    setPictogramMode(state, action: PayloadAction<boolean>) {
      state.pictogramMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_pictogram', String(action.payload));
      }
    },
    setSpeechRate(state, action: PayloadAction<number>) {
      state.speechRate = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_speech_rate', String(action.payload));
      }
    },
    setAutoReadEnabled(state, action: PayloadAction<boolean>) {
      state.autoReadEnabled = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_autoread', String(action.payload));
      }
    },
    setSoundEffectsEnabled(state, action: PayloadAction<boolean>) {
      state.soundEffectsEnabled = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('dosebridge_soundfx', String(action.payload));
      }
    },
    setIsSpeaking(state, action: PayloadAction<boolean>) {
      state.isSpeaking = action.payload;
      if (!action.payload) {
        state.speakingText = '';
      }
    },
    setSpeakingText(state, action: PayloadAction<string>) {
      state.speakingText = action.payload;
      state.isSpeaking = !!action.payload;
    },
    announce(state, action: PayloadAction<string>) {
      state.announcement = action.payload;
    },
  },
});

export const {
  setFontSize,
  setTheme,
  setDyslexicFont,
  setPictogramMode,
  setSpeechRate,
  setAutoReadEnabled,
  setSoundEffectsEnabled,
  setIsSpeaking,
  setSpeakingText,
  announce,
} = accessibilitySlice.actions;

export default accessibilitySlice.reducer;
