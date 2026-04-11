"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Council,
  CouncilScore,
  Alert,
  ClassificationType,
  CLASSIFICATION_LABELS,
  AlertType,
  ALERT_TYPE_LABELS,
  AlertSeverity,
  ALERT_SEVERITY_LABELS,
  AlertStatus,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Bell,
  CheckCircle,
  XCircle,
  Building2,
  BarChart3,
  Activity,
  Target,
  Users,
  Zap,
} from "lucide-react";

// Sample data
const SAMPLE_COUNCILS: Council[] = [
  {
    id: "c1",
    uuid: "council-uuid-1",
    name_ar: "مجلس الأعمال السوري التركي",
    name_en: null,
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
  {
    id: "c3",
    uuid: "council-uuid-3",
    name_ar: "مجلس الأعمال السوري الأردني",
    name_en: null,
    partner_country_code: "JO",
    partner_country_name: "الأردن",
    status: "draft",
    establishment_stage: "under_establishment",
    chairman_user_id: null,
    summary: null,
    sectors: ["trade"],
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
];

const SAMPLE_SCORES: CouncilScore[] = [
  {
    id: "s1",
    council_id: "c1",
    period: "2026-Q1",
    governance_score: 85,
    compliance_score: 90,
    execution_score: 80,
    impact_score: 75,
    integration_score: 88,
    platform_services_score: 82,
    overall_score: 83,
    classification: "leading",
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "s2",
    council_id: "c2",
    period: "2026-Q1",
    governance_score: 70,
    compliance_score: 65,
    execution_score: 72,
    impact_score: 68,
    integration_score: 60,
    platform_services_score: 55,
    overall_score: 65,
    classification: "needs_improvement",
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "s3",
    council_id: "c3",
    period: "2026-Q1",
    governance_score: 45,
    compliance_score: 40,
    execution_score: 50,
    impact_score: 30,
    integration_score: 35,
    platform_services_score: 42,
    overall_score: 40,
    classification: "at_risk",
    created_at: "2026-04-01T00:00:00Z",
  },
];

const SAMPLE_ALERTS: Alert[] = [
  {
    id: "a1",
    council_id: "c2",
    alert_type: "missing_reports",
    severity: "high",
    message: "لم يتم تقديم تقرير الربع الأول 2026",
    status: "open",
    resolution_note: null,
    created_at: "2026-04-05T00:00:00Z",
    updated_at: "2026-04-05T00:00:00Z",
  },
  {
    id: "a2",
    council_id: "c3",
    alert_type: "low_activity",
    severity: "medium",
    message: "لم يتم تسجيل أي نشاط خلال الشهرين الماضيين",
    status: "open",
    resolution_note: null,
    created_at: "2026-04-03T00:00:00Z",
    updated_at: "2026-04-03T00:00:00Z",
  },
  {
    id: "a3",
    council_id: "c3",
    alert_type: "missing_annual_plan",
    severity: "high",
    message: "لم يتم تقديم الخطة السنوية لعام 2026",
    status: "open",
    resolution_note: null,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "a4",
    council_id: "c1",
    alert_type: "low_appointments_usage",
    severity: "low",
    message: "استخدام منخفض لبوابة المواعيد",
    status: "resolved",
    resolution_note: "تم تفعيل البوابة وإضافة مواعيد جديدة",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-03-20T00:00:00Z",
  },
  {
    id: "a5",
    council_id: "c2",
    alert_type: "governance_risk",
    severity: "medium",
    message: "انخفاض في معايير الحوكمة مقارنة بالربع السابق",
    status: "open",
    resolution_note: null,
    created_at: "2026-04-02T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
  },
];

interface ScoresAlertsProps {
  councils?: Council[];
  scores?: CouncilScore[];
  alerts?: Alert[];
}

export function ScoresAlerts({
  councils = SAMPLE_COUNCILS,
  scores = SAMPLE_SCORES,
  alerts: initialAlerts = SAMPLE_ALERTS,
}: ScoresAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedPeriod, setSelectedPeriod] = useState("2026-Q1");
  const [alertFilter, setAlertFilter] = useState<AlertStatus | "all">("all");
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  // Get score for a council
  const getScore = useCallback(
    (councilId: string) =>
      scores.find((s) => s.council_id === councilId && s.period === selectedPeriod),
    [scores, selectedPeriod]
  );

  // Get council name
  const getCouncilName = useCallback(
    (councilId: string) => {
      const council = councils.find((c) => c.id === councilId);
      return council?.partner_country_name || "غير معروف";
    },
    [councils]
  );

  // Stats
  const stats = useMemo(() => {
    const periodScores = scores.filter((s) => s.period === selectedPeriod);
    const avgOverall =
      periodScores.length > 0
        ? Math.round(
            periodScores.reduce((sum, s) => sum + s.overall_score, 0) / periodScores.length
          )
        : 0;

    const openAlerts = alerts.filter((a) => a.status === "open").length;
    const highAlerts = alerts.filter((a) => a.status === "open" && a.severity === "high").length;

    const classifications = {
      leading: periodScores.filter((s) => s.classification === "leading").length,
      stable: periodScores.filter((s) => s.classification === "stable").length,
      needs_improvement: periodScores.filter((s) => s.classification === "needs_improvement")
        .length,
      at_risk: periodScores.filter((s) => s.classification === "at_risk").length,
    };

    return { avgOverall, openAlerts, highAlerts, classifications };
  }, [scores, alerts, selectedPeriod]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => alertFilter === "all" || a.status === alertFilter);
  }, [alerts, alertFilter]);

  const getClassificationColor = (classification: ClassificationType) => {
    switch (classification) {
      case "leading":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "stable":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "needs_improvement":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "at_risk":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "low":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const handleResolveAlert = useCallback(() => {
    if (!selectedAlert) return;
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              status: "resolved" as AlertStatus,
              resolution_note: resolutionNote || null,
              updated_at: new Date().toISOString(),
            }
          : a
      )
    );
    setResolveDialogOpen(false);
    setSelectedAlert(null);
    setResolutionNote("");
  }, [selectedAlert, resolutionNote]);

  const handleDismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: "dismissed" as AlertStatus, updated_at: new Date().toISOString() }
          : a
      )
    );
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">التقييم والتنبيهات</h2>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2026-Q1">الربع الأول 2026</SelectItem>
            <SelectItem value="2025-Q4">الربع الرابع 2025</SelectItem>
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
                <p className={`text-2xl font-bold ${getScoreColor(stats.avgOverall)}`}>
                  {stats.avgOverall}%
                </p>
                <p className="text-xs text-muted-foreground">متوسط الأداء</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.classifications.leading}</p>
                <p className="text-xs text-muted-foreground">مجلس رائد</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Bell className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.openAlerts}</p>
                <p className="text-xs text-muted-foreground">تنبيه مفتوح</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.highAlerts}</p>
                <p className="text-xs text-muted-foreground">تنبيه عاجل</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="scores">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scores">تقييم المجالس</TabsTrigger>
          <TabsTrigger value="alerts">
            التنبيهات
            {stats.openAlerts > 0 && (
              <Badge variant="destructive" className="mr-2 h-5 w-5 p-0 text-[10px]">
                {stats.openAlerts}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Scores Tab */}
        <TabsContent value="scores" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {/* Classification Summary */}
              <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                  <p className="text-xl font-bold text-green-700">{stats.classifications.leading}</p>
                  <p className="text-xs text-green-600">رائد</p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                  <p className="text-xl font-bold text-blue-700">{stats.classifications.stable}</p>
                  <p className="text-xs text-blue-600">مستقر</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
                  <p className="text-xl font-bold text-amber-700">
                    {stats.classifications.needs_improvement}
                  </p>
                  <p className="text-xs text-amber-600">يحتاج تحسين</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-xl font-bold text-red-700">{stats.classifications.at_risk}</p>
                  <p className="text-xs text-red-600">في خطر</p>
                </div>
              </div>

              {/* Scores Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right">المجلس</TableHead>
                      <TableHead className="text-right">التصنيف</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">الحوكمة</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">التنفيذ</TableHead>
                      <TableHead className="text-right hidden md:table-cell">التأثير</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {councils.map((council) => {
                      const score = getScore(council.id);
                      return (
                        <TableRow key={council.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{council.partner_country_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {score ? (
                              <Badge className={getClassificationColor(score.classification)}>
                                {CLASSIFICATION_LABELS[score.classification]}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">غير مقيّم</span>
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {score ? (
                              <div className="flex items-center gap-2">
                                <Progress value={score.governance_score} className="h-2 w-12" />
                                <span className={`text-xs ${getScoreColor(score.governance_score)}`}>
                                  {score.governance_score}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {score ? (
                              <div className="flex items-center gap-2">
                                <Progress value={score.execution_score} className="h-2 w-12" />
                                <span className={`text-xs ${getScoreColor(score.execution_score)}`}>
                                  {score.execution_score}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {score ? (
                              <div className="flex items-center gap-2">
                                <Progress value={score.impact_score} className="h-2 w-12" />
                                <span className={`text-xs ${getScoreColor(score.impact_score)}`}>
                                  {score.impact_score}
                                </span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {score ? (
                              <span className={`text-lg font-bold ${getScoreColor(score.overall_score)}`}>
                                {score.overall_score}%
                              </span>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Score Breakdown for each council */}
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {councils.map((council) => {
                  const score = getScore(council.id);
                  if (!score) return null;

                  const metrics = [
                    { label: "الحوكمة", value: score.governance_score, icon: Activity },
                    { label: "الامتثال", value: score.compliance_score, icon: CheckCircle },
                    { label: "التنفيذ", value: score.execution_score, icon: Target },
                    { label: "التأثير", value: score.impact_score, icon: TrendingUp },
                    { label: "التكامل", value: score.integration_score, icon: Users },
                    { label: "خدمات المنصة", value: score.platform_services_score, icon: Zap },
                  ];

                  return (
                    <Card key={council.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{council.partner_country_name}</CardTitle>
                          <Badge className={getClassificationColor(score.classification)}>
                            {CLASSIFICATION_LABELS[score.classification]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {metrics.map((m) => {
                            const Icon = m.icon;
                            return (
                              <div key={m.label} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{m.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Progress value={m.value} className="h-1.5 w-16" />
                                  <span className={`text-xs font-medium w-6 ${getScoreColor(m.value)}`}>
                                    {m.value}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between items-center">
                          <span className="text-sm font-medium">الإجمالي</span>
                          <span className={`text-xl font-bold ${getScoreColor(score.overall_score)}`}>
                            {score.overall_score}%
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="mt-4">
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">سجل التنبيهات</CardTitle>
                <Select
                  value={alertFilter}
                  onValueChange={(v) => setAlertFilter(v as AlertStatus | "all")}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع التنبيهات</SelectItem>
                    <SelectItem value="open">مفتوحة</SelectItem>
                    <SelectItem value="resolved">تم حلها</SelectItem>
                    <SelectItem value="dismissed">تم تجاهلها</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {filteredAlerts.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  لا توجد تنبيهات
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg border p-4 ${
                        alert.status === "open"
                          ? "border-border bg-card"
                          : "border-border/50 bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                              alert.severity === "high"
                                ? "bg-red-500/10"
                                : alert.severity === "medium"
                                ? "bg-amber-500/10"
                                : "bg-blue-500/10"
                            }`}
                          >
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                alert.severity === "high"
                                  ? "text-red-600"
                                  : alert.severity === "medium"
                                  ? "text-amber-600"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium">
                                {getCouncilName(alert.council_id)}
                              </span>
                              <Badge className={getSeverityColor(alert.severity)} variant="outline">
                                {ALERT_SEVERITY_LABELS[alert.severity]}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                {ALERT_TYPE_LABELS[alert.alert_type]}
                              </Badge>
                            </div>
                            <p className="mt-1 text-sm text-foreground">{alert.message}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {formatDate(alert.created_at)}
                            </p>
                            {alert.resolution_note && (
                              <p className="mt-2 text-xs text-green-700 bg-green-50 rounded p-2">
                                الحل: {alert.resolution_note}
                              </p>
                            )}
                          </div>
                        </div>
                        {alert.status === "open" && (
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAlert(alert);
                                setResolveDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="ml-1 h-3.5 w-3.5" />
                              حل
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDismissAlert(alert.id)}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                        {alert.status !== "open" && (
                          <Badge
                            variant="outline"
                            className={
                              alert.status === "resolved"
                                ? "bg-green-500/10 text-green-700"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {alert.status === "resolved" ? "تم الحل" : "تم التجاهل"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>حل التنبيه</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4">
              <div className="rounded-lg bg-muted p-3 mb-4">
                <p className="text-sm font-medium">{getCouncilName(selectedAlert.council_id)}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedAlert.message}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>ملاحظات الحل (اختياري)</Label>
                <Textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="صف الإجراءات المتخذة لحل هذا التنبيه..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleResolveAlert}>
              <CheckCircle className="ml-1.5 h-4 w-4" />
              تأكيد الحل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
