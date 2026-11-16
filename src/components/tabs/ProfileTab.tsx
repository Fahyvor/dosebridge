import React, { useState } from 'react';
import { useDoseBridge } from '../../store/useDoseBridge';
import { Language } from '../../types';

export const ProfileTab: React.FC = () => {
  const {
    activePatient,
    patients,
    setActivePatient,
    updateCurrentPatient,
    registerNewPatient,
    announce,
  } = useDoseBridge();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Edit Patient fields
  const [name, setName] = useState(activePatient?.fullName || '');
  const [preferredName, setPreferredName] = useState(activePatient?.preferredName || '');
  const [age, setAge] = useState(activePatient?.age || 68);
  const [gender, setGender] = useState(activePatient?.gender || 'Female');
  const [lang, setLang] = useState<Language>(activePatient?.primaryLanguage || 'en');
  const [literacy, setLiteracy] = useState<'simple' | 'standard' | 'pictogram'>(activePatient?.literacyMode || 'simple');
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [emName, setEmName] = useState(activePatient?.emergencyContact.name || '');
  const [emPhone, setEmPhone] = useState(activePatient?.emergencyContact.phone || '');
  const [emRel, setEmRel] = useState(activePatient?.emergencyContact.relationship || '');
  const [savedNotice, setSavedNotice] = useState(false);

  // New patient registration form
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState(60);
  const [regLang, setRegLang] = useState<Language>('en');
  const [regCondition, setRegCondition] = useState('');
  const [regAllergy, setRegAllergy] = useState('');

  const handleCopyCode = () => {
    if (activePatient?.accessCode) {
      navigator.clipboard.writeText(activePatient.accessCode);
      setCopiedCode(true);
      announce('Access code copied to clipboard');
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    await updateCurrentPatient({
      fullName: name,
      preferredName,
      age: Number(age),
      gender,
      primaryLanguage: lang,
      literacyMode: literacy,
      emergencyContact: {
        name: emName,
        phone: emPhone,
        relationship: emRel,
      },
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleAddCondition = () => {
    if (!activePatient || !newCondition.trim()) return;
    const updated = [...activePatient.conditions, newCondition.trim()];
    updateCurrentPatient({ conditions: updated });
    setNewCondition('');
  };

  const handleRemoveCondition = (idx: number) => {
    if (!activePatient) return;
    const updated = activePatient.conditions.filter((_, i) => i !== idx);
    updateCurrentPatient({ conditions: updated });
  };

  const handleAddAllergy = () => {
    if (!activePatient || !newAllergy.trim()) return;
    const updated = [...activePatient.allergies, newAllergy.trim()];
    updateCurrentPatient({ allergies: updated });
    setNewAllergy('');
  };

  const handleRemoveAllergy = (idx: number) => {
    if (!activePatient) return;
    const updated = activePatient.allergies.filter((_, i) => i !== idx);
    updateCurrentPatient({ allergies: updated });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    await registerNewPatient({
      fullName: regName.trim(),
      preferredName: regName.trim().split(' ')[0],
      age: Number(regAge),
      gender: 'Other',
      primaryLanguage: regLang,
      literacyMode: 'simple',
      conditions: regCondition ? [regCondition.trim()] : [],
      allergies: regAllergy ? [regAllergy.trim()] : [],
      emergencyContact: {
        name: 'Emergency Contact',
        relationship: 'Family Member',
        phone: '+1 (555) 000-0000',
      },
    });

    setRegName('');
    setRegCondition('');
    setRegAllergy('');
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#1e3a2f]">
            Clinical Medical Chart
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-0.5">
            Patient Health Record
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1">
            Demographic information, confirmed chronic conditions, known allergies, and caregiver sync codes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Patient Switcher */}
          <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e7e2d8] rounded-xl px-3 py-2 text-xs">
            <span className="text-[#78716c] font-medium">Record:</span>
            <select
              value={activePatient?.id || ''}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) {
                  setActivePatient(found);
                  setName(found.fullName);
                  setPreferredName(found.preferredName);
                  setAge(found.age);
                  setGender(found.gender);
                  setLang(found.primaryLanguage);
                  setLiteracy(found.literacyMode);
                  setEmName(found.emergencyContact.name);
                  setEmPhone(found.emergencyContact.phone);
                  setEmRel(found.emergencyContact.relationship);
                }
              }}
              className="bg-transparent font-semibold text-[#1c1917] focus:outline-none cursor-pointer pr-1"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-[#1c1917]">
                  {p.fullName} ({p.accessCode})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-[#fcfbf9] font-medium text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            + New Patient Record
          </button>
        </div>
      </div>

      {/* Access Code Box */}
      {activePatient && (
        <div className="p-6 rounded-3xl bg-[#faf8f5] border border-[#e7e2d8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716c]">
              Care Circle Access Key
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-2xl font-bold tracking-widest text-[#1e3a2f]">
                {activePatient.accessCode}
              </span>
              <span className="text-xs text-[#57534e]">
                Share this secure code with family members or caregivers to sync medication schedules.
              </span>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-xl border border-[#e7e2d8] bg-white hover:bg-[#f2ede4] text-xs font-semibold text-[#1c1917] transition-colors cursor-pointer shrink-0"
          >
            {copiedCode ? 'Copied to Clipboard!' : 'Copy Access Code'}
          </button>
        </div>
      )}

      {/* Main Chart Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Demographics Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#f2ede4]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
              Section 1
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              Demographic Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Preferred Greeting Name
              </label>
              <input
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium text-[#1c1917] focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Primary Language
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium text-[#1c1917] focus:outline-none"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (Spanish)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="ar">العربية (Arabic)</option>
                <option value="tl">Tagalog (Filipino)</option>
                <option value="vi">Tiếng Việt (Vietnamese)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Instruction Complexity Mode
              </label>
              <select
                value={literacy}
                onChange={(e) => setLiteracy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium text-[#1c1917] focus:outline-none"
              >
                <option value="simple">Simple Plain Language (Recommended)</option>
                <option value="standard">Standard Clinical Terms</option>
                <option value="pictogram">Visual Pictogram Emphasis</option>
              </select>
            </div>
          </div>
        </section>

        {/* Chronic Conditions & Allergies Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs space-y-5">
          <div className="pb-3 border-b border-[#f2ede4]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
              Section 2
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              Clinical Conditions & Drug Allergies
            </h2>
          </div>

          {/* Diagnoses */}
          <div>
            <label className="block text-xs font-semibold text-[#44403c] mb-2">
              Documented Diagnoses & Conditions
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {activePatient?.conditions.map((cond, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium text-[#1c1917]"
                >
                  <span>{cond}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCondition(idx)}
                    className="text-[#a8a29e] hover:text-[#b91c1c] text-sm ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition (e.g. Mild Knee Arthritis)..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs focus:outline-none focus:border-[#1e3a2f]"
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-3 py-2 rounded-xl bg-[#1e3a2f] text-white text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Drug Allergies */}
          <div className="pt-4 border-t border-[#f2ede4]">
            <label className="block text-xs font-semibold text-[#b91c1c] mb-2">
              Known Drug Allergies & Hypersensitivities
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {activePatient?.allergies.map((allergy, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fee2e2] border border-[#fecaca] text-xs font-semibold text-[#991b1b]"
                >
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllergy(idx)}
                    className="text-[#991b1b] hover:text-[#450a0a] text-sm ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy (e.g. Penicillin, Sulfa)..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs focus:outline-none focus:border-[#b91c1c]"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3 py-2 rounded-xl bg-[#b91c1c] text-white text-xs font-medium cursor-pointer"
              >
                Add Allergy
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Emergency Contact Handoff */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs space-y-4">
          <div className="pb-3 border-b border-[#f2ede4]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
              Section 3
            </span>
            <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
              Primary Emergency Contact
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Contact Full Name
              </label>
              <input
                type="text"
                value={emName}
                onChange={(e) => setEmName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={emRel}
                onChange={(e) => setEmRel(e.target.value)}
                placeholder="e.g. Son & Primary Caregiver"
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#44403c] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={emPhone}
                onChange={(e) => setEmPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm font-mono text-[#1c1917] focus:outline-none focus:border-[#1e3a2f]"
              />
            </div>
          </div>
        </section>

        {/* Save Bar */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-[#e7e2d8]">
          <div>
            {savedNotice && (
              <span className="text-xs font-semibold text-[#166534]">
                Patient medical chart updated successfully!
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Save Chart Updates
          </button>
        </div>
      </form>

      {/* New Patient Registration Modal */}
      {isRegisterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#f2ede4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
                  New Patient Record
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                  Register Patient Chart
                </h3>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="px-2 py-1 rounded-lg border border-[#e7e2d8] text-xs font-semibold text-[#78716c]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Margaret Smith"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none focus:border-[#1e3a2f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#44403c] mb-1">
                    Language
                  </label>
                  <select
                    value={regLang}
                    onChange={(e) => setRegLang(e.target.value as Language)}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="zh">中文</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Primary Condition / Diagnosis
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension"
                  value={regCondition}
                  onChange={(e) => setRegCondition(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Known Drug Allergy
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin"
                  value={regAllergy}
                  onChange={(e) => setRegAllergy(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f2ede4]">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e7e2d8] text-xs font-medium text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white text-xs font-medium shadow-xs"
                >
                  Create Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
