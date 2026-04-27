export type employment_status = 'probationary' | 'regular';
export type shift_type = 'day' | 'mid' | 'night';
export type sex_at_birth = 'male' | 'female' | 'intersex';
export type living_situation = 'alone' | 'with_family' | 'with_roommates';
export type financial_stress_level = 'low' | 'moderate' | 'high' | 'severe';

export interface EmployeeProfile {
  id: string;
  sick_leave_balance: number;
  wellness_leave_balance: number;
  employment_status: employment_status;
  team_id: string;
  shift_type: shift_type;
  tenure_months: number;
  hmo_provider_name: string;
  hmo_plan_type: string;
  age: number;
  sex_at_birth: sex_at_birth;
  primary_language: string;
  job_function: string;
  baseline_sleep_hours: number;
  physical_conditions: string[];
  prior_diagnoses: string[];
  current_psychiatric_medication: boolean;
  previous_psychiatric_hospitalization: boolean;
  previous_therapy_or_counseling: boolean;
  living_situation?: living_situation;
  financial_stress_level?: financial_stress_level;
  recent_life_events?: string[];
  substance_use?: string[];
}
