import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useDoseBridge } from './store/useDoseBridge';
import { Navbar } from './components/Navbar';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { MedicationsTab } from './components/tabs/MedicationsTab';
import { CaregiverTab } from './components/tabs/CaregiverTab';
import { EducationTab } from './components/tabs/EducationTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { NotificationModal } from './components/NotificationModal';
import { PrintScheduleModal } from './components/PrintScheduleModal';

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
      className="min-h-screen flex flex-col selection:bg-[#cbe7db] selection:text-[#162c23] font-sans bg-[#fcfbf9] text-[#1c1917]"
    >
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 px-5 py-2.5 bg-[#1e3a2f] text-[#fcfbf9] font-semibold rounded-xl shadow-lg border border-[#162c23]"
      >
        Skip directly to today&apos;s medication schedule
      </a>

      {/* Navigation Header */}
      <Navbar onOpenPrintModal={() => setIsPrintModalOpen(true)} />

      {/* Main Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 outline-none">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-8 h-8 border-2 border-[#1e3a2f] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-serif text-[#57534e]">
              Consulting patient records and daily schedule...
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
      <footer className="mt-auto border-t border-[#e7e2d8] bg-[#faf8f5]/80 py-8 px-4 sm:px-6 text-[#57534e] text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <div>
            <span className="font-serif font-bold text-sm text-[#1c1917] tracking-tight block">
              DoseBridge
            </span>
            <span className="text-[11px] text-[#78716c]">
              An accessible, dignity-first companion for daily medication routines
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[#78716c] text-[11px]">
            <span>End-to-End Family Shared Circle</span>
            <span>•</span>
            <span>Plain-Language & Multilingual</span>
            <span>•</span>
            <span className="text-[#991b1b] font-semibold">
              Medical Emergency: Call 911
            </span>
          </div>

          <p className="text-[11px] text-[#a8a29e] max-w-xs md:text-right">
            Follow the specific guidance provided by your physician or pharmacist.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <MainLayout />
    </Provider>
  );
}
