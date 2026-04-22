"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Council,
  SECTOR_CODES,
  SECTOR_LABELS,
  SectorCode,
  MEMBER_TYPES,
  MEMBER_TYPE_LABELS,
  MemberType,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  Building2,
  Users,
  FileText,
  Upload,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Target,
  Briefcase,
  Globe,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  ChevronLeft,
  Save,
  Send,
  Loader2,
  XCircle,
} from "lucide-react";

// Establishment phases with their steps
const ESTABLISHMENT_PHASES = [
  {
    id: "initiative",
    title: "مرحلة المبادرة",
    description: "تقديم طلب تأسيس المجلس والموافقة المبدئية",
    steps: [
      { id: "initiative_submitted", label: "تقديم طلب المبادرة", required: true },
      { id: "initiative_reviewed", label: "مراجعة الطلب", required: true },
      { id: "initiative_approved", label: "الموافقة على المبادرة", required: true },
    ],
  },
  {
    id: "documentation",
    title: "مرحلة التوثيق",
    description: "جمع وتوثيق جميع المستندات المطلوبة",
    steps: [
      { id: "founders_list", label: "قائمة الأعضاء المؤسسين", required: true },
      { id: "founders_cvs", label: "السير الذاتية للمؤسسين", required: true },
      { id: "company_profiles", label: "بروفايلات الشركات", required: true },
      { id: "business_plan", label: "خطة العمل المفصلة", required: true },
      { id: "mou_draft", label: "مسودة مذكرة التفاهم", required: false },
    ],
  },
  {
    id: "ministry_approval",
    title: "موافقة الوزارة",
    description: "الحصول على الموافقات الرسمية من الجهات المعنية",
    steps: [
      { id: "ministry_submission", label: "تقديم الطلب للوزارة", required: true },
      { id: "ministry_review", label: "مراجعة الوزارة", required: true },
      { id: "ministry_approval", label: "موافقة الوزارة", required: true },
      { id: "coordination_approval", label: "موافقة المجلس التنسيقي", required: true },
    ],
  },
  {
    id: "formation",
    title: "مرحلة التشكيل",
    description: "تشكيل الهيكل الإداري وتعيين المسؤولين",
    steps: [
      { id: "chairman_appointed", label: "تعيين رئيس المجلس", required: true },
      { id: "board_formed", label: "تشكيل مجلس الإدارة", required: true },
      { id: "committees_formed", label: "تشكيل اللجان", required: false },
      { id: "bylaws_approved", label: "اعتماد النظام الداخلي", required: true },
    ],
  },
  {
    id: "launch",
    title: "مرحلة الإطلاق",
    description: "الإطلاق الرسمي وبدء العمل",
    steps: [
      { id: "official_announcement", label: "الإعلان الرسمي", required: true },
      { id: "platform_setup", label: "إعداد المنصات الرقمية", required: true },
      { id: "first_meeting", label: "الاجتماع التأسيسي", required: true },
      { id: "operations_started", label: "بدء العمليات", required: true },
    ],
  },
];

// Founder member interface
interface FounderMember {
  id: string;
  name: string;
  type: MemberType;
  position: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  cvFile: string | null;
  companyProfile: string | null;
}

// Sample council with establishment data
interface CouncilEstablishment extends Council {
  establishment_data?: {
    initiative_id?: string;
    completed_steps: string[];
    founders: FounderMember[];
    documents: { id: string; name: string; type: string; url: string; uploaded_at: string }[];
    ministry_reference?: string;
    coordination_reference?: string;
    notes: string;
  };
}

const SAMPLE_COUNCIL: CouncilEstablishment = {
  id: "c3",
  uuid: "council-uuid-3",
  name_ar: "مجلس الأعمال السوري الأردني",
  name_en: "Syrian-Jordanian Business Council",
  partner_country_code: "JO",
  partner_country_name: "الأردن",
  status: "draft",
  establishment_stage: "under_establishment",
  chairman_user_id: null,
  summary: "مجلس أعمال ثنائي يهدف لتعزيز التعاون الاقتصادي بين سوريا والأردن",
  sectors: ["trade", "transport", "agriculture"],
  created_at: "2026-03-15T00:00:00Z",
  updated_at: "2026-04-15T00:00:00Z",
  establishment_data: {
    initiative_id: "init-001",
    completed_steps: [
      "initiative_submitted",
      "initiative_reviewed",
      "initiative_approved",
      "founders_list",
    ],
    founders: [
      {
        id: "f1",
        name: "أحمد الخالد",
        type: "individual",
        position: "رئيس مقترح",
        company: "شركة الخالد للتجارة",
        email: "ahmad@example.com",
        phone: "+963 944 111 222",
        country: "سوريا",
        cvFile: "/uploads/cv-ahmad.pdf",
        companyProfile: "/uploads/profile-khaled.pdf",
      },
      {
        id: "f2",
        name: "شركة الأفق للاستيراد والتصدير",
        type: "company",
        position: "عضو مؤسس",
        company: "شركة الأفق",
        email: "info@alofuq.com",
        phone: "+962 6 555 1234",
        country: "الأردن",
        cvFile: null,
        companyProfile: "/uploads/profile-alofuq.pdf",
      },
    ],
    documents: [
      { id: "d1", name: "طلب المبادرة", type: "initiative", url: "/docs/initiative.pdf", uploaded_at: "2026-03-15" },
      { id: "d2", name: "قائمة المؤسسين", type: "founders", url: "/docs/founders.pdf", uploaded_at: "2026-03-20" },
    ],
    ministry_reference: "",
    coordination_reference: "",
    notes: "المجلس في مرحلة جمع الوثائق المطلوبة",
  },
};

interface CouncilEstablishmentWorkflowProps {
  council?: CouncilEstablishment;
  onBack?: () => void;
}

export function CouncilEstablishmentWorkflow({
  council = SAMPLE_COUNCIL,
  onBack,
}: CouncilEstablishmentWorkflowProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "form" | "founders" | "documents">("overview");
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [addFounderOpen, setAddFounderOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<FounderMember | null>(null);
  
  const [establishmentData, setEstablishmentData] = useState(
    council.establishment_data || {
      initiative_id: "",
      completed_steps: [],
      founders: [],
      documents: [],
      ministry_reference: "",
      coordination_reference: "",
      notes: "",
    }
  );

  const [founderForm, setFounderForm] = useState<Omit<FounderMember, "id">>({
    name: "",
    type: "individual",
    position: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    cvFile: null,
    companyProfile: null,
  });

  // Calculate progress for each phase
  const phaseProgress = useMemo(() => {
    return ESTABLISHMENT_PHASES.map((phase) => {
      const totalSteps = phase.steps.length;
      const completedSteps = phase.steps.filter((step) =>
        establishmentData.completed_steps.includes(step.id)
      ).length;
      return {
        ...phase,
        completedSteps,
        totalSteps,
        percentage: Math.round((completedSteps / totalSteps) * 100),
        isComplete: completedSteps === totalSteps,
      };
    });
  }, [establishmentData.completed_steps]);

  // Overall progress
  const overallProgress = useMemo(() => {
    const allSteps = ESTABLISHMENT_PHASES.flatMap((p) => p.steps);
    const completedCount = allSteps.filter((s) =>
      establishmentData.completed_steps.includes(s.id)
    ).length;
    return {
      completed: completedCount,
      total: allSteps.length,
      percentage: Math.round((completedCount / allSteps.length) * 100),
    };
  }, [establishmentData.completed_steps]);

  // Toggle step completion
  const toggleStep = useCallback((stepId: string) => {
    setEstablishmentData((prev) => ({
      ...prev,
      completed_steps: prev.completed_steps.includes(stepId)
        ? prev.completed_steps.filter((s) => s !== stepId)
        : [...prev.completed_steps, stepId],
    }));
  }, []);

  // Handle founder add/edit
  const handleSaveFounder = useCallback(() => {
    if (!founderForm.name.trim()) return;

    if (editingFounder) {
      setEstablishmentData((prev) => ({
        ...prev,
        founders: prev.founders.map((f) =>
          f.id === editingFounder.id ? { ...founderForm, id: f.id } : f
        ),
      }));
    } else {
      const newFounder: FounderMember = {
        ...founderForm,
        id: `f-${Date.now()}`,
      };
      setEstablishmentData((prev) => ({
        ...prev,
        founders: [...prev.founders, newFounder],
      }));
    }

    setFounderForm({
      name: "",
      type: "individual",
      position: "",
      company: "",
      email: "",
      phone: "",
      country: "",
      cvFile: null,
      companyProfile: null,
    });
    setEditingFounder(null);
    setAddFounderOpen(false);
  }, [founderForm, editingFounder]);

  const openEditFounder = useCallback((founder: FounderMember) => {
    setEditingFounder(founder);
    setFounderForm({
      name: founder.name,
      type: founder.type,
      position: founder.position,
      company: founder.company,
      email: founder.email,
      phone: founder.phone,
      country: founder.country,
      cvFile: founder.cvFile,
      companyProfile: founder.companyProfile,
    });
    setAddFounderOpen(true);
  }, []);

  const deleteFounder = useCallback((founderId: string) => {
    setEstablishmentData((prev) => ({
      ...prev,
      founders: prev.founders.filter((f) => f.id !== founderId),
    }));
  }, []);

  // File upload handler (simulated)
  const handleFileUpload = useCallback(
    async (
      file: File,
      setPath: (path: string) => void,
      setLoading: (loading: boolean) => void
    ) => {
      setLoading(true);
      // Simulate upload
      await new Promise((r) => setTimeout(r, 1000));
      const fakePath = `/uploads/${Date.now()}-${file.name}`;
      setPath(fakePath);
      setLoading(false);
    },
    []
  );

  const [uploadingCv, setUploadingCv] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // Get phase status color
  const getPhaseStatusColor = (phase: typeof phaseProgress[0]) => {
    if (phase.isComplete) return "bg-emerald-500";
    if (phase.completedSteps > 0) return "bg-amber-500";
    return "bg-muted";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="ml-1 h-4 w-4" />
            العودة
          </Button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{council.name_ar}</h1>
              <p className="text-sm text-muted-foreground">
                {council.partner_country_name} - إجراءات التأسيس
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/images/syrian-gov-logo.jpg"
            alt="الجمهورية العربية السورية"
            width={40}
            height={40}
            className="rounded-md"
          />
          <Image
            src="/images/sbcb-logo.png"
            alt="SBCB"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>

      {/* Overall Progress Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Progress Circle */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="h-28 w-28 -rotate-90 transform">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${overallProgress.percentage * 3.02} 302`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {overallProgress.percentage}%
                  </span>
                  <span className="text-[10px] text-muted-foreground">مكتمل</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">تقدم إجراءات التأسيس</h3>
                <p className="text-sm text-muted-foreground">
                  {overallProgress.completed} من {overallProgress.total} خطوة مكتملة
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      overallProgress.percentage >= 80
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : overallProgress.percentage >= 50
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-sky-300 bg-sky-50 text-sky-700"
                    }
                  >
                    {overallProgress.percentage >= 80
                      ? "قريب من الاكتمال"
                      : overallProgress.percentage >= 50
                      ? "في منتصف الطريق"
                      : "في البداية"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Phase Mini Cards */}
            <div className="flex flex-wrap gap-2">
              {phaseProgress.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`flex flex-col items-center rounded-lg border p-3 min-w-[80px] cursor-pointer transition-all ${
                    currentPhaseIndex === idx
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setCurrentPhaseIndex(idx)}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold ${getPhaseStatusColor(
                      phase
                    )}`}
                  >
                    {phase.isComplete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="mt-1 text-[10px] text-center text-muted-foreground">
                    {phase.title.split(" ")[1]}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {phase.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Progress Bars */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {phaseProgress.map((phase, idx) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all ${
              currentPhaseIndex === idx ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setCurrentPhaseIndex(idx)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">{phase.title}</span>
                <span className="text-xs text-muted-foreground">
                  {phase.completedSteps}/{phase.totalSteps}
                </span>
              </div>
              <Progress value={phase.percentage} className="h-2" />
              <p className="mt-2 text-[10px] text-muted-foreground line-clamp-2">
                {phase.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="form">استمارة البيانات</TabsTrigger>
          <TabsTrigger value="founders">الأعضاء المؤسسون</TabsTrigger>
          <TabsTrigger value="documents">المستندات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Current Phase Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {phaseProgress[currentPhaseIndex].title}
                </CardTitle>
                <CardDescription>
                  {phaseProgress[currentPhaseIndex].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {ESTABLISHMENT_PHASES[currentPhaseIndex].steps.map((step) => {
                    const isCompleted = establishmentData.completed_steps.includes(step.id);
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          isCompleted
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-border"
                        }`}
                      >
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => toggleStep(step.id)}
                        />
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              isCompleted
                                ? "text-emerald-700 font-medium"
                                : "text-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                          {step.required && !isCompleted && (
                            <Badge variant="outline" className="mr-2 text-[9px]">
                              مطلوب
                            </Badge>
                          )}
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPhaseIndex === 0}
                    onClick={() => setCurrentPhaseIndex((i) => i - 1)}
                  >
                    <ArrowRight className="ml-1 h-4 w-4" />
                    المرحلة السابقة
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPhaseIndex === ESTABLISHMENT_PHASES.length - 1}
                    onClick={() => setCurrentPhaseIndex((i) => i + 1)}
                  >
                    المرحلة التالية
                    <ArrowLeft className="mr-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">ملخص الإنجاز</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-emerald-700">
                          {overallProgress.completed}
                        </p>
                        <p className="text-xs text-emerald-600">خطوة مكتملة</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-700">
                          {overallProgress.total - overallProgress.completed}
                        </p>
                        <p className="text-xs text-amber-600">خطوة متبقية</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-sky-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100">
                        <Users className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-sky-700">
                          {establishmentData.founders.length}
                        </p>
                        <p className="text-xs text-sky-600">عضو مؤسس</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-violet-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                        <FileText className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-violet-700">
                          {establishmentData.documents.length}
                        </p>
                        <p className="text-xs text-violet-600">مستند مرفق</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">ملاحظات</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={establishmentData.notes}
                    onChange={(e) =>
                      setEstablishmentData((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="أضف ملاحظات حول سير إجراءات التأسيس..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Form Tab */}
        <TabsContent value="form" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">استمارة استكمال بيانات التأسيس</CardTitle>
              <CardDescription>
                استكمل جميع البيانات المطلوبة للمجلس
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Council Basic Info */}
                <div className="sm:col-span-2">
                  <h4 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    معلومات المجلس الأساسية
                  </h4>
                  <Separator className="mb-4" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>اسم المجلس (عربي)</Label>
                  <Input value={council.name_ar} disabled className="bg-muted" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>الدولة الشريكة</Label>
                  <Input value={council.partner_country_name} disabled className="bg-muted" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>رقم مرجع المبادرة</Label>
                  <Input
                    value={establishmentData.initiative_id}
                    onChange={(e) =>
                      setEstablishmentData((prev) => ({
                        ...prev,
                        initiative_id: e.target.value,
                      }))
                    }
                    placeholder="رقم طلب المبادرة الأصلي"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>القطاعات المستهدفة</Label>
                  <div className="flex flex-wrap gap-1">
                    {council.sectors.map((s) => (
                      <Badge key={s} variant="secondary">
                        {SECTOR_LABELS[s]}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Ministry & Coordination */}
                <div className="sm:col-span-2 mt-4">
                  <h4 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    الموافقات الرسمية
                  </h4>
                  <Separator className="mb-4" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>رقم موافقة الوزارة</Label>
                  <Input
                    value={establishmentData.ministry_reference}
                    onChange={(e) =>
                      setEstablishmentData((prev) => ({
                        ...prev,
                        ministry_reference: e.target.value,
                      }))
                    }
                    placeholder="أدخل رقم كتاب الموافقة"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>رقم موافقة المجلس التنسيقي</Label>
                  <Input
                    value={establishmentData.coordination_reference}
                    onChange={(e) =>
                      setEstablishmentData((prev) => ({
                        ...prev,
                        coordination_reference: e.target.value,
                      }))
                    }
                    placeholder="رقم قرار المجلس التنسيقي"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <Label>وصف المجلس وأهدافه</Label>
                  <Textarea
                    value={council.summary || ""}
                    placeholder="وصف تفصيلي لأهداف المجلس ورؤيته..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">
                  إلغاء التغييرات
                </Button>
                <Button onClick={() => setSaving(true)} disabled={saving}>
                  {saving ? (
                    <Loader2 className="ml-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="ml-1.5 h-4 w-4" />
                  )}
                  حفظ البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Founders Tab */}
        <TabsContent value="founders" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">الأعضاء المؤسسون</CardTitle>
                  <CardDescription>
                    قائمة الأعضاء المؤسسين مع السير الذاتية وبروفايلات الشركات
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingFounder(null);
                    setFounderForm({
                      name: "",
                      type: "individual",
                      position: "",
                      company: "",
                      email: "",
                      phone: "",
                      country: "",
                      cvFile: null,
                      companyProfile: null,
                    });
                    setAddFounderOpen(true);
                  }}
                >
                  <Plus className="ml-1.5 h-4 w-4" />
                  إضافة عضو
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {establishmentData.founders.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    لم يتم إضافة أعضاء مؤسسين بعد
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setAddFounderOpen(true)}
                  >
                    <Plus className="ml-1.5 h-4 w-4" />
                    إضافة أول عضو
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المنصب</TableHead>
                      <TableHead>الدولة</TableHead>
                      <TableHead>المرفقات</TableHead>
                      <TableHead className="text-left">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {establishmentData.founders.map((founder) => (
                      <TableRow key={founder.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{founder.name}</p>
                            <p className="text-xs text-muted-foreground">{founder.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">
                            {MEMBER_TYPE_LABELS[founder.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>{founder.position}</TableCell>
                        <TableCell>{founder.country}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {founder.cvFile && (
                              <Badge variant="secondary" className="text-[9px]">
                                CV
                              </Badge>
                            )}
                            {founder.companyProfile && (
                              <Badge variant="secondary" className="text-[9px]">
                                Profile
                              </Badge>
                            )}
                            {!founder.cvFile && !founder.companyProfile && (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditFounder(founder)}
                            >
                              تعديل
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteFounder(founder.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {establishmentData.founders.length > 0 && (
                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm text-muted-foreground">
                    إجمالي الأعضاء: {establishmentData.founders.length}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {establishmentData.founders.filter((f) => f.cvFile).length} CV مرفق
                    </Badge>
                    <Badge variant="outline">
                      {establishmentData.founders.filter((f) => f.companyProfile).length} بروفايل مرفق
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">المستندات والمرفقات</CardTitle>
                  <CardDescription>
                    جميع الوثائق المطلوبة لإتمام إجراءات التأسيس
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline">
                  <Upload className="ml-1.5 h-4 w-4" />
                  رفع مستند
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Required Documents Checklist */}
                <Card className="sm:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">المستندات المطلوبة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {[
                        { id: "founders_list", label: "قائمة المؤسسين" },
                        { id: "cvs", label: "السير الذاتية" },
                        { id: "profiles", label: "بروفايلات الشركات" },
                        { id: "business_plan", label: "خطة العمل" },
                        { id: "mou", label: "مذكرة التفاهم" },
                        { id: "ministry_approval", label: "موافقة الوزارة" },
                      ].map((doc) => {
                        const uploaded = establishmentData.documents.some(
                          (d) => d.type === doc.id
                        );
                        return (
                          <div
                            key={doc.id}
                            className={`flex items-center gap-2 rounded-md p-2 ${
                              uploaded ? "bg-emerald-50" : "bg-muted/50"
                            }`}
                          >
                            {uploaded ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span
                              className={`text-sm ${
                                uploaded ? "text-emerald-700" : "text-muted-foreground"
                              }`}
                            >
                              {doc.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Uploaded Documents */}
                <div className="sm:col-span-2 flex flex-col gap-3">
                  <h4 className="text-sm font-medium text-foreground">المستندات المرفوعة</h4>
                  {establishmentData.documents.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        لا توجد مستندات مرفوعة
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {establishmentData.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {doc.uploaded_at}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Founder Dialog */}
      <Dialog open={addFounderOpen} onOpenChange={setAddFounderOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingFounder ? "تعديل عضو مؤسس" : "إضافة عضو مؤسس"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label>الاسم *</Label>
                <Input
                  value={founderForm.name}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="الاسم الكامل أو اسم الشركة"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>نوع العضوية</Label>
                <Select
                  value={founderForm.type}
                  onValueChange={(v) =>
                    setFounderForm((f) => ({ ...f, type: v as MemberType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEMBER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {MEMBER_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>المنصب المقترح</Label>
                <Input
                  value={founderForm.position}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, position: e.target.value }))
                  }
                  placeholder="مثال: رئيس، نائب رئيس، عضو"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>الشركة / المؤسسة</Label>
                <Input
                  value={founderForm.company}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, company: e.target.value }))
                  }
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>الدولة</Label>
                <Input
                  value={founderForm.country}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, country: e.target.value }))
                  }
                  placeholder="سوريا / الدولة الشريكة"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={founderForm.email}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>رقم الهاتف</Label>
                <Input
                  type="tel"
                  value={founderForm.phone}
                  onChange={(e) =>
                    setFounderForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+963 ..."
                  dir="ltr"
                />
              </div>

              {/* CV Upload */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label>السيرة الذاتية (CV)</Label>
                <div className="flex gap-2 items-center">
                  {founderForm.cvFile ? (
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate flex-1" dir="ltr">
                        {founderForm.cvFile.split("/").pop()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setFounderForm((f) => ({ ...f, cvFile: null }))}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={uploadingCv}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(
                              file,
                              (path) => setFounderForm((f) => ({ ...f, cvFile: path })),
                              setUploadingCv
                            );
                          }
                          e.target.value = "";
                        }}
                      />
                      {uploadingCv && <Loader2 className="h-4 w-4 animate-spin" />}
                    </>
                  )}
                </div>
              </div>

              {/* Company Profile Upload */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <Label>بروفايل الشركة</Label>
                <div className="flex gap-2 items-center">
                  {founderForm.companyProfile ? (
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate flex-1" dir="ltr">
                        {founderForm.companyProfile.split("/").pop()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() =>
                          setFounderForm((f) => ({ ...f, companyProfile: null }))
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        disabled={uploadingProfile}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(
                              file,
                              (path) =>
                                setFounderForm((f) => ({ ...f, companyProfile: path })),
                              setUploadingProfile
                            );
                          }
                          e.target.value = "";
                        }}
                      />
                      {uploadingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFounderOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSaveFounder} disabled={!founderForm.name.trim()}>
              {editingFounder ? "حفظ التغييرات" : "إضافة العضو"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
