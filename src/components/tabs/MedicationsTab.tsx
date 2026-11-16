import React, { useState } from 'react';
import { useDoseBridge } from '../../store/useDoseBridge';
import { VisualPill } from '../VisualPill';
import { PictogramBadge } from '../PictogramBadge';
import { Medication } from '../../types';

export const MedicationsTab: React.FC = () => {
  const {
    medications,
    addNewMedication,
    updateMedication,
    deleteMedication,
    refillMedication,
    language,
    speakText,
  } = useDoseBridge();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formGeneric, setFormGeneric] = useState('');
  const [formStrength, setFormStrength] = useState('500 mg');
  const [formForm, setFormForm] = useState<'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection' | 'drops'>('tablet');
  const [formColor, setFormColor] = useState('#2563eb');
  const [formShape, setFormShape] = useState<'round' | 'capsule' | 'oval' | 'square'>('oval');
  const [formImprint, setFormImprint] = useState('');
  const [formTimesPerDay, setFormTimesPerDay] = useState(1);
  const [formTimeSlots, setFormTimeSlots] = useState<('morning' | 'afternoon' | 'evening' | 'bedtime')[]>(['morning']);
  const [formFoodRule, setFormFoodRule] = useState<'with_food' | 'empty_stomach' | 'after_food' | 'no_restriction'>('with_food');
  const [formTotalPills, setFormTotalPills] = useState(30);
  const [formRemaining, setFormRemaining] = useState(30);
  const [formDoctor, setFormDoctor] = useState('Dr. Sarah Chen, MD');
  const [formPharmacy, setFormPharmacy] = useState('Community Health Pharmacy');
  const [formRx, setFormRx] = useState('RX-102938');

  const [refillNotice, setRefillNotice] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingMed(null);
    setFormName('');
    setFormGeneric('');
    setFormStrength('500 mg');
    setFormForm('tablet');
    setFormColor('#2563eb');
    setFormShape('oval');
    setFormImprint('');
    setFormTimesPerDay(1);
    setFormTimeSlots(['morning']);
    setFormFoodRule('with_food');
    setFormTotalPills(30);
    setFormRemaining(30);
    setFormDoctor('Dr. Sarah Chen, MD');
    setFormPharmacy('Community Health Pharmacy');
    setFormRx(`RX-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setFormName(med.name);
    setFormGeneric(med.genericName);
    setFormStrength(med.strength);
    setFormForm(med.form);
    setFormColor(med.pillColor);
    setFormShape(med.pillShape);
    setFormImprint(med.imprint || '');
    setFormTimesPerDay(med.timesPerDay);
    setFormTimeSlots(med.timeSlots);
    setFormFoodRule(med.foodRule);
    setFormTotalPills(med.totalPills);
    setFormRemaining(med.pillsRemaining);
    setFormDoctor(med.prescribingDoctor);
    setFormPharmacy(med.pharmacyName);
    setFormRx(med.rxNumber);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingMed) {
      await updateMedication(editingMed.id, {
        name: formName,
        genericName: formGeneric || formName,
        strength: formStrength,
        form: formForm,
        pillColor: formColor,
        pillShape: formShape,
        imprint: formImprint,
        timesPerDay: formTimesPerDay,
        timeSlots: formTimeSlots,
        foodRule: formFoodRule,
        totalPills: formTotalPills,
        pillsRemaining: formRemaining,
        prescribingDoctor: formDoctor,
        pharmacyName: formPharmacy,
        rxNumber: formRx,
      });
    } else {
      await addNewMedication({
        name: formName,
        genericName: formGeneric || formName,
        strength: formStrength,
        form: formForm,
        pillColor: formColor,
        pillShape: formShape,
        imprint: formImprint,
        timesPerDay: formTimesPerDay,
        timeSlots: formTimeSlots,
        foodRule: formFoodRule,
        totalPills: formTotalPills,
        pillsRemaining: formRemaining,
        refillThreshold: 5,
        prescribingDoctor: formDoctor,
        pharmacyName: formPharmacy,
        rxNumber: formRx,
      });
    }

    setIsModalOpen(false);
  };

  const handleRefill = async (id: string) => {
    const msg = await refillMedication(id);
    setRefillNotice(msg);
    setTimeout(() => setRefillNotice(null), 5000);
  };

  const handleSpeakMed = (med: Medication) => {
    const inst = med.instructions?.[language] || med.instructions?.en;
    const text = `${med.name}, ${med.genericName}. Strength: ${med.strength}. Form: ${med.form}. ${inst?.simple || inst?.standard || ''}`;
    speakText(text, language);
  };

  const lowStockCount = medications.filter((m) => m.pillsRemaining <= m.refillThreshold).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Refill confirmation banner */}
      {refillNotice && (
        <div className="p-4 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#14532d] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
            <span className="font-semibold text-sm">{refillNotice}</span>
          </div>
          <button
            onClick={() => setRefillNotice(null)}
            className="text-xs font-semibold text-[#166534] hover:underline cursor-pointer px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Low stock alert banner */}
      {lowStockCount > 0 && !refillNotice && (
        <div className="p-4 rounded-2xl bg-[#fffbeb] border border-[#fde68a] text-[#78350f] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] animate-pulse" />
            <span className="font-medium text-xs sm:text-sm">
              <strong className="font-bold text-[#92400e]">{lowStockCount} prescription{lowStockCount > 1 ? 's' : ''}</strong> running low on supply. Restock options are available directly below.
            </span>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#1e3a2f]">
            Pharmacy Formulary & Cabinet
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-0.5">
            Active Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1 max-w-xl">
            Verified medicine specifications, physical pill descriptions, remaining days of supply, and clinical instructions.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-[#fcfbf9] font-medium text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          + Add New Prescription
        </button>
      </div>

      {/* Grid of Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {medications.map((med) => {
          const inst = med.instructions?.[language] || med.instructions?.en;
          const isLowPills = med.pillsRemaining <= med.refillThreshold;
          const daysLeft = Math.floor(med.pillsRemaining / (med.timesPerDay || 1));

          return (
            <article
              key={med.id}
              className={`rounded-3xl border p-6 transition-all shadow-xs bg-white flex flex-col justify-between ${
                isLowPills ? 'border-[#fed7aa] bg-[#fffaf5]' : 'border-[#e7e2d8]'
              }`}
            >
              <div>
                {/* Header: Visual Pill + Name + Edit / Discontinue */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#f2ede4]">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="shrink-0 p-2 rounded-2xl bg-[#f9f7f2] border border-[#e7e2d8]/70 flex items-center justify-center">
                      <VisualPill
                        color={med.pillColor}
                        shape={med.pillShape}
                        form={med.form}
                        imprint={med.imprint}
                        size="lg"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-serif font-bold text-[#1c1917] leading-tight">
                          {med.name}
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-[#f2ede4] text-[#44403c] text-[11px] font-mono font-semibold">
                          {med.strength}
                        </span>
                        <span className="text-[11px] text-[#78716c] uppercase tracking-wide">
                          {med.form}
                        </span>
                      </div>
                      <p className="text-xs text-[#57534e] mt-1">
                        Generic: <span className="text-[#1c1917] font-medium">{med.genericName}</span>
                      </p>
                      {inst?.phonetic && (
                        <p className="text-[11px] text-[#78716c] italic mt-0.5">
                          Pronunciation: &ldquo;{inst.phonetic}&rdquo;
                        </p>
                      )}
                      <p className="text-[11px] text-[#78716c] font-mono mt-1">
                        {med.rxNumber} • {med.pharmacyName}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    <button
                      onClick={() => openEditModal(med)}
                      className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] text-[#57534e] hover:text-[#1c1917] hover:bg-[#f9f7f2] font-medium transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    {deletingId === med.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteMedication(med.id);
                            setDeletingId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-[#b91c1c] text-white font-medium text-[11px] cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2 py-1 rounded-lg border border-[#e7e2d8] text-[#78716c] text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingId(med.id)}
                        className="px-2.5 py-1 rounded-lg border border-[#e7e2d8] text-[#78716c] hover:text-[#b91c1c] hover:bg-[#fef2f2] font-medium transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Instructions Block */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider">
                      Patient Dosing Direction
                    </span>
                    <button
                      onClick={() => handleSpeakMed(med)}
                      className="text-xs font-semibold text-[#1e3a2f] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Read Aloud</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#292524] mt-1.5 leading-relaxed">
                    {inst?.simple || inst?.standard || 'Take as instructed by your doctor.'}
                  </p>
                  {inst?.purpose && (
                    <div className="mt-2 text-xs text-[#57534e] bg-[#f9f7f2] p-2.5 rounded-xl border border-[#e7e2d8]/60">
                      <span className="font-semibold text-[#1c1917]">Clinical Purpose:</span> {inst.purpose}
                    </div>
                  )}
                </div>

                {/* Dietary and Timing Pictograms */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {med.foodRule === 'with_food' && <PictogramBadge type="with_food" size="sm" />}
                  {med.foodRule === 'empty_stomach' && <PictogramBadge type="empty_stomach" size="sm" />}
                  {med.waterRule === 'full_glass' && <PictogramBadge type="full_glass" size="sm" />}
                  {med.timeSlots.map((ts) => (
                    <PictogramBadge key={ts} type={ts} size="sm" />
                  ))}
                </div>

                {/* Prescriber Footer */}
                <div className="mt-4 pt-3 border-t border-[#f2ede4] flex flex-wrap items-center justify-between text-xs text-[#78716c] gap-2">
                  <span>Prescriber: <strong className="text-[#44403c] font-medium">{med.prescribingDoctor}</strong></span>
                  <span>Doctor contact: <strong className="text-[#44403c] font-medium">{med.doctorPhone}</strong></span>
                </div>
              </div>

              {/* Supply & Restock Bar */}
              <div className="mt-5 pt-4 border-t border-[#f2ede4] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-11 h-11 rounded-xl font-mono font-bold text-sm ${
                      isLowPills
                        ? 'bg-[#fed7aa] text-[#9a3412]'
                        : 'bg-[#e7e2d8] text-[#1e3a2f]'
                    }`}
                  >
                    {med.pillsRemaining}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1c1917]">
                      {med.pillsRemaining} of {med.totalPills} doses remaining
                    </div>
                    <div className="text-[11px] text-[#78716c]">
                      {isLowPills ? (
                        <span className="text-[#b45309] font-semibold">
                          Supply low (~{daysLeft} days remaining)
                        </span>
                      ) : (
                        <span>~{daysLeft} days supply remaining</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRefill(med.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer ${
                    isLowPills
                      ? 'bg-[#c2410c] hover:bg-[#9a3412] text-white'
                      : 'bg-[#f2ede4] hover:bg-[#e7e2d8] text-[#1c1917] border border-[#e7e2d8]'
                  }`}
                >
                  Restock Bottle (+{med.totalPills})
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Add / Edit Prescription Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#f2ede4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
                  Prescription Record
                </span>
                <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
                  {editingMed ? `Edit Prescription: ${editingMed.name}` : 'New Prescription Order'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 rounded-lg border border-[#e7e2d8] text-xs font-semibold text-[#78716c] hover:text-[#1c1917] cursor-pointer"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-5">
              {/* Row 1: Name, Generic, Strength */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Metformin"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Generic Chemical Name
                  </label>
                  <input
                    type="text"
                    value={formGeneric}
                    onChange={(e) => setFormGeneric(e.target.value)}
                    placeholder="e.g. Metformin HCl"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Strength / Dose
                  </label>
                  <input
                    type="text"
                    value={formStrength}
                    onChange={(e) => setFormStrength(e.target.value)}
                    placeholder="e.g. 500 mg"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
                  />
                </div>
              </div>

              {/* Row 2: Physical Pill Appearance */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#57534e] block">
                  Physical Pill Appearance & Identification
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-[#57534e] mb-1 font-medium">Form</label>
                    <select
                      value={formForm}
                      onChange={(e) => setFormForm(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e7e2d8] text-xs font-medium focus:outline-none"
                    >
                      <option value="tablet">Tablet</option>
                      <option value="capsule">Capsule</option>
                      <option value="liquid">Liquid</option>
                      <option value="inhaler">Inhaler</option>
                      <option value="injection">Injection</option>
                      <option value="drops">Drops</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534e] mb-1 font-medium">Shape</label>
                    <select
                      value={formShape}
                      onChange={(e) => setFormShape(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e7e2d8] text-xs font-medium focus:outline-none"
                    >
                      <option value="oval">Oval</option>
                      <option value="round">Round</option>
                      <option value="capsule">Capsule Shape</option>
                      <option value="square">Square</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534e] mb-1 font-medium">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formColor}
                        onChange={(e) => setFormColor(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-[#e7e2d8] cursor-pointer bg-white p-0.5"
                      />
                      <span className="text-xs font-mono text-[#78716c]">{formColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#57534e] mb-1 font-medium">Imprint Code</label>
                    <input
                      type="text"
                      value={formImprint}
                      onChange={(e) => setFormImprint(e.target.value)}
                      placeholder="e.g. M 500"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#e7e2d8] text-xs font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Routine & Food Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Food Relationship
                  </label>
                  <select
                    value={formFoodRule}
                    onChange={(e) => setFormFoodRule(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium focus:outline-none"
                  >
                    <option value="with_food">Take with meals / breakfast & dinner</option>
                    <option value="empty_stomach">Empty stomach (1 hr before food)</option>
                    <option value="after_food">After food</option>
                    <option value="no_restriction">No food restrictions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Doses Per Day
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={formTimesPerDay}
                    onChange={(e) => setFormTimesPerDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1.5">
                  Routine Dosing Windows
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['morning', 'afternoon', 'evening', 'bedtime'] as const).map((slot) => {
                    const active = formTimeSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setFormTimeSlots(formTimeSlots.filter((s) => s !== slot));
                          } else {
                            setFormTimeSlots([...formTimeSlots, slot]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors cursor-pointer border ${
                          active
                            ? 'bg-[#1e3a2f] text-[#fcfbf9] border-[#1e3a2f]'
                            : 'bg-[#faf8f5] text-[#57534e] border-[#e7e2d8]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Supply & Doctor */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Full Bottle Count
                  </label>
                  <input
                    type="number"
                    value={formTotalPills}
                    onChange={(e) => setFormTotalPills(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Current Remaining
                  </label>
                  <input
                    type="number"
                    value={formRemaining}
                    onChange={(e) => setFormRemaining(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Prescribing Doctor
                  </label>
                  <input
                    type="text"
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    placeholder="Dr. Sarah Chen, MD"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 5: Pharmacy & Rx Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Pharmacy Name
                  </label>
                  <input
                    type="text"
                    value={formPharmacy}
                    onChange={(e) => setFormPharmacy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Prescription (Rx) Number
                  </label>
                  <input
                    type="text"
                    value={formRx}
                    onChange={(e) => setFormRx(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f2ede4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#e7e2d8] text-xs font-semibold text-[#57534e] hover:bg-[#faf8f5] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-[#fcfbf9] text-xs font-semibold shadow-xs cursor-pointer"
                >
                  {editingMed ? 'Update Prescription' : 'Save Prescription to Cabinet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
