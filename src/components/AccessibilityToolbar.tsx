import React, { useState } from 'react';
import {
  FaSliders,
  FaTextHeight,
  FaCircleHalfStroke,
  FaVolumeHigh,
  FaXmark,
  FaCheck,
  FaFont,
  FaIcons,
} from 'react-icons/fa6';
import { useDoseBridge } from '../store/useDoseBridge';
import { FontSize, ContrastTheme } from '../types';

export const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    fontSize,
    setFontSize,
    theme,
    setTheme,
    dyslexicFont,
    setDyslexicFont,
    pictogramMode,
    setPictogramMode,
    speechRate,
    setSpeechRate,
    soundEffectsEnabled,
    setSoundEffectsEnabled,
    autoReadEnabled,
    setAutoReadEnabled,
    playTap,
    announce,
  } = useDoseBridge();

  const handleFontChange = (size: FontSize) => {
    setFontSize(size);
    playTap();
    announce(`Text size set to ${size}`);
  };

  const handleThemeChange = (t: ContrastTheme) => {
    setTheme(t);
    playTap();
    announce(`Theme changed to ${t}`);
  };

  return (
    <>
      {/* Trigger Button in Navbar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          playTap();
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
        aria-label="Open Reading & Comfort Settings"
        title="Adjust text size, contrast, colors, and audio"
      >
        <FaSliders className="text-stone-600 text-xs" />
        <span className="hidden sm:inline">Reading & Comfort</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="accessibility-menu-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-stone-900/60 backdrop-blur-xs p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-900 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <FaSliders className="text-base" />
                </div>
                <div>
                  <h2 id="accessibility-menu-title" className="text-lg font-bold text-stone-900">
                    Reading & Comfort
                  </h2>
                  <p className="text-xs text-stone-500">Personalize text size, contrast, and voice speed</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 cursor-pointer"
                aria-label="Close settings"
              >
                <FaXmark className="text-lg" />
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* 1. Text Sizing */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wide mb-2.5">
                  <FaTextHeight className="text-emerald-800" />
                  <span>Text Size</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'normal', label: 'Default', size: '100%' },
                      { id: 'large', label: 'Large', size: '120%' },
                      { id: 'xl', label: 'X-Large', size: '140%' },
                      { id: 'jumbo', label: 'Jumbo', size: '160%' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleFontChange(item.id)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        fontSize === item.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-sm font-bold">A</span>
                      <span>{item.label}</span>
                      <span className={`text-[10px] ${fontSize === item.id ? 'text-emerald-200' : 'text-stone-400'}`}>
                        {item.size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Themes */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wide mb-2.5">
                  <FaCircleHalfStroke className="text-emerald-800" />
                  <span>Color Theme</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleThemeChange('soft-calm')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'soft-calm'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#faf8f5] border border-stone-300 shrink-0" />
                    <div>
                      <div>Warm Daylight</div>
                      <div className="text-[10px] text-stone-500">Gentle & easy on eyes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-stone-900 border-emerald-500 text-white font-bold shadow-xs'
                        : 'bg-stone-100 border-stone-200 text-stone-800 hover:bg-stone-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1b1c21] border border-stone-700 shrink-0" />
                    <div>
                      <div>Evening Charcoal</div>
                      <div className="text-[10px] text-stone-400">Restful for night</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('high-contrast-light')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'high-contrast-light'
                        ? 'bg-white border-black text-black font-bold ring-2 ring-black'
                        : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white border-2 border-black shrink-0" />
                    <div>
                      <div>High Contrast Light</div>
                      <div className="text-[10px] text-stone-500">Bold black on white</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('high-contrast-dark')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'high-contrast-dark'
                        ? 'bg-black border-yellow-400 text-yellow-300 font-bold ring-2 ring-yellow-400'
                        : 'bg-stone-900 border-stone-700 text-yellow-400 hover:border-yellow-500'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black border-2 border-yellow-400 shrink-0" />
                    <div>
                      <div>Midnight Yellow</div>
                      <div className="text-[10px] text-yellow-500">WCAG AAA Contrast</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Dyslexia & Pictograms */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <FaFont className="text-emerald-800" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Dyslexia-Friendly Letters</div>
                      <div className="text-[11px] text-stone-500">Wider letter spacing for easier reading</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDyslexicFont(!dyslexicFont);
                      playTap();
                    }}
                    role="switch"
                    aria-checked={dyslexicFont}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      dyslexicFont ? 'bg-emerald-800' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                        dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <FaIcons className="text-amber-700" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Enlarged Picture Icons</div>
                      <div className="text-[11px] text-stone-500">Emphasizes large food, water, and sun icons</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPictogramMode(!pictogramMode);
                      playTap();
                    }}
                    role="switch"
                    aria-checked={pictogramMode}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      pictogramMode ? 'bg-amber-600' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                        pictogramMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 4. Speech & Audio */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wide mb-2.5">
                  <FaVolumeHigh className="text-emerald-800" />
                  <span>Speech & Sound Options</span>
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-xs font-semibold text-stone-800">Reading Speed</span>
                    <div className="flex items-center gap-1">
                      {[0.75, 1.0, 1.25].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setSpeechRate(rate);
                            playTap();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                            speechRate === rate
                              ? 'bg-emerald-800 text-white'
                              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {rate}x {rate === 0.75 ? '(Gentle)' : rate === 1.0 ? '(Normal)' : '(Brisk)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div>
                      <div className="text-xs font-bold text-stone-900">Auto-Read Aloud</div>
                      <div className="text-[11px] text-stone-500">Read instructions automatically on selection</div>
                    </div>
                    <button
                      onClick={() => {
                        setAutoReadEnabled(!autoReadEnabled);
                        playTap();
                      }}
                      role="switch"
                      aria-checked={autoReadEnabled}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        autoReadEnabled ? 'bg-emerald-800' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                          autoReadEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <div>
                      <div className="text-xs font-bold text-stone-900">Gentle Chimes & Feedback</div>
                      <div className="text-[11px] text-stone-500">Play a pleasant soft chime when taking a pill</div>
                    </div>
                    <button
                      onClick={() => {
                        setSoundEffectsEnabled(!soundEffectsEnabled);
                        playTap();
                      }}
                      role="switch"
                      aria-checked={soundEffectsEnabled}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        soundEffectsEnabled ? 'bg-emerald-800' : 'bg-stone-300'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                          soundEffectsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FaCheck />
                <span>Keep These Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
