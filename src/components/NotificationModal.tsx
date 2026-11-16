import React from 'react';
import {
  FaBell,
  FaCheck,
  FaClock,
  FaVolumeHigh,
  FaXmark,
} from 'react-icons/fa6';
import { useDoseBridge } from '../store/useDoseBridge';
import { VisualPill } from './VisualPill';

export const NotificationModal: React.FC = () => {
  const { activeAlarmItem, dismissAlarm, takeDose, snoozeDose, language, speakText } = useDoseBridge();

  if (!activeAlarmItem || !activeAlarmItem.medication) {
    return null;
  }

  const med = activeAlarmItem.medication;
  const instructionObj = med.instructions?.[language] || med.instructions?.en;
  const spokenText = `Medication Reminder. Time to take ${med.name} ${med.strength}. ${instructionObj?.simple || instructionObj?.standard || 'Please take with water.'}`;

  const handleTake = async () => {
    await takeDose(activeAlarmItem.id);
    dismissAlarm();
  };

  const handleSnooze = async () => {
    await snoozeDose(activeAlarmItem.id);
    dismissAlarm();
  };

  const handleSpeak = () => {
    speakText(spokenText, language);
  };

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alarm-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-white border border-amber-300 rounded-3xl p-6 sm:p-7 shadow-2xl text-stone-900">
        {/* Dismiss Button */}
        <button
          onClick={dismissAlarm}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          aria-label="Close reminder"
        >
          <FaXmark className="text-lg" />
        </button>

        {/* Gentle Alarm Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 shrink-0">
            <FaBell className="text-xl text-amber-700" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Reminder • {activeAlarmItem.scheduledTime}
            </span>
            <h2 id="alarm-title" className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Time for your medicine
            </h2>
          </div>
        </div>

        {/* Medication Details Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
          <div className="shrink-0">
            <VisualPill
              color={med.pillColor}
              shape={med.pillShape}
              form={med.form}
              imprint={med.imprint}
              size="lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-stone-900 leading-tight">{med.name}</h3>
            <p className="text-xs font-semibold text-emerald-800">{med.strength} • {med.form}</p>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
              {instructionObj?.simple || instructionObj?.standard}
            </p>
          </div>
        </div>

        {/* Read aloud button */}
        <button
          onClick={handleSpeak}
          className="w-full mb-4 py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <FaVolumeHigh className="text-stone-500 text-xs" />
          <span>Read instructions aloud</span>
        </button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSnooze}
            className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FaClock className="text-stone-500" />
            <span>Need 15 Minutes</span>
          </button>

          <button
            onClick={handleTake}
            className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FaCheck />
            <span>I&apos;ve Taken This</span>
          </button>
        </div>
      </div>
    </div>
  );
};
