import React from 'react';
import { useDoseBridge } from '../store/useDoseBridge';

interface PrintScheduleModalProps {
  onClose: () => void;
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({ onClose }) => {
  const { activePatient, medications } = useDoseBridge();

  const handlePrint = () => {
    window.print();
  };

  if (!activePatient) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white text-[#1c1917] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full border border-[#e7e2d8]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f2ede4] print:hidden">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
              Official Document
            </span>
            <h2 id="print-title" className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              Printable Medical Wallet Card & Summary
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-[#e7e2d8] text-[#57534e] hover:text-[#1c1917] font-medium text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="mt-4 print:mt-0 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3">
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-[#1c1917]">
                DOSEBRIDGE HEALTHCARE SUMMARY
              </h1>
              <p className="text-xs text-[#57534e]">
                Personal Medication Schedule • Generated {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#faf8f5] border border-[#d6cebf] text-xs font-mono font-bold text-[#1c1917]">
                Patient Code: {activePatient.accessCode}
              </span>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-[#e7e2d8] text-xs">
            <div>
              <span className="font-semibold text-[#78716c] uppercase block text-[10px]">Patient Name</span>
              <span className="font-bold text-sm text-[#1c1917]">{activePatient.fullName}</span>
            </div>
            <div>
              <span className="font-semibold text-[#78716c] uppercase block text-[10px]">Age / Gender</span>
              <span className="font-medium text-[#44403c]">{activePatient.age} yrs • {activePatient.gender}</span>
            </div>
            <div>
              <span className="font-semibold text-[#78716c] uppercase block text-[10px]">Known Allergies</span>
              <span className="font-bold text-[#991b1b]">
                {activePatient.allergies.length > 0 ? activePatient.allergies.join(', ') : 'None Reported'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#78716c] uppercase block text-[10px]">Emergency Contact</span>
              <span className="font-medium text-[#1c1917]">
                {activePatient.emergencyContact.name} ({activePatient.emergencyContact.phone})
              </span>
            </div>
          </div>

          {/* Diagnosed Conditions */}
          <div className="py-2.5 border-b border-[#e7e2d8] text-xs">
            <span className="font-semibold text-[#78716c] uppercase text-[10px] mr-2">
              Clinical Conditions:
            </span>
            <span className="font-medium text-[#1c1917]">
              {activePatient.conditions.join(', ')}
            </span>
          </div>

          {/* Medications Table */}
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a2f] mb-2">
              Active Prescriptions & Dosing Schedule
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1c1917] bg-[#faf8f5]">
                  <th className="py-2 px-2.5 font-bold text-[#1c1917]">Medication</th>
                  <th className="py-2 px-2.5 font-bold text-[#1c1917]">Strength & Form</th>
                  <th className="py-2 px-2.5 font-bold text-[#1c1917]">Dosing Routine</th>
                  <th className="py-2 px-2.5 font-bold text-[#1c1917]">Instructions</th>
                  <th className="py-2 px-2.5 font-bold text-[#1c1917]">Prescriber & Rx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e2d8]">
                {medications.map((med) => {
                  const inst = med.instructions?.en;
                  return (
                    <tr key={med.id} className="align-top">
                      <td className="py-2.5 px-2.5 font-bold text-[#1c1917]">
                        {med.name}
                        <div className="font-normal text-[10px] text-[#78716c]">{med.genericName}</div>
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[#44403c]">
                        {med.strength} {med.form}
                        <div className="text-[10px] text-[#78716c] capitalize">({med.pillShape}, {med.pillColor})</div>
                      </td>
                      <td className="py-2.5 px-2.5 font-medium text-[#1c1917]">
                        {med.scheduledTimes.join(', ')}
                        <div className="text-[10px] text-[#78716c] capitalize">
                          {med.foodRule === 'with_food' ? 'Take with food' : 'Standard'}
                        </div>
                      </td>
                      <td className="py-2.5 px-2.5 text-[#44403c]">
                        {inst?.simple || inst?.standard || 'Take as directed'}
                      </td>
                      <td className="py-2.5 px-2.5 text-[#57534e]">
                        <div>{med.prescribingDoctor}</div>
                        <div className="font-mono text-[10px] text-[#78716c]">{med.rxNumber}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Notice */}
          <div className="mt-6 pt-3 border-t border-[#e7e2d8] text-[10px] text-[#78716c] flex items-center justify-between">
            <span>Keep this card in your wallet, purse, or on your refrigerator.</span>
            <span>Emergency Medical Services: Dial 911</span>
          </div>
        </div>
      </div>
    </div>
  );
};
