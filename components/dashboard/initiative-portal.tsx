"use client";

import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import type { InitiativeStatus, Phase2Track } from "@/lib/types";
import { PHASE2_TRACKS } from "@/lib/types";
import { seedCountries } from "@/lib/seed-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
import {
  Lightbulb,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  XCircle,
  ClipboardList,
  Users,
  Target,
  ArrowLeft,
  ArrowRight,
  Upload,
  Info,
  Shield,
  BookOpen,
  Pencil,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Database shape from Supabase
interface DbInitiative {
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
  created_at: string;
  updated_at: string;
}

interface InitiativePortalProps {
  canSubmit: boolean;
  canReview: boolean;
  userId: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const statusConfig: Record<InitiativeStatus, { color: string; icon: typeof Clock }> = {
  "مقدّم": { color: "bg-sky-100 text-sky-800 border-sky-300", icon: Send },
  "قيد المراجعة": { color: "bg-amber-100 text-amber-800 border-amber-300", icon: Eye },
  "مقبول": { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2 },
  "مرفوض": { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle },
};

const ESTABLISHMENT_CONDITIONS = [
  "وجود حد أدنى من 5 أعضاء مؤسسين بين الجانبين",
  "توفر خطة عمل واضحة للسنة الأولى",
  "تحديد القطاعات المستهدفة والمجالات التجارية",
  "ألا يكون هناك مجلس أعمال قائم مع نفس الدولة",
  "تقديم سير ذاتية للأعضاء المؤسسين",
  "موافقة خطية من جميع الأعضاء المؤسسين",
];

const EVALUATION_STEPS = [
  { title: "تقديم الطلب", desc: "رفع جميع المستندات المطلوبة عبر البوابة" },
  { title: "المراجعة الأولية", desc: "التحقق من استيفاء الشروط الأساسية" },
  { title: "التقييم الفني", desc: "دراسة خطة العمل والقطاعات المستهدفة" },
  { title: "المراجعة النهائية", desc: "اتخاذ قرار القبول أو الرفض مع التوصيات" },
];

export function InitiativePortal({
  canSubmit,
  canReview,
  userId,
}: InitiativePortalProps) {
  const { data: initiatives, error, isLoading, mutate } = useSWR<DbInitiative[]>(
    "/api/initiatives",
    fetcher,
    { refreshInterval: 10000, revalidateOnFocus: true }
  );

  const [activeTab, setActiveTab] = useState<"info" | "submit" | "list">("info");
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<DbInitiative | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState<InitiativeStatus>("مقبول");
  const [reviewing, setReviewing] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);

  // Get available countries (exclude those with Approved councils)
  const availableCountries = useMemo(
    () => seedCountries.filter((c) => c.stage !== "Approved"),
    []
  );

  const [form, setForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    target_country: "",
    interest_area: "" as Phase2Track | "",
    proposed_sectors: "" as string,
    founding_members: "",
    business_plan_summary: "",
    company_profile: "" as string,
    attachments: [] as string[],
  });

  // File upload helper
  const handleFileUpload = useCallback(async (
    file: File,
    onSuccess: (pathname: string, filename: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { pathname, filename } = await res.json();
      onSuccess(pathname, filename);
    } catch (err) {
      console.error("Upload error:", err);
      alert("فشل في رفع الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setUploading(false);
    }
  }, []);

  const allInitiatives = useMemo(() => Array.isArray(initiatives) ? initiatives : [], [initiatives]);
  const myInitiatives = useMemo(
    () => allInitiatives.filter((i) => i.submitted_by === userId),
    [allInitiatives, userId]
  );

  const handleSubmit = useCallback(async () => {
    if (!form.applicant_name.trim() || !form.target_country.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_name: form.applicant_name,
          applicant_email: form.applicant_email,
          applicant_phone: form.applicant_phone,
          target_country: form.target_country,
          interest_area: form.interest_area,
          proposed_sectors: form.proposed_sectors.split("،").map((s) => s.trim()).filter(Boolean),
          founding_members: form.founding_members,
          business_plan_summary: form.business_plan_summary,
          company_profile: form.company_profile,
          attachments: form.attachments,
          submitted_by: userId,
        }),
      });
      if (!res.ok) throw new Error("فشل في إرسال المبادرة");
      await mutate(); // Revalidate SWR cache
      setForm({
        applicant_name: "",
        applicant_email: "",
        applicant_phone: "",
        target_country: "",
        interest_area: "",
        proposed_sectors: "",
        founding_members: "",
        business_plan_summary: "",
        company_profile: "",
        attachments: [],
      });
      setStep(0);
      setActiveTab("list");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }, [form, userId, mutate]);

  const handleReview = useCallback(async () => {
    if (!reviewTarget) return;
    setReviewing(true);
    try {
      const res = await fetch(`/api/initiatives/${reviewTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewStatus,
          reviewer_notes: reviewNotes,
        }),
      });
      if (!res.ok) throw new Error("فشل في حفظ المراجعة");
      await mutate(); // Revalidate SWR cache
      setReviewDialogOpen(false);
      setReviewTarget(null);
      setReviewNotes("");
    } catch (err) {
      console.error("Review error:", err);
    } finally {
      setReviewing(false);
    }
  }, [reviewTarget, reviewStatus, reviewNotes, mutate]);

  const openReview = useCallback((initiative: DbInitiative) => {
    setReviewTarget(initiative);
    setReviewStatus("مقبول");
    setReviewNotes("");
    setReviewDialogOpen(true);
  }, []);

  const displayList = canReview ? allInitiatives : myInitiatives;

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">بوابة تسجيل المبادرات</h2>
            <p className="text-sm text-muted-foreground">
              تأسيس مجالس أعمال مشتركة جديدة
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className={`ml-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            تحديث
          </Button>
          {!isLoading && !error && (
            <Badge variant="secondary" className="text-[10px]">
              {allInitiatives.length} مبادرة
            </Badge>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">خطأ في تحميل البيانات</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                تعذّر الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.
              </p>
            </div>
            <Button variant="outline" size="sm" className="mr-auto shrink-0" onClick={() => mutate()}>
              إعادة المحاولة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
        {[
          { id: "info" as const, label: "الشروط والآلية", icon: Info },
          ...(canSubmit ? [{ id: "submit" as const, label: "تقديم مبادرة", icon: Send }] : []),
          { id: "list" as const, label: canReview ? "جميع المبادرات" : "مبادراتي", icon: ClipboardList },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Info Tab */}
      {activeTab === "info" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" />
                شروط تأسيس مجلس الأعمال
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2.5">
                {ESTABLISHMENT_CONDITIONS.map((condition, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {condition}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                آلية الدراسة والتقييم والاعتماد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {EVALUATION_STEPS.map((evalStep, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {i + 1}
                      </div>
                      {i < EVALUATION_STEPS.length - 1 && (
                        <div className="h-6 w-0.5 bg-border mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-foreground">{evalStep.title}</p>
                      <p className="text-xs text-muted-foreground">{evalStep.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {canSubmit && (
            <Card className="border-border bg-primary/5 lg:col-span-2">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    هل أنت مستعد لتقديم مبادرة تأسيس مجلس أعمال جديد؟
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    تأكد من استيفاء جميع الشروط قبل البدء في تقديم الطلب
                  </p>
                </div>
                <Button onClick={() => setActiveTab("submit")} className="bg-primary text-primary-foreground">
                  <Send className="ml-1.5 h-4 w-4" />
                  ابدأ التقديم
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Submit Tab - Multi-step form */}
      {activeTab === "submit" && canSubmit && (
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                نموذج تسجيل المبادرة
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                الخطوة {step + 1} من 4
              </div>
            </div>
            {/* Progress */}
            <div className="mt-3 flex gap-1.5">
              {[0, 1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 0: Applicant Info */}
            {step === 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">بيانات مقدّم الطلب</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">الاسم الكامل</Label>
                    <Input
                      value={form.applicant_name}
                      onChange={(e) => setForm((f) => ({ ...f, applicant_name: e.target.value }))}
                      placeholder="الاسم الكامل"
                      className="text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={form.applicant_email}
                      onChange={(e) => setForm((f) => ({ ...f, applicant_email: e.target.value }))}
                      placeholder="email@example.com"
                      className="text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">رقم الهاتف</Label>
                    <Input
                      type="tel"
                      value={form.applicant_phone}
                      onChange={(e) => setForm((f) => ({ ...f, applicant_phone: e.target.value }))}
                      placeholder="+90 555 123 4567"
                      className="text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">بروفايل الشركة</Label>
                    <div className="flex gap-2">
                      {form.company_profile ? (
                        <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate flex-1" dir="ltr">
                            {form.company_profile.split("/").pop()?.split("-").slice(1).join("-") || form.company_profile}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setForm((f) => ({ ...f, company_profile: "" }))}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-1 items-center gap-2">
                          <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="text-sm"
                            disabled={uploadingProfile}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(
                                  file,
                                  (pathname) => setForm((f) => ({ ...f, company_profile: pathname })),
                                  setUploadingProfile
                                );
                              }
                              e.target.value = "";
                            }}
                          />
                          {uploadingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      يرجى رفع ملف تعريفي بالشركة التي تمثلها أو تعمل فيها أو تمتلكها (PDF أو Word)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Target & Sectors */}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">الدولة المستهدفة والمجال</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">الدولة المستهدفة للمجلس</Label>
                    <Select
                      value={form.target_country}
                      onValueChange={(value) => setForm((f) => ({ ...f, target_country: value }))}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="اختر دولة..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCountries.map((country) => (
                          <SelectItem key={country.id} value={country.country_name_ar}>
                            <div className="flex items-center gap-2">
                              <span>{country.country_name_ar}</span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                                {country.stage === "Under Assessment" ? "قيد الدراسة" :
                                 country.stage === "Provisional" ? "مؤقت" :
                                 country.stage === "Candidate" ? "مرشح" : country.stage}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">
                      الدول ذات المجالس المعتمدة غير متاحة للاختيار
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">المجال الذي يهتم به صاحب المبادرة</Label>
                    <Select
                      value={form.interest_area}
                      onValueChange={(value) => setForm((f) => ({ ...f, interest_area: value as Phase2Track }))}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="اختر المجال..." />
                      </SelectTrigger>
                      <SelectContent>
                        {PHASE2_TRACKS.map((track) => (
                          <SelectItem key={track} value={track}>
                            {track}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">القطاعات المقترحة (مفصولة بفاصلة عربية)</Label>
                    <Input
                      value={form.proposed_sectors}
                      onChange={(e) => setForm((f) => ({ ...f, proposed_sectors: e.target.value }))}
                      placeholder="مثال: التقنية، الزراعة، الصناعات الغذائية"
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Founders & Plan */}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">الأعضاء المؤسسون وخطة العمل</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">وصف الأعضاء المؤسسين</Label>
                    <Textarea
                      value={form.founding_members}
                      onChange={(e) => setForm((f) => ({ ...f, founding_members: e.target.value }))}
                      placeholder="اذكر عدد الأعضاء المؤسسين وأدوارهم وخلفياتهم..."
                      className="text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">ملخص خطة العمل</Label>
                    <Textarea
                      value={form.business_plan_summary}
                      onChange={(e) => setForm((f) => ({ ...f, business_plan_summary: e.target.value }))}
                      placeholder="وصف موجز لخطة العمل والأهداف للسنة الأولى..."
                      className="text-sm"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Attachments & Review */}
            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-foreground">المرفقات والمراجعة</h3>

                {/* File upload */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm">المرفقات (خطة العمل، السير الذاتية، إلخ)</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="text-sm"
                      disabled={uploadingAttachment}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(
                            file,
                            (pathname) => setForm((f) => ({ ...f, attachments: [...f.attachments, pathname] })),
                            setUploadingAttachment
                          );
                        }
                        e.target.value = "";
                      }}
                    />
                    {uploadingAttachment && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
                  </div>
                  {form.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {form.attachments.map((file, i) => {
                        const displayName = file.split("/").pop()?.split("-").slice(1).join("-") || file;
                        return (
                          <Badge key={i} variant="secondary" className="text-[10px] gap-1 py-1">
                            <FileText className="h-3 w-3" />
                            <a
                              href={`/api/file?pathname=${encodeURIComponent(file)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline max-w-[120px] truncate"
                              title={displayName}
                            >
                              {displayName}
                            </a>
                            <button
                              onClick={() => setForm((f) => ({ ...f, attachments: f.attachments.filter((_, idx) => idx !== i) }))}
                              className="mr-0.5 text-muted-foreground hover:text-foreground"
                            >
                              <XCircle className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    يمكنك رفع عدة ملفات (PDF, Word, Excel). الحد الأقصى 10 ميجابايت لكل ملف.
                  </p>
                </div>

                <Separator />

                {/* Summary */}
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <h4 className="text-xs font-semibold text-foreground mb-3">ملخص الطلب</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">{"مقدّم الطلب: "}</span>
                      <span className="font-medium text-foreground">{form.applicant_name || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"الدولة المستهدفة: "}</span>
                      <span className="font-medium text-foreground">{form.target_country || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"البريد: "}</span>
                      <span className="font-medium text-foreground" dir="ltr">{form.applicant_email || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{"القطاعات: "}</span>
                      <span className="font-medium text-foreground">{form.proposed_sectors || "-"}</span>
                    </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">{"المرفقات: "}</span>
                    <span className="font-medium text-foreground">
                      {form.attachments.length > 0
                        ? form.attachments.map((f) => f.split("/").pop()?.split("-").slice(1).join("-") || f).join("، ")
                        : "لا توجد"}
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowRight className="ml-1 h-4 w-4" />
                السابق
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => Math.min(3, s + 1))}
                  className="bg-primary text-primary-foreground"
                >
                  التالي
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!form.applicant_name.trim() || !form.target_country.trim() || submitting}
                  className="bg-primary text-primary-foreground"
                >
                  {submitting ? (
                    <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="ml-1.5 h-4 w-4" />
                  )}
                  {submitting ? "جارٍ الإرسال..." : "إرسال المبادرة"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Tab */}
      {activeTab === "list" && (
        <div className="flex flex-col gap-3">
          {/* Loading state */}
          {isLoading && (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">جارٍ تحميل المبادرات...</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && displayList.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ClipboardList className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">لا توجد مبادرات مقدّمة</p>
              </CardContent>
            </Card>
          ) : (
            !isLoading && displayList.map((initiative) => {
              const stsCfg = statusConfig[initiative.status];
              return (
                <Card key={initiative.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            مبادرة مجلس أعمال سوري - {initiative.target_country}
                          </h3>
                          <Badge variant="outline" className={`text-[10px] border ${stsCfg.color}`}>
                            {initiative.status}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Users className="h-3 w-3" />
                            <span>{initiative.applicant_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target className="h-3 w-3" />
                            <span>{initiative.proposed_sectors.join("، ")}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(initiative.submitted_at).toLocaleDateString("ar-SA")}</span>
                          </div>
                {initiative.attachments.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <FileText className="h-3 w-3 shrink-0" />
                    {initiative.attachments.map((file, idx) => {
                      const displayName = file.split("/").pop()?.split("-").slice(1).join("-") || file;
                      return (
                        <a
                          key={idx}
                          href={`/api/file?pathname=${encodeURIComponent(file)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-[10px]"
                          title={`تحميل: ${displayName}`}
                        >
                          {displayName}
                          {idx < initiative.attachments.length - 1 && "،"}
                        </a>
                      );
                    })}
                  </div>
                )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {initiative.business_plan_summary}
                        </p>
                        {initiative.reviewer_notes && (
                          <div className="mt-2 rounded-md bg-muted/50 border border-border p-2 text-xs">
                            <span className="font-medium text-foreground">{"ملاحظات المراجع: "}</span>
                            <span className="text-muted-foreground">{initiative.reviewer_notes}</span>
                          </div>
                        )}
                      </div>
                      {canReview && (initiative.status === "مقدّم" || initiative.status === "قيد المراجعة") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => openReview(initiative)}
                        >
                          <Pencil className="ml-1 h-3.5 w-3.5" />
                          مراجعة
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>مراجعة المبادرة</DialogTitle>
          </DialogHeader>
          {reviewTarget && (
            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-lg bg-muted/50 border border-border p-3">
                <p className="text-sm font-medium text-foreground">
                  مبادرة مجلس أعمال سوري - {reviewTarget.target_country}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {"مقدّم الطلب: "}{reviewTarget.applicant_name}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">القرار</Label>
                <Select value={reviewStatus} onValueChange={(v) => setReviewStatus(v as InitiativeStatus)}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                    <SelectItem value="مرفوض">مرفوض</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">ملاحظات المراجع</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="أضف ملاحظاتك هنا..."
                  className="text-sm"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleReview} disabled={reviewing} className="bg-primary text-primary-foreground">
              {reviewing ? (
                <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />
              ) : null}
              {reviewing ? "جارٍ الحفظ..." : "حفظ المراجعة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
