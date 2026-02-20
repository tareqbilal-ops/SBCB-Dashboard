"use client";

import { useState } from "react";
import type { Country, Risk, Stage } from "@/lib/types";
import { STAGES, PHASE2_TRACKS } from "@/lib/types";
import {
  getReadinessLabel,
  getNextAction,
  getDaysInStage,
  getStageBadgeColor,
  getScoreBgColor,
  getStageLabel,
  canTransitionToReady,
  getRiskLevelColor,
  getRiskStatusColor,
  computeScoreTotal,
} from "@/lib/business-logic";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Save,
  Target,
  TrendingUp,
  Shield,
} from "lucide-react";

interface CountryDetailProps {
  country: Country | null;
  risks: Risk[];
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Country>) => void;
}

export function CountryDetail({ country, risks, open, onClose, onSave }: CountryDetailProps) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Country>>({});
  const [stageError, setStageError] = useState<string | null>(null);

  if (!country) return null;

  const daysInStage = getDaysInStage(country.entry_date);
  const readiness = getReadinessLabel(country.score_total);
  const nextAction = getNextAction(country.stage);
  const countryRisks = risks.filter((r) => r.country_id === country.id);

  const startEditing = () => {
    setFormData({
      score_network: country.score_network,
      score_institutional: country.score_institutional,
      score_market: country.score_market,
      score_strategic: country.score_strategic,
      stage: country.stage,
      phase2_track: country.phase2_track,
      phase2_activity_done: country.phase2_activity_done,
      phase2_activity_value: country.phase2_activity_value,
      notes: country.notes,
    });
    setEditing(true);
    setStageError(null);
  };

  const handleSave = () => {
    // Check gate rule
    const merged = { ...country, ...formData };
    if (
      country.stage === "Provisional" &&
      formData.stage === "Ready for Approval"
    ) {
      const check = canTransitionToReady(merged as Country);
      if (!check.allowed) {
        setStageError(check.reason || "غير مسموح بالانتقال");
        return;
      }
    }

    const total = computeScoreTotal({
      score_network: formData.score_network ?? country.score_network,
      score_institutional: formData.score_institutional ?? country.score_institutional,
      score_market: formData.score_market ?? country.score_market,
      score_strategic: formData.score_strategic ?? country.score_strategic,
    });
    onSave(country.id, { ...formData, score_total: total });
    setEditing(false);
    setStageError(null);
  };

  const currentScores = editing
    ? {
        score_network: formData.score_network ?? country.score_network,
        score_institutional: formData.score_institutional ?? country.score_institutional,
        score_market: formData.score_market ?? country.score_market,
        score_strategic: formData.score_strategic ?? country.score_strategic,
      }
    : {
        score_network: country.score_network,
        score_institutional: country.score_institutional,
        score_market: country.score_market,
        score_strategic: country.score_strategic,
      };

  const currentTotal = computeScoreTotal(currentScores);
  const currentStage = editing ? (formData.stage ?? country.stage) : country.stage;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="left" className="w-full sm:w-[540px] overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg font-bold text-foreground">
                {country.country_name_ar}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[10px]">{country.tier}</Badge>
                <Badge className={`text-[10px] border ${getStageBadgeColor(country.stage)}`}>
                  {getStageLabel(country.stage)}
                </Badge>
              </div>
            </div>
            {!editing ? (
              <Button size="sm" onClick={startEditing} className="bg-primary text-primary-foreground">
                تعديل
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditing(false); setStageError(null); }}>
                  إلغاء
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground">
                  <Save className="ml-1 h-3.5 w-3.5" />
                  حفظ
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-6">
          {/* Section A: Summary */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                ملخص
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-muted-foreground">النتيجة الإجمالية</p>
                <p className={`text-2xl font-bold ${getScoreBgColor(currentTotal).split(" ")[1]}`}>
                  {currentTotal}
                  <span className="text-xs text-muted-foreground font-normal"> / 100</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">الجاهزية</p>
                <Badge className={`mt-1 text-[10px] border ${getScoreBgColor(currentTotal)}`}>
                  {getReadinessLabel(currentTotal)}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">تاريخ الدخول</p>
                  <p className="text-xs font-medium text-foreground">{country.entry_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">أيام في المرحلة</p>
                  <p className="text-xs font-medium text-foreground">{daysInStage} يوم</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] text-muted-foreground">الإجراء التالي</p>
                <p className="mt-0.5 text-xs font-medium text-primary">{nextAction}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section B: Scores */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                درجات الجاهزية
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {[
                { key: "score_network" as const, label: "شبكة المؤسسين" },
                { key: "score_institutional" as const, label: "المؤسسي" },
                { key: "score_market" as const, label: "السوق" },
                { key: "score_strategic" as const, label: "الاستراتيجي" },
              ].map((item) => (
                <div key={item.key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-foreground">{item.label}</Label>
                    <span className="text-sm font-bold text-foreground">
                      {currentScores[item.key]} / 25
                    </span>
                  </div>
                  {editing ? (
                    <Slider
                      min={0}
                      max={25}
                      step={1}
                      value={[currentScores[item.key]]}
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, [item.key]: val[0] }))
                      }
                      className="w-full"
                    />
                  ) : (
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${(currentScores[item.key] / 25) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">المجموع</span>
                <span className={`text-lg font-bold ${getScoreBgColor(currentTotal).split(" ")[1]}`}>
                  {currentTotal} / 100
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Stage control (editing mode) */}
          {editing && (
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground">
                  تغيير المرحلة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.stage ?? country.stage}
                  onValueChange={(v) => {
                    setFormData((prev) => ({ ...prev, stage: v as Stage }));
                    setStageError(null);
                  }}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>{getStageLabel(s)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {stageError && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-xs text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {stageError}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Section C: Phase 2 Test */}
          {currentStage === "Provisional" && (
            <Card className="border border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-amber-800">
                  اختبار المرحلة المؤقتة (Phase 2)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs text-foreground">مسار الاختبار</Label>
                  {editing ? (
                    <Select
                      value={formData.phase2_track ?? country.phase2_track ?? ""}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, phase2_track: v as typeof country.phase2_track }))
                      }
                    >
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue placeholder="اختر المسار" />
                      </SelectTrigger>
                      <SelectContent>
                        {PHASE2_TRACKS.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {country.phase2_track || (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          مسار الاختبار غير محدد
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-foreground">هل تم تنفيذ النشاط؟</Label>
                  {editing ? (
                    <Select
                      value={formData.phase2_activity_done ?? country.phase2_activity_done ?? "لا"}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          phase2_activity_done: v as "نعم" | "لا",
                        }))
                      }
                    >
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="نعم">نعم</SelectItem>
                        <SelectItem value="لا">لا</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={`mt-1 text-[10px] border ${
                        country.phase2_activity_done === "نعم"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : "bg-red-100 text-red-700 border-red-300"
                      }`}
                    >
                      {country.phase2_activity_done === "نعم" ? "تم التنفيذ" : "لم يُنفّذ بعد"}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label className="text-xs text-foreground">وصف النشاط / القيمة</Label>
                  {editing ? (
                    <Textarea
                      value={formData.phase2_activity_value ?? country.phase2_activity_value ?? ""}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phase2_activity_value: e.target.value }))
                      }
                      placeholder="وصف النشاط أو القيمة..."
                      className="mt-1 text-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {country.phase2_activity_value || "لم يُحدد بعد"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section D: Risks */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                المخاطر ({countryRisks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {countryRisks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  لا توجد مخاطر مسجلة لهذه الدولة
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {countryRisks.map((risk) => (
                    <div key={risk.id} className="flex flex-col gap-1 rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{risk.risk_type}</span>
                        <div className="flex gap-1.5">
                          <Badge className={`text-[10px] border ${getRiskLevelColor(risk.risk_level)}`}>
                            {risk.risk_level}
                          </Badge>
                          <Badge className={`text-[10px] border ${getRiskStatusColor(risk.status)}`}>
                            {risk.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{risk.mitigation}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground">ملاحظات</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <Textarea
                  value={formData.notes ?? country.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  className="text-sm"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {country.notes || "لا توجد ملاحظات"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
