export type AITriagePathway =
  | 'Counseling'
  | 'Psychiatry'
  | 'Immediate Escalation'
  | 'Standard LOA';

export type TriageLogStatus = 'Pending' | 'Reviewed' | 'Escalated' | 'Resolved';

export interface TriageLog {
  id: string;
  user_id: string;
  created_at: string;
  user_free_text: string;
  phq9_score?: number;
  gad7_score?: number;
  ai_triage_pathway: AITriagePathway;
  loa_recommended: boolean;
  ai_reasoning: string;
  policy_basis?: string;
  reference_number: string;
  status: TriageLogStatus;
}
