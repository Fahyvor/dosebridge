import React from 'react';
import { useDoseBridge } from '../store/useDoseBridge';

export const AudioPlayerBar: React.FC = () => {
  const {
    isSpeaking,
    speakingText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    speechRate,
    setSpeechRate,
    speakText,
  } = useDoseBridge();

  if (!isSpeaking && !speakingText) {
    return null;
  }

  const handleSpeedToggle = () => {
    if (speechRate === 0.75) setSpeechRate(1.0);
    else if (speechRate === 1.0) setSpeechRate(1.25);
    else setSpeechRate(0.75);
  };

  const handleReplay = () => {
    if (speakingText) {
      speakText(speakingText);
    }
  };

  return (
    <div
      role="region"
      aria-label="Audio Instructions Player"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-white/95 border border-[#e7e2d8] shadow-xl backdrop-blur-md rounded-2xl p-3.5 text-[#1c1917] flex flex-col md:flex-row items-center justify-between gap-3"
    >
      {/* Audio indicator & spoken text */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1e3a2f] animate-ping shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a2f] bg-[#e7e2d8]/60 px-2 py-0.5 rounded-md">
              Reading Aloud
            </span>
          </div>
          <p className="text-xs font-medium text-[#44403c] truncate mt-0.5" title={speakingText}>
            {speakingText || 'Reading instructions...'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 shrink-0 text-xs">
        <button
          onClick={handleSpeedToggle}
          className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] font-medium text-[#57534e] transition-colors cursor-pointer"
          title="Change playback speed"
          aria-label={`Reading speed: ${speechRate}x. Click to change.`}
        >
          {speechRate}x
        </button>

        <button
          onClick={handleReplay}
          className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-[#57534e] font-medium transition-colors cursor-pointer"
          title="Replay from start"
        >
          Replay
        </button>

        {isSpeaking ? (
          <button
            onClick={pauseSpeaking}
            className="px-3 py-1 rounded-lg border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-[#1c1917] font-medium transition-colors cursor-pointer"
          >
            Pause
          </button>
        ) : (
          <button
            onClick={resumeSpeaking}
            className="px-3 py-1 rounded-lg bg-[#1e3a2f] text-white font-medium transition-colors cursor-pointer"
          >
            Resume
          </button>
        )}

        <button
          onClick={stopSpeaking}
          className="px-2.5 py-1 rounded-lg border border-[#fecdd3] bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#be123c] font-medium transition-colors cursor-pointer"
        >
          Stop
        </button>
      </div>
    </div>
  );
};
