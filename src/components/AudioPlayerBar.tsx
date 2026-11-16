import React from 'react';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaVolumeHigh,
  FaRotateLeft,
  FaGaugeHigh,
} from 'react-icons/fa6';
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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-white/95 border border-stone-300 shadow-xl backdrop-blur-md rounded-2xl p-3 text-stone-900 flex flex-col md:flex-row items-center justify-between gap-3 animate-slide-up"
    >
      {/* Audio indicator & spoken text */}
      <div className="flex items-center gap-3 w-full md:w-auto flex-1 min-w-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
          <FaVolumeHigh className="text-sm animate-pulse" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Reading aloud
            </span>
          </div>
          <p className="text-xs font-medium text-stone-700 truncate mt-0.5" title={speakingText}>
            {speakingText || 'Reading instructions...'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleSpeedToggle}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          title="Change playback speed"
          aria-label={`Reading speed: ${speechRate}x. Click to change.`}
        >
          <FaGaugeHigh className="text-stone-500 text-[10px]" />
          <span>{speechRate}x</span>
        </button>

        <button
          onClick={handleReplay}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          title="Replay from start"
          aria-label="Replay audio"
        >
          <FaRotateLeft className="text-xs" />
        </button>

        <button
          onClick={resumeSpeaking}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          title="Resume speech"
          aria-label="Resume audio"
        >
          <FaPlay className="text-xs" />
        </button>

        <button
          onClick={pauseSpeaking}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
          title="Pause speech"
          aria-label="Pause audio"
        >
          <FaPause className="text-xs" />
        </button>

        <button
          onClick={stopSpeaking}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-stone-200 hover:bg-rose-100 hover:text-rose-800 font-semibold text-xs text-stone-700 transition-colors cursor-pointer"
          title="Stop reading"
          aria-label="Stop audio reading"
        >
          <FaStop className="text-[10px]" />
          <span>Stop</span>
        </button>
      </div>
    </div>
  );
};
