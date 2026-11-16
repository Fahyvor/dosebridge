export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection' | 'drops';
  pillColor: string;
  pillShape: 'round' | 'capsule' | 'oval' | 'square';
  imprint?: string;
  timesPerDay: number;
  scheduledTimes: string[]; // e.g. ["08:00", "20:00"]
  timeSlots: ('morning' | 'afternoon' | 'evening' | 'bedtime')[];
  foodRule: 'with_food' | 'empty_stomach' | 'after_food' | 'no_restriction';
  waterRule: 'full_glass' | 'normal';
  warnings: string[];
  totalPills: number;
  pillsRemaining: number;
  refillThreshold: number;
  prescribingDoctor: string;
  doctorPhone: string;
  pharmacyName: string;
  rxNumber: string;
  instructions: {
    en: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    es: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    fr: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    yo: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    ar: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    zh: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    hi: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    sw: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
    de: {
      standard: string;
      simple: string;
      phonetic: string;
      purpose: string;
    };
  };
}

export interface ScheduleItem {
  id: string;
  medicationId: string;
  patientId: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  scheduledTime: string; // e.g. "08:00 AM"
  status: 'pending' | 'taken' | 'snoozed' | 'skipped';
  takenAt?: string;
  skipReason?: string;
  snoozedUntil?: string;
  loggedBy?: 'patient' | 'caregiver';
  loggedByName?: string;
}

export interface AdherenceLog {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  action: 'taken' | 'skipped' | 'snoozed';
  timestamp: string;
  scheduledFor: string;
  loggedBy: 'patient' | 'caregiver';
  loggedByName: string;
  notes?: string;
}

export interface CaregiverNote {
  id: string;
  patientId: string;
  caregiverId: string;
  caregiverName: string;
  text: string;
  timestamp: string;
  pinned: boolean;
  priority: 'normal' | 'important' | 'emergency';
}

export interface PatientProfile {
  id: string;
  fullName: string;
  preferredName: string;
  age: number;
  gender: string;
  primaryLanguage: 'en' | 'es' | 'fr' | 'yo' | 'ar' | 'zh' | 'hi' | 'sw' | 'de';
  literacyMode: 'simple' | 'standard' | 'pictogram';
  accessCode: string; // for caregiver linking
  conditions: string[];
  allergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  caregivers: {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }[];
}

export interface EducationalArticle {
  id: string;
  category: 'safety' | 'instructions' | 'interactions' | 'storage' | 'emergency';
  title: {
    en: string;
    es: string;
    fr: string;
    yo: string;
    ar: string;
    zh: string;
  };
  summary: {
    en: string;
    es: string;
    fr: string;
    yo: string;
    ar: string;
    zh: string;
  };
  simpleContent: {
    en: string;
    es: string;
    fr: string;
    yo: string;
    ar: string;
    zh: string;
  };
  keyTakeaways: string[];
  readTime: string;
  iconName: string;
}

export const samplePatients: PatientProfile[] = [
  {
    id: 'pat-1',
    fullName: 'Eleanor Vance',
    preferredName: 'Mama Eleanor',
    age: 68,
    gender: 'Female',
    primaryLanguage: 'en',
    literacyMode: 'simple',
    accessCode: 'DB-6821',
    conditions: ['Type 2 Diabetes', 'Hypertension (High Blood Pressure)', 'Mild Arthritis'],
    allergies: ['Penicillin', 'Sulfa drugs'],
    emergencyContact: {
      name: 'David Vance (Son)',
      relationship: 'Son & Primary Caregiver',
      phone: '+1 (555) 234-5678',
    },
    caregivers: [
      {
        id: 'cg-1',
        name: 'David Vance',
        relationship: 'Son',
        phone: '+1 (555) 234-5678',
        email: 'david.vance@example.com',
      },
    ],
  },
  {
    id: 'pat-2',
    fullName: 'Mateo Hernandez',
    preferredName: 'Don Mateo',
    age: 72,
    gender: 'Male',
    primaryLanguage: 'es',
    literacyMode: 'simple',
    accessCode: 'DB-7204',
    conditions: ['Hypercholesterolemia', 'Glaucoma'],
    allergies: ['Aspirin'],
    emergencyContact: {
      name: 'Sofia Hernandez',
      relationship: 'Daughter',
      phone: '+1 (555) 876-5432',
    },
    caregivers: [
      {
        id: 'cg-2',
        name: 'Sofia Hernandez',
        relationship: 'Daughter',
        phone: '+1 (555) 876-5432',
        email: 'sofia.h@example.com',
      },
    ],
  },
];

export const sampleMedications: Medication[] = [
  {
    id: 'med-1',
    patientId: 'pat-1',
    name: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    strength: '500 mg',
    form: 'tablet',
    pillColor: '#ffffff',
    pillShape: 'oval',
    imprint: 'M 500',
    timesPerDay: 2,
    scheduledTimes: ['08:00 AM', '06:30 PM'],
    timeSlots: ['morning', 'evening'],
    foodRule: 'with_food',
    waterRule: 'full_glass',
    warnings: ['Take with breakfast & dinner', 'Do not drink heavy alcohol', 'Swallow whole with water'],
    totalPills: 60,
    pillsRemaining: 14,
    refillThreshold: 10,
    prescribingDoctor: 'Dr. Sarah Chen, MD (Endocrinology)',
    doctorPhone: '+1 (555) 432-1098',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-994821',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth twice daily with meals to lower blood glucose.',
        simple: 'Take 1 white oval pill with your breakfast and 1 with your dinner. Always eat food first so your tummy feels good. Drink a full glass of water.',
        phonetic: 'met-FOR-min hye-droe-KLOR-ide',
        purpose: 'Helps control blood sugar levels for diabetes.',
      },
      es: {
        standard: 'Tome 1 tableta por vía oral dos veces al día con las comidas para controlar la glucosa.',
        simple: 'Tome 1 pastilla blanca ovalada con su desayuno y 1 con su cena. Siempre coma alimentos primero para cuidar su estómago. Beba un vaso lleno de agua.',
        phonetic: 'met-for-MEE-na',
        purpose: 'Ayuda a regular los niveles de azúcar en la sangre.',
      },
      fr: {
        standard: 'Prendre 1 comprimé par voie orale deux fois par jour avec les repas pour réguler la glycémie.',
        simple: 'Prenez 1 comprimé blanc ovale avec le petit-déjeuner et 1 avec le dîner. Mangez toujours d’abord pour ne pas avoir mal au ventre. Buvez un grand verre d’eau.',
        phonetic: 'met-for-MEEN',
        purpose: 'Aide à contrôler le taux de sucre dans le sang.',
      },
      yo: {
        standard: 'Mu egbogi kan lemeji lojumo pelu ounje lati dinku suga ninu eje.',
        simple: 'Mu boolu egbogi funfun yika kan pelu ounje aaro, ati eyo kan pelu ounje ale. Jeun daadaa ki o to mu un ki inu ma ba dun e. Mu omi to po.',
        phonetic: 'Met-fo-miin',
        purpose: 'O n ran ara lowo lati dari suga eje.',
      },
      ar: {
        standard: 'تناول قرصاً واحداً عن طريق الفم مرتين يومياً مع الوجبات لضبط مستوى السكر.',
        simple: 'تناول قرصاً واحداً أبيض بيضاوي الشكل مع وجبة الإفطار وقرصاً مع العشاء. احرص دائماً على تناول الطعام أولاً لحماية معدتك. اشرب كوباً كبيراً من الماء.',
        phonetic: 'ميتفورمين',
        purpose: 'يساعد على خفض وموازنة السكر في الدم.',
      },
      zh: {
        standard: '每日口服两次，每次1片，随餐服用以调节血糖。',
        simple: '早餐时吃1片白色椭圆形药片，晚餐时吃1片。一定要先吃饱饭再服药，以保护肠胃。喝一大杯温水送服。',
        phonetic: '二甲双胍 (Èrjiǎshuāngguā)',
        purpose: '帮助控制血糖水平，治疗糖尿病。',
      },
      hi: {
        standard: 'भोजन के साथ दिन में दो बार 1 गोली मुंह से लें।',
        simple: 'सुबह के नाश्ते के साथ 1 सफेद अंडाकार गोली लें और रात के खाने के साथ 1 गोली लें। पेट की सुरक्षा के लिए हमेशा भोजन के बाद ही लें और भरपूर पानी पिएं।',
        phonetic: 'मेटफॉर्मिन',
        purpose: 'रक्त शर्करा को नियंत्रित करने में मदद करता है।',
      },
      sw: {
        standard: 'Meza kidonge 1 mara mbili kwa siku pamoja na chakula kupunguza sukari mwilini.',
        simple: 'Kunywa kidonge 1 cheupe cha mviringo pamoja na kiamsha kinywa na 1 na chakula cha jioni. Kula chakula kwanza ili tumbo lisiume. Kunywa glasi nzima ya maji.',
        phonetic: 'Metifomini',
        purpose: 'Husaidia kudhibiti sukari kwenye damu.',
      },
      de: {
        standard: 'Nehmen Sie zweimal täglich 1 Tablette oral zu den Mahlzeiten ein.',
        simple: 'Nehmen Sie 1 weiße ovale Tablette zum Frühstück und 1 zum Abendessen. Immer mit einer Mahlzeit einnehmen, um den Magen zu schonen. Mit einem vollen Glas Wasser schlucken.',
        phonetic: 'Met-for-min',
        purpose: 'Hilft bei der Regulierung des Blutzuckerspiegels.',
      },
    },
  },
  {
    id: 'med-2',
    patientId: 'pat-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril Dihydrate',
    strength: '10 mg',
    form: 'tablet',
    pillColor: '#f97316',
    pillShape: 'round',
    imprint: 'L 10',
    timesPerDay: 1,
    scheduledTimes: ['08:00 AM'],
    timeSlots: ['morning'],
    foodRule: 'no_restriction',
    waterRule: 'full_glass',
    warnings: ['Take every morning at the same hour', 'May cause light dizziness when standing up quickly'],
    totalPills: 30,
    pillsRemaining: 4, // low refill trigger!
    refillThreshold: 5,
    prescribingDoctor: 'Dr. Marcus Vance, MD (Cardiology)',
    doctorPhone: '+1 (555) 678-9012',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-882190',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth daily in the morning for blood pressure management.',
        simple: 'Take 1 round orange pill every morning with water. It keeps your blood pressure safe and relaxes your heart. Stand up slowly if you feel dizzy.',
        phonetic: 'lye-SIN-oh-pril',
        purpose: 'Lowers high blood pressure and protects your heart.',
      },
      es: {
        standard: 'Tome 1 tableta por vía oral diariamente por la mañana para la presión arterial.',
        simple: 'Tome 1 pastilla redonda de color naranja cada mañana con agua. Mantiene su corazón tranquilo y su presión baja. Levántese despacio si siente mareo.',
        phonetic: 'li-si-no-PRIL',
        purpose: 'Baja la presión arterial alta y cuida su corazón.',
      },
      fr: {
        standard: 'Prendre 1 comprimé par jour le matin pour réguler la tension artérielle.',
        simple: 'Prenez 1 comprimé rond orange chaque matin avec de l’eau. Il protège votre cœur et abaisse votre tension. Levez-vous doucement si vous avez la tête qui tourne.',
        phonetic: 'li-zi-no-PRIL',
        purpose: 'Fait baisser la tension artérielle élevée.',
      },
      yo: {
        standard: 'Mu egbogi kan lojumo ni aaro lati mu eje rirun duro daadaa.',
        simple: 'Mu boolu osan yika kan ni gbogbo aaro pelu omi. O n daabo bo okan re ati eje re. Dide diedie ti o ba n daku tabi ti oju re n yi.',
        phonetic: 'Li-si-no-prili',
        purpose: 'O n dinku eje rirun to ga.',
      },
      ar: {
        standard: 'تناول قرصاً واحداً عن طريق الفم كل صباح للتحكم في ضغط الدم.',
        simple: 'تناول قرصاً برتقالياً دائرياً واحداً كل صباح مع الماء. هذا الدواء يحمي قلبك ويخفض ضغط دمك. قف بهدوء وببطء إذا شعرت بدوار.',
        phonetic: 'ليسينوبريل',
        purpose: 'يخفض ضغط الدم المرتفع ويحمي القلب.',
      },
      zh: {
        standard: '每日早晨口服1片，用于控制血压。',
        simple: '每天早晨配温水吃1片橙色圆形药片。它帮助平稳血压、保护心脏。站起来时动作要慢，防止头晕。',
        phonetic: '赖诺普利 (Làinuòpǔlì)',
        purpose: '降低高血压，减轻心脏负担。',
      },
      hi: {
        standard: 'रक्तचाप नियंत्रण के लिए प्रतिदिन सुबह 1 गोली लें।',
        simple: 'हर सुबह 1 नारंगी गोल गोली पानी के साथ लें। यह आपके रक्तचाप को सामान्य रखती है। चक्कर आने पर धीरे से उठें।',
        phonetic: 'लिसिनोप्रिल',
        purpose: 'उच्च रक्तचाप को कम करता है।',
      },
      sw: {
        standard: 'Meza kidonge 1 kila asubuhi kudhibiti shinikizo la damu.',
        simple: 'Meza kidonge 1 cha rangi ya machungwa kila asubuhi na maji. Kinalinda moyo wako na kupunguza presha. Simama polepole ukihisi kizunguzungu.',
        phonetic: 'Lisinoprili',
        purpose: 'Hupunguza shinikizo la juu la damu.',
      },
      de: {
        standard: 'Nehmen Sie täglich morgens 1 Tablette oral zur Blutdrucksenkung ein.',
        simple: 'Nehmen Sie jeden Morgen 1 runde orangefarbene Tablette mit Wasser. Sie schützt Ihr Herz und senkt den Blutdruck. Bei Schwindel langsam aufstehen.',
        phonetic: 'Li-si-no-pril',
        purpose: 'Senkt den Bluthochdruck und schützt das Herz.',
      },
    },
  },
  {
    id: 'med-3',
    patientId: 'pat-1',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    strength: '20 mg',
    form: 'tablet',
    pillColor: '#38bdf8',
    pillShape: 'oval',
    imprint: 'ATV 20',
    timesPerDay: 1,
    scheduledTimes: ['09:30 PM'],
    timeSlots: ['bedtime'],
    foodRule: 'no_restriction',
    waterRule: 'full_glass',
    warnings: ['Take at bedtime', 'Avoid eating grapefruit or drinking grapefruit juice'],
    totalPills: 30,
    pillsRemaining: 21,
    refillThreshold: 7,
    prescribingDoctor: 'Dr. Sarah Chen, MD',
    doctorPhone: '+1 (555) 432-1098',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-773291',
    instructions: {
      en: {
        standard: 'Take 1 tablet by mouth daily at bedtime to lower blood cholesterol.',
        simple: 'Take 1 light blue oval pill every night before sleep. Do not eat or drink grapefruit. It cleans bad fats out of your blood vessels while you rest.',
        phonetic: 'a-TOR-va-sta-tin',
        purpose: 'Lowers cholesterol and prevents heart attacks.',
      },
      es: {
        standard: 'Tome 1 tableta por vía oral diariamente al acostarse para el colesterol.',
        simple: 'Tome 1 pastilla ovalada azul claro cada noche antes de dormir. No coma toronja (pomelo). Limpia las grasas malas de su sangre mientras duerme.',
        phonetic: 'a-tor-vas-ta-TEE-na',
        purpose: 'Baja el colesterol y protege contra infartos.',
      },
      fr: {
        standard: 'Prendre 1 comprimé par jour au coucher pour diminuer le cholestérol.',
        simple: 'Prenez 1 comprimé bleu ciel chaque soir avant de dormir. Évitez le pamplemousse. Il élimine les mauvaises graisses de vos vaisseaux pendant votre sommeil.',
        phonetic: 'a-tor-vas-ta-TEEN',
        purpose: 'Réduit le cholestérol et protège les artères.',
      },
      yo: {
        standard: 'Mu egbogi kan lojumo saaju ki o to sun lati dinku ororo buburu ninu eje.',
        simple: 'Mu egbogi awo omi bulu kan saaju ki o to sun ni ale. Mase je osan grape. O n fo ororo buburu kuro ninu iṣan eje re nigba ti o n sun.',
        phonetic: 'A-tor-fa-sta-tin',
        purpose: 'O n dinku ororo buburu ninu eje.',
      },
      ar: {
        standard: 'تناول قرصاً واحداً عند النوم يومياً لخفض الكوليسترول.',
        simple: 'تناول قرصاً أزرق فاتح بيضاوي الشكل كل ليلة قبل النوم. لا تتناول الجريب فروت. هذا الدواء ينظف الدهون الضارة من الأوعية الدموية أثناء نومك.',
        phonetic: 'أتورفاستاتين',
        purpose: 'يخفض الكوليسترول الضار ويحمي الشرايين.',
      },
      zh: {
        standard: '每日睡前口服1片，用于降低胆固醇。',
        simple: '每晚睡前吃1片浅蓝色椭圆形药片。服药期间不要吃西柚或喝西柚汁。它能在您休息时清除血管中的有害脂肪。',
        phonetic: '阿托伐他汀 (Ātuōfátātīng)',
        purpose: '降低胆固醇，预防心脑血管疾病。',
      },
      hi: {
        standard: 'कोलेस्ट्रॉल कम करने के लिए रोजाना रात को सोने से पहले 1 गोली लें।',
        simple: 'हर रात सोने से पहले 1 हल्की नीली अंडाकार गोली लें। चकोतरा (ग्रेपफ्रूट) न खाएं। यह सोते समय नसों से खराब चर्बी साफ करती है।',
        phonetic: 'एटोरवास्टेटिन',
        purpose: 'कोलेस्ट्रॉल कम करता है।',
      },
      sw: {
        standard: 'Meza kidonge 1 kabla ya kulala kila siku kupunguza kolesteroli.',
        simple: 'Meza kidonge 1 cha samawati cha mviringo kila usiku kabla ya kulala. Usile balungi (grapefruit). Husafisha mafuta mabaya kwenye mishipa unapolala.',
        phonetic: 'Atovastatini',
        purpose: 'Hupunguza mafuta mabaya kwenye damu.',
      },
      de: {
        standard: 'Nehmen Sie täglich vor dem Schlafengehen 1 Tablette oral zur Cholesterinsenkung ein.',
        simple: 'Nehmen Sie jeden Abend vor dem Schlafen 1 hellblaue ovale Tablette. Keine Grapefruits essen oder trinken. Reinigt schlechte Fette aus den Gefäßen.',
        phonetic: 'A-tor-va-sta-tin',
        purpose: 'Senkt Cholesterin und schützt Gefäße.',
      },
    },
  },
  {
    id: 'med-4',
    patientId: 'pat-1',
    name: 'Albuterol Inhaler',
    genericName: 'Albuterol Sulfate Inhalation Aerosol',
    strength: '90 mcg/actuation',
    form: 'inhaler',
    pillColor: '#10b981',
    pillShape: 'capsule',
    imprint: 'PROAIR',
    timesPerDay: 1,
    scheduledTimes: ['As needed for shortness of breath'],
    timeSlots: ['afternoon'],
    foodRule: 'no_restriction',
    waterRule: 'normal',
    warnings: ['Rinse mouth with water after use', 'Shake well for 5 seconds before every puff'],
    totalPills: 200,
    pillsRemaining: 85,
    refillThreshold: 20,
    prescribingDoctor: 'Dr. Sarah Chen, MD',
    doctorPhone: '+1 (555) 432-1098',
    pharmacyName: 'Community Health Pharmacy #12',
    rxNumber: 'RX-661902',
    instructions: {
      en: {
        standard: 'Inhale 2 puffs every 4 to 6 hours as needed for wheezing or chest tightness.',
        simple: 'Shake the inhaler well. Breathe all your air out. Put the mouth piece in your mouth and breathe in deep while pressing the top. Hold breath for 10 seconds.',
        phonetic: 'al-BYOO-ter-ol in-HAY-ler',
        purpose: 'Opens breathing airways quickly during asthma or tightness.',
      },
      es: {
        standard: 'Inhale 2 descargas cada 4 a 6 horas según sea necesario para la respiración.',
        simple: 'Agite bien el inhalador. Bote todo el aire de sus pulmones. Coloque la boquilla en su boca y respire hondo mientras presiona el botón. Aguante el aire 10 segundos.',
        phonetic: 'al-bu-te-ROL',
        purpose: 'Abre los conductos de aire rápidamente cuando cuesta respirar.',
      },
      fr: {
        standard: 'Inhaler 2 bouffées toutes les 4 à 6 heures en cas de gêne respiratoire.',
        simple: 'Secouez bien l’inhalateur. Soufflez tout l’air de vos poumons. Mettez l’embout en bouche et inspirez profondément en appuyant. Bloquez votre souffle 10 secondes.',
        phonetic: 'al-bu-té-ROL',
        purpose: 'Ouvre rapidement les voies respiratoires en cas de crise.',
      },
      yo: {
        standard: 'Fa eemi egbogi meji si inu ni wakati merin si mefa bi o ba se ye fun iṣoro eemi.',
        simple: 'Gbọn igo egbogi na daadaa. Mi gbogbo ategun kuro ninu re. Fi enu igo na si enu re, fa eemi nla wole nigba ti o ba te e. Di eemi re mu fun iseju aaya mewa.',
        phonetic: 'Al-bu-te-roli',
        purpose: 'O n si ona ofun eemi kankan nigba ti eemi ba n le.',
      },
      ar: {
        standard: 'استنشق بختين كل 4 إلى 6 ساعات عند الحاجة لضيق التنفس.',
        simple: 'رج البخاخ جيداً لـ 5 ثوانٍ. اخرج كل الهواء من صدرك. ضع الفوهة في فمك واستنشق بعمق مع الضغط لأسفل. احبس نفسك لمدة 10 ثوانٍ ثم اشطف فمك بالماء.',
        phonetic: 'ألبوتيرول',
        purpose: 'يوسع الشعب الهوائية فوراً لتسهيل التنفس.',
      },
      zh: {
        standard: '需要时每4-6小时吸入2喷，用于缓解喘息或胸闷。',
        simple: '用力摇匀喷雾器5秒。呼出肺部全部气体。含住吸嘴，深呼吸的同时按下药罐。屏住呼吸10秒，然后用清水漱口。',
        phonetic: '沙丁胺醇吸入剂 (Shādīng\'ànchún)',
        purpose: '快速扩张支气管气道，缓解气促胸闷。',
      },
      hi: {
        standard: 'सांस लेने में कठिनाई होने पर हर 4 से 6 घंटे में 2 बार सांस के जरिए लें।',
        simple: 'इनहेलर को 5 सेकंड हिलाएं। पूरी सांस बाहर निकालें। मुंह में रखकर दबाएं और गहरी सांस अंदर खींचें। 10 सेकंड तक सांस रोकें, फिर कुल्ला करें।',
        phonetic: 'अल्ब्युटेरोल इनहेलर',
        purpose: 'सांस की नली को तुरंत खोलता है।',
      },
      sw: {
        standard: 'Vuta pumzi mara 2 kila masaa 4 hadi 6 inapohitajika kwa kubanwa na pumzi.',
        simple: 'Tikisa kifaa vizuri. Toa hewa yote nje. Weka kinywani na uvute pumzi ndani kwa nguvu ukibonyeza. Zuia pumzi kwa sekunde 10.',
        phonetic: 'Albuteroli',
        purpose: 'Hufungua njia za hewa haraka wakati wa kubanwa na pumu.',
      },
      de: {
        standard: 'Bei Atemnot alle 4 bis 6 Stunden 2 Hübe inhalieren.',
        simple: 'Inhalator gut schütteln. Vollständig ausatmen. Mundstück ansetzen, tief einatmen und drücken. Atem 10 Sekunden anhalten.',
        phonetic: 'Al-bu-te-rol',
        purpose: 'Öffnet bei Atemnot schnell die Bronchien.',
      },
    },
  },
];

export const sampleTodaySchedule: ScheduleItem[] = [
  {
    id: 'sch-1',
    medicationId: 'med-1',
    patientId: 'pat-1',
    timeSlot: 'morning',
    scheduledTime: '08:00 AM',
    status: 'taken',
    takenAt: '08:14 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
  },
  {
    id: 'sch-2',
    medicationId: 'med-2',
    patientId: 'pat-1',
    timeSlot: 'morning',
    scheduledTime: '08:00 AM',
    status: 'taken',
    takenAt: '08:15 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
  },
  {
    id: 'sch-3',
    medicationId: 'med-4',
    patientId: 'pat-1',
    timeSlot: 'afternoon',
    scheduledTime: '01:30 PM',
    status: 'pending',
  },
  {
    id: 'sch-4',
    medicationId: 'med-1',
    patientId: 'pat-1',
    timeSlot: 'evening',
    scheduledTime: '06:30 PM',
    status: 'pending',
  },
  {
    id: 'sch-5',
    medicationId: 'med-3',
    patientId: 'pat-1',
    timeSlot: 'bedtime',
    scheduledTime: '09:30 PM',
    status: 'pending',
  },
];

export const sampleAdherenceLogs: AdherenceLog[] = [
  {
    id: 'log-1',
    patientId: 'pat-1',
    medicationName: 'Metformin',
    dosage: '500 mg',
    action: 'taken',
    timestamp: 'Today at 08:14 AM',
    scheduledFor: '08:00 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
    notes: 'Taken with oatmeal and tea',
  },
  {
    id: 'log-2',
    patientId: 'pat-1',
    medicationName: 'Lisinopril',
    dosage: '10 mg',
    action: 'taken',
    timestamp: 'Today at 08:15 AM',
    scheduledFor: '08:00 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
  },
  {
    id: 'log-3',
    patientId: 'pat-1',
    medicationName: 'Atorvastatin',
    dosage: '20 mg',
    action: 'taken',
    timestamp: 'Yesterday at 09:28 PM',
    scheduledFor: '09:30 PM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
  },
  {
    id: 'log-4',
    patientId: 'pat-1',
    medicationName: 'Metformin',
    dosage: '500 mg',
    action: 'taken',
    timestamp: 'Yesterday at 06:40 PM',
    scheduledFor: '06:30 PM',
    loggedBy: 'caregiver',
    loggedByName: 'David Vance (Son)',
    notes: 'Assisted after family dinner',
  },
  {
    id: 'log-5',
    patientId: 'pat-1',
    medicationName: 'Lisinopril',
    dosage: '10 mg',
    action: 'taken',
    timestamp: 'Yesterday at 08:05 AM',
    scheduledFor: '08:00 AM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
  },
  {
    id: 'log-6',
    patientId: 'pat-1',
    medicationName: 'Metformin',
    dosage: '500 mg',
    action: 'skipped',
    timestamp: '2 days ago at 06:45 PM',
    scheduledFor: '06:30 PM',
    loggedBy: 'patient',
    loggedByName: 'Eleanor Vance',
    notes: 'Skipped due to mild stomach upset after lunch',
  },
];

export const sampleCaregiverNotes: CaregiverNote[] = [
  {
    id: 'note-1',
    patientId: 'pat-1',
    caregiverId: 'cg-1',
    caregiverName: 'David Vance (Son)',
    text: 'Mom, I placed the new fresh water bottle next to your morning pill organizer. Remember to drink the full glass with the white pill!',
    timestamp: 'Today at 07:15 AM',
    pinned: true,
    priority: 'important',
  },
  {
    id: 'note-2',
    patientId: 'pat-1',
    caregiverId: 'cg-1',
    caregiverName: 'David Vance (Son)',
    text: 'Dr. Sarah Chen scheduled a blood glucose follow-up review for next Tuesday at 10:30 AM. I will drive you there.',
    timestamp: 'Yesterday at 04:20 PM',
    pinned: false,
    priority: 'normal',
  },
];

export const sampleEducationalArticles: EducationalArticle[] = [
  {
    id: 'edu-1',
    category: 'instructions',
    title: {
      en: 'How to Read a Prescription Label Clearly',
      es: 'Cómo leer la etiqueta de su receta médica claramente',
      fr: 'Comment lire clairement l’étiquette de votre ordonnance',
      yo: 'Bi a se n ka iwe aami egbogi daadaa',
      ar: 'كيف تقرأ ملصق الوصفة الطبية بوضوح وبساطة',
      zh: '如何清晰读懂处方药瓶标签',
    },
    summary: {
      en: 'Learn what the Rx number, dosage numbers, and warning symbols mean on your pill bottle.',
      es: 'Aprenda qué significan el número de receta, las dosis y los símbolos de advertencia.',
      fr: 'Comprenez le numéro d’ordonnance, les dosages et les symboles d’alerte sur votre boîte.',
      yo: 'Kọ ẹkọ nipa nọmba egbogi, iwọn lilo, ati awọn ami ikilọ lori igo egbogi rẹ.',
      ar: 'تعلم معاني رقم الوصفة وجرعات الدواء ورموز التحذير الموجودة على علبة الدواء.',
      zh: '了解药瓶上的处方编号、剂量数字以及彩色警告图标的含义。',
    },
    simpleContent: {
      en: `1. Medication Name: Tells you what medicine is inside. If there are two names, one is the brand name (like Glucophage) and one is the generic scientific name (like Metformin).\n2. Directions: Look for words like "Take 1 tablet by mouth daily". Follow the exact number.\n3. Rx Number: This is your unique ID number for this prescription bottle. Give this number to the pharmacy when you need a refill.\n4. Warning Stickers: Bright yellow or red stickers tell you if you must take it with food, avoid alcohol, or avoid sunlight.`,
      es: `1. Nombre del medicamento: Le indica qué medicina contiene. Si hay dos nombres, uno es la marca comercial y el otro es el nombre genérico.\n2. Indicaciones: Busque palabras como "Tome 1 tableta diaria". Siga siempre el número exacto.\n3. Número de Rx: Es el número de identificación de su receta. Úselo para pedir un surtido en la farmacia.\n4. Pegatinas de advertencia: Indican si debe tomarlo con comida, evitar alcohol o no exponerse al sol.`,
      fr: `1. Nom du médicament: Indique le principe actif et le nom commercial.\n2. Posologie: Lisez attentivement "Prendre 1 comprimé par jour". Respectez scrupuleusement la dose.\n3. Numéro d’ordonnance: Utilisez ce numéro pour renouveler votre traitement à la pharmacie.\n4. Mises en garde: Les étiquettes colorées précisent s’il faut manger avant de prendre le médicament.`,
      yo: `1. Oruko Egbogi: O n so iru oogun to wa ninu re fun e.\n2. Ilana lilo: Wo iye boolu ti won ni ki o mu lojumo. Mase se afikun tabi idinku.\n3. Nomba Rx: Eyi ni nomba pataki ti oogun re. Fun ile-owo oogun ni nomba yi nigba ti egbogi re ba fe tan.\n4. Awon ami ikilọ: Won n so boya o nilo ounje saaju kio to mu un tabi boya o ko gbodo mu oti.`,
      ar: `1. اسم الدواء: يوضح الاسم التجاري والاسم العلمي للمركب.\n2. طريقة الاستعمال: ابحث عن عبارات مثل "تناول قرصاً واحداً يومياً". التزم دائماً بالجرعة المحددة بدقة.\n3. رقم الوصفة (Rx): الرقم المخصص لعلبتك في الصيدلية، تحتاجه عند طلب إعادة صرف الدواء.\n4. ملصقات التحذير: توضح ما إذا كان يجب تناول الدواء مع وجبة طعام أو تجنب المشروبات الكحولية.`,
      zh: `1. 药物名称：标明药品商品名和通用学名。\n2. 服用说明：明确写出“每日口服1片”等频率与用量，切勿自行加减。\n3. 处方号 (Rx Number)：这是您处方的专属编号，续药时向药房报出即可。\n4. 警告标签：彩色标签会提示必须随餐服用、避免饮酒或避免阳光直射。`,
    },
    keyTakeaways: [
      'Always verify both brand and generic names',
      'The Rx number is all you need for easy pharmacy refills',
      'Colored stickers contain vital safety warnings',
    ],
    readTime: '3 min read',
    iconName: 'FaPrescriptionBottleAlt',
  },
  {
    id: 'edu-2',
    category: 'storage',
    title: {
      en: 'Safe Storage: Why the Bathroom Cabinet is Risky',
      es: 'Almacenamiento seguro: Por qué el botiquín del baño es riesgoso',
      fr: 'Stockage sécurisé: Pourquoi l’armoire de bain est déconseillée',
      yo: 'Ibi aabo fun egbogi: Idi ti yara iwe ko fi dara',
      ar: 'التخزين الآمن للأدوية: لماذا تُعد خزانة الحمام مكاناً غير مناسب',
      zh: '安全存放指南：为什么浴室药箱不是好地方',
    },
    summary: {
      en: 'Heat and steam from hot showers can break down pills before their expiration date.',
      es: 'El calor y la humedad de las duchas pueden arruinar los medicamentos antes de tiempo.',
      fr: 'La chaleur et l’humidité des douches dégradent les principes actifs des comprimés.',
      yo: 'Ooru ati omi gbigbona le ba agbara egbogi je ki ojo to ye ki o pari to pe.',
      ar: 'حرارة ورطوبة الاستحمام اليومي قد تتلف فعالية الأقراص الطبية قبل تاريخ انتهائها.',
      zh: '洗澡时的湿气和高温会加速药片受潮变质，降低药效。',
    },
    simpleContent: {
      en: `Most people store pills in the bathroom medicine cabinet, but heat and moisture from showers actually cause pills to weaken, crumble, or expire much sooner.\n\nBest places to store your medications:\n- A cool, dry bedroom nightstand drawer.\n- A high kitchen cabinet away from the hot stove and sink.\n- Keep pills that require cold storage (like some insulins or eye drops) on the middle shelf of the refrigerator, never the freezer door!\n- Always keep child-safe caps tightly fastened and out of reach of curious toddlers and pets.`,
      es: `El calor y la humedad del baño dañan las pastillas. Guárdelas en un lugar fresco y seco, como el cajón de la mesa de noche o un armario alto en la cocina lejos de la estufa. Los medicamentos refrigerados deben ir en el estante medio del refrigerador.`,
      fr: `La vapeur et la chaleur abîment les molécules. Préférez un tiroir de table de nuit dans la chambre ou un placard sec. Les médicaments à réfrigérer doivent rester au milieu du frigo, loin du congélateur.`,
      yo: `Mase fi egbogi re si baluwe. Fi egbogi si ibi ti o tutu ti ko si ooru, bi kọbọọdu inu yara ibusun tabi kọbọọdu idana ti o jinna si ina ati omi.`,
      ar: `تجنب وضع الأدوية في الحمام لأن الرطوبة والحرارة تفسدان فعالية العلاج. الأماكن المثالية: درج جاف في غرفة النوم أو خزانة مطبخ بعيدة عن الحرارة. الأدوية التي تحتاج للتبريد تُوضع في الرف الأوسط من الثلاجة.`,
      zh: `千万不要把药放在浴室镜柜里，淋浴产生的湿热会使药物分解失效。最佳存放处是卧室床头抽屉或远离炉灶的高处橱柜。需要冷藏的药品请放在冰箱中层，远离冷冻室。`,
    },
    keyTakeaways: [
      'Avoid bathroom cabinets due to steam and heat',
      'Keep in a cool, dry place away from direct sunlight',
      'Store refrigerated medications on middle shelf, not the freezer',
    ],
    readTime: '2 min read',
    iconName: 'FaBoxArchive',
  },
  {
    id: 'edu-3',
    category: 'safety',
    title: {
      en: 'What Should You Do If You Miss a Dose?',
      es: '¿Qué debe hacer si olvida una dosis?',
      fr: 'Que faire en cas d’oubli d’une prise ?',
      yo: 'Kini ki o se ti o ba gbagbe lati mu egbogi re?',
      ar: 'ماذا تفعل إذا نسيت تناول جرعة في موعدها؟',
      zh: '漏服了一次药物，该如何正确补救？',
    },
    summary: {
      en: 'The general golden rule: Never take a double dose to make up for a missed pill.',
      es: 'La regla de oro: Nunca tome una dosis doble para compensar la que olvidó.',
      fr: 'La règle d’or: Ne doublez jamais la dose suivante pour compenser.',
      yo: 'Ofin wura: Mase mu boolu meji ni ekan lati se atunse egbogi ti o gbagbe.',
      ar: 'القاعدة الذهبية الطبية: لا تضاعف الجرعة أبداً لتعويض حبة نسيتها.',
      zh: '黄金安全准则：切勿为了补服而一次吃下双倍剂量的药物。',
    },
    simpleContent: {
      en: `Rule #1: NEVER take two pills at once to make up for a missed dose. Double doses can trigger dangerous drops in blood pressure, low blood sugar, or organ strain.\n\nGeneral guidance:\n- If you remember within 2 to 3 hours of the scheduled time: Take the missed dose immediately.\n- If it is already almost time for your next scheduled dose: Skip the missed dose completely, and take your regular dose at the usual time.\n- Write down or log that you missed it in your DOSEBRIDGE app so your caregiver and doctor know.`,
      es: `Nunca tome dos dosis juntas. Si recuerda el olvido pocas horas después, tómela de inmediato. Si ya casi es la hora de la siguiente dosis, salte la que olvidó y continúe con su horario habitual. Regístrelo en la app.`,
      fr: `Ne doublez jamais la prise. Si vous vous en rendez compte peu après l’heure, prenez-la. S’il est presque l’heure de la prise suivante, ignorez la dose oubliée et reprenez votre rythme normal.`,
      yo: `Mase mu egbogi meji leekan soso. Ti o ba ranti ni wakati die leyin akoko re, mu un lesekese. Sugbon ti akoko egbogi to kan ba ti fe to, fo eyi ti o gbagbe yen koja, ki o si mu elekeji ni akoko re.`,
      ar: `القاعدة الذهبية: لا تأخذ حبتين في وقت واحد مطلقاً. إذا تذكرت خلال ساعتين إلى ثلاث ساعات من موعدها، خذها فوراً. إذا اقترب موعد الجرعة التالية، اترك الفائتة وتابع جدولك العادي وسجل ذلك في التطبيق.`,
      zh: `首要准则：绝对不要一次服用双倍剂量！如果在原定时间后2-3小时内想起，可立即补服；如果已经接近下一次服药时间，请直接跳过本次漏服的药物，按正常时间吃下一剂。`,
    },
    keyTakeaways: [
      'Never double up pills on the next dose',
      'If close to next dose, skip and resume regular schedule',
      'Log missed doses in DOSEBRIDGE to keep caregivers updated',
    ],
    readTime: '3 min read',
    iconName: 'FaClockRotateLeft',
  },
  {
    id: 'edu-4',
    category: 'interactions',
    title: {
      en: 'Common Interactions: Grapefruit, Alcohol, and Vitamins',
      es: 'Interacciones comunes: Toronja, alcohol y vitaminas',
      fr: 'Interactions fréquentes: Pamplemousse, alcool et compléments',
      yo: 'Awọn ohun ti ko gbọdọ pade: Oti, Eso Grape, ati Vitamin',
      ar: 'تداخلات دوائية شائعة: الجريب فروت والكحول والمكملات',
      zh: '常见用药禁忌：西柚、酒精与保健品的相互作用',
    },
    summary: {
      en: 'Why certain healthy foods like grapefruit can make standard medicines dangerously strong.',
      es: 'Por qué alimentos saludables como la toronja pueden potenciar peligrosamente los medicamentos.',
      fr: 'Pourquoi certains aliments sains comme le pamplemousse surdosent certains médicaments.',
      yo: 'Idi ti eso kan pato le fi so egbogi di ohun ti o le pa eniyan lara.',
      ar: 'لماذا تزيد بعض الأطعمة الصحية مثل الجريب فروت من تركيز الدواء في الدم لمستويات خطرة.',
      zh: '为什么像西柚这种健康水果会导致部分药物在血液中的浓度异常偏高。',
    },
    simpleContent: {
      en: `Did you know everyday foods can alter how medicine works?\n\n1. Grapefruit & Grapefruit Juice: Blocks the liver enzymes that break down cholesterol pills (like Atorvastatin) and blood pressure pills. This makes the medicine buildup to toxic levels in your body!\n2. Alcohol: Mixing alcohol with diabetes pills or sleeping medicines can cause fainting, liver damage, or dangerous breathing drops.\n3. Calcium & Dairy: Milk and yogurt can bind to certain antibiotics (like Ciprofloxacin) and stop your body from absorbing them. Take antibiotics 2 hours before or 4 hours after dairy.`,
      es: `La toronja bloquea enzimas del hígado y hace que medicamentos como la atorvastatina se acumulen en niveles tóxicos. El alcohol nunca debe mezclarse con fármacos para la diabetes o calmantes. Los lácteos interfieren con la absorción de ciertos antibióticos.`,
      fr: `Le pamplemousse empêche la dégradation hépatique de certains traitements (statines, tension). L’alcool amplifie la somnolence et les risques d’hypoglycémie. Les produits laitiers bloquent l’absorption de plusieurs antibiotiques.`,
      yo: `Eso Grape n di ara lowo lati fo egbogi ti a n mu fun ororo eje (Atorvastatin). Oti mimu pelu egbogi suga le fa idaku tabi ipalara fun edo. Wara le di gbigba egbogi kokoro ara lowo.`,
      ar: `يحتوي الجريب فروت على مركبات تعطل إنزيمات الكبد المسؤولة عن تكسير أدوية الكوليسترول والضغط، مما يرفع تركيزها في الجسم بشكل خطير. الكحول يسبب هبوطاً حاداً في السكر عند مزجه بأدوية السكري. منتجات الحليب تقلل امتصاص بعض المضادات الحيوية.`,
      zh: `西柚中的化学成分会抑制人体肝脏分解他汀类降脂药和部分降压药的酶，导致药物在体内蓄积过量。酒精与降糖药或镇静药合用可引起低血糖晕厥。牛奶等乳制品会阻碍四环素或喹诺酮类抗生素的吸收。`,
    },
    keyTakeaways: [
      'Grapefruit dangerously amplifies cholesterol and heart drugs',
      'Never drink alcohol with diabetes or sedating medications',
      'Separate dairy products from antibiotics by at least 2 hours',
    ],
    readTime: '4 min read',
    iconName: 'FaTriangleExclamation',
  },
  {
    id: 'edu-5',
    category: 'emergency',
    title: {
      en: 'Recognizing Allergic Reactions: Mild vs Emergency Red Flags',
      es: 'Reconocer reacciones alérgicas: Leves vs banderas rojas de emergencia',
      fr: 'Reconnaître les allergies médicamenteuses: Signes d’urgence',
      yo: 'Bi a se n mo ti egbogi ko ba ba ara mu: Ewu kekere ati Ewu nla',
      ar: 'التعرف على الحساسية الدوائية: الأعراض البسيطة مقابل حالات الطوارئ',
      zh: '药物过敏识别：轻度不适与危急红旗警报',
    },
    summary: {
      en: 'Learn when an upset stomach is mild and when swelling or breathing trouble requires calling 911.',
      es: 'Aprenda cuándo un malestar estomacal es leve y cuándo la hinchazón requiere llamar a emergencias.',
      fr: 'Distinguez les effets secondaires bénins de l’anaphylaxie qui nécessite les secours.',
      yo: 'Mo igba ti o ye ki o pe iranlowo pajawiri nigba ti egbogi ba n se e ni lile.',
      ar: 'تعلم التمييز بين اضطراب المعدة العادي وصعوبة التنفس أو التورم التي تتطلب الاتصال بالإسعاف فوراً.',
      zh: '学会辨别普通胃部轻微不适与需要立即呼叫急救的面部肿胀或呼吸骤停。',
    },
    simpleContent: {
      en: `It is critical to distinguish between common mild side effects and true life-threatening allergic reactions.\n\nMild Side Effects (Contact your doctor within 24 hours):\n- Mild nausea or slight stomach rumble after taking a pill.\n- Mild dry mouth or feeling slightly sleepy.\n\nEMERGENCY RED FLAGS (Call 911 or emergency services IMMEDIATELY):\n- Swelling of the lips, tongue, face, or throat.\n- Sudden difficulty breathing, whistling sound (wheezing), or throat closing.\n- Widespread hives, severe itchy red welts across your body.\n- Feeling faint, severe dizziness, or sudden confusion.`,
      es: `Efectos leves: Náuseas ligeras, boca seca o somnolencia leve. BANDERAS ROJAS DE EMERGENCIA: Hinchazón de labios, lengua o garganta, dificultad para respirar, ronchas rojas con picazón en todo el cuerpo, o mareo severo con desmayo. Llame al 911 de inmediato.`,
      fr: `Effets légers: Légère nausée ou bouche sèche. URGENCES VITALES (Appelez le 15 ou le 112): Gonflement des lèvres, de la langue ou de la gorge, difficultés à respirer, urticaire généralisée, sensation d’évanouissement.`,
      yo: `Ti o ba je inu fifo die: Pe dokita re. Sugbon ti o ba je wiwu ete, ahan tabi ofun, tabi ti eemi re ba le gidi, pe iranlowo pajawiri lesekese!`,
      ar: `الأعراض البسيطة: غثيان خفيف أو جفاف الحلق. علامات الطوارئ الخطيرة (اتصل بالإسعاف فوراً): تورم الشفتين أو اللسان أو الحلق، صعوبة مفاجئة في التنفس، طفح جلدي واسع وحكة شديدة، أو دوار شديد وإغماء.`,
      zh: `轻度副作用：轻微胃部不适、口干或轻度嗜睡，可联系医生咨询。危急红旗警报（必须立刻呼叫急救）：嘴唇、舌头或喉咙肿胀；突发呼吸困难或喘鸣；全身急性荨麻疹伴剧烈瘙痒；眩晕昏厥。`,
    },
    keyTakeaways: [
      'Swelling of lips, tongue, or throat is an absolute emergency',
      'Sudden wheezing or chest tightness requires immediate 911 help',
      'Keep your allergies list updated on your DOSEBRIDGE profile',
    ],
    readTime: '3 min read',
    iconName: 'FaHeartPulse',
  },
];
