import type { Country, Risk } from "./types";

export const seedCountries: Country[] = [
  {
    id: "c-001", country_name_ar: "تركيا", tier: "Tier 1", stage: "Approved",
    score_network: 22, score_institutional: 21, score_market: 20, score_strategic: 23, score_total: 86,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-09-01", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-002", country_name_ar: "السعودية", tier: "Tier 1", stage: "Approved",
    score_network: 21, score_institutional: 22, score_market: 21, score_strategic: 22, score_total: 86,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-10-15", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-003", country_name_ar: "ألمانيا", tier: "Tier 1", stage: "Approved",
    score_network: 23, score_institutional: 22, score_market: 21, score_strategic: 24, score_total: 90,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-08-20", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-004", country_name_ar: "المملكة المتحدة", tier: "Tier 1", stage: "Approved",
    score_network: 20, score_institutional: 21, score_market: 20, score_strategic: 22, score_total: 83,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-11-05", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-005", country_name_ar: "الولايات المتحدة", tier: "Tier 1", stage: "Approved",
    score_network: 22, score_institutional: 20, score_market: 22, score_strategic: 23, score_total: 87,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-12-01", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-006", country_name_ar: "كندا", tier: "Tier 1", stage: "Approved",
    score_network: 19, score_institutional: 21, score_market: 20, score_strategic: 22, score_total: 82,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-12-10", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-007", country_name_ar: "الصين", tier: "Tier 1", stage: "Approved",
    score_network: 21, score_institutional: 20, score_market: 22, score_strategic: 21, score_total: 84,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-09-30", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-008", country_name_ar: "فرنسا", tier: "Tier 1", stage: "Approved",
    score_network: 20, score_institutional: 21, score_market: 21, score_strategic: 22, score_total: 84,
    owner: "مسار الدول", notes: "مجلس معتمد وقائم",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2025-10-01", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  // Under Assessment
  {
    id: "c-009", country_name_ar: "هولندا", tier: "Tier 2", stage: "Under Assessment",
    score_network: 16, score_institutional: 14, score_market: 15, score_strategic: 16, score_total: 61,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-20", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-010", country_name_ar: "العراق", tier: "Tier 2", stage: "Under Assessment",
    score_network: 17, score_institutional: 13, score_market: 16, score_strategic: 15, score_total: 61,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-28", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-011", country_name_ar: "الكويت", tier: "Tier 2", stage: "Under Assessment",
    score_network: 15, score_institutional: 12, score_market: 14, score_strategic: 16, score_total: 57,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-18", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-012", country_name_ar: "الإمارات", tier: "Tier 1", stage: "Under Assessment",
    score_network: 18, score_institutional: 15, score_market: 17, score_strategic: 18, score_total: 68,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-10", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-013", country_name_ar: "الأردن", tier: "Tier 2", stage: "Under Assessment",
    score_network: 16, score_institutional: 14, score_market: 14, score_strategic: 15, score_total: 59,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-02-01", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-014", country_name_ar: "مصر", tier: "Tier 2", stage: "Under Assessment",
    score_network: 17, score_institutional: 14, score_market: 15, score_strategic: 16, score_total: 62,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-12", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-015", country_name_ar: "إيطاليا", tier: "Tier 2", stage: "Under Assessment",
    score_network: 16, score_institutional: 13, score_market: 15, score_strategic: 15, score_total: 59,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-25", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-016", country_name_ar: "ماليزيا", tier: "Tier 3", stage: "Under Assessment",
    score_network: 14, score_institutional: 12, score_market: 13, score_strategic: 14, score_total: 53,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-30", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-017", country_name_ar: "إندونيسيا", tier: "Tier 3", stage: "Under Assessment",
    score_network: 13, score_institutional: 12, score_market: 13, score_strategic: 13, score_total: 51,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-22", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-018", country_name_ar: "السودان", tier: "Tier 3", stage: "Under Assessment",
    score_network: 12, score_institutional: 11, score_market: 12, score_strategic: 12, score_total: 47,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-02-02", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-019", country_name_ar: "بلجيكا", tier: "Tier 2", stage: "Under Assessment",
    score_network: 15, score_institutional: 13, score_market: 14, score_strategic: 14, score_total: 56,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-15", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-020", country_name_ar: "ليبيا", tier: "Tier 3", stage: "Under Assessment",
    score_network: 13, score_institutional: 10, score_market: 12, score_strategic: 13, score_total: 48,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-02-05", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-021", country_name_ar: "السويد", tier: "Tier 2", stage: "Under Assessment",
    score_network: 15, score_institutional: 12, score_market: 13, score_strategic: 14, score_total: 54,
    owner: "خلية التوسع", notes: "ضمن دائرة الدراسة (تقييم جاهزية)",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-01-27", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  // Provisional
  {
    id: "c-022", country_name_ar: "قطر", tier: "Tier 2", stage: "Provisional",
    score_network: 18, score_institutional: 17, score_market: 18, score_strategic: 17, score_total: 70,
    owner: "خلية التوسع", notes: "مرحلة مؤقتة للاختبار",
    phase2_track: "جلب استثمارات", phase2_activity_done: "نعم", phase2_activity_value: "تنظيم لقاءين مع مستثمرين + خطاب نوايا مبدئي",
    entry_date: "2026-01-05", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-023", country_name_ar: "إسبانيا", tier: "Tier 3", stage: "Provisional",
    score_network: 17, score_institutional: 16, score_market: 16, score_strategic: 16, score_total: 65,
    owner: "خلية التوسع", notes: "مرحلة مؤقتة للاختبار",
    phase2_track: "بيع خدمات", phase2_activity_done: "لا", phase2_activity_value: null,
    entry_date: "2026-01-12", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-024", country_name_ar: "اليابان", tier: "Tier 3", stage: "Provisional",
    score_network: 16, score_institutional: 15, score_market: 16, score_strategic: 16, score_total: 63,
    owner: "خلية التوسع", notes: "مرحلة مؤقتة للاختبار",
    phase2_track: "زيادة صادرات", phase2_activity_done: "نعم", phase2_activity_value: "صفقة تصدير تجريبية (طلبية أولية)",
    entry_date: "2026-01-18", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-025", country_name_ar: "لبنان", tier: "Tier 2", stage: "Provisional",
    score_network: 15, score_institutional: 14, score_market: 15, score_strategic: 15, score_total: 59,
    owner: "خلية التوسع", notes: "مرحلة مؤقتة للاختبار",
    phase2_track: "بيع خدمات", phase2_activity_done: "نعم", phase2_activity_value: "توقيع عقد خدمات لوجستية تجريبي",
    entry_date: "2026-01-25", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  // Candidates
  {
    id: "c-026", country_name_ar: "روسيا", tier: "Tier 3", stage: "Candidate",
    score_network: 12, score_institutional: 10, score_market: 11, score_strategic: 10, score_total: 43,
    owner: "الأمانة العامة", notes: "مرشح احتياطي",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-02-10", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "c-027", country_name_ar: "كوريا الجنوبية", tier: "Tier 3", stage: "Candidate",
    score_network: 13, score_institutional: 11, score_market: 12, score_strategic: 11, score_total: 47,
    owner: "الأمانة العامة", notes: "مرشح احتياطي",
    phase2_track: null, phase2_activity_done: null, phase2_activity_value: null,
    entry_date: "2026-02-08", created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
];

export const seedRisks: Risk[] = [
  {
    id: "r-001", country_id: "c-012", risk_type: "حساسية سياسية", risk_level: "متوسط",
    mitigation: "توجيه مجلس الإدارة + تحديد نطاق التمثيل", status: "مفتوح",
    created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "r-002", country_id: "c-011", risk_type: "غياب شريك مقابل", risk_level: "مرتفع",
    mitigation: "تثبيت نقطة اتصال مقابلة خلال 30 يوم", status: "قيد المعالجة",
    created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "r-003", country_id: "c-023", risk_type: "ضعف شبكة مؤسسين", risk_level: "متوسط",
    mitigation: "توسيع قاعدة الأعضاء + 3 شركات محورية", status: "مفتوح",
    created_at: "2026-02-16T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
];
