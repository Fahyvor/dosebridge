import React, { useState } from 'react';
import { useDoseBridge } from '../../store/useDoseBridge';
import { VisualPill } from '../VisualPill';
import { PictogramBadge } from '../PictogramBadge';
import { SkipReasonModal } from '../SkipReasonModal';
import { ScheduleItem } from '../../types';

export const ScheduleTab: React.FC = () => {
  const {
    activePatient,
    schedule,
    adherence,
    caregiverNotes,
    takeDose,
    snoozeDose,
    language,
    role,
    speakText,
    pictogramMode,
    announce,
  } = useDoseBridge();

  const [skipItem, setSkipItem] = useState<{ id: string; name: string } | null>(null);

  const pinnedNote = caregiverNotes.find((n) => n.pinned) || caregiverNotes[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = activePatient?.preferredName || activePatient?.fullName?.split(' ')[0] || 'there';
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 17) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };

  const takenCount = schedule.filter((s) => s.status === 'taken').length;
  const pendingCount = schedule.filter((s) => s.status === 'pending').length;

  const slots = [
    {
      id: 'morning' as const,
      title: 'Morning Routine',
      timeSlotText: '7:00 AM – 10:00 AM',
      note: 'Best taken with your breakfast',
      slotAccent: 'border-l-amber-600',
    },
    {
      id: 'afternoon' as const,
      title: 'Afternoon Routine',
      timeSlotText: '12:00 PM – 2:00 PM',
      note: 'Best taken with lunch',
      slotAccent: 'border-l-orange-600',
    },
    {
      id: 'evening' as const,
      title: 'Evening Routine',
      timeSlotText: '6:00 PM – 7:30 PM',
      note: 'Best taken with dinner',
      slotAccent: 'border-l-indigo-600',
    },
    {
      id: 'bedtime' as const,
      title: 'Bedtime',
      timeSlotText: '9:00 PM – 10:30 PM',
      note: 'Before sleep with a glass of water',
      slotAccent: 'border-l-stone-600',
    },
  ];

  const handleSpeakInstruction = (item: ScheduleItem) => {
    if (!item.medication) return;
    const med = item.medication;
    const inst = med.instructions?.[language] || med.instructions?.en;
    const textToSpeak = `${med.name}, ${med.strength}. ${inst?.simple || inst?.standard || ''}. Scheduled for ${item.scheduledTime}.`;
    speakText(textToSpeak, language);
    announce(`Reading aloud: ${med.name}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Daily Routine Header */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-wider text-stone-500 uppercase">
              Daily Ledger • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {getGreeting()}
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              {pendingCount === 0
                ? "All set for today. All scheduled medications have been recorded."
                : `${takenCount} of ${schedule.length} doses taken. ${pendingCount} remaining today.`}
            </p>
          </div>

          {/* Habit streak */}
          <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/80 px-4 py-2.5 rounded-xl">
            <span className="font-mono text-xl font-bold text-emerald-900">
              {adherence?.streakDays || 6}d
            </span>
            <div className="text-xs">
              <span className="font-semibold text-stone-800 block">Consistency Streak</span>
              <span className="text-[11px] text-stone-500">Every dose on schedule</span>
            </div>
          </div>
        </div>

        {/* Weekly Day Tracker */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-1">
          {adherence?.weeklyBreakdown.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 min-w-[32px]">
              <span className="text-[11px] font-mono text-stone-500">{item.day}</span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold mt-1 transition-all ${
                  item.current
                    ? 'ring-2 ring-stone-900 bg-stone-100 text-stone-900 font-bold'
                    : item.pct === 100
                    ? 'bg-stone-900 text-white'
                    : item.pct > 0
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-stone-100 text-stone-400'
                }`}
                title={`${item.day}: ${item.pct}% completed`}
              >
                {item.pct === 100 ? '✓' : item.pct > 0 ? `${item.pct}%` : '·'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Family Note Card */}
      {pinnedNote && (
        <div className="bg-[#fffdf7] rounded-xl border border-amber-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-baseline justify-between gap-2 border-b border-amber-100 pb-2 mb-2">
            <span className="text-xs font-semibold text-amber-900">
              Note from {pinnedNote.caregiverName}
            </span>
            <span className="text-[11px] font-mono text-amber-700/70">{pinnedNote.timestamp}</span>
          </div>
          <p className="text-sm font-medium text-stone-800 leading-relaxed">
            &ldquo;{pinnedNote.text}&rdquo;
          </p>
        </div>
      )}

      {/* Routine Slots */}
      <div className="space-y-5">
        {slots.map((slot) => {
          const itemsInSlot = schedule.filter((s) => s.timeSlot === slot.id);
          if (itemsInSlot.length === 0) return null;

          const slotTakenCount = itemsInSlot.filter((i) => i.status === 'taken').length;

          return (
            <section
              key={slot.id}
              className={`rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-2xs border-l-4 ${slot.slotAccent}`}
            >
              {/* Slot Header */}
              <div className="px-5 py-3.5 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">
                      {slot.title}
                    </h2>
                    <span className="font-mono text-xs text-stone-500">
                      • {slot.timeSlotText}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">{slot.note}</p>
                </div>

                <span className="font-mono text-xs text-stone-600 bg-white border border-stone-200 px-2.5 py-0.5 rounded-md">
                  {slotTakenCount} / {itemsInSlot.length}
                </span>
              </div>

              {/* Medicines in Slot */}
              <div className="p-5 space-y-4 divide-y divide-stone-100">
                {itemsInSlot.map((item) => {
                  const med = item.medication;
                  if (!med) return null;

                  const inst = med.instructions?.[language] || med.instructions?.en;
                  const isTaken = item.status === 'taken';
                  const isSkipped = item.status === 'skipped';
                  const isSnoozed = item.status === 'snoozed';
                  const isPending = item.status === 'pending';

                  return (
                    <article
                      key={item.id}
                      className={`pt-4 first:pt-0 transition-opacity ${
                        isTaken ? 'opacity-85' : ''
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        {/* Pill Display + Dosage Instructions */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="shrink-0 pt-1">
                            <VisualPill
                              color={med.pillColor}
                              shape={med.pillShape}
                              form={med.form}
                              imprint={med.imprint}
                              size={pictogramMode ? 'xl' : 'lg'}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <h3 className="text-lg font-bold text-stone-900">
                                {med.name}
                              </h3>
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                                {med.strength}
                              </span>
                              <span className="text-xs text-stone-500 capitalize">{med.form}</span>

                              {/* Status Badges */}
                              {isTaken && (
                                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                                  Taken at {item.takenAt}
                                </span>
                              )}
                              {isSkipped && (
                                <span className="text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                                  Skipped: {item.skipReason || 'Recorded'}
                                </span>
                              )}
                              {isSnoozed && (
                                <span className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                                  Snoozed until {item.snoozedUntil}
                                </span>
                              )}
                            </div>

                            {/* Human instruction text */}
                            <p className="mt-1 text-sm font-medium text-stone-700 leading-relaxed">
                              {inst?.simple || inst?.standard || 'Take as directed.'}
                            </p>

                            {/* Purpose & Pronunciation */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-stone-500">
                              {inst?.purpose && (
                                <span className="text-stone-700">
                                  {inst.purpose}
                                </span>
                              )}
                              {inst?.phonetic && (
                                <span className="font-mono text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                                  Say: &ldquo;{inst.phonetic}&rdquo;
                                </span>
                              )}
                            </div>

                            {/* Visual Pictogram Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                              {med.foodRule === 'with_food' && (
                                <PictogramBadge type="with_food" size={pictogramMode ? 'lg' : 'sm'} />
                              )}
                              {med.foodRule === 'empty_stomach' && (
                                <PictogramBadge type="empty_stomach" size={pictogramMode ? 'lg' : 'sm'} />
                              )}
                              {med.waterRule === 'full_glass' && (
                                <PictogramBadge type="full_glass" size={pictogramMode ? 'lg' : 'sm'} />
                              )}
                              <PictogramBadge type={slot.id} size={pictogramMode ? 'lg' : 'sm'} />
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 mt-3 lg:mt-0">
                          {/* Speak aloud */}
                          <button
                            onClick={() => handleSpeakInstruction(item)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                            title="Hear instructions spoken out loud"
                            aria-label={`Listen to instructions for ${med.name}`}
                          >
                            Listen
                          </button>

                          {(isPending || isSnoozed) && (
                            <>
                              <button
                                onClick={() => snoozeDose(item.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
                                title="Wait 15 minutes before reminding again"
                              >
                                15m
                              </button>

                              <button
                                onClick={() => setSkipItem({ id: item.id, name: med.name })}
                                className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-800 text-xs font-medium transition-colors cursor-pointer"
                                title="Record why this pill could not be taken"
                              >
                                Skip
                              </button>

                              <button
                                onClick={() => takeDose(item.id)}
                                className="flex-1 sm:flex-initial px-4 py-1.5 rounded-lg bg-[#1e3a2f] hover:bg-[#152921] text-white font-semibold text-xs transition-transform active:scale-95 cursor-pointer"
                                aria-label={`Confirm taking ${med.name}`}
                              >
                                {role === 'caregiver' ? 'Help Take Dose' : 'Mark Taken'}
                              </button>
                            </>
                          )}

                          {isTaken && (
                            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Skip Reason Dialog */}
      {skipItem && (
        <SkipReasonModal
          scheduleId={skipItem.id}
          medicationName={skipItem.name}
          onClose={() => setSkipItem(null)}
        />
      )}
    </div>
  );
};
