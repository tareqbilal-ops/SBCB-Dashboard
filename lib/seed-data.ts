import type { Country, Risk, Project, Participant, User, Initiative } from "./types";

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

// ========== USERS ==========

export const seedUsers: User[] = [
  { id: "u-001", name: "المشرف العام", email: "admin@sbcb.org", membership_level: "مشرف عام", access_key: "ADMIN-2026" },
  { id: "u-002", name: "مدير الإقليم", email: "region@sbcb.org", membership_level: "مدير إقليمي", access_key: "REGION-2026" },
  { id: "u-003", name: "مدير المجلس", email: "council@sbcb.org", membership_level: "مدير مجلس", access_key: "COUNCIL-2026" },
  { id: "u-004", name: "عضو المجلس", email: "member@sbcb.org", membership_level: "عضو", access_key: "MEMBER-2026" },
  { id: "u-005", name: "زائر", email: "visitor@sbcb.org", membership_level: "زائر", access_key: "VISITOR-2026" },
];

// ========== PROJECTS ==========

export const seedProjects: Project[] = [
  {
    id: "p-001", name: "مشروع تعزيز الصادرات السورية إلى تركيا", type: "تجاري",
    status: "قيد التنفيذ", priority: "مرتفع",
    description: "مشروع لتطوير سلاسل التصدير وتسهيل التبادل التجاري بين سوريا وتركيا عبر المجلس الثنائي",
    council_type: "ثنائي", country_ids: ["c-001"], sector: null,
    budget: 250000, start_date: "2026-01-15", end_date: "2026-12-31",
    owner: "مجلس الأعمال السوري-التركي", participants: ["pt-001", "pt-002"],
    created_at: "2026-01-10T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "p-002", name: "منصة الاستثمار المشترك - الخليج", type: "تجاري",
    status: "مقترح", priority: "عاجل",
    description: "إنشاء منصة رقمية للاستثمار المشترك بين سوريا ودول الخليج العربي بإشراف المجلس الإقليمي",
    council_type: "إقليمي", country_ids: ["c-002", "c-012", "c-022"], sector: null,
    budget: 500000, start_date: "2026-03-01", end_date: "2027-03-01",
    owner: "المجلس الإقليمي - الخليج", participants: ["pt-003", "pt-004"],
    created_at: "2026-02-01T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "p-003", name: "دراسة تطوير التشريعات التجارية", type: "بحثي",
    status: "قيد التنفيذ", priority: "مرتفع",
    description: "دراسة بحثية لتحليل التشريعات التجارية ووضع توصيات لتحسين بيئة الأعمال بإشراف المجلس القطاعي للتشريعات",
    council_type: null, country_ids: [], sector: "التشريعات والسياسات التجارية",
    budget: 120000, start_date: "2026-02-01", end_date: "2026-08-01",
    owner: "المجلس القطاعي للتشريعات", participants: ["pt-005"],
    created_at: "2026-01-20T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "p-004", name: "تحليل فرص السوق الألمانية", type: "بحثي",
    status: "مكتمل", priority: "متوسط",
    description: "بحث ميداني حول فرص دخول المنتجات السورية إلى السوق الألمانية وتحديد القطاعات الواعدة",
    council_type: null, country_ids: ["c-003"], sector: "تحليل الأسواق",
    budget: 80000, start_date: "2025-09-01", end_date: "2026-01-31",
    owner: "المجلس القطاعي لتحليل الأسواق", participants: ["pt-002", "pt-005"],
    created_at: "2025-09-01T10:00:00Z", updated_at: "2026-02-01T10:00:00Z"
  },
  {
    id: "p-005", name: "معرض التجارة السوري-البريطاني", type: "تجاري",
    status: "قيد التنفيذ", priority: "متوسط",
    description: "تنظيم معرض تجاري مشترك في لندن لعرض المنتجات والخدمات السورية",
    council_type: "ثنائي", country_ids: ["c-004"], sector: null,
    budget: 180000, start_date: "2026-04-01", end_date: "2026-06-30",
    owner: "مجلس الأعمال السوري-البريطاني", participants: ["pt-001", "pt-004"],
    created_at: "2026-02-10T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "p-006", name: "بحث سياسات دعم المنشآت الصغيرة", type: "بحثي",
    status: "مقترح", priority: "منخفض",
    description: "إعداد ورقة سياسات لدعم صاحب القرار في مجال المنشآت الصغيرة والمتوسطة",
    council_type: null, country_ids: [], sector: "دعم المنشآت الصغيرة",
    budget: 60000, start_date: null, end_date: null,
    owner: "المجلس القطاعي للمنشآت الصغيرة", participants: [],
    created_at: "2026-02-15T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
];

// ========== PARTICIPANTS ==========

export const seedParticipants: Participant[] = [
  {
    id: "pt-001", name: "أحمد الخطيب", type: "شخصية حقيقية",
    email: "ahmed@example.com", phone: "+90 555 123 4567", country: "تركيا",
    organization: "مجموعة الخطيب التجارية", role: "رئيس مجلس الأعمال السوري-التركي",
    council_ids: ["c-001"], notes: "عضو مؤسس",
    created_at: "2025-09-01T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "pt-002", name: "شركة النور للاستيراد والتصدير", type: "شركة",
    email: "info@alnour.com", phone: "+49 30 1234567", country: "ألمانيا",
    organization: null, role: "عضو مجلس إدارة",
    council_ids: ["c-003"], notes: "شركة تجارية رائدة في الاستيراد والتصدير",
    created_at: "2025-10-01T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "pt-003", name: "غرفة تجارة وصناعة الرياض", type: "هيئة",
    email: "riyadh@chamber.sa", phone: "+966 11 234 5678", country: "السعودية",
    organization: null, role: "شريك مؤسسي",
    council_ids: ["c-002"], notes: "شريك استراتيجي في المنطقة",
    created_at: "2025-10-15T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "pt-004", name: "مجلس الأعمال السوري-الإماراتي", type: "مجلس",
    email: "council@sbcb-uae.org", phone: "+971 4 567 8901", country: "الإمارات",
    organization: null, role: "مجلس شريك",
    council_ids: ["c-012"], notes: "مجلس قيد التأسيس",
    created_at: "2026-01-10T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "pt-005", name: "د. سمير حسن", type: "شخصية حقيقية",
    email: "samir@research.org", phone: "+44 20 7123 4567", country: "المملكة المتحدة",
    organization: "مركز أبحاث السياسات الاقتصادية", role: "باحث رئيسي",
    council_ids: ["c-004"], notes: "خبير في السياسات التجارية والتشريعات",
    created_at: "2025-11-05T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "pt-006", name: "محمد العلي", type: "شخصية حقيقية",
    email: "mali@business.com", phone: "+1 202 555 0199", country: "الولايات المتحدة",
    organization: "العلي للاستشارات", role: "عضو",
    council_ids: ["c-005"], notes: "",
    created_at: "2025-12-01T10:00:00Z", updated_at: "2026-02-16T10:00:00Z"
  },
];

// ========== INITIATIVES ==========

export const seedInitiatives: Initiative[] = [
  {
    id: "i-001", applicant_name: "عمر الشامي", applicant_email: "omar@example.com",
    applicant_phone: "+90 532 987 6543", target_country: "هولندا",
    proposed_sectors: ["التقنية", "الزراعة"], founding_members: "5 رجال أعمال سوريين مقيمين في هولندا، 3 شركاء هولنديين",
    business_plan_summary: "إنشاء مجلس أعمال سوري-هولندي يركز على تبادل الخبرات الزراعية والتقنية",
    attachments: ["business-plan.pdf", "founders-cv.pdf"],
    status: "قيد المراجعة", submitted_by: "u-004",
    submitted_at: "2026-02-10T10:00:00Z", reviewed_at: null, reviewer_notes: null
  },
  {
    id: "i-002", applicant_name: "ليلى حداد", applicant_email: "layla@example.com",
    applicant_phone: "+39 06 123 4567", target_country: "إيطاليا",
    proposed_sectors: ["الصناعات الغذائية", "السياحة"], founding_members: "7 أعضاء مؤسسين بين سوريا وإيطاليا",
    business_plan_summary: "تأسيس مجلس أعمال سوري-إيطالي متخصص في الصناعات الغذائية والسياحة",
    attachments: ["proposal.pdf"],
    status: "مقدّم", submitted_by: "u-004",
    submitted_at: "2026-02-18T10:00:00Z", reviewed_at: null, reviewer_notes: null
  },
];

// ========== RISKS ==========

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
