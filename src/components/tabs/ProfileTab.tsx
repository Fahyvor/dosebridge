import React, { useState } from 'react';
import {
  FaIdCard,
  FaCopy,
  FaCheck,
  FaTriangleExclamation,
  FaUserPlus,
  FaUsers,
  FaXmark,
  FaShieldHeart,
} from 'react-icons/fa6';
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

  const handleRegisterNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    await registerNewPatient({
      fullName: regName.trim(),
      age: Number(regAge),
      gender: 'Female',
      primaryLanguage: regLang,
      conditions: regCondition ? [regCondition] : [],
      allergies: regAllergy ? [regAllergy] : [],
    });

    setIsRegisterModalOpen(false);
    setRegName('');
  };

  if (!activePatient) return null;

  return (
    <div className="space-y-6 pb-20">
      {/* Saved notice */}
      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-xs animate-slide-up">
          <FaCheck className="text-lg text-emerald-700" />
          <span className="font-semibold text-sm">Patient profile updated successfully.</span>
        </div>
      )}

      {/* Persona Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
            <FaUsers className="text-lg" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
              Active Patient
            </span>
            <div className="text-lg font-bold text-stone-900">{activePatient.fullName}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {patients.map((pat) => (
            <button
              key={pat.id}
              onClick={() => {
                setActivePatient(pat);
                setName(pat.fullName);
                setPreferredName(pat.preferredName);
                setAge(pat.age);
                setGender(pat.gender);
                setLang(pat.primaryLanguage);
                setLiteracy(pat.literacyMode);
                setEmName(pat.emergencyContact.name);
                setEmPhone(pat.emergencyContact.phone);
                setEmRel(pat.emergencyContact.relationship);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activePatient.id === pat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {pat.fullName} ({pat.primaryLanguage.toUpperCase()})
            </button>
          ))}

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <FaUserPlus className="text-emerald-800" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Access Code & Sharing Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800 flex items-center gap-1.5">
              <FaShieldHeart className="text-xs" />
              <span>Care Circle Sharing Code</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              Share with family members, nurses, or caregivers
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-xl">
              Anyone with this 6-character code can link to your medicine routine from the Caregiver Portal to help check in on your health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-5 py-2.5 rounded-2xl bg-white border border-emerald-300 text-xl sm:text-2xl font-mono font-bold text-emerald-950 tracking-wider shadow-xs">
              {activePatient.accessCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {copiedCode ? <FaCheck className="text-xs" /> : <FaCopy className="text-xs" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <FaIdCard className="text-emerald-800 text-xl" />
          <div>
            <h3 className="text-lg font-bold text-stone-900">Personal Health & Literacy Information</h3>
            <p className="text-xs text-stone-500">Customize how medication instructions are formatted for you</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Name / Nickname</label>
            <input
              type="text"
              value={preferredName}
              onChange={(e) => setPreferredName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Age & Gender</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
              />
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Language & Literacy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Native Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
            >
              <option value="en">English (US/UK)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="yo">Èdè Yorùbá (Yoruba)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="zh">中文 (Chinese)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="sw">Kiswahili (Swahili)</option>
              <option value="de">Deutsch (German)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Instruction Reading Style</label>
            <select
              value={literacy}
              onChange={(e) => setLiteracy(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
            >
              <option value="simple">Simple Everyday Language (Clear & friendly)</option>
              <option value="pictogram">Visual Pictograms & Icons</option>
              <option value="standard">Standard Clinical Prescription Terms</option>
            </select>
          </div>
        </div>

        {/* Conditions List */}
        <div className="pt-4 border-t border-stone-100">
          <label className="block text-xs font-semibold text-stone-700 mb-2">Diagnosed Health Conditions</label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activePatient.conditions.map((cond, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 text-xs font-medium"
              >
                <span>{cond}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCondition(idx)}
                  className="hover:text-rose-700 cursor-pointer"
                  aria-label={`Remove condition ${cond}`}
                >
                  <FaXmark className="text-xs" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Add health condition (e.g. Arthritis, High Blood Pressure)..."
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-emerald-700"
            />
            <button
              type="button"
              onClick={handleAddCondition}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        {/* Allergies List */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-rose-800 text-xs font-bold uppercase tracking-wide mb-2">
            <FaTriangleExclamation />
            <span>Known Drug & Food Allergies</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activePatient.allergies.map((allergy, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold"
              >
                <span>⚠️ {allergy}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAllergy(idx)}
                  className="hover:text-rose-950 cursor-pointer"
                  aria-label={`Remove allergy ${allergy}`}
                >
                  <FaXmark className="text-xs" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              placeholder="Add an allergy (e.g. Penicillin, Peanuts, Sulfa)..."
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-rose-700"
            />
            <button
              type="button"
              onClick={handleAddAllergy}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
            >
              Add Allergy
            </button>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="pt-4 border-t border-stone-100">
          <label className="block text-xs font-semibold text-stone-700 mb-2">Primary Emergency Contact</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={emName}
              onChange={(e) => setEmName(e.target.value)}
              placeholder="Full Name (e.g. David Vance)"
              className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={emRel}
              onChange={(e) => setEmRel(e.target.value)}
              placeholder="Relationship (e.g. Son, Daughter)"
              className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none"
            />
            <input
              type="text"
              value={emPhone}
              onChange={(e) => setEmPhone(e.target.value)}
              placeholder="Phone number (+1 555...)"
              className="px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm shadow-xs cursor-pointer"
          >
            Save Profile Updates
          </button>
        </div>
      </form>

      {/* Register New Patient Modal */}
      {isRegisterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white border border-stone-200 rounded-3xl p-6 sm:p-7 shadow-xl text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">Add a New Patient</h3>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 cursor-pointer"
              >
                <FaXmark />
              </button>
            </div>

            <form onSubmit={handleRegisterNewPatient} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Gabriel Santos"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Language</label>
                  <select
                    value={regLang}
                    onChange={(e) => setRegLang(e.target.value as Language)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="yo">Yorùbá</option>
                    <option value="ar">العربية</option>
                    <option value="zh">中文</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Condition</label>
                <input
                  type="text"
                  value={regCondition}
                  onChange={(e) => setRegCondition(e.target.value)}
                  placeholder="e.g. High Blood Pressure, Diabetes"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Drug Allergies</label>
                <input
                  type="text"
                  value={regAllergy}
                  onChange={(e) => setRegAllergy(e.target.value)}
                  placeholder="e.g. Penicillin (or leave blank if none)"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
