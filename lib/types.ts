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

export const INITIATIVE_STATUSES = [
  "مقدّم",
  "قيد الدراسة",
  "مستوفية مبدئياً",
  "قيد المراجعة",
  "مقبول",
  "مرفوض",
  "احتياطية",
  "معتمدة ضمن التشكيلة",
] as const;
export type InitiativeStatus = (typeof INITIATIVE_STATUSES)[number];

// ========== CANDIDATE EVALUATION TYPES ==========

export const CANDIDATE_ROLES = [
  "رئيس المجلس",
  "نائب رئيس المجلس",
  "عضو مجلس إدارة",
  "عضو احتياطي",
  "غير محدد",
] as const;
export type CandidateRole = (typeof CANDIDATE_ROLES)[number];

export const ACTIVITY_TYPES = [
  "إنتاجي",
  "تجاري",
  "تصديري",
  "استثماري",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const BUSINESS_SIZES = [
  "صغير (أقل من 10 موظفين)",
  "متوسط (10-50 موظف)",
  "كبير (51-200 موظف)",
  "مؤسسة كبرى (أكثر من 200 موظف)",
] as const;
export type BusinessSize = (typeof BUSINESS_SIZES)[number];

export const SYRIAN_CITIES = [
  "دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "دير الزور",
  "الرقة",
  "الحسكة",
  "درعا",
  "السويداء",
  "القنيطرة",
  "إدلب",
  "ريف دمشق",
] as const;
export type SyrianCity = (typeof SYRIAN_CITIES)[number];

export const ECONOMIC_SECTORS = [
  "الصناعة",
  "التجارة",
  "الزراعة",
  "السياحة",
  "الخدمات المالية",
  "التكنولوجيا",
  "البناء والتشييد",
  "النقل واللوجستيات",
  "الطاقة",
  "الصناعات الغذائية",
  "الصناعات الكيميائية",
  "النسيج والألبسة",
  "الاستثمار العقاري",
  "الخدمات الاستشارية",
  "أخرى",
] as const;
export type EconomicSector = (typeof ECONOMIC_SECTORS)[number];

// Candidate evaluation criteria (1-5 scale)
export interface CandidateEvaluation {
  quality_score: number; // جودة المبادرة
  feasibility_score: number; // قابلية التنفيذ
  financial_capacity_score: number; // الملاءة المالية
  network_score: number; // شبكة العلاقات
  reputation_score: number; // السمعة المهنية
  sector_importance_score: number; // الأهمية القطاعية
  geographic_representation_score: number; // التمثيل الجغرافي
  total_score: number; // المجموع (محسوب)
}

// Extended initiative with candidate data
export interface CandidateData {
  // Basic info
  full_name: string;
  email: string;
  phone: string;
  
  // Location
  target_country: string; // الدولة الشريكة
  current_residence_country: string; // بلد الإقامة الحالي
  origin_city: SyrianCity; // المدينة الأصل في سوريا
  
  // Business info
  economic_sector: EconomicSector; // القطاع الاقتصادي
  activity_type: ActivityType; // نوع النشاط
  business_size: BusinessSize; // حجم النشاط أو الشركة
  initiative_description: string; // وصف المبادرة
  
  // Network & experience
  partner_country_network: string; // شبكة العلاقات في الدولة الشريكة
  professional_record: string; // السجل المهني المختصر
  
  // Role preference
  desired_role: CandidateRole; // الرغبة بالدور
  
  // Files
  company_profile_url: string | null;
  cv_url: string | null;
  
  // Evaluation (filled by reviewer)
  evaluation: CandidateEvaluation | null;
  
  // Final assignment
  assigned_role: CandidateRole | null;
}

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

// ========== ROLE TYPES (Based on ref_roles) ==========

export const ROLE_CODES = [
  "super_admin",
  "coordination_admin",
  "council_chairman",
  "executive_member",
  "appointments_manager",
  "initiatives_manager",
  "media_editor",
  "viewer",
] as const;
export type RoleCode = (typeof ROLE_CODES)[number];

export const ROLE_LABELS: Record<RoleCode, string> = {
  super_admin: "مدير عام",
  coordination_admin: "إدارة المجلس التنسيقي",
  council_chairman: "رئيس مجلس",
  executive_member: "عضو تنفيذي",
  appointments_manager: "مدير المواعيد",
  initiatives_manager: "مدير المبادرات",
  media_editor: "محرر إعلامي",
  viewer: "مستخدم للقراءة فقط",
};

// ========== SECTOR TYPES ==========

export const SECTOR_CODES = [
  "industry",
  "trade",
  "investment",
  "energy",
  "construction",
  "agriculture",
  "tourism",
  "services",
  "transport",
  "technology",
  "textile",
  "food",
  "other",
] as const;
export type SectorCode = (typeof SECTOR_CODES)[number];

export const SECTOR_LABELS: Record<SectorCode, string> = {
  industry: "الصناعة",
  trade: "التجارة",
  investment: "الاستثمار",
  energy: "الطاقة",
  construction: "الإنشاءات",
  agriculture: "الزراعة",
  tourism: "السياحة",
  services: "الخدمات",
  transport: "النقل",
  technology: "التكنولوجيا",
  textile: "النسيج",
  food: "الغذائيات",
  other: "أخرى",
};

// ========== COUNCIL TYPES ==========

export const COUNCIL_STATUSES = ["draft", "active", "frozen", "closed"] as const;
export type CouncilStatus = (typeof COUNCIL_STATUSES)[number];

export const COUNCIL_STATUS_LABELS: Record<CouncilStatus, string> = {
  draft: "مسودة",
  active: "نشط",
  frozen: "مجمد",
  closed: "مغلق",
};

export const ESTABLISHMENT_STAGES = [
  "under_establishment",
  "approved",
  "active",
  "reorganized",
] as const;
export type EstablishmentStage = (typeof ESTABLISHMENT_STAGES)[number];

export const ESTABLISHMENT_STAGE_LABELS: Record<EstablishmentStage, string> = {
  under_establishment: "قيد التأسيس",
  approved: "معتمد",
  active: "نشط",
  reorganized: "معاد هيكلته",
};

export interface Council {
  id: string;
  uuid: string;
  name_ar: string;
  name_en: string | null;
  partner_country_code: string;
  partner_country_name: string;
  status: CouncilStatus;
  establishment_stage: EstablishmentStage;
  chairman_user_id: string | null;
  summary: string | null;
  sectors: SectorCode[];
  created_at: string;
  updated_at: string;
}

// ========== SYSTEM USER TYPES ==========

export interface SystemUser {
  id: string;
  uuid: string;
  council_id: string | null;
  name: string;
  email: string;
  role_code: RoleCode;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

// ========== MEMBERSHIP TYPES ==========

export const MEMBER_TYPES = ["individual", "company", "institution"] as const;
export type MemberType = (typeof MEMBER_TYPES)[number];

export const MEMBER_TYPE_LABELS: Record<MemberType, string> = {
  individual: "فرد",
  company: "شركة",
  institution: "مؤسسة",
};

export const MEMBERSHIP_STATUSES = ["active", "inactive"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export interface Membership {
  id: string;
  uuid: string;
  council_id: string;
  member_type: MemberType;
  name: string;
  representative_name: string | null;
  sector_code: SectorCode | null;
  status: MembershipStatus;
  email: string | null;
  phone: string | null;
  country_relation: string | null;
  joined_at: string | null;
  deactivation_reason: string | null;
  created_at: string;
  updated_at: string;
}

// ========== GOVERNANCE & COMPLIANCE TYPES ==========

export interface GovernanceAssessment {
  id: string;
  council_id: string;
  assessment_period: string;
  national_interest_score: number;
  professionalism_score: number;
  institutional_discipline_score: number;
  transparency_score: number;
  clarity_of_responsibility_score: number;
  evaluability_score: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const COMPLIANCE_STATUSES = ["compliant", "partially_compliant", "non_compliant"] as const;
export type ComplianceStatus = (typeof COMPLIANCE_STATUSES)[number];

export const COMPLIANCE_STATUS_LABELS: Record<ComplianceStatus, string> = {
  compliant: "ملتزم",
  partially_compliant: "ملتزم جزئياً",
  non_compliant: "غير ملتزم",
};

export interface ComplianceCheck {
  id: string;
  council_id: string;
  check_period: string;
  has_annual_plan: boolean;
  has_measurable_goals: boolean;
  has_periodic_reports: boolean;
  uses_national_platform: boolean;
  uses_membership_portal: boolean;
  uses_appointments_portal: boolean;
  uses_initiatives_portal: boolean;
  uses_media_window: boolean;
  cooperates_with_coordination_board: boolean;
  respects_media_guidelines: boolean;
  official_correspondence_compliant: boolean;
  overall_compliance_status: ComplianceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ========== SCORES & CLASSIFICATION TYPES ==========

export const CLASSIFICATION_TYPES = [
  "leading",
  "stable",
  "needs_improvement",
  "at_risk",
] as const;
export type ClassificationType = (typeof CLASSIFICATION_TYPES)[number];

export const CLASSIFICATION_LABELS: Record<ClassificationType, string> = {
  leading: "رائد",
  stable: "مستقر",
  needs_improvement: "يحتاج تحسين",
  at_risk: "في خطر",
};

export interface CouncilScore {
  id: string;
  council_id: string;
  period: string;
  governance_score: number;
  compliance_score: number;
  execution_score: number;
  impact_score: number;
  integration_score: number;
  platform_services_score: number;
  overall_score: number;
  classification: ClassificationType;
  created_at: string;
}

// ========== ALERT TYPES ==========

export const ALERT_TYPES = [
  "missing_annual_plan",
  "missing_reports",
  "low_activity",
  "low_impact",
  "low_platform_usage",
  "governance_risk",
  "compliance_breach",
  "integration_gap",
  "low_appointments_usage",
  "low_initiatives_usage",
  "low_media_activity",
  "outdated_opportunities",
] as const;
export type AlertType = (typeof ALERT_TYPES)[number];

export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  missing_annual_plan: "خطة سنوية مفقودة",
  missing_reports: "تقارير مفقودة",
  low_activity: "نشاط منخفض",
  low_impact: "تأثير منخفض",
  low_platform_usage: "استخدام منخفض للمنصة",
  governance_risk: "خطر حوكمة",
  compliance_breach: "خرق امتثال",
  integration_gap: "فجوة تكامل",
  low_appointments_usage: "استخدام منخفض للمواعيد",
  low_initiatives_usage: "استخدام منخفض للمبادرات",
  low_media_activity: "نشاط إعلامي منخفض",
  outdated_opportunities: "فرص قديمة",
};

export const ALERT_SEVERITIES = ["low", "medium", "high"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
};

export const ALERT_STATUSES = ["open", "resolved", "dismissed"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export interface Alert {
  id: string;
  council_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  message: string;
  status: AlertStatus;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
}

// ========== AUDIT LOG TYPES ==========

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  changes_json: Record<string, unknown> | null;
  created_at: string;
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
