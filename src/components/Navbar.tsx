import React, { useState } from 'react';
import { useDoseBridge } from '../store/useDoseBridge';
import { AccessibilityToolbar } from './AccessibilityToolbar';
import { AuthModal } from './AuthModal';
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
    authUser,
    authRole,
  } = useDoseBridge();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#fcfbf9]/95 border-b border-[#e7e2d8] backdrop-blur-md transition-colors">
      {/* Top Ledger Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Active Patient Note */}
        <div className="flex items-baseline gap-3">
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#1c1917]">
            DoseBridge
          </span>
          <span className="text-xs font-mono text-[#a8a29e]">/</span>
          <span className="text-xs font-medium text-[#57534e]">
            {role === 'patient'
              ? (activePatient?.fullName || 'Eleanor Vance')
              : `Care Circle View (${activePatient?.fullName || 'Eleanor'})`}
          </span>
        </div>

        {/* Right Ledger Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* User Mode Toggle */}
          <div
            role="group"
            aria-label="User mode"
            className="flex items-center p-0.5 rounded-lg bg-[#faf8f5] border border-[#e7e2d8] text-xs font-medium"
          >
            <button
              onClick={() => setRole('patient')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                role === 'patient'
                  ? 'bg-white text-[#1c1917] font-semibold shadow-2xs'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
              aria-pressed={role === 'patient'}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('caregiver')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                role === 'caregiver'
                  ? 'bg-[#1e3a2f] text-white font-semibold shadow-2xs'
                  : 'text-[#78716c] hover:text-[#1c1917]'
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
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e7e2d8] text-[#1c1917] focus:outline-none cursor-pointer"
            >
              {languageOptions.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-white text-[#1c1917]">
                  {opt.flag} — {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Test reminder */}
          <button
            onClick={handleTestAlarm}
            className="px-2.5 py-1 text-xs font-medium text-[#78350f] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] rounded-lg transition-colors cursor-pointer"
            title="Hear reminder tone & notification"
          >
            Test Chime
          </button>

          {/* Reset daily schedule */}
          <button
            onClick={resetTodaySchedule}
            className="px-2.5 py-1 text-xs font-medium text-[#57534e] hover:text-[#1c1917] bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e7e2d8] rounded-lg transition-colors cursor-pointer"
            title="Reset daily schedule for demo testing"
          >
            Reset Day
          </button>

          {/* Print wallet card */}
          <button
            onClick={onOpenPrintModal}
            className="hidden md:inline-block px-2.5 py-1 text-xs font-medium text-[#57534e] hover:text-[#1c1917] bg-[#faf8f5] hover:bg-[#f2ede4] border border-[#e7e2d8] rounded-lg transition-colors cursor-pointer"
          >
            Wallet Card
          </button>

          {/* Auth & RBAC Profile Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#e7e2d8] bg-[#faf8f5] hover:bg-[#f2ede4] text-xs font-medium text-[#1c1917] transition-colors cursor-pointer"
            title="Manage user account and RBAC role"
          >
            <span className="font-semibold">{authUser?.name?.split(' ')[0] || 'Account'}</span>
            <span className="px-1.5 py-0.2 rounded bg-[#1e3a2f] text-white font-mono text-[10px] font-bold">
              {authRole}
            </span>
          </button>

          {/* Reading & Comfort */}
          <AccessibilityToolbar />
        </div>
      </div>

      {/* Main Tab Navigation */}
      <nav
        aria-label="Main Navigation"
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto border-t border-[#e7e2d8]/60 scrollbar-none"
      >
        <button
          onClick={() => setActiveTab('schedule')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'text-[#1c1917] font-semibold'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <span>Today&apos;s Schedule</span>
          {pendingDoses.length > 0 && (
            <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              {pendingDoses.length} due
            </span>
          )}
          {activeTab === 'schedule' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1e3a2f]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('medications')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'medications'
              ? 'text-[#1c1917] font-semibold'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <span>Medicine Cabinet</span>
          {activeTab === 'medications' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1e3a2f]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('caregiver')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'caregiver'
              ? 'text-[#1c1917] font-semibold'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <span>Care Circle</span>
          {activeTab === 'caregiver' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1e3a2f]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'resources'
              ? 'text-[#1c1917] font-semibold'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <span>Health Guides</span>
          {activeTab === 'resources' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1e3a2f]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`relative py-3 px-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#1c1917] font-semibold'
              : 'text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <span>Profile & Access Code</span>
          {activeTab === 'profile' && (
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1e3a2f]" />
          )}
        </button>
      </nav>

      {/* Auth & RBAC Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
