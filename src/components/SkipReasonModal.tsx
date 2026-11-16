import React, { useState } from 'react';
import { useDoseBridge } from '../store/useDoseBridge';

interface SkipReasonModalProps {
  scheduleId: string;
  medicationName: string;
  onClose: () => void;
}

export const SkipReasonModal: React.FC<SkipReasonModalProps> = ({
  scheduleId,
  medicationName,
  onClose,
}) => {
  const { skipDose } = useDoseBridge();
  const [selectedReason, setSelectedReason] = useState<string>('Stomach felt upset or nauseous');
  const [customReason, setCustomReason] = useState<string>('');

  const commonReasons = [
    'Stomach felt upset or nauseous',
    'Feeling dizzy or too sleepy',
    'Away from home / forgot my pills',
    'Ran out of pills in the bottle',
    'Doctor or pharmacist told me to pause',
    'Taking it later with dinner instead',
  ];

  const handleConfirm = async () => {
    const finalReason = customReason.trim() ? customReason.trim() : selectedReason;
    await skipDose(scheduleId, finalReason);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skip-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-xl text-[#1c1917]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#f2ede4]">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#991b1b]">
              Clinical Log
            </span>
            <h3 id="skip-modal-title" className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              Skip Dose: {medicationName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#a8a29e] hover:text-[#1c1917] font-semibold"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-[#57534e] mt-3 leading-relaxed">
          It happens! Sharing a reason logs an explanation in your health record so your caregiver and clinician can understand how you are feeling.
        </p>

        <div className="mt-4 space-y-2">
          {commonReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => {
                setSelectedReason(reason);
                setCustomReason('');
              }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                selectedReason === reason && !customReason
                  ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b] font-semibold'
                  : 'bg-[#faf8f5] border-[#e7e2d8] text-[#57534e] hover:bg-[#f2ede4]'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="block text-xs font-semibold text-[#44403c] mb-1">
            Or enter a specific reason:
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="e.g. Taking after dinner with warm tea..."
            className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-[#1c1917] text-xs placeholder:text-[#a8a29e] focus:outline-none focus:border-[#991b1b]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl border border-[#e7e2d8] bg-white hover:bg-[#faf8f5] text-[#57534e] font-semibold text-xs transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 rounded-xl bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            Record Skipped Dose
          </button>
        </div>
      </div>
    </div>
  );
};
