import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  fetchPatients,
  setActivePatient as setActivePatientAction,
  updatePatientProfile,
  registerPatientProfile,
  linkPatientByAccessCode,
} from './slices/patientSlice';
import {
  fetchMedications,
  addNewMedication as addMedAction,
  updateExistingMedication,
  deleteExistingMedication,
  refillExistingMedication,
} from './slices/medicationSlice';
import {
  fetchSchedule,
  logDoseAction,
  resetSchedule,
  setActiveAlarmItem,
} from './slices/scheduleSlice';
import { fetchAdherence } from './slices/adherenceSlice';
import {
  fetchCaregiverNotes,
  fetchCaregiverAlerts,
  fetchCaregiverPatients,
  addCaregiverNote as addNoteAction,
  deleteCaregiverNote as deleteNoteAction,
} from './slices/caregiverSlice';
import {
  setFontSize,
  setTheme,
  setDyslexicFont,
  setPictogramMode,
  setSpeechRate,
  setAutoReadEnabled,
  setSoundEffectsEnabled,
  setIsSpeaking,
  setSpeakingText,
  announce as announceAction,
  syncAccessibilityDom,
} from './slices/accessibilitySlice';
import {
  setRole as setRoleAction,
  setLanguage as setLanguageAction,
  setActiveTab as setActiveTabAction,
  setPrintModalOpen,
  openSkipModal,
  closeSkipModal,
} from './slices/uiSlice';
import { speechService } from '../services/speech';
import { playSuccessChime, playReminderAlarm, playTapTone } from '../services/sound';
import {
  UserRole,
  Language,
  FontSize,
  ContrastTheme,
  PatientProfile,
  Medication,
  ScheduleItem,
} from '../types';

export const useDoseBridge = () => {
  const dispatch = useAppDispatch();

  // Redux state
  const patientsState = useAppSelector((state) => state.patients);
  const medicationsState = useAppSelector((state) => state.medications);
  const scheduleState = useAppSelector((state) => state.schedule);
  const adherenceState = useAppSelector((state) => state.adherence);
  const caregiverState = useAppSelector((state) => state.caregiver);
  const accessibilityState = useAppSelector((state) => state.accessibility);
  const uiState = useAppSelector((state) => state.ui);

  const activePatient = patientsState.activePatient;
  const patients = patientsState.patients;
  const medications = medicationsState.medications;
  const schedule = scheduleState.schedule;
  const adherence = adherenceState.adherence;
  const caregiverNotes = caregiverState.notes;
  const caregiverAlerts = caregiverState.alerts;
  const linkedCaregiverPatients = caregiverState.linkedPatients;

  const role = uiState.role;
  const language = uiState.language;
  const activeTab = uiState.activeTab;
  const isPrintModalOpen = uiState.isPrintModalOpen;
  const isSkipModalOpen = uiState.isSkipModalOpen;
  const skipTargetItem = uiState.skipTargetItem;
  const activeAlarmItem = scheduleState.activeAlarmItem;

  const loading =
    patientsState.loading ||
    medicationsState.loading ||
    scheduleState.loading;

  // Sound effects
  const playChime = useCallback(() => {
    if (accessibilityState.soundEffectsEnabled) playSuccessChime();
  }, [accessibilityState.soundEffectsEnabled]);

  const playAlarm = useCallback(() => {
    if (accessibilityState.soundEffectsEnabled) playReminderAlarm();
  }, [accessibilityState.soundEffectsEnabled]);

  const playTap = useCallback(() => {
    if (accessibilityState.soundEffectsEnabled) playTapTone();
  }, [accessibilityState.soundEffectsEnabled]);

  const announce = useCallback(
    (msg: string) => {
      dispatch(announceAction(msg));
    },
    [dispatch]
  );

  // Sync DOM classes whenever theme / font size / dyslexic changes
  useEffect(() => {
    syncAccessibilityDom({
      fontSize: accessibilityState.fontSize,
      theme: accessibilityState.theme,
      dyslexicFont: accessibilityState.dyslexicFont,
    });
  }, [accessibilityState.fontSize, accessibilityState.theme, accessibilityState.dyslexicFont]);

  // Initial load: Fetch real patients from API into Redux
  const refreshData = useCallback(async () => {
    const patientsRes = await dispatch(fetchPatients()).unwrap();
    const targetPatient = activePatient
      ? patientsRes.find((p) => p.id === activePatient.id) || patientsRes[0]
      : patientsRes[0];

    if (targetPatient) {
      await Promise.all([
        dispatch(fetchMedications(targetPatient.id)),
        dispatch(fetchSchedule(targetPatient.id)),
        dispatch(fetchAdherence(targetPatient.id)),
        dispatch(fetchCaregiverNotes(targetPatient.id)),
        dispatch(fetchCaregiverAlerts(targetPatient.id)),
        dispatch(fetchCaregiverPatients('cg-1')),
      ]);
    }
  }, [dispatch, activePatient]);

  // Handle patient switch
  const selectPatient = useCallback(
    async (pat: PatientProfile) => {
      dispatch(setActivePatientAction(pat));
      playTap();
      announce(`Selected patient ${pat.fullName}`);
      await Promise.all([
        dispatch(fetchMedications(pat.id)),
        dispatch(fetchSchedule(pat.id)),
        dispatch(fetchAdherence(pat.id)),
        dispatch(fetchCaregiverNotes(pat.id)),
        dispatch(fetchCaregiverAlerts(pat.id)),
      ]);
    },
    [dispatch, playTap, announce]
  );

  // Speech controls
  const speakText = useCallback(
    (text: string, lang: Language = language) => {
      dispatch(setSpeakingText(text));
      speechService.speak(text, lang, accessibilityState.speechRate, {
        onStart: () => dispatch(setIsSpeaking(true)),
        onEnd: () => {
          dispatch(setIsSpeaking(false));
          dispatch(setSpeakingText(''));
        },
        onError: () => {
          dispatch(setIsSpeaking(false));
          dispatch(setSpeakingText(''));
        },
      });
    },
    [dispatch, language, accessibilityState.speechRate]
  );

  const stopSpeaking = useCallback(() => {
    speechService.stop();
    dispatch(setIsSpeaking(false));
    dispatch(setSpeakingText(''));
  }, [dispatch]);

  const pauseSpeaking = useCallback(() => {
    speechService.pause();
  }, []);

  const resumeSpeaking = useCallback(() => {
    speechService.resume();
  }, []);

  // Dose actions
  const takeDose = useCallback(
    async (scheduleId: string) => {
      if (!activePatient) return;
      const loggedByName = role === 'caregiver' ? 'David Vance (Caregiver)' : activePatient.fullName;
      const res = await dispatch(
        logDoseAction({
          scheduleId,
          action: 'taken',
          loggedBy: role,
          loggedByName,
        })
      ).unwrap();

      playChime();
      announce(res.res.message);
      // Refresh adherence & medications to reflect pill decrement
      dispatch(fetchAdherence(activePatient.id));
      dispatch(fetchMedications(activePatient.id));
    },
    [dispatch, activePatient, role, playChime, announce]
  );

  const skipDose = useCallback(
    async (scheduleId: string, reason: string) => {
      if (!activePatient) return;
      const loggedByName = role === 'caregiver' ? 'David Vance (Caregiver)' : activePatient.fullName;
      const res = await dispatch(
        logDoseAction({
          scheduleId,
          action: 'skipped',
          reason,
          loggedBy: role,
          loggedByName,
        })
      ).unwrap();

      announce(res.res.message);
      dispatch(fetchAdherence(activePatient.id));
    },
    [dispatch, activePatient, role, announce]
  );

  const snoozeDose = useCallback(
    async (scheduleId: string) => {
      if (!activePatient) return;
      const loggedByName = role === 'caregiver' ? 'David Vance (Caregiver)' : activePatient.fullName;
      const res = await dispatch(
        logDoseAction({
          scheduleId,
          action: 'snoozed',
          loggedBy: role,
          loggedByName,
        })
      ).unwrap();

      announce(res.res.message);
    },
    [dispatch, activePatient, role, announce]
  );

  const resetTodaySchedule = useCallback(async () => {
    if (!activePatient) return;
    await dispatch(resetSchedule(activePatient.id));
    playTap();
    announce('Daily schedule reset to pending');
    dispatch(fetchAdherence(activePatient.id));
  }, [dispatch, activePatient, playTap, announce]);

  // Medication actions
  const addNewMedication = useCallback(
    async (med: Partial<Medication>) => {
      if (!activePatient) return;
      await dispatch(addMedAction({ ...med, patientId: activePatient.id })).unwrap();
      playChime();
      announce(`Added medication ${med.name}`);
      // Refresh schedule to reflect newly scheduled doses
      dispatch(fetchSchedule(activePatient.id));
    },
    [dispatch, activePatient, playChime, announce]
  );

  const updateMedication = useCallback(
    async (id: string, updates: Partial<Medication>) => {
      await dispatch(updateExistingMedication({ id, updates })).unwrap();
      announce('Medication updated');
      if (activePatient) dispatch(fetchSchedule(activePatient.id));
    },
    [dispatch, activePatient, announce]
  );

  const deleteMedication = useCallback(
    async (id: string) => {
      await dispatch(deleteExistingMedication(id)).unwrap();
      announce('Medication removed');
      if (activePatient) dispatch(fetchSchedule(activePatient.id));
    },
    [dispatch, activePatient, announce]
  );

  const refillMedication = useCallback(
    async (id: string): Promise<string> => {
      const res = await dispatch(refillExistingMedication({ id })).unwrap();
      playChime();
      announce(res.message);
      return res.message;
    },
    [dispatch, playChime, announce]
  );

  // Caregiver notes & connection
  const addCaregiverNote = useCallback(
    async (text: string, priority: 'normal' | 'important' | 'emergency' = 'normal') => {
      if (!activePatient) return;
      await dispatch(
        addNoteAction({
          patientId: activePatient.id,
          text,
          priority,
          caregiverName: 'David Vance (Caregiver)',
        })
      ).unwrap();
      playChime();
      announce('Caregiver note posted');
    },
    [dispatch, activePatient, playChime, announce]
  );

  const deleteCaregiverNote = useCallback(
    async (id: string) => {
      await dispatch(deleteNoteAction(id)).unwrap();
      announce('Note removed');
    },
    [dispatch, announce]
  );

  const linkNewPatient = useCallback(
    async (code: string) => {
      const res = await dispatch(linkPatientByAccessCode({ code })).unwrap();
      playChime();
      announce(res.message);
      return res;
    },
    [dispatch, playChime, announce]
  );

  // Alarm Simulator
  const triggerAlarmSimulation = useCallback(
    (item: ScheduleItem) => {
      dispatch(setActiveAlarmItem(item));
      playAlarm();
      announce(`Medication Reminder Alert for ${item.medication?.name || 'Medication'}`);
    },
    [dispatch, playAlarm, announce]
  );

  const dismissAlarm = useCallback(() => {
    dispatch(setActiveAlarmItem(null));
  }, [dispatch]);

  // Profile management
  const updateCurrentPatient = useCallback(
    async (updates: Partial<PatientProfile>) => {
      if (!activePatient) return;
      await dispatch(updatePatientProfile({ id: activePatient.id, updates })).unwrap();
      announce('Patient profile updated');
    },
    [dispatch, activePatient, announce]
  );

  const registerNewPatient = useCallback(
    async (profile: Partial<PatientProfile>) => {
      const created = await dispatch(registerPatientProfile(profile)).unwrap();
      playChime();
      announce(`Patient ${created.fullName} registered successfully!`);
      await Promise.all([
        dispatch(fetchMedications(created.id)),
        dispatch(fetchSchedule(created.id)),
        dispatch(fetchAdherence(created.id)),
      ]);
    },
    [dispatch, playChime, announce]
  );

  // UI helpers
  const handleSetRole = useCallback(
    (newRole: UserRole) => {
      dispatch(setRoleAction(newRole));
      playTap();
      announce(`Switched to ${newRole === 'patient' ? 'Patient' : 'Caregiver'} mode`);
    },
    [dispatch, playTap, announce]
  );

  const handleSetLanguage = useCallback(
    (newLang: Language) => {
      dispatch(setLanguageAction(newLang));
      playTap();
      announce('Language changed');
    },
    [dispatch, playTap, announce]
  );

  const handleSetActiveTab = useCallback(
    (tab: 'schedule' | 'medications' | 'caregiver' | 'resources' | 'profile') => {
      dispatch(setActiveTabAction(tab));
      playTap();
    },
    [dispatch, playTap]
  );

  return {
    // Redux State
    role,
    setRole: handleSetRole,
    language,
    setLanguage: handleSetLanguage,
    activeTab,
    setActiveTab: handleSetActiveTab,
    patients,
    activePatient,
    setActivePatient: selectPatient,
    medications,
    schedule,
    adherence,
    caregiverNotes,
    caregiverAlerts,
    linkedCaregiverPatients,
    loading,
    refreshData,

    // Dose actions
    takeDose,
    skipDose,
    snoozeDose,
    resetTodaySchedule,

    // Medication CRUD
    addNewMedication,
    updateMedication,
    deleteMedication,
    refillMedication,

    // Caregiver
    addCaregiverNote,
    deleteCaregiverNote,
    linkNewPatient,

    // Alarm
    activeAlarmItem,
    triggerAlarmSimulation,
    dismissAlarm,

    // Profile
    updateCurrentPatient,
    registerNewPatient,

    // Accessibility state & controls
    fontSize: accessibilityState.fontSize,
    setFontSize: (size: FontSize) => dispatch(setFontSize(size)),
    theme: accessibilityState.theme,
    setTheme: (t: ContrastTheme) => dispatch(setTheme(t)),
    dyslexicFont: accessibilityState.dyslexicFont,
    setDyslexicFont: (val: boolean) => dispatch(setDyslexicFont(val)),
    pictogramMode: accessibilityState.pictogramMode,
    setPictogramMode: (val: boolean) => dispatch(setPictogramMode(val)),
    speechRate: accessibilityState.speechRate,
    setSpeechRate: (rate: number) => dispatch(setSpeechRate(rate)),
    autoReadEnabled: accessibilityState.autoReadEnabled,
    setAutoReadEnabled: (val: boolean) => dispatch(setAutoReadEnabled(val)),
    soundEffectsEnabled: accessibilityState.soundEffectsEnabled,
    setSoundEffectsEnabled: (val: boolean) => dispatch(setSoundEffectsEnabled(val)),
    isSpeaking: accessibilityState.isSpeaking,
    speakingText: accessibilityState.speakingText,
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    playChime,
    playAlarm,
    playTap,
    announcement: accessibilityState.announcement,
    announce,

    // UI Modals
    isPrintModalOpen,
    setPrintModalOpen: (open: boolean) => dispatch(setPrintModalOpen(open)),
    isSkipModalOpen,
    skipTargetItem,
    openSkipModal: (target: { id: string; name: string }) => dispatch(openSkipModal(target)),
    closeSkipModal: () => dispatch(closeSkipModal()),
  };
};
