import React, { useState } from 'react';
import { FaCircleXmark, FaXmark } from 'react-icons/fa6';
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
        className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xl text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-rose-700">
            <FaCircleXmark className="text-lg" />
            <h3 id="skip-modal-title" className="text-lg font-bold text-stone-900">
              Skip Dose: {medicationName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800"
          >
            <FaXmark />
          </button>
        </div>

        <p className="text-xs text-stone-600 mt-3 leading-relaxed">
          It happens! Sharing a quick reason helps your caregiver and doctor understand how you are feeling and keep you safe.
        </p>

        <div className="mt-3.5 space-y-2">
          {commonReasons.map((reason) => (
            <button
              key={reason}
              onClick={() => {
                setSelectedReason(reason);
                setCustomReason('');
              }}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                selectedReason === reason && !customReason
                  ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="block text-xs font-semibold text-stone-600 mb-1">
            Or describe in your own words:
          </label>
          <input
            type="text"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="e.g. Taking after dinner with tea..."
            className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-rose-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            Keep Pending
          </button>
          <button
            onClick={handleConfirm}
            className="py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            Record Skipped Dose
          </button>
        </div>
      </div>
    </div>
  );
};
