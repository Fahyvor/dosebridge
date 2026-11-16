import { Language } from '../types';

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

const LANG_CODE_MAP: Record<Language, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  yo: 'yo-NG',
  ar: 'ar-SA',
  zh: 'zh-CN',
  hi: 'hi-IN',
  sw: 'sw-KE',
  de: 'de-DE',
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private isSpeakingState = false;
  private isPausedState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isAvailable(): boolean {
    return this.synth !== null;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public speak(
    text: string,
    lang: Language = 'en',
    rate = 1.0,
    callbacks?: SpeechCallbacks
  ) {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this browser.');
      callbacks?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    if (!text || text.trim() === '') {
      callbacks?.onEnd?.();
      return;
    }

    const bcp47 = LANG_CODE_MAP[lang] || 'en-US';
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = bcp47;
    utterance.rate = Math.max(0.6, Math.min(1.5, rate));
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase() === bcp47.toLowerCase() || v.lang.toLowerCase().startsWith(lang.toLowerCase())
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeakingState = true;
      this.isPausedState = false;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.isSpeakingState = false;
      this.isPausedState = false;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      // Don't treat manual cancel as an error
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
        callbacks?.onError?.(e);
      }
      this.isSpeakingState = false;
      this.isPausedState = false;
      callbacks?.onEnd?.();
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeakingState && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
  }
}

export const speechService = new SpeechService();
