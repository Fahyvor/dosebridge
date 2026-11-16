import React from 'react';
import { FaPrint, FaXmark, FaPrescriptionBottleMedical } from 'react-icons/fa6';
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
        className="w-full max-w-3xl bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 print:hidden">
          <div className="flex items-center gap-2 text-emerald-800">
            <FaPrescriptionBottleMedical className="text-xl" />
            <h2 id="print-title" className="text-lg font-bold text-stone-900">
              Printable Medical Wallet Card
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <FaPrint className="text-xs" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors"
              aria-label="Close dialog"
            >
              <FaXmark className="text-lg" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="mt-4 print:mt-0 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-stone-900 pb-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">
                DOSEBRIDGE HEALTHCARE SUMMARY
              </h1>
              <p className="text-xs text-stone-600">
                Personal Medication Schedule • Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-md bg-stone-100 border border-stone-300 text-xs font-mono font-bold text-stone-900">
                Patient Code: {activePatient.accessCode}
              </span>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-stone-200 text-xs">
            <div>
              <span className="font-semibold text-stone-500 uppercase block text-[10px]">Patient Name</span>
              <span className="font-bold text-sm text-stone-900">{activePatient.fullName}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 uppercase block text-[10px]">Age / Gender</span>
              <span className="font-medium text-stone-800">{activePatient.age} yrs • {activePatient.gender}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 uppercase block text-[10px]">Known Allergies</span>
              <span className="font-bold text-rose-700">
                {activePatient.allergies.length > 0 ? activePatient.allergies.join(', ') : 'None Reported'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 uppercase block text-[10px]">Emergency Contact</span>
              <span className="font-medium text-stone-900">
                {activePatient.emergencyContact.name} ({activePatient.emergencyContact.phone})
              </span>
            </div>
          </div>

          {/* Diagnosed Conditions */}
          <div className="py-2.5 border-b border-stone-200 text-xs">
            <span className="font-semibold text-stone-500 uppercase text-[10px] mr-2">Health Conditions:</span>
            <span className="font-medium text-stone-800">{activePatient.conditions.join(' • ')}</span>
          </div>

          {/* Medications Table */}
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-stone-700 mb-2">
              Active Prescriptions & Dosages
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-y border-stone-200 text-[11px] font-semibold text-stone-700">
                  <th className="py-2 px-2">Medication</th>
                  <th className="py-2 px-2">Dosage & Form</th>
                  <th className="py-2 px-2">When to Take</th>
                  <th className="py-2 px-2">Key Instruction</th>
                  <th className="py-2 px-2">Prescribing Doctor</th>
                  <th className="py-2 px-2">Rx Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {medications.map((med) => (
                  <tr key={med.id}>
                    <td className="py-2 px-2 font-bold text-stone-900">
                      <div>{med.name}</div>
                      <div className="text-[10px] font-normal text-stone-500">{med.genericName}</div>
                    </td>
                    <td className="py-2 px-2 font-medium">
                      {med.strength} ({med.form})
                    </td>
                    <td className="py-2 px-2">
                      <span className="font-medium">{med.scheduledTimes.join(', ')}</span>
                    </td>
                    <td className="py-2 px-2 text-stone-700">
                      {med.foodRule === 'with_food'
                        ? 'Take with meals'
                        : med.foodRule === 'empty_stomach'
                        ? 'Empty stomach'
                        : 'With water'}
                    </td>
                    <td className="py-2 px-2 text-stone-600">{med.prescribingDoctor}</td>
                    <td className="py-2 px-2 font-mono text-[11px]">{med.rxNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Warning */}
          <div className="mt-6 pt-3 border-t border-stone-200 text-[10px] text-stone-500 flex justify-between items-center">
            <p>DoseBridge Platform • Keep this card in your wallet for doctor appointments and emergency responders.</p>
            <p>Primary Pharmacy: Community Health Pharmacy</p>
          </div>
        </div>
      </div>
    </div>
  );
};
