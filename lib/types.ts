// ========== ENUMS ==========

export const TIERS = ["Tier 1", "Tier 2", "Tier 3"] as const;
export type Tier = (typeof TIERS)[number];

export const STAGES = [
  "Candidate",
  "Under Assessment",
  "Provisional",
  "Ready for Approval",
  "Approved",
] as const;
export type Stage = (typeof STAGES)[number];

export const PHASE2_TRACKS = [
  "زيادة صادرات",
  "جلب استثمارات",
  "بيع خدمات",
] as const;
export type Phase2Track = (typeof PHASE2_TRACKS)[number];

export const RISK_TYPES = [
  "حساسية سياسية",
  "ضعف شبكة مؤسسين",
  "غياب شريك مقابل",
  "تضارب جغرافي",
  "تضارب مصالح محتمل",
] as const;
export type RiskType = (typeof RISK_TYPES)[number];

export const RISK_LEVELS = ["منخفض", "متوسط", "مرتفع"] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

export const RISK_STATUSES = ["مفتوح", "قيد المعالجة", "مغلق"] as const;
export type RiskStatus = (typeof RISK_STATUSES)[number];

// ========== ENTITIES ==========

export interface Country {
  id: string;
  country_name_ar: string;
  tier: Tier;
  stage: Stage;
  score_network: number;
  score_institutional: number;
  score_market: number;
  score_strategic: number;
  score_total: number;
  owner: string;
  notes: string;
  phase2_track: Phase2Track | null;
  phase2_activity_done: "نعم" | "لا" | null;
  phase2_activity_value: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface Risk {
  id: string;
  country_id: string;
  risk_type: RiskType;
  risk_level: RiskLevel;
  mitigation: string;
  status: RiskStatus;
  created_at: string;
  updated_at: string;
}

// ========== PROJECT TYPES ==========

export const PROJECT_TYPES = ["تجاري", "بحثي"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const PROJECT_STATUSES = ["مقترح", "قيد التنفيذ", "مكتمل", "معلّق", "ملغى"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_PRIORITIES = ["عاجل", "مرتفع", "متوسط", "منخفض"] as const;
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number];

export const COUNCIL_TYPES = ["ثنائي", "إقليمي"] as const;
export type CouncilType = (typeof COUNCIL_TYPES)[number];

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  description: string;
  council_type: CouncilType | null;
  country_ids: string[];
  sector: string | null;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  owner: string;
  participants: string[];
  created_at: string;
  updated_at: string;
}

// ========== PARTICIPANT TYPES ==========

export const PARTICIPANT_TYPES = ["شخصية حقيقية", "شركة", "هيئة", "مجلس"] as const;
export type ParticipantType = (typeof PARTICIPANT_TYPES)[number];

export interface Participant {
  id: string;
  name: string;
  type: ParticipantType;
  email: string;
  phone: string;
  country: string;
  organization: string | null;
  role: string;
  council_ids: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

// ========== AUTH TYPES ==========

export const MEMBERSHIP_LEVELS = [
  "مشرف عام",
  "مدير إقليمي",
  "مدير مجلس",
  "عضو",
  "زائر",
] as const;
export type MembershipLevel = (typeof MEMBERSHIP_LEVELS)[number];

export interface User {
  id: string;
  name: string;
  email: string;
  membership_level: MembershipLevel;
  access_key: string;
}

// ========== INITIATIVE TYPES ==========

export const INITIATIVE_STATUSES = ["مقدّم", "قيد المراجعة", "مقبول", "مرفوض"] as const;
export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number];

export interface Initiative {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  target_country: string;
  proposed_sectors: string[];
  founding_members: string;
  business_plan_summary: string;
  attachments: string[];
  status: InitiativeStatus;
  submitted_by: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
}

// ========== COMPUTED TYPES ==========

export type ReadinessLabel =
  | "جاهز للاعتماد"
  | "جاهز للمرحلة المؤقتة"
  | "يحتاج تطوير"
  | "غير جاهز";

export interface KPIs {
  approvedCount: number;
  readyCount: number;
  provisionalCount: number;
  underAssessmentCount: number;
  candidateCount: number;
  progress: number;
  avgScore: number;
  phase2PassCount: number;
  phase2FailCount: number;
  totalTarget: number;
}
