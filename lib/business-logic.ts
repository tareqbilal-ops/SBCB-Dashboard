import type { Country, ReadinessLabel, KPIs, Stage } from "./types";

export const TOTAL_TARGET = 62;

export function computeScoreTotal(country: Pick<Country, "score_network" | "score_institutional" | "score_market" | "score_strategic">): number {
  return country.score_network + country.score_institutional + country.score_market + country.score_strategic;
}

export function getReadinessLabel(scoreTotal: number): ReadinessLabel {
  if (scoreTotal >= 85) return "جاهز للاعتماد";
  if (scoreTotal >= 70) return "جاهز للمرحلة المؤقتة";
  if (scoreTotal >= 50) return "يحتاج تطوير";
  return "غير جاهز";
}

export function getNextAction(stage: Stage): string {
  switch (stage) {
    case "Approved":
      return "متابعة الأداء (ربع سنوي)";
    case "Ready for Approval":
      return "تحضير ملف اعتماد للوزير";
    case "Provisional":
      return "تنفيذ خطة 6 أشهر + فعالية واحدة";
    case "Under Assessment":
      return "استكمال الشريك المقابل + لجنة تأسيس";
    case "Candidate":
      return "جمع قاعدة أعضاء + تحديد 3 قطاعات";
    default:
      return "";
  }
}

export function canTransitionToReady(country: Country): { allowed: boolean; reason?: string } {
  if (country.stage !== "Provisional") {
    return { allowed: true };
  }
  if (!country.phase2_track) {
    return { allowed: false, reason: "مسار الاختبار غير محدد" };
  }
  if (country.phase2_activity_done !== "نعم") {
    return { allowed: false, reason: "اختبار المرحلة 2 غير مستوفى" };
  }
  return { allowed: true };
}

export function getDaysInStage(entryDate: string): number {
  const entry = new Date(entryDate);
  const now = new Date();
  return Math.floor((now.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
}

export function computeKPIs(countries: Country[]): KPIs {
  const approvedCount = countries.filter((c) => c.stage === "Approved").length;
  const readyCount = countries.filter((c) => c.stage === "Ready for Approval").length;
  const provisionalCount = countries.filter((c) => c.stage === "Provisional").length;
  const underAssessmentCount = countries.filter((c) => c.stage === "Under Assessment").length;
  const candidateCount = countries.filter((c) => c.stage === "Candidate").length;

  const progress = approvedCount / TOTAL_TARGET;
  const avgScore = countries.length > 0
    ? Math.round(countries.reduce((sum, c) => sum + c.score_total, 0) / countries.length)
    : 0;

  const provisionalCountries = countries.filter((c) => c.stage === "Provisional");
  const phase2PassCount = provisionalCountries.filter(
    (c) => c.phase2_activity_done === "نعم"
  ).length;
  const phase2FailCount = provisionalCountries.filter(
    (c) => c.phase2_activity_done !== "نعم"
  ).length;

  return {
    approvedCount,
    readyCount,
    provisionalCount,
    underAssessmentCount,
    candidateCount,
    progress,
    avgScore,
    phase2PassCount,
    phase2FailCount,
    totalTarget: TOTAL_TARGET,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-600";
  if (score >= 70) return "text-amber-600";
  if (score >= 50) return "text-orange-600";
  return "text-red-600";
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 70) return "bg-amber-50 text-amber-700 border-amber-200";
  if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export function getStageBadgeColor(stage: Stage): string {
  switch (stage) {
    case "Approved":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "Ready for Approval":
      return "bg-teal-100 text-teal-800 border-teal-300";
    case "Provisional":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Under Assessment":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Candidate":
      return "bg-slate-100 text-slate-600 border-slate-300";
    default:
      return "bg-slate-100 text-slate-600 border-slate-300";
  }
}

export function getStageLabel(stage: Stage): string {
  switch (stage) {
    case "Approved": return "معتمد";
    case "Ready for Approval": return "جاهز للاعتماد";
    case "Provisional": return "مرحلة مؤقتة";
    case "Under Assessment": return "قيد التقييم";
    case "Candidate": return "مرشح";
    default: return stage;
  }
}

export function getRiskLevelColor(level: string): string {
  switch (level) {
    case "مرتفع": return "bg-red-100 text-red-800 border-red-300";
    case "متوسط": return "bg-amber-100 text-amber-800 border-amber-300";
    case "منخفض": return "bg-emerald-100 text-emerald-800 border-emerald-300";
    default: return "bg-slate-100 text-slate-600 border-slate-300";
  }
}

export function getRiskStatusColor(status: string): string {
  switch (status) {
    case "مفتوح": return "bg-red-50 text-red-700 border-red-200";
    case "قيد المعالجة": return "bg-amber-50 text-amber-700 border-amber-200";
    case "مغلق": return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default: return "bg-slate-50 text-slate-600 border-slate-200";
  }
}
