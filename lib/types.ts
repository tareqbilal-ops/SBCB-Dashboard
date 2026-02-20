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
