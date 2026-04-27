export type EmploymentStatus = 'probationary' | 'regular';
export type ShiftType = 'day' | 'mid' | 'night';

export interface LeaveBalance {
  sickDays: number;
  wellnessDays: number;
}

export interface HMOInfo {
  providerName: string;
  planType: string;
}

export type SexAtBirth = 'male' | 'female' | 'intersex';

export interface OnboardingData {
  age: number;
  sexAtBirth: SexAtBirth;
  primaryLanguage: string;
  jobFunction: string;
  baselineSleepHours: number;
  physicalConditions: string[];
}

export interface MentalHealthHistory {
  priorDiagnoses: string[];
  currentPsychiatricMedication: boolean;
  previousPsychiatricHospitalization: boolean;
  previousTherapyOrCounseling: boolean;
}

export type LivingSituation = 'alone' | 'with_family' | 'with_roommates';
export type FinancialStressLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface LifestyleContext {
  livingSituation: LivingSituation;
  financialStressLevel: FinancialStressLevel;
  recentLifeEvents: string[];
  substanceUse: string[];
}

export interface HRISData {
  userId: string;
  leaveBalance: LeaveBalance;
  employmentStatus: EmploymentStatus;
  teamId: string;
  shiftType: ShiftType;
  tenureMonths: number;
  hmo: HMOInfo;
  onboarding: OnboardingData;
  mentalHealthHistory: MentalHealthHistory;
  lifestyleContext?: LifestyleContext;
}

const MOCK_HRIS_PROFILES: Record<string, HRISData> = {
  'user-night-tenured': {
    userId: 'user-night-tenured',
    leaveBalance: {
      sickDays: 9,
      wellnessDays: 5,
    },
    employmentStatus: 'regular',
    teamId: 'TEAM-ALPHA',
    shiftType: 'night',
    tenureMonths: 62,
    hmo: {
      providerName: 'MaxiCare',
      planType: 'Premium Plus',
    },
    onboarding: {
      age: 36,
      sexAtBirth: 'male',
      primaryLanguage: 'English',
      jobFunction: 'Call Center Agent',
      baselineSleepHours: 5.5,
      physicalConditions: ['Chronic back pain'],
    },
    mentalHealthHistory: {
      priorDiagnoses: ['MDD', 'Anxiety'],
      currentPsychiatricMedication: true,
      previousPsychiatricHospitalization: true,
      previousTherapyOrCounseling: true,
    },
    lifestyleContext: {
      livingSituation: 'alone',
      financialStressLevel: 'high',
      recentLifeEvents: ['separation'],
      substanceUse: ['alcohol'],
    },
  },
  'user-day-probationary': {
    userId: 'user-day-probationary',
    leaveBalance: {
      sickDays: 2,
      wellnessDays: 1,
    },
    employmentStatus: 'probationary',
    teamId: 'TEAM-BRAVO',
    shiftType: 'day',
    tenureMonths: 4,
    hmo: {
      providerName: 'Intellicare',
      planType: 'Basic',
    },
    onboarding: {
      age: 27,
      sexAtBirth: 'female',
      primaryLanguage: 'Taglish',
      jobFunction: 'Team Lead',
      baselineSleepHours: 7.2,
      physicalConditions: [],
    },
    mentalHealthHistory: {
      priorDiagnoses: [],
      currentPsychiatricMedication: false,
      previousPsychiatricHospitalization: false,
      previousTherapyOrCounseling: true,
    },
  },
  'user-high-risk-mdd': {
    userId: 'user-high-risk-mdd',
    leaveBalance: {
      sickDays: 6,
      wellnessDays: 3,
    },
    employmentStatus: 'regular',
    teamId: 'TEAM-CHARLIE',
    shiftType: 'mid',
    tenureMonths: 22,
    hmo: {
      providerName: 'MaxiCare',
      planType: 'Standard',
    },
    onboarding: {
      age: 31,
      sexAtBirth: 'female',
      primaryLanguage: 'Filipino',
      jobFunction: 'Back-office',
      baselineSleepHours: 6.0,
      physicalConditions: ['Diabetes'],
    },
    mentalHealthHistory: {
      priorDiagnoses: ['MDD'],
      currentPsychiatricMedication: true,
      previousPsychiatricHospitalization: true,
      previousTherapyOrCounseling: false,
    },
  },
};

const FALLBACK_PROFILE_KEY = 'user-day-probationary';

export function getMockHrisProfile(userId: string): HRISData {
  return MOCK_HRIS_PROFILES[userId] ?? {
    ...MOCK_HRIS_PROFILES[FALLBACK_PROFILE_KEY],
    userId,
  };
}
