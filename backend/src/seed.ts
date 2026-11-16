import { prisma } from './lib/prisma.js';

async function seed() {
  console.log('Seeding SQLite database with real clinical data...');

  // Clean old data
  await prisma.caregiverNote.deleteMany();
  await prisma.adherenceLog.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.medication.deleteMany();
  await prisma.caregiver.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.educationalArticle.deleteMany();

  // 1. Seed Patients
  const eleanor = await prisma.patient.create({
    data: {
      id: 'pat-1',
      fullName: 'Eleanor Vance',
      preferredName: 'Eleanor',
      age: 68,
      gender: 'Female',
      primaryLanguage: 'en',
      literacyMode: 'simple',
      accessCode: 'DB-6821',
      conditions: JSON.stringify(['Type 2 Diabetes Mellitus', 'Essential Hypertension', 'Mild Knee Osteoarthritis']),
      allergies: JSON.stringify(['Penicillin', 'Sulfonamides']),
      emergencyName: 'David Vance',
      emergencyRelationship: 'Son & Primary Caregiver',
      emergencyPhone: '+1 (555) 234-5678',
    },
  });

  const mateo = await prisma.patient.create({
    data: {
      id: 'pat-2',
      fullName: 'Don Mateo Hernandez',
      preferredName: 'Mateo',
      age: 72,
      gender: 'Male',
      primaryLanguage: 'es',
      literacyMode: 'simple',
      accessCode: 'DB-7204',
      conditions: JSON.stringify(['Hypercholesterolemia', 'Primary Open-Angle Glaucoma']),
      allergies: JSON.stringify(['Aspirin (Acetylsalicylic Acid)', 'NSAIDs']),
      emergencyName: 'Sofia Hernandez',
      emergencyRelationship: 'Daughter',
      emergencyPhone: '+1 (555) 876-5432',
    },
  });

  // 2. Seed Caregivers
  await prisma.caregiver.create({
    data: {
      id: 'cg-1',
      name: 'David Vance',
      relationship: 'Son',
      phone: '+1 (555) 234-5678',
      email: 'david.vance@example.com',
      patientId: eleanor.id,
    },
  });

  await prisma.caregiver.create({
    data: {
      id: 'cg-2',
      name: 'Sofia Hernandez',
      relationship: 'Daughter',
      phone: '+1 (555) 876-5432',
      email: 'sofia.h@example.com',
      patientId: mateo.id,
    },
  });

  // 3. Seed Medications for Eleanor
  const med1 = await prisma.medication.create({
    data: {
      id: 'med-1',
      patientId: eleanor.id,
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      strength: '500 mg',
      form: 'tablet',
      pillColor: '#f1f5f9',
      pillShape: 'oval',
      imprint: 'M 500',
      timesPerDay: 2,
      scheduledTimes: JSON.stringify(['08:00 AM', '06:30 PM']),
      timeSlots: JSON.stringify(['morning', 'evening']),
      foodRule: 'with_food',
      waterRule: 'full_glass',
      warnings: JSON.stringify([
        'Take with meals to prevent stomach discomfort',
        'Do not drink heavy alcohol while on this medicine',
        'Swallow whole with a full glass of water',
      ]),
      totalPills: 60,
      pillsRemaining: 14,
      refillThreshold: 10,
      prescribingDoctor: 'Dr. Sarah Chen, MD (Endocrinology)',
      doctorPhone: '+1 (555) 432-1098',
      pharmacyName: 'Community Health Pharmacy #12',
      rxNumber: 'RX-994821',
      instructions: JSON.stringify({
        en: {
          standard: 'Take 1 tablet by mouth twice daily with meals to lower blood glucose.',
          simple: 'Take 1 white oval pill with breakfast and 1 with dinner. Eat food first so your tummy feels settled. Drink a full glass of water.',
          phonetic: 'met-FOR-min hye-droe-KLOR-ide',
          purpose: 'Helps balance healthy blood sugar levels for diabetes.',
        },
        es: {
          standard: 'Tome 1 tableta por vía oral dos veces al día con las comidas para controlar la glucosa.',
          simple: 'Tome 1 pastilla blanca ovalada con su desayuno y 1 con su cena. Coma alimentos primero para proteger su estómago.',
          phonetic: 'met-for-MEE-na',
          purpose: 'Ayuda a regular los niveles de azúcar en la sangre.',
        },
      }),
    },
  });

  const med2 = await prisma.medication.create({
    data: {
      id: 'med-2',
      patientId: eleanor.id,
      name: 'Lisinopril',
      genericName: 'Lisinopril Dihydrate',
      strength: '10 mg',
      form: 'tablet',
      pillColor: '#f97316',
      pillShape: 'round',
      imprint: 'L 10',
      timesPerDay: 1,
      scheduledTimes: JSON.stringify(['08:00 AM']),
      timeSlots: JSON.stringify(['morning']),
      foodRule: 'no_restriction',
      waterRule: 'full_glass',
      warnings: JSON.stringify([
        'Take every morning at the same hour',
        'Stand up slowly from sitting or lying down to avoid dizziness',
      ]),
      totalPills: 30,
      pillsRemaining: 4, // triggers refill threshold 5
      refillThreshold: 5,
      prescribingDoctor: 'Dr. Marcus Vance, MD (Cardiology)',
      doctorPhone: '+1 (555) 678-9012',
      pharmacyName: 'Community Health Pharmacy #12',
      rxNumber: 'RX-882190',
      instructions: JSON.stringify({
        en: {
          standard: 'Take 1 tablet by mouth daily in the morning for blood pressure management.',
          simple: 'Take 1 round orange pill every morning with water. It keeps your blood pressure safe and relaxes your heart.',
          phonetic: 'lye-SIN-oh-pril',
          purpose: 'Lowers high blood pressure and protects your heart.',
        },
        es: {
          standard: 'Tome 1 tableta por vía oral diariamente por la mañana para la presión arterial.',
          simple: 'Tome 1 pastilla redonda naranja cada mañana con agua. Mantiene su corazón tranquilo y su presión baja.',
          phonetic: 'li-si-no-PRIL',
          purpose: 'Baja la presión arterial alta y cuida su corazón.',
        },
      }),
    },
  });

  const med3 = await prisma.medication.create({
    data: {
      id: 'med-3',
      patientId: eleanor.id,
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      strength: '20 mg',
      form: 'tablet',
      pillColor: '#e2e8f0',
      pillShape: 'oval',
      imprint: 'AT 20',
      timesPerDay: 1,
      scheduledTimes: JSON.stringify(['09:30 PM']),
      timeSlots: JSON.stringify(['bedtime']),
      foodRule: 'no_restriction',
      waterRule: 'normal',
      warnings: JSON.stringify([
        'Take once daily at bedtime',
        'Avoid drinking fresh grapefruit juice while on this medication',
      ]),
      totalPills: 30,
      pillsRemaining: 21,
      refillThreshold: 7,
      prescribingDoctor: 'Dr. Marcus Vance, MD (Cardiology)',
      doctorPhone: '+1 (555) 678-9012',
      pharmacyName: 'Community Health Pharmacy #12',
      rxNumber: 'RX-773104',
      instructions: JSON.stringify({
        en: {
          standard: 'Take 1 tablet by mouth daily at bedtime to reduce cholesterol.',
          simple: 'Take 1 white oval pill at night before going to bed. Avoid grapefruit while on this medicine.',
          phonetic: 'a-TOR-va-sta-tin',
          purpose: 'Protects blood vessels and keeps cholesterol healthy.',
        },
        es: {
          standard: 'Tome 1 tableta diaria por la noche al acostarse.',
          simple: 'Tome 1 pastilla ovalada blanca por la noche antes de acostarse. Evite la toronja.',
          phonetic: 'a-tor-va-sta-TEE-na',
          purpose: 'Protege las arterias y baja el colesterol.',
        },
      }),
    },
  });

  // 4. Seed Schedule Items
  await prisma.scheduleItem.create({
    data: {
      id: 'sched-1',
      patientId: eleanor.id,
      medicationId: med1.id,
      timeSlot: 'morning',
      scheduledTime: '08:00 AM',
      status: 'taken',
      takenAt: '08:12 AM',
      loggedBy: 'patient',
      loggedByName: 'Eleanor Vance',
    },
  });

  await prisma.scheduleItem.create({
    data: {
      id: 'sched-2',
      patientId: eleanor.id,
      medicationId: med2.id,
      timeSlot: 'morning',
      scheduledTime: '08:00 AM',
      status: 'taken',
      takenAt: '08:12 AM',
      loggedBy: 'patient',
      loggedByName: 'Eleanor Vance',
    },
  });

  await prisma.scheduleItem.create({
    data: {
      id: 'sched-3',
      patientId: eleanor.id,
      medicationId: med1.id,
      timeSlot: 'evening',
      scheduledTime: '06:30 PM',
      status: 'pending',
    },
  });

  await prisma.scheduleItem.create({
    data: {
      id: 'sched-4',
      patientId: eleanor.id,
      medicationId: med3.id,
      timeSlot: 'bedtime',
      scheduledTime: '09:30 PM',
      status: 'pending',
    },
  });

  // 5. Seed Caregiver Notes
  await prisma.caregiverNote.create({
    data: {
      id: 'note-1',
      patientId: eleanor.id,
      caregiverId: 'cg-1',
      caregiverName: 'David Vance (Son)',
      text: 'Good morning Mom! I placed a fresh pitcher of ice water on your kitchen table. Remember to take your morning pill after eating your oatmeal! ❤️',
      timestamp: 'Today at 7:15 AM',
      pinned: true,
      priority: 'important',
    },
  });

  await prisma.caregiverNote.create({
    data: {
      id: 'note-2',
      patientId: eleanor.id,
      caregiverId: 'cg-1',
      caregiverName: 'David Vance (Son)',
      text: 'Dr. Sarah Chen scheduled a follow-up review for next Tuesday at 10:30 AM. I will pick you up at 9:45 AM.',
      timestamp: 'Yesterday at 4:20 PM',
      pinned: false,
      priority: 'normal',
    },
  });

  // 6. Seed Adherence Logs
  await prisma.adherenceLog.create({
    data: {
      id: 'log-1',
      patientId: eleanor.id,
      medicationName: 'Metformin',
      dosage: '500 mg',
      action: 'taken',
      timestamp: 'Today at 08:12 AM',
      scheduledFor: '08:00 AM',
      loggedBy: 'patient',
      loggedByName: 'Eleanor Vance',
    },
  });

  await prisma.adherenceLog.create({
    data: {
      id: 'log-2',
      patientId: eleanor.id,
      medicationName: 'Lisinopril',
      dosage: '10 mg',
      action: 'taken',
      timestamp: 'Today at 08:12 AM',
      scheduledFor: '08:00 AM',
      loggedBy: 'patient',
      loggedByName: 'Eleanor Vance',
    },
  });

  await prisma.adherenceLog.create({
    data: {
      id: 'log-3',
      patientId: eleanor.id,
      medicationName: 'Metformin',
      dosage: '500 mg',
      action: 'taken',
      timestamp: 'Yesterday at 06:45 PM',
      scheduledFor: '06:30 PM',
      loggedBy: 'patient',
      loggedByName: 'Eleanor Vance',
    },
  });

  // 7. Seed Educational Articles
  await prisma.educationalArticle.create({
    data: {
      id: 'edu-1',
      category: 'instructions',
      title: JSON.stringify({
        en: 'How to Read Your Pill Bottle Without Getting Confused',
        es: 'Cómo leer la etiqueta de su receta médica claramente',
        fr: 'Comment lire clairement l’étiquette de votre ordonnance',
      }),
      summary: JSON.stringify({
        en: 'Learn what the Rx number, dosage numbers, and warning symbols mean on your prescription bottle.',
        es: 'Aprenda qué significan el número de receta, las dosis y los símbolos de advertencia.',
        fr: 'Comprenez le numéro d’ordonnance, les dosages et les symboles d’alerte.',
      }),
      simpleContent: JSON.stringify({
        en: `1. Medication Name: Tells you what medicine is inside. If there are two names, one is the brand name and one is the generic active ingredient.\n2. Directions: Look for words like "Take 1 tablet by mouth daily". Follow the exact count.\n3. Rx Number: This is your unique ID number for this prescription bottle. Give this number to the pharmacy when you need a refill.\n4. Warning Stickers: Bright yellow or red stickers tell you if you must take it with food, avoid alcohol, or avoid sunlight.`,
      }),
      keyTakeaways: JSON.stringify([
        'Always verify both brand and generic names',
        'The Rx number is all you need for easy pharmacy refills',
        'Colored stickers contain vital safety warnings',
      ]),
      readTime: '3 min read',
      iconName: 'FaPrescriptionBottleAlt',
    },
  });

  await prisma.educationalArticle.create({
    data: {
      id: 'edu-2',
      category: 'safety',
      title: JSON.stringify({
        en: 'What to Do If You Forgot Your Morning Pill',
        es: 'Qué hacer si olvidó tomar su medicamento a tiempo',
        fr: 'Que faire en cas d’oubli d’une prise de médicament',
      }),
      summary: JSON.stringify({
        en: 'Simple rules for safely handling a missed pill — and why you should never take a double dose.',
        es: 'Reglas sencillas para manejar una dosis olvidada sin peligro.',
        fr: 'Directives claires pour gérer un oubli sans danger.',
      }),
      simpleContent: JSON.stringify({
        en: `Rule #1: Never take two pills at once to make up for a missed one! Taking double medication can cause unexpected drops in blood pressure or blood sugar.\n\nRule #2: If it is only an hour or two late, take the pill as soon as you remember. But if it is almost time for your next scheduled pill, skip the missed one completely and stay on your normal routine.`,
      }),
      keyTakeaways: JSON.stringify([
        'Never take two doses at the same time to compensate',
        'Call your pharmacy or caregiver if you are unsure',
        'Keep your pills in sight to build a daily habit',
      ]),
      readTime: '2 min read',
      iconName: 'FaClockRotateLeft',
    },
  });

  await prisma.educationalArticle.create({
    data: {
      id: 'edu-3',
      category: 'interactions',
      title: JSON.stringify({
        en: 'Why Taking Medicines With Food Actually Matters',
        es: 'Por qué tomar medicamentos con alimentos realmente importa',
        fr: 'Pourquoi la prise avec nourriture est essentielle',
      }),
      summary: JSON.stringify({
        en: 'Learn how food protects your stomach lining and helps certain pills absorb smoothly.',
        es: 'Aprenda cómo los alimentos protegen su estómago y mejoran la absorción.',
        fr: 'Découvrez comment les repas protègent votre estomac.',
      }),
      simpleContent: JSON.stringify({
        en: `Some medicines, like Metformin or pain relievers, can irritate an empty stomach. Eating a slice of toast, a bowl of oatmeal, or having a meal creates a protective cushion in your stomach. It also slows absorption just enough so you don't feel nauseous or dizzy.`,
      }),
      keyTakeaways: JSON.stringify([
        'A simple snack is enough to protect your stomach',
        'Always drink a full glass of water with pills',
        'Check bottle labels for food instructions',
      ]),
      readTime: '3 min read',
      iconName: 'FaUtensils',
    },
  });

  console.log('Database seeded successfully with authentic clinical data!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
