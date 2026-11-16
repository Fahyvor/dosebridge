import React, { useState } from 'react';
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
        className="px-3 py-1.5 rounded-xl border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-[#1c1917] text-xs font-medium transition-colors cursor-pointer"
        aria-label="Open Display & Reading Preferences"
      >
        <span>Display & Reading</span>
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
            className="w-full max-w-md bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917] overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#f2ede4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
                  Visual & Audio Comfort
                </span>
                <h2 id="accessibility-menu-title" className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
                  Display Preferences
                </h2>
                <p className="text-xs text-[#57534e]">Adjust type scale, contrast levels, and audio reading speed</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] text-xs font-semibold text-[#78716c] hover:text-[#1c1917]"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-6">
              {/* 1. Text Sizing */}
              <div>
                <label className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider block mb-2">
                  Type Scale
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
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        fontSize === item.id
                          ? 'bg-[#1e3a2f] text-white border-[#1e3a2f] shadow-xs'
                          : 'bg-[#faf8f5] text-[#57534e] border-[#e7e2d8] hover:bg-[#f2ede4]'
                      }`}
                    >
                      <span className="text-sm font-bold">A</span>
                      <span>{item.label}</span>
                      <span className={`text-[10px] ${fontSize === item.id ? 'text-[#a7f3d0]' : 'text-[#78716c]'}`}>
                        {item.size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Themes */}
              <div>
                <label className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider block mb-2">
                  Contrast Palette
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleThemeChange('soft-calm')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'soft-calm'
                        ? 'bg-[#f4efe6] border-[#1e3a2f] text-[#1c1917] font-semibold'
                        : 'bg-[#faf8f5] border-[#e7e2d8] text-[#57534e] hover:bg-[#f2ede4]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#faf8f5] border border-[#d6cebf] shrink-0" />
                    <div>
                      <div>Warm Daylight</div>
                      <div className="text-[10px] text-[#78716c]">Soft linen & forest green</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#1c1917] border-[#1e3a2f] text-white font-semibold'
                        : 'bg-[#faf8f5] border-[#e7e2d8] text-[#57534e] hover:bg-[#f2ede4]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1c1917] border border-stone-600 shrink-0" />
                    <div>
                      <div>Evening Charcoal</div>
                      <div className="text-[10px] text-[#78716c]">Restful night viewing</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('high-contrast-light')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'high-contrast-light'
                        ? 'bg-white border-black text-black font-bold ring-2 ring-black'
                        : 'bg-[#faf8f5] border-[#e7e2d8] text-[#57534e] hover:bg-[#f2ede4]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white border-2 border-black shrink-0" />
                    <div>
                      <div>High Contrast Light</div>
                      <div className="text-[10px] text-[#78716c]">Deep black on pure white</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleThemeChange('high-contrast-dark')}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      theme === 'high-contrast-dark'
                        ? 'bg-black border-yellow-400 text-yellow-300 font-bold ring-2 ring-yellow-400'
                        : 'bg-stone-900 border-stone-700 text-yellow-400'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-black border-2 border-yellow-400 shrink-0" />
                    <div>
                      <div>Midnight Yellow</div>
                      <div className="text-[10px] text-yellow-500">Maximum WCAG AAA</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 3. Dyslexia & Pictograms */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8]">
                  <div>
                    <div className="text-xs font-bold text-[#1c1917]">Dyslexia-Optimized Typography</div>
                    <div className="text-[11px] text-[#78716c]">Expanded letter-spacing and weighted base lines</div>
                  </div>
                  <button
                    onClick={() => {
                      setDyslexicFont(!dyslexicFont);
                      playTap();
                    }}
                    role="switch"
                    aria-checked={dyslexicFont}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      dyslexicFont ? 'bg-[#1e3a2f]' : 'bg-[#d6cebf]'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                        dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8]">
                  <div>
                    <div className="text-xs font-bold text-[#1c1917]">Enlarged Routine Pictograms</div>
                    <div className="text-[11px] text-[#78716c]">Emphasizes meal, sun, and water badges</div>
                  </div>
                  <button
                    onClick={() => {
                      setPictogramMode(!pictogramMode);
                      playTap();
                    }}
                    role="switch"
                    aria-checked={pictogramMode}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      pictogramMode ? 'bg-[#c2410c]' : 'bg-[#d6cebf]'
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
                <label className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider block mb-2">
                  Speech & Sound Controls
                </label>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8]">
                    <span className="text-xs font-semibold text-[#1c1917]">Reading Speed</span>
                    <div className="flex items-center gap-1">
                      {[0.75, 1.0, 1.25].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => {
                            setSpeechRate(rate);
                            playTap();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            speechRate === rate
                              ? 'bg-[#1e3a2f] text-white'
                              : 'bg-white border border-[#e7e2d8] text-[#57534e] hover:bg-[#f2ede4]'
                          }`}
                        >
                          {rate}x {rate === 0.75 ? '(Gentle)' : rate === 1.0 ? '(Normal)' : '(Brisk)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8]">
                    <div>
                      <div className="text-xs font-bold text-[#1c1917]">Auto-Read Aloud</div>
                      <div className="text-[11px] text-[#78716c]">Vocalize instructions when selecting items</div>
                    </div>
                    <button
                      onClick={() => {
                        setAutoReadEnabled(!autoReadEnabled);
                        playTap();
                      }}
                      role="switch"
                      aria-checked={autoReadEnabled}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        autoReadEnabled ? 'bg-[#1e3a2f]' : 'bg-[#d6cebf]'
                      }`}
                    >
                      <span
                        className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${
                          autoReadEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8]">
                    <div>
                      <div className="text-xs font-bold text-[#1c1917]">Gentle Chimes & Audio Tones</div>
                      <div className="text-[11px] text-[#78716c]">Play pleasant soft chime on dose confirmation</div>
                    </div>
                    <button
                      onClick={() => {
                        setSoundEffectsEnabled(!soundEffectsEnabled);
                        playTap();
                      }}
                      role="switch"
                      aria-checked={soundEffectsEnabled}
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        soundEffectsEnabled ? 'bg-[#1e3a2f]' : 'bg-[#d6cebf]'
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
                className="w-full py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer text-center"
              >
                Apply & Return to Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
