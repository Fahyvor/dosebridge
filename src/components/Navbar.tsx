import React from 'react';
import { useDoseBridge } from '../store/useDoseBridge';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { Language } from '../types';

interface NavbarProps {
  onOpenPrintModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrintModal }) => {
  const {
    role,
    setRole,
    activePatient,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    schedule,
    triggerAlarmSimulation,
    resetTodaySchedule,
  } = useDoseBridge();

  const languageOptions: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: 'EN' },
    { id: 'es', label: 'Español', flag: 'ES' },
    { id: 'fr', label: 'Français', flag: 'FR' },
    { id: 'yo', label: 'Èdè Yorùbá', flag: 'YO' },
    { id: 'ar', label: 'العربية', flag: 'AR' },
    { id: 'zh', label: '中文', flag: 'ZH' },
    { id: 'hi', label: 'हिन्दी', flag: 'HI' },
    { id: 'sw', label: 'Kiswahili', flag: 'SW' },
    { id: 'de', label: 'Deutsch', flag: 'DE' },
  ];

  const pendingDoses = schedule.filter((s) => s.status === 'pending');

  const handleTestAlarm = () => {
    if (schedule.length > 0) {
      triggerAlarmSimulation(pendingDoses[0] || schedule[0]);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 border-b border-stone-200/80 backdrop-blur-md transition-colors">
      {/* Top Ledger Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Active Patient Note */}
        <div className="flex items-baseline gap-3">
          <span className="font-editorial text-2xl font-bold tracking-tight text-stone-900">
            DoseBridge
          </span>
          <span className="text-xs font-mono text-stone-400">/</span>
          <span className="text-xs font-medium text-stone-600">
            {role === 'patient'
              ? (activePatient?.fullName || 'Eleanor Vance')
              : `Caregiver View (${activePatient?.fullName || 'Eleanor'})`}
          </span>
        </div>

        {/* Right Ledger Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* User Mode Toggle */}
          <div
            role="group"
            aria-label="User mode"
            className="flex items-center p-0.5 rounded-lg bg-stone-200/60 border border-stone-200 text-xs font-medium"
          >
            <button
              onClick={() => setRole('patient')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                role === 'patient'
                  ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-pressed={role === 'patient'}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                role === 'caregiver'
                  ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              aria-pressed={role === 'caregiver'}
            >
              Caregiver
            </button>
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <label htmlFor="language-select" className="sr-only">
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-700 focus:outline-none cursor-pointer"
            >
              {languageOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-white text-stone-900">
                  {opt.flag} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Test reminder */}
          <button
            onClick={handleTestAlarm}
            className="px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-lg transition-colors cursor-pointer"
            title="Hear reminder tone & notification"
          >
            Test Chime
          </button>

          {/* Reset daily schedule */}
          <button
            onClick={resetTodaySchedule}
            className="px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Reset daily schedule for demo testing"
          >
            Reset Day
          </button>

          {/* Print wallet card */}
          <button
            onClick={onOpenPrintModal}
            className="hidden md:inline-block px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors cursor-pointer"
          >
            Wallet Card
          </button>

          {/* Reading & Comfort */}
          <AccessibilityToolbar />
        </div>
      </div>

      {/* Main Tab Navigation - Clean Architectural Ledger Tabs */}
      <nav
        aria-label="Main Navigation"
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-stone-200/60 scrollbar-none"
      >
        <button
          onClick={() => setActiveTab('schedule')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Today&apos;s Schedule</span>
          {pendingDoses.length > 0 && (
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
              {pendingDoses.length} due
            </span>
          )}
          {activeTab === 'schedule' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('medications')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'medications'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Medicine Cabinet</span>
          {activeTab === 'medications' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('caregiver')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'caregiver'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Care Circle</span>
          {activeTab === 'caregiver' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Health Guides</span>
          {activeTab === 'resources' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-stone-900" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-stone-900 font-semibold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>Profile & Access Code</span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-stone-900" />
          )}
        </button>
      </nav>
    </header>
  );
};
