import React from 'react';
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
      <div className="relative w-full max-w-lg bg-white border border-[#fed7aa] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917]">
        {/* Dismiss Button */}
        <button
          onClick={dismissAlarm}
          className="absolute top-5 right-5 text-xs text-[#a8a29e] hover:text-[#1c1917] font-semibold cursor-pointer"
          aria-label="Dismiss reminder"
        >
          Dismiss
        </button>

        {/* Reminder Header */}
        <div className="mb-4">
          <span className="text-[11px] font-bold text-[#b45309] uppercase tracking-wider bg-[#fef3c7] px-2.5 py-0.5 rounded-md border border-[#fde68a]">
            Scheduled Reminder • {activeAlarmItem.scheduledTime}
          </span>
          <h2 id="alarm-title" className="text-2xl font-serif font-bold text-[#1c1917] mt-1.5">
            Time for your medicine
          </h2>
        </div>

        {/* Medication Details Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] mb-4">
          <div className="shrink-0 p-2 rounded-xl bg-white border border-[#e7e2d8]">
            <VisualPill
              color={med.pillColor}
              shape={med.pillShape}
              form={med.form}
              imprint={med.imprint}
              size="lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-serif font-bold text-[#1c1917] leading-tight">{med.name}</h3>
            <p className="text-xs font-mono font-semibold text-[#1e3a2f]">{med.strength} • {med.form}</p>
            <p className="text-xs text-[#57534e] mt-1 line-clamp-2 leading-relaxed">
              {instructionObj?.simple || instructionObj?.standard}
            </p>
          </div>
        </div>

        {/* Read aloud button */}
        <button
          onClick={handleSpeak}
          className="w-full mb-4 py-2 px-4 rounded-xl bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e7e2d8] text-[#1c1917] font-medium text-xs transition-colors cursor-pointer text-center"
        >
          Read instructions aloud
        </button>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSnooze}
            className="w-full py-3 px-4 rounded-xl border border-[#e7e2d8] bg-white hover:bg-[#faf8f5] text-[#57534e] font-semibold text-xs transition-colors cursor-pointer"
          >
            Remind in 15 Minutes
          </button>

          <button
            onClick={handleTake}
            className="w-full py-3 px-4 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-semibold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            Confirm Dose Taken
          </button>
        </div>
      </div>
    </div>
  );
};
