import React, { useState } from 'react';
import { useDoseBridge } from '../../store/useDoseBridge';

export const CaregiverTab: React.FC = () => {
  const {
    activePatient,
    setActivePatient,
    patients,
    schedule,
    adherence,
    caregiverNotes,
    addCaregiverNote,
    deleteCaregiverNote,
    linkNewPatient,
    takeDose,
    authRole,
    switchRole,
  } = useDoseBridge();

  const canManageCaregiver = authRole === 'CAREGIVER' || authRole === 'CLINICIAN' || authRole === 'ADMIN';

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [linkFeedback, setLinkFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [newNoteText, setNewNoteText] = useState('');
  const [notePriority, setNotePriority] = useState<'normal' | 'important' | 'emergency'>('normal');

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim()) return;

    try {
      const res = await linkNewPatient(accessCodeInput.trim());
      setLinkFeedback(res);
      if (res.success) {
        setAccessCodeInput('');
        setTimeout(() => {
          setIsLinkModalOpen(false);
          setLinkFeedback(null);
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not link code';
      setLinkFeedback({ success: false, message: msg });
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    await addCaregiverNote(newNoteText.trim(), notePriority);
    setNewNoteText('');
    setNotePriority('normal');
  };

  const pendingSchedule = schedule.filter((s) => s.status === 'pending');
  const takenSchedule = schedule.filter((s) => s.status === 'taken');

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner: Family & Care Circle */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#1e3a2f]">
            Shared Caregiving Circle
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-0.5">
            Family Caregiver Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] mt-1">
            Logged in as <strong className="text-[#1c1917] font-semibold">David Vance (Primary Caregiver)</strong> • Monitoring patient compliance & daily notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Patient switcher */}
          <div className="flex items-center gap-2 bg-[#faf8f5] border border-[#e7e2d8] rounded-xl px-3 py-2 text-xs">
            <span className="text-[#78716c] font-medium">Patient:</span>
            <select
              value={activePatient?.id || ''}
              onChange={(e) => {
                const pat = patients.find((p) => p.id === e.target.value);
                if (pat) setActivePatient(pat);
              }}
              className="bg-transparent font-semibold text-[#1c1917] focus:outline-none cursor-pointer pr-1"
            >
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id} className="bg-white text-[#1c1917]">
                  {pat.fullName} ({pat.accessCode})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-[#fcfbf9] font-medium text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            + Link Family Member
          </button>
        </div>
      </section>

      {/* Patient Health Overview & Emergency Card */}
      {activePatient && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Today's Status for Caregiver */}
          <div className="p-6 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider">
                Today&apos;s Medication Progress
              </span>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-3xl font-serif font-bold text-[#1c1917]">
                    {takenSchedule.length} of {schedule.length}
                  </div>
                  <p className="text-xs text-[#57534e] mt-0.5">Doses taken so far today</p>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl font-medium text-xs ${
                    pendingSchedule.length === 0
                      ? 'bg-[#dcfce7] text-[#14532d]'
                      : 'bg-[#fef3c7] text-[#92400e]'
                  }`}
                >
                  {pendingSchedule.length === 0 ? 'All Completed' : `${pendingSchedule.length} Pending`}
                </div>
              </div>
            </div>

            {/* Dose confirmation buttons */}
            {pendingSchedule.length > 0 ? (
              <div className="mt-5 pt-4 border-t border-[#f2ede4] space-y-2">
                <span className="text-[11px] font-bold text-[#57534e] uppercase tracking-wide block">
                  Verify or log on behalf of {activePatient.preferredName}:
                </span>
                {pendingSchedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#1c1917]">{item.medication?.name}</span>
                      <span className="text-[#78716c] ml-1.5 font-mono">({item.scheduledTime})</span>
                    </div>
                    <button
                      onClick={() => takeDose(item.id)}
                      className="px-3 py-1 rounded-lg bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs cursor-pointer"
                    >
                      Confirm Taken
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-[#f2ede4] text-xs text-[#166534]">
                All scheduled doses for today have been logged.
              </div>
            )}
          </div>

          {/* Card 2: Patient Profile & Health Watch */}
          <div className="p-6 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider">
                Clinical Diagnoses & Allergies
              </span>
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <span className="text-[#78716c] block font-medium">Active Diagnoses:</span>
                  <span className="font-semibold text-[#1c1917] text-sm block mt-0.5">
                    {activePatient.conditions.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#78716c] block font-medium">Critical Drug Allergies:</span>
                  <span className="font-bold text-[#b91c1c] text-sm block mt-0.5">
                    {activePatient.allergies.length > 0 ? activePatient.allergies.join(', ') : 'None Reported'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#f2ede4] flex items-center justify-between text-xs">
              <span className="text-[#78716c]">Family Access Code:</span>
              <span className="font-mono font-bold text-[#1e3a2f] bg-[#e7e2d8]/60 px-2.5 py-1 rounded-md">
                {activePatient.accessCode}
              </span>
            </div>
          </div>

          {/* Card 3: 1-Tap Emergency Contact Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#fecdd3] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#9f1239] uppercase tracking-wider block">
                Primary Emergency Line
              </span>
              <div className="mt-3">
                <h3 className="text-xl font-serif font-bold text-[#1c1917]">
                  {activePatient.emergencyContact.name}
                </h3>
                <p className="text-xs text-[#78716c] mt-0.5">
                  {activePatient.emergencyContact.relationship}
                </p>
                <p className="text-base font-mono font-bold text-[#1c1917] mt-2">
                  {activePatient.emergencyContact.phone}
                </p>
              </div>
            </div>

            <a
              href={`tel:${activePatient.emergencyContact.phone.replace(/[^0-9+]/g, '')}`}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#be123c] hover:bg-[#9f1239] text-white font-medium text-xs shadow-xs text-center transition-colors cursor-pointer"
            >
              Direct Dial Emergency Phone
            </a>
          </div>
        </div>
      )}

      {/* Caregiver Notes Board */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs">
        <div className="pb-4 border-b border-[#f2ede4]">
          <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider">
            Family Care Bulletins
          </span>
          <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
            Daily Reminders & Notes for {activePatient?.preferredName || 'Patient'}
          </h2>
          <p className="text-xs text-[#57534e] mt-1">
            Notes written here will appear directly on top of {activePatient?.preferredName || "the patient's"} daily routine screen.
          </p>
        </div>

        {/* Add Note Form or RBAC Notice */}
        {canManageCaregiver ? (
          <form onSubmit={handleCreateNote} className="mt-5 space-y-3">
            <textarea
              rows={2}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Write a message (e.g. Left a fresh water tumbler on the kitchen counter, remember to take your evening pill with dinner)..."
              className="w-full px-4 py-3 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] text-[#1c1917] text-sm placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1e3a2f] resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#57534e]">Priority:</span>
                <button
                  type="button"
                  onClick={() => setNotePriority('normal')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    notePriority === 'normal'
                      ? 'bg-[#1c1917] text-white'
                      : 'bg-[#faf8f5] text-[#57534e] border border-[#e7e2d8]'
                  }`}
                >
                  Everyday Note
                </button>
                <button
                  type="button"
                  onClick={() => setNotePriority('important')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    notePriority === 'important'
                      ? 'bg-[#c2410c] text-white'
                      : 'bg-[#faf8f5] text-[#57534e] border border-[#e7e2d8]'
                  }`}
                >
                  High-Visibility Notice
                </button>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs shadow-xs cursor-pointer"
              >
                Post Note
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-[#1c1917] block">Caregiver Authorization Required to Post</span>
              <span className="text-[#57534e]">
                Care bulletins are authored by family caregivers or clinicians. Active role is currently <strong className="font-mono text-[#1e3a2f]">{authRole}</strong>.
              </span>
            </div>
            <button
              onClick={() => switchRole('CAREGIVER')}
              className="px-3.5 py-1.5 rounded-xl bg-[#1e3a2f] text-white font-medium text-xs shadow-xs cursor-pointer whitespace-nowrap"
            >
              Authorize as Caregiver
            </button>
          </div>
        )}

        {/* Existing Notes Feed */}
        <div className="mt-6 space-y-3">
          {caregiverNotes.length === 0 ? (
            <p className="text-xs text-[#a8a29e] italic">No active notes. Leave one above.</p>
          ) : (
            caregiverNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 transition-all ${
                  note.pinned
                    ? 'bg-[#fffbeb] border-[#fde68a] text-[#78350f]'
                    : 'bg-[#faf8f5] border-[#e7e2d8] text-[#1c1917]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1c1917]">{note.caregiverName}</span>
                    <span className="text-[11px] text-[#78716c]">• {note.timestamp}</span>
                    {note.pinned && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] px-2 py-0.5 rounded-md border border-[#fde68a]">
                        Pinned Notice
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm font-medium leading-relaxed">{note.text}</p>
                </div>

                <button
                  onClick={() => deleteCaregiverNote(note.id)}
                  className="px-2 py-1 rounded-lg text-[#a8a29e] hover:text-[#b91c1c] text-xs font-medium transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Real-time Adherence Log Feed */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs">
        <div className="pb-4 border-b border-[#f2ede4]">
          <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider">
            Clinical Compliance Trail
          </span>
          <h2 className="text-xl font-serif font-bold text-[#1c1917] mt-0.5">
            Recent Dosing History & Logs
          </h2>
          <p className="text-xs text-[#57534e] mt-1">
            Recorded confirmations and skip reasons stored in the patient health ledger.
          </p>
        </div>

        <div className="mt-4 divide-y divide-[#f2ede4]">
          {adherence?.recentLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    log.action === 'taken'
                      ? 'bg-[#16a34a]'
                      : log.action === 'skipped'
                      ? 'bg-[#dc2626]'
                      : 'bg-[#d97706]'
                  }`}
                />
                <div>
                  <div className="font-semibold text-[#1c1917]">
                    {log.medicationName} <span className="font-mono text-xs text-[#78716c]">({log.dosage})</span>
                  </div>
                  <div className="text-[11px] text-[#78716c]">
                    Recorded {log.timestamp} • Scheduled for {log.scheduledFor}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`capitalize font-semibold text-xs ${
                    log.action === 'taken' ? 'text-[#166534]' : 'text-[#991b1b]'
                  }`}
                >
                  {log.action}
                </span>
                <span className="text-[11px] text-[#78716c] block">
                  by {log.loggedByName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connect Patient Modal */}
      {isLinkModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4"
          onClick={() => setIsLinkModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-[#e7e2d8] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#1c1917]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#f2ede4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
                  Care Circle
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                  Link Patient by Access Code
                </h3>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-2 py-1 rounded-lg border border-[#e7e2d8] text-xs font-semibold text-[#78716c]"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-[#57534e] mt-3 leading-relaxed">
              Enter the 6-character patient Care Circle code found on the patient&apos;s profile screen (e.g. <strong>DB-6821</strong> or <strong>DB-7204</strong>).
            </p>

            <form onSubmit={handleLinkSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#44403c] mb-1">
                  Access Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DB-7204"
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 font-mono text-base uppercase rounded-xl bg-[#faf8f5] border border-[#e7e2d8] focus:outline-none focus:border-[#1e3a2f]"
                />
              </div>

              {linkFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    linkFeedback.success
                      ? 'bg-[#dcfce7] text-[#14532d] border border-[#bbf7d0]'
                      : 'bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]'
                  }`}
                >
                  {linkFeedback.message}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#e7e2d8] text-[#57534e] font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs shadow-xs cursor-pointer"
                >
                  Connect Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
