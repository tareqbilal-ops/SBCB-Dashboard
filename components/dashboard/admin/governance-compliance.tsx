"use client";

import { useState, useMemo } from "react";
import {
  Council,
  GovernanceAssessment,
  ComplianceCheck,
  ComplianceStatus,
  COMPLIANCE_STATUS_LABELS,
  COUNCIL_STATUS_LABELS,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Building2,
  ClipboardCheck,
  BarChart3,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample data
const SAMPLE_COUNCILS: Council[] = [
  {
    id: "c1",
    uuid: "council-uuid-1",
    name_ar: "مجلس الأعمال السوري التركي",
    name_en: "Syrian-Turkish Business Council",
    partner_country_code: "TR",
    partner_country_name: "تركيا",
    status: "active",
    establishment_stage: "active",
    chairman_user_id: "2",
    summary: null,
    sectors: ["trade", "industry"],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "c2",
    uuid: "council-uuid-2",
    name_ar: "مجلس الأعمال السوري الإماراتي",
    name_en: null,
    partner_country_code: "AE",
    partner_country_name: "الإمارات",
    status: "active",
    establishment_stage: "approved",
    chairman_user_id: null,
    summary: null,
    sectors: ["investment"],
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
];

const SAMPLE_ASSESSMENTS: GovernanceAssessment[] = [
  {
    id: "ga1",
    council_id: "c1",
    assessment_period: "2026-Q1",
    national_interest_score: 85,
    professionalism_score: 90,
    institutional_discipline_score: 80,
    transparency_score: 75,
    clarity_of_responsibility_score: 88,
    evaluability_score: 82,
    notes: "أداء جيد مع بعض التحسينات المطلوبة في الشفافية",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "ga2",
    council_id: "c2",
    assessment_period: "2026-Q1",
    national_interest_score: 70,
    professionalism_score: 75,
    institutional_discipline_score: 65,
    transparency_score: 80,
    clarity_of_responsibility_score: 70,
    evaluability_score: 68,
    notes: "يحتاج تحسين في الانضباط المؤسسي",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
];

const SAMPLE_COMPLIANCE: ComplianceCheck[] = [
  {
    id: "cc1",
    council_id: "c1",
    check_period: "2026-Q1",
    has_annual_plan: true,
    has_measurable_goals: true,
    has_periodic_reports: true,
    uses_national_platform: true,
    uses_membership_portal: true,
    uses_appointments_portal: true,
    uses_initiatives_portal: true,
    uses_media_window: true,
    cooperates_with_coordination_board: true,
    respects_media_guidelines: true,
    official_correspondence_compliant: true,
    overall_compliance_status: "compliant",
    notes: null,
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "cc2",
    council_id: "c2",
    check_period: "2026-Q1",
    has_annual_plan: true,
    has_measurable_goals: true,
    has_periodic_reports: false,
    uses_national_platform: true,
    uses_membership_portal: true,
    uses_appointments_portal: false,
    uses_initiatives_portal: true,
    uses_media_window: false,
    cooperates_with_coordination_board: true,
    respects_media_guidelines: true,
    official_correspondence_compliant: true,
    overall_compliance_status: "partially_compliant",
    notes: "يفتقر لبوابة المواعيد والنافذة الإعلامية",
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
];

interface GovernanceComplianceProps {
  councils?: Council[];
  assessments?: GovernanceAssessment[];
  complianceChecks?: ComplianceCheck[];
}

export function GovernanceCompliance({
  councils = SAMPLE_COUNCILS,
  assessments = SAMPLE_ASSESSMENTS,
  complianceChecks = SAMPLE_COMPLIANCE,
}: GovernanceComplianceProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-Q1");
  const [detailCouncilId, setDetailCouncilId] = useState<string | null>(null);

  // Get assessment for a council
  const getAssessment = (councilId: string) =>
    assessments.find((a) => a.council_id === councilId && a.assessment_period === selectedPeriod);

  // Get compliance for a council
  const getCompliance = (councilId: string) =>
    complianceChecks.find((c) => c.council_id === councilId && c.check_period === selectedPeriod);

  // Calculate average governance score
  const calcAvgGovernance = (assessment: GovernanceAssessment) => {
    return Math.round(
      (assessment.national_interest_score +
        assessment.professionalism_score +
        assessment.institutional_discipline_score +
        assessment.transparency_score +
        assessment.clarity_of_responsibility_score +
        assessment.evaluability_score) /
        6
    );
  };

  // Calculate compliance percentage
  const calcCompliancePercent = (compliance: ComplianceCheck) => {
    const fields = [
      compliance.has_annual_plan,
      compliance.has_measurable_goals,
      compliance.has_periodic_reports,
      compliance.uses_national_platform,
      compliance.uses_membership_portal,
      compliance.uses_appointments_portal,
      compliance.uses_initiatives_portal,
      compliance.uses_media_window,
      compliance.cooperates_with_coordination_board,
      compliance.respects_media_guidelines,
      compliance.official_correspondence_compliant,
    ];
    const passed = fields.filter(Boolean).length;
    return Math.round((passed / fields.length) * 100);
  };

  // Stats
  const stats = useMemo(() => {
    const periodAssessments = assessments.filter((a) => a.assessment_period === selectedPeriod);
    const periodCompliance = complianceChecks.filter((c) => c.check_period === selectedPeriod);

    const avgGov =
      periodAssessments.length > 0
        ? Math.round(
            periodAssessments.reduce((sum, a) => sum + calcAvgGovernance(a), 0) /
              periodAssessments.length
          )
        : 0;

    const compliant = periodCompliance.filter(
      (c) => c.overall_compliance_status === "compliant"
    ).length;
    const partial = periodCompliance.filter(
      (c) => c.overall_compliance_status === "partially_compliant"
    ).length;
    const nonCompliant = periodCompliance.filter(
      (c) => c.overall_compliance_status === "non_compliant"
    ).length;

    return {
      avgGovernance: avgGov,
      compliant,
      partial,
      nonCompliant,
      assessed: periodAssessments.length,
    };
  }, [assessments, complianceChecks, selectedPeriod]);

  const getComplianceColor = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "partially_compliant":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "non_compliant":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const detailCouncil = councils.find((c) => c.id === detailCouncilId);
  const detailAssessment = detailCouncilId ? getAssessment(detailCouncilId) : null;
  const detailCompliance = detailCouncilId ? getCompliance(detailCouncilId) : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">الحوكمة والامتثال</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-Q1">الربع الأول 2026</SelectItem>
            <SelectItem value="2025-Q4">الربع الرابع 2025</SelectItem>
            <SelectItem value="2025-Q3">الربع الثالث 2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className={`text-2xl font-bold ${getScoreColor(stats.avgGovernance)}`}>
                  {stats.avgGovernance}%
                </p>
                <p className="text-xs text-muted-foreground">متوسط الحوكمة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.compliant}</p>
                <p className="text-xs text-muted-foreground">ملتزم</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.partial}</p>
                <p className="text-xs text-muted-foreground">ملتزم جزئياً</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.nonCompliant}</p>
                <p className="text-xs text-muted-foreground">غير ملتزم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultValue="overview">
          <CardHeader className="border-b border-border pb-0">
            <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                نظرة عامة
              </TabsTrigger>
              <TabsTrigger
                value="governance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                تقييم الحوكمة
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                فحص الامتثال
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right">المجلس</TableHead>
                      <TableHead className="text-right">الحوكمة</TableHead>
                      <TableHead className="text-right">الامتثال</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">الحالة</TableHead>
                      <TableHead className="text-center w-[80px]">تفاصيل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {councils.map((council) => {
                      const assessment = getAssessment(council.id);
                      const compliance = getCompliance(council.id);
                      const avgGov = assessment ? calcAvgGovernance(assessment) : null;
                      const compPercent = compliance ? calcCompliancePercent(compliance) : null;

                      return (
                        <TableRow key={council.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{council.partner_country_name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {council.name_ar}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {avgGov !== null ? (
                              <div className="flex items-center gap-2">
                                <Progress value={avgGov} className="h-2 w-16" />
                                <span className={`text-sm font-medium ${getScoreColor(avgGov)}`}>
                                  {avgGov}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">غير مقيّم</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {compliance ? (
                              <Badge className={getComplianceColor(compliance.overall_compliance_status)}>
                                {COMPLIANCE_STATUS_LABELS[compliance.overall_compliance_status]}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">غير مفحوص</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-[10px]">
                              {COUNCIL_STATUS_LABELS[council.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDetailCouncilId(council.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Governance Tab */}
            <TabsContent value="governance" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                {councils.map((council) => {
                  const assessment = getAssessment(council.id);
                  if (!assessment) {
                    return (
                      <Card key={council.id} className="border-dashed">
                        <CardContent className="p-4 text-center text-muted-foreground">
                          <p className="text-sm font-medium">{council.partner_country_name}</p>
                          <p className="text-xs mt-1">لا يوجد تقييم لهذه الفترة</p>
                        </CardContent>
                      </Card>
                    );
                  }

                  const avgScore = calcAvgGovernance(assessment);
                  const criteria = [
                    { label: "المصلحة الوطنية", value: assessment.national_interest_score },
                    { label: "الاحترافية", value: assessment.professionalism_score },
                    { label: "الانضباط المؤسسي", value: assessment.institutional_discipline_score },
                    { label: "الشفافية", value: assessment.transparency_score },
                    { label: "وضوح المسؤولية", value: assessment.clarity_of_responsibility_score },
                    { label: "قابلية التقييم", value: assessment.evaluability_score },
                  ];

                  return (
                    <Card key={council.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{council.partner_country_name}</CardTitle>
                          <div className={`text-lg font-bold ${getScoreColor(avgScore)}`}>
                            {avgScore}%
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {criteria.map((c) => (
                            <div key={c.label} className="flex items-center justify-between gap-2">
                              <span className="text-xs text-muted-foreground">{c.label}</span>
                              <div className="flex items-center gap-2">
                                <Progress value={c.value} className="h-1.5 w-20" />
                                <span className={`text-xs font-medium w-8 ${getScoreColor(c.value)}`}>
                                  {c.value}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {assessment.notes && (
                          <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                            {assessment.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="mt-0">
              <div className="grid gap-4 md:grid-cols-2">
                {councils.map((council) => {
                  const compliance = getCompliance(council.id);
                  if (!compliance) {
                    return (
                      <Card key={council.id} className="border-dashed">
                        <CardContent className="p-4 text-center text-muted-foreground">
                          <p className="text-sm font-medium">{council.partner_country_name}</p>
                          <p className="text-xs mt-1">لا يوجد فحص لهذه الفترة</p>
                        </CardContent>
                      </Card>
                    );
                  }

                  const checks = [
                    { label: "خطة سنوية", value: compliance.has_annual_plan },
                    { label: "أهداف قابلة للقياس", value: compliance.has_measurable_goals },
                    { label: "تقارير دورية", value: compliance.has_periodic_reports },
                    { label: "استخدام المنصة الوطنية", value: compliance.uses_national_platform },
                    { label: "بوابة العضوية", value: compliance.uses_membership_portal },
                    { label: "بوابة المواعيد", value: compliance.uses_appointments_portal },
                    { label: "بوابة المبادرات", value: compliance.uses_initiatives_portal },
                    { label: "النافذة الإعلامية", value: compliance.uses_media_window },
                    { label: "التعاون مع المجلس التنسيقي", value: compliance.cooperates_with_coordination_board },
                    { label: "احترام ضوابط الإعلام", value: compliance.respects_media_guidelines },
                    { label: "المراسلات الرسمية", value: compliance.official_correspondence_compliant },
                  ];

                  const passedCount = checks.filter((c) => c.value).length;

                  return (
                    <Card key={council.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{council.partner_country_name}</CardTitle>
                          <Badge className={getComplianceColor(compliance.overall_compliance_status)}>
                            {COMPLIANCE_STATUS_LABELS[compliance.overall_compliance_status]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {passedCount} من {checks.length} معايير محققة
                        </p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-1.5">
                          {checks.map((c) => (
                            <div
                              key={c.label}
                              className="flex items-center gap-1.5 text-xs"
                            >
                              {c.value ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                              )}
                              <span className={c.value ? "text-foreground" : "text-muted-foreground"}>
                                {c.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        {compliance.notes && (
                          <p className="mt-3 text-xs text-muted-foreground border-t pt-3">
                            {compliance.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailCouncilId} onOpenChange={() => setDetailCouncilId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          {detailCouncil && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {detailCouncil.partner_country_name} - تقرير الحوكمة والامتثال
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Governance Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    تقييم الحوكمة
                  </h3>
                  {detailAssessment ? (
                    <div className="rounded-lg border border-border p-4 space-y-3">
                      {[
                        { label: "المصلحة الوطنية", value: detailAssessment.national_interest_score },
                        { label: "الاحترافية", value: detailAssessment.professionalism_score },
                        { label: "الانضباط المؤسسي", value: detailAssessment.institutional_discipline_score },
                        { label: "الشفافية", value: detailAssessment.transparency_score },
                        { label: "وضوح المسؤولية", value: detailAssessment.clarity_of_responsibility_score },
                        { label: "قابلية التقييم", value: detailAssessment.evaluability_score },
                      ].map((c) => (
                        <div key={c.label} className="flex items-center justify-between">
                          <span className="text-sm">{c.label}</span>
                          <div className="flex items-center gap-3">
                            <Progress value={c.value} className="h-2 w-24" />
                            <span className={`text-sm font-semibold w-10 text-left ${getScoreColor(c.value)}`}>
                              {c.value}%
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="text-sm font-medium">المتوسط العام</span>
                        <span className={`text-lg font-bold ${getScoreColor(calcAvgGovernance(detailAssessment))}`}>
                          {calcAvgGovernance(detailAssessment)}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">لا يوجد تقييم لهذه الفترة</p>
                  )}
                </div>

                {/* Compliance Section */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    فحص الامتثال
                  </h3>
                  {detailCompliance ? (
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm">الحالة العامة</span>
                        <Badge className={getComplianceColor(detailCompliance.overall_compliance_status)}>
                          {COMPLIANCE_STATUS_LABELS[detailCompliance.overall_compliance_status]}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "خطة سنوية معتمدة", value: detailCompliance.has_annual_plan },
                          { label: "أهداف قابلة للقياس", value: detailCompliance.has_measurable_goals },
                          { label: "تقارير دورية", value: detailCompliance.has_periodic_reports },
                          { label: "استخدام المنصة الوطنية", value: detailCompliance.uses_national_platform },
                          { label: "بوابة العضوية", value: detailCompliance.uses_membership_portal },
                          { label: "بوابة المواعيد", value: detailCompliance.uses_appointments_portal },
                          { label: "بوابة المبادرات", value: detailCompliance.uses_initiatives_portal },
                          { label: "النافذة الإعلامية", value: detailCompliance.uses_media_window },
                          { label: "التعاون مع المجلس التنسيقي", value: detailCompliance.cooperates_with_coordination_board },
                          { label: "احترام ضوابط الإعلام", value: detailCompliance.respects_media_guidelines },
                          { label: "المراسلات الرسمية", value: detailCompliance.official_correspondence_compliant },
                        ].map((c) => (
                          <div key={c.label} className="flex items-center gap-2 text-sm">
                            {c.value ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                            )}
                            <span className={c.value ? "" : "text-muted-foreground"}>{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">لا يوجد فحص لهذه الفترة</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
