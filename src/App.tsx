import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDoseBridge } from './store/useDoseBridge';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { MedicationsTab } from './components/tabs/MedicationsTab';
import { CaregiverTab } from './components/tabs/CaregiverTab';
import { EducationTab } from './components/tabs/EducationTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { NotificationModal } from './components/NotificationModal';
import { PrintScheduleModal } from './components/PrintScheduleModal';
import {
  FaHeartPulse,
  FaPhoneVolume,
  FaShieldHalved,
  FaHandsHoldingCircle,
} from 'react-icons/fa6';

const MainLayout: React.FC = () => {
  const { activeTab, language, loading, refreshData } = useDoseBridge();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const isRtl = language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col selection:bg-emerald-200 selection:text-emerald-950 font-sans"
    >
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 px-5 py-2.5 bg-emerald-800 text-white font-semibold rounded-xl shadow-lg border border-emerald-700"
      >
        Skip directly to today&apos;s medicines
      </a>

      {/* Navigation Header */}
      <Navbar onOpenPrintModal={() => setIsPrintModalOpen(true)} />

      {/* Main Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 outline-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-10 h-10 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-600">
              Gathering your medicine schedule...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'schedule' && <ScheduleTab />}
            {activeTab === 'medications' && <MedicationsTab />}
            {activeTab === 'caregiver' && <CaregiverTab />}
            {activeTab === 'resources' && <EducationTab />}
            {activeTab === 'profile' && <ProfileTab />}
          </>
        )}
      </main>

      {/* Floating Audio Player Bar */}
      <AudioPlayerBar />

      {/* Live Reminder Alert Simulator Modal */}
      <NotificationModal />

      {/* Printable Schedule Modal */}
      {isPrintModalOpen && (
        <PrintScheduleModal onClose={() => setIsPrintModalOpen(false)} />
      )}

      {/* Caring, Human Healthcare Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white/70 py-8 px-4 sm:px-6 text-stone-600 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <FaHeartPulse className="text-sm" />
            </div>
            <div>
              <span className="font-bold text-stone-900 tracking-tight block">
                DoseBridge
              </span>
              <span className="text-[11px] text-stone-500">
                A calm, accessible companion for your daily medicine routine
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-stone-600 text-xs">
            <span className="flex items-center gap-1.5 text-stone-700">
              <FaShieldHalved className="text-emerald-700 text-xs" />
              <span>Private & Family-Shared</span>
            </span>
            <span className="flex items-center gap-1.5 text-stone-700">
              <FaHandsHoldingCircle className="text-stone-500 text-xs" />
              <span>Plain Speech & Multi-language</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
              <FaPhoneVolume className="text-xs" />
              <span>Medical Emergency: 911</span>
            </span>
          </div>

          <p className="text-[11px] text-stone-500 max-w-sm">
            DoseBridge helps you organize your daily medications and keep family in touch. Always follow specific instructions given by your doctor or pharmacist.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AccessibilityProvider>
        <AppProvider>
          <MainLayout />
        </AppProvider>
      </AccessibilityProvider>
    </Provider>
  );
}
