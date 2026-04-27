import { supabase } from '../lib/supabase';
import { EmployeeProfile } from '../types/hris';

export async function getEmployeeProfile(
  userId: string,
): Promise<EmployeeProfile | null> {
  const { data, error } = await supabase
    .from('employee_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle<EmployeeProfile>();

  if (error) {
    throw new Error(`Failed to fetch employee profile: ${error.message}`);
  }

  return data ?? null;
}

export function generateSystemPrompt(profileData: EmployeeProfile): string {
  const probationaryLeaveNote =
    profileData.employment_status === 'probationary'
      ? 'Employee is probationary: apply probationary leave entitlements and stricter LOA checks.'
      : 'Employee is regular: apply regular leave entitlements.';

  const shiftClinicalNote =
    profileData.shift_type === 'night'
      ? 'Night shift detected: contextualize PHQ-9 sleep-related responses because baseline sleep disruption may be shift-driven.'
      : 'Non-night shift detected: evaluate PHQ-9 sleep-related responses with standard weighting.';

  const languageLower = profileData.primary_language.trim().toLowerCase();
  const isFilipinoOrTaglish =
    languageLower === 'filipino' || languageLower === 'taglish';
  const languageInstruction = isFilipinoOrTaglish
    ? `Primary language is ${profileData.primary_language}: conduct triage questions in ${profileData.primary_language} for more accurate self-reporting.`
    : `Primary language is ${profileData.primary_language}: use this language preference during triage when feasible.`;

  const physicalConditionsText =
    profileData.physical_conditions.length > 0
      ? profileData.physical_conditions.join(', ')
      : 'None reported';

  const priorDiagnosesText =
    profileData.prior_diagnoses.length > 0
      ? profileData.prior_diagnoses.join(', ')
      : 'None reported';

  const hasLifestyleContext =
    profileData.living_situation !== undefined &&
    profileData.financial_stress_level !== undefined;

  const lifestyleSection = hasLifestyleContext
    ? [
        '',
        'LIFESTYLE & STRESSOR CONTEXT',
        `- Living Situation: ${profileData.living_situation}`,
        `- Financial Stress Level: ${profileData.financial_stress_level}`,
        `- Recent Life Events: ${
          (profileData.recent_life_events ?? []).length > 0
            ? (profileData.recent_life_events ?? []).join(', ')
            : 'None reported'
        }`,
        `- Substance Use: ${
          (profileData.substance_use ?? []).length > 0
            ? (profileData.substance_use ?? []).join(', ')
            : 'None reported'
        }`,
        '- Social Support: Use livingSituation as a protective/risk factor signal; living alone increases support-vulnerability risk.',
        '- Financial Context: Weight financialStressLevel heavily when interpreting GAD-7 worry items as a compounding stressor.',
        '- Baseline Interpretation: Use recentLifeEvents to contextualize acute PHQ-9 spikes related to grief or major transitions.',
        '- Co-occurring Risks: Treat any substanceUse as a clinical red flag requiring sensitive probing and possible dual-diagnosis pathway weighting.',
      ]
    : [];

  return [
    'You are HABI AI, an HR-aware mental wellness assistant. Use the HRIS profile below to personalize decisions and recommendations.',
    '',
    'HRIS CONTEXT',
    `- Employment Status: ${profileData.employment_status}`,
    `- Leave Balance: sick=${profileData.sick_leave_balance}, wellness=${profileData.wellness_leave_balance}`,
    `- Team ID: ${profileData.team_id}`,
    `- Shift Type: ${profileData.shift_type}`,
    `- Tenure (months): ${profileData.tenure_months}`,
    `- HMO Provider: ${profileData.hmo_provider_name}`,
    `- HMO Plan Type: ${profileData.hmo_plan_type}`,
    `- Age: ${profileData.age}`,
    `- Sex At Birth: ${profileData.sex_at_birth}`,
    `- Primary Language: ${profileData.primary_language}`,
    `- Job Function: ${profileData.job_function}`,
    `- Baseline Sleep Hours: ${profileData.baseline_sleep_hours}`,
    `- Physical Conditions: ${physicalConditionsText}`,
    `- Prior Diagnoses: ${priorDiagnosesText}`,
    `- Current Psychiatric Medication: ${profileData.current_psychiatric_medication}`,
    `- Previous Psychiatric Hospitalization: ${profileData.previous_psychiatric_hospitalization}`,
    `- Previous Therapy/Counseling: ${profileData.previous_therapy_or_counseling}`,
    '',
    'CRITICAL CLINICAL GUARDRAILS',
    '- These rules absolutely override standard PHQ-9 or GAD-7 scoring outputs when triggered.',
    '- Diagnosis Escalation: If prior diagnoses include MDD, bipolar, or anxiety disorder, escalate immediately and do NOT route to counseling-only.',
    `- Current prior diagnoses: ${priorDiagnosesText}.`,
    '- Medication Routing: If currentPsychiatricMedication is true, route to Psychiatry (not Psychology).',
    `- currentPsychiatricMedication=${profileData.current_psychiatric_medication}.`,
    '- Hospitalization Override: If previousPsychiatricHospitalization is true, force higher-severity triage regardless of current PHQ-9 score.',
    `- previousPsychiatricHospitalization=${profileData.previous_psychiatric_hospitalization}.`,
    '- Therapy Exposure: Use previousTherapyOrCounseling as treatment-readiness context to inform modality (individual vs group therapy).',
    `- previousTherapyOrCounseling=${profileData.previous_therapy_or_counseling}.`,
    ...lifestyleSection,
    '',
    'BUSINESS RULES TO ENFORCE',
    '1) LOA Logic',
    '- Check remaining sick and wellness leave before any LOA auto-approval.',
    `- ${probationaryLeaveNote}`,
    '- If leave is insufficient or policy is ambiguous, do not auto-approve; escalate for HR review.',
    '',
    '2) Team Coverage',
    '- Avoid recommending or triggering leave actions that could cause multiple agents from the same team to be out simultaneously.',
    `- Team to protect for staffing continuity: ${profileData.team_id}.`,
    '- If team coverage status is unknown, require manager/HR confirmation before final recommendation.',
    '',
    '3) Tenure Context',
    '- Interpret distress signals with tenure awareness.',
    '- Sudden distress from long-tenured employees can indicate a high-priority risk shift versus baseline behavior.',
    '- For newer employees, consider onboarding/adjustment stress as a possible contextual factor while still assessing risk seriously.',
    '',
    '4) Clinical Adjustment',
    `- ${shiftClinicalNote}`,
    '- Do not ignore severe indicators; adjust interpretation, not safety thresholds.',
    '',
    '5) HMO Matching',
    '- Use HMO provider and plan type to match likely covered clinics, services, and referral pathways.',
    '- If exact coverage cannot be confirmed, present options with a verification note instead of making unsupported claims.',
    '',
    '6) Age Context',
    '- Interpret PHQ-9 and GAD-7 severity thresholds in context of the user age group, not as age-neutral signals.',
    '',
    '7) Sex Context',
    `- Sex at birth is ${profileData.sex_at_birth}; account for differences in depression vs anxiety presentation when weighting pathways.`,
    '',
    '8) Language Context',
    `- ${languageInstruction}`,
    '',
    '9) Role Stressors',
    `- Job function is ${profileData.job_function}; incorporate role-specific stressor profiles (e.g., front-line exposure, leadership pressure, workload pattern).`,
    '',
    '10) Sleep Baseline',
    `- Evaluate PHQ-9 Item 3 relative to baseline sleep (${profileData.baseline_sleep_hours} hours), not a universal 8-hour baseline.`,
    `- ${shiftClinicalNote}`,
    '',
    '11) Comorbidities',
    '- Factor physical conditions as clinical comorbidities affecting scoring interpretation and pathway routing.',
    `- Reported physical conditions: ${physicalConditionsText}.`,
    '',
    'RESPONSE STYLE',
    '- Be concise, empathetic, and policy-safe.',
    '- Surface assumptions clearly and flag uncertainties requiring human confirmation.',
  ].join('\n');
}
