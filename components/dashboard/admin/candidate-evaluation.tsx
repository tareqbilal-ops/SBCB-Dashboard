"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Search,
  Filter,
  Star,
  Award,
  FileText,
  Download,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  MapPin,
  Building2,
  Globe,
  TrendingUp,
  ClipboardList,
  Eye,
  Edit,
  Loader2,
} from "lucide-react";
import type {
  InitiativeStatus,
  CandidateRole,
  CandidateEvaluation,
  EconomicSector,
  SyrianCity,
  ActivityType,
  BusinessSize,
} from "@/lib/types";
import {
  CANDIDATE_ROLES,
  ECONOMIC_SECTORS,
  SYRIAN_CITIES,
} from "@/lib/types";

// Extended initiative interface with candidate data
interface CandidateInitiative {
  id: string;
  // Basic info
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  target_country: string;
  
  // Extended candidate fields
  current_residence_country: string;
  origin_city: SyrianCity;
  economic_sector: EconomicSector;
  activity_type: string;
  business_size: string;
  initiative_description: string;
  partner_country_network: string;
  professional_record: string;
  desired_role: CandidateRole;
  company_profile_url: string | null;
  cv_url: string | null;
  
  // Evaluation
  evaluation: CandidateEvaluation | null;
  assigned_role: CandidateRole | null;
  
  // Status
  status: InitiativeStatus;
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
}

interface CandidateEvaluationProps {
  country: string;
  onBack: () => void;
}

// Sample data - in production, this would come from API
const sampleCandidates: CandidateInitiative[] = [
  {
    id: "cand-001",
    applicant_name: "غسان كريم",
    applicant_email: "ghassan@example.com",
    applicant_phone: "+20 100 123 4567",
    target_country: "مصر",
    current_residence_country: "القاهرة",
    origin_city: "دمشق",
    economic_sector: "التجارة",
    activity_type: "تجاري",
    business_size: "كبير (51-200 موظف)",
    initiative_description: "تأسيس شبكة توزيع للمنتجات السورية في السوق المصري",
    partner_country_network: "علاقات قوية مع غرف التجارة المصرية ومستوردين رئيسيين",
    professional_record: "20 عاماً خبرة في التجارة الدولية، مؤسس 3 شركات ناجحة",
    desired_role: "رئيس المجلس",
    company_profile_url: "/uploads/profile-ghassan.pdf",
    cv_url: "/uploads/cv-ghassan.pdf",
    evaluation: {
      quality_score: 5,
      feasibility_score: 4,
      financial_capacity_score: 5,
      network_score: 5,
      reputation_score: 5,
      sector_importance_score: 4,
      geographic_representation_score: 4,
      total_score: 32,
    },
    assigned_role: "رئيس المجلس",
    status: "معتمدة ضمن التشكيلة",
    submitted_at: "2026-01-15T10:00:00Z",
    reviewed_at: "2026-01-20T14:00:00Z",
    reviewer_notes: "مرشح ممتاز بخبرة واسعة وشبكة علاقات قوية",
  },
  {
    id: "cand-002",
    applicant_name: "وائل الدرة",
    applicant_email: "wael@example.com",
    applicant_phone: "+20 100 234 5678",
    target_country: "مصر",
    current_residence_country: "القاهرة",
    origin_city: "دمشق",
    economic_sector: "الصناعة",
    activity_type: "إنتاجي",
    business_size: "كبير (51-200 موظف)",
    initiative_description: "إنشاء منطقة صناعية سورية-مصرية مشتركة",
    partner_country_network: "شراكات مع مصانع مصرية كبرى",
    professional_record: "15 عاماً في الصناعة التحويلية، خبير في التصدير",
    desired_role: "نائب رئيس المجلس",
    company_profile_url: "/uploads/profile-wael.pdf",
    cv_url: "/uploads/cv-wael.pdf",
    evaluation: {
      quality_score: 4,
      feasibility_score: 5,
      financial_capacity_score: 4,
      network_score: 4,
      reputation_score: 5,
      sector_importance_score: 5,
      geographic_representation_score: 4,
      total_score: 31,
    },
    assigned_role: "نائب رئيس المجلس",
    status: "معتمدة ضمن التشكيلة",
    submitted_at: "2026-01-16T11:00:00Z",
    reviewed_at: "2026-01-21T10:00:00Z",
    reviewer_notes: "خبرة صناعية متميزة",
  },
  {
    id: "cand-003",
    applicant_name: "أحمد راغب آغا",
    applicant_email: "ahmad@example.com",
    applicant_phone: "+20 100 345 6789",
    target_country: "مصر",
    current_residence_country: "القاهرة",
    origin_city: "حلب",
    economic_sector: "الصناعات الكيميائية",
    activity_type: "إنتاجي",
    business_size: "متوسط (10-50 موظف)",
    initiative_description: "تطوير صناعة المواد الكيميائية والصيدلانية",
    partner_country_network: "علاقات مع شركات أدوية مصرية",
    professional_record: "12 عاماً في صناعة الكيماويات",
    desired_role: "نائب رئيس المجلس",
    company_profile_url: "/uploads/profile-ahmad.pdf",
    cv_url: "/uploads/cv-ahmad.pdf",
    evaluation: {
      quality_score: 4,
      feasibility_score: 4,
      financial_capacity_score: 4,
      network_score: 4,
      reputation_score: 4,
      sector_importance_score: 5,
      geographic_representation_score: 5,
      total_score: 30,
    },
    assigned_role: "نائب رئيس المجلس",
    status: "معتمدة ضمن التشكيلة",
    submitted_at: "2026-01-17T09:00:00Z",
    reviewed_at: "2026-01-22T11:00:00Z",
    reviewer_notes: "تمثيل جيد لحلب، قطاع مهم",
  },
  {
    id: "cand-004",
    applicant_name: "أيمن أبو اللبن",
    applicant_email: "ayman@example.com",
    applicant_phone: "+20 100 456 7890",
    target_country: "مصر",
    current_residence_country: "القاهرة",
    origin_city: "حمص",
    economic_sector: "الصناعات الغذائية",
    activity_type: "إنتاجي",
    business_size: "متوسط (10-50 موظف)",
    initiative_description: "تصدير المنتجات الغذائية السورية للسوق المصري",
    partner_country_network: "علاقات مع سلاسل سوبرماركت مصرية",
    professional_record: "10 سنوات في صناعة الأغذية",
    desired_role: "عضو مجلس إدارة",
    company_profile_url: "/uploads/profile-ayman.pdf",
    cv_url: "/uploads/cv-ayman.pdf",
    evaluation: {
      quality_score: 4,
      feasibility_score: 4,
      financial_capacity_score: 3,
      network_score: 4,
      reputation_score: 4,
      sector_importance_score: 4,
      geographic_representation_score: 5,
      total_score: 28,
    },
    assigned_role: "عضو مجلس إدارة",
    status: "معتمدة ضمن التشكيلة",
    submitted_at: "2026-01-18T14:00:00Z",
    reviewed_at: "2026-01-23T09:00:00Z",
    reviewer_notes: "تمثيل جيد لحمص، قطاع غذائي مهم",
  },
  {
    id: "cand-005",
    applicant_name: "سامر الحسن",
    applicant_email: "samer@example.com",
    applicant_phone: "+20 100 567 8901",
    target_country: "مصر",
    current_residence_country: "الإسكندرية",
    origin_city: "اللاذقية",
    economic_sector: "النقل واللوجستيات",
    activity_type: "تجاري",
    business_size: "متوسط (10-50 موظف)",
    initiative_description: "تطوير خطوط شحن بحري بين الموانئ السورية والمصرية",
    partner_country_network: "علاقات مع شركات شحن في الإسكندرية",
    professional_record: "8 سنوات في قطاع النقل البحري",
    desired_role: "عضو مجلس إدارة",
    company_profile_url: null,
    cv_url: "/uploads/cv-samer.pdf",
    evaluation: {
      quality_score: 3,
      feasibility_score: 4,
      financial_capacity_score: 3,
      network_score: 3,
      reputation_score: 4,
      sector_importance_score: 4,
      geographic_representation_score: 4,
      total_score: 25,
    },
    assigned_role: null,
    status: "مقبول",
    submitted_at: "2026-01-19T16:00:00Z",
    reviewed_at: "2026-01-24T10:00:00Z",
    reviewer_notes: "مرشح جيد، يمكن إضافته للتشكيلة",
  },
  {
    id: "cand-006",
    applicant_name: "منى العلي",
    applicant_email: "mona@example.com",
    applicant_phone: "+20 100 678 9012",
    target_country: "مصر",
    current_residence_country: "القاهرة",
    origin_city: "حماة",
    economic_sector: "الخدمات الاستشارية",
    activity_type: "تجاري",
    business_size: "صغير (أقل من 10 موظفين)",
    initiative_description: "تقديم خدمات استشارية للمستثمرين السوريين في مصر",
    partner_country_network: "علاقات مع مكاتب محاماة واستشارات مصرية",
    professional_record: "6 سنوات في الاستشارات القانونية والتجارية",
    desired_role: "غير محدد",
    company_profile_url: null,
    cv_url: null,
    evaluation: null,
    assigned_role: null,
    status: "قيد الدراسة",
    submitted_at: "2026-01-25T10:00:00Z",
    reviewed_at: null,
    reviewer_notes: null,
  },
];

const EVALUATION_CRITERIA = [
  { key: "quality_score", label: "جودة المبادرة" },
  { key: "feasibility_score", label: "قابلية التنفيذ" },
  { key: "financial_capacity_score", label: "الملاءة المالية" },
  { key: "network_score", label: "شبكة العلاقات" },
  { key: "reputation_score", label: "السمعة المهنية" },
  { key: "sector_importance_score", label: "الأهمية القطاعية" },
  { key: "geographic_representation_score", label: "التمثيل الجغرافي" },
] as const;

const STATUS_CONFIG: Record<InitiativeStatus, { color: string; icon: typeof Clock; label: string }> = {
  "مقدّم": { color: "bg-slate-100 text-slate-800 border-slate-300", icon: Clock, label: "مقدّم" },
  "قيد الدراسة": { color: "bg-sky-100 text-sky-800 border-sky-300", icon: Eye, label: "قيد الدراسة" },
  "مستوفية مبدئياً": { color: "bg-blue-100 text-blue-800 border-blue-300", icon: ClipboardList, label: "مستوفية مبدئياً" },
  "قيد المراجعة": { color: "bg-amber-100 text-amber-800 border-amber-300", icon: Eye, label: "قيد المراجعة" },
  "مقبول": { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle, label: "مقبول" },
  "مرفوض": { color: "bg-red-100 text-red-800 border-red-300", icon: XCircle, label: "مرفوض" },
  "احتياطية": { color: "bg-orange-100 text-orange-800 border-orange-300", icon: Clock, label: "احتياطية" },
  "معتمدة ضمن التشكيلة": { color: "bg-primary/20 text-primary border-primary/30", icon: Award, label: "معتمدة ضمن التشكيلة" },
};

export function CandidateEvaluation({ country, onBack }: CandidateEvaluationProps) {
  const [candidates, setCandidates] = useState<CandidateInitiative[]>(
    sampleCandidates.filter((c) => c.target_country === country)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | "all">("all");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateInitiative | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [evaluatingCandidate, setEvaluatingCandidate] = useState<CandidateInitiative | null>(null);
  const [evaluationForm, setEvaluationForm] = useState<CandidateEvaluation>({
    quality_score: 3,
    feasibility_score: 3,
    financial_capacity_score: 3,
    network_score: 3,
    reputation_score: 3,
    sector_importance_score: 3,
    geographic_representation_score: 3,
    total_score: 21,
  });

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.applicant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.economic_sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.origin_city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [candidates, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = candidates.length;
    const approved = candidates.filter((c) => c.status === "معتمدة ضمن التشكيلة").length;
    const accepted = candidates.filter((c) => c.status === "مقبول").length;
    const pending = candidates.filter((c) => ["قيد الدراسة", "مستوفية مبدئياً", "قيد المراجعة"].includes(c.status)).length;
    const rejected = candidates.filter((c) => c.status === "مرفوض").length;
    return { total, approved, accepted, pending, rejected };
  }, [candidates]);

  // Council formation table (approved candidates)
  const councilMembers = useMemo(() => {
    return candidates
      .filter((c) => c.status === "معتمدة ضمن التشكيلة" && c.assigned_role)
      .sort((a, b) => {
        const roleOrder = ["رئيس المجلس", "نائب رئيس المجلس", "عضو مجلس إدارة", "عضو احتياطي"];
        return roleOrder.indexOf(a.assigned_role!) - roleOrder.indexOf(b.assigned_role!);
      });
  }, [candidates]);

  // Calculate total score
  const calculateTotalScore = useCallback((eval_: CandidateEvaluation) => {
    return (
      eval_.quality_score +
      eval_.feasibility_score +
      eval_.financial_capacity_score +
      eval_.network_score +
      eval_.reputation_score +
      eval_.sector_importance_score +
      eval_.geographic_representation_score
    );
  }, []);

  // Open evaluation dialog
  const openEvaluation = useCallback((candidate: CandidateInitiative) => {
    setEvaluatingCandidate(candidate);
    if (candidate.evaluation) {
      setEvaluationForm(candidate.evaluation);
    } else {
      setEvaluationForm({
        quality_score: 3,
        feasibility_score: 3,
        financial_capacity_score: 3,
        network_score: 3,
        reputation_score: 3,
        sector_importance_score: 3,
        geographic_representation_score: 3,
        total_score: 21,
      });
    }
    setEvaluationDialogOpen(true);
  }, []);

  // Save evaluation
  const saveEvaluation = useCallback((newStatus: InitiativeStatus, assignedRole?: CandidateRole) => {
    if (!evaluatingCandidate) return;
    const totalScore = calculateTotalScore(evaluationForm);
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === evaluatingCandidate.id
          ? {
              ...c,
              evaluation: { ...evaluationForm, total_score: totalScore },
              status: newStatus,
              assigned_role: assignedRole || c.assigned_role,
              reviewed_at: new Date().toISOString(),
            }
          : c
      )
    );
    setEvaluationDialogOpen(false);
    setEvaluatingCandidate(null);
  }, [evaluatingCandidate, evaluationForm, calculateTotalScore]);

  // Update role
  const updateRole = useCallback((candidateId: string, role: CandidateRole) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, assigned_role: role, status: "معتمدة ضمن التشكيلة" }
          : c
      )
    );
  }, []);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              تقييم المرشحين - مجلس الأعمال السوري {country}ي
            </h2>
            <p className="text-sm text-muted-foreground">
              وحدة تقييم المرشحين وتشكيل فرق مجالس الأعمال
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="ml-1.5 h-3.5 w-3.5" />
            تصدير التشكيلة
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <ClipboardList className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي المبادرات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">ضمن التشكيلة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{stats.accepted}</p>
                <p className="text-xs text-muted-foreground">مقبول</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">قيد الدراسة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">مرفوض</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidates">
            <Users className="ml-1.5 h-4 w-4" />
            قائمة المرشحين
          </TabsTrigger>
          <TabsTrigger value="formation">
            <Award className="ml-1.5 h-4 w-4" />
            تشكيلة المجلس
          </TabsTrigger>
        </TabsList>

        {/* Candidates Tab */}
        <TabsContent value="candidates" className="mt-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border pb-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">
                  المرشحون للانضمام للمجلس
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="بحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-9 w-48 pr-9 text-sm"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as InitiativeStatus | "all")}
                  >
                    <SelectTrigger className="h-9 w-40 text-sm">
                      <Filter className="ml-1.5 h-3.5 w-3.5" />
                      <SelectValue placeholder="الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {Object.keys(STATUS_CONFIG).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-medium">الاسم</TableHead>
                      <TableHead className="text-right font-medium">القطاع</TableHead>
                      <TableHead className="text-right font-medium">المدينة الأصل</TableHead>
                      <TableHead className="text-right font-medium">بلد الإقامة</TableHead>
                      <TableHead className="text-right font-medium">الدور المرغوب</TableHead>
                      <TableHead className="text-center font-medium">التقييم</TableHead>
                      <TableHead className="text-center font-medium">الحالة</TableHead>
                      <TableHead className="text-center font-medium">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => {
                      const statusConfig = STATUS_CONFIG[candidate.status];
                      const StatusIcon = statusConfig.icon;
                      return (
                        <TableRow key={candidate.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{candidate.applicant_name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {candidate.economic_sector}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {candidate.origin_city}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {candidate.current_residence_country}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {candidate.desired_role}
                          </TableCell>
                          <TableCell className="text-center">
                            {candidate.evaluation ? (
                              <div className="flex items-center justify-center gap-1">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-medium">
                                  {candidate.evaluation.total_score}/35
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${statusConfig.color} text-[10px]`}>
                              <StatusIcon className="ml-1 h-3 w-3" />
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => {
                                  setSelectedCandidate(candidate);
                                  setDetailOpen(true);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => openEvaluation(candidate)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredCandidates.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          لا توجد نتائج
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formation Tab */}
        <TabsContent value="formation" className="mt-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-foreground">
                  تشكيلة مجلس الأعمال السوري {country}ي
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="ml-1.5 h-3.5 w-3.5" />
                    مذكرة تبريرية
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="ml-1.5 h-3.5 w-3.5" />
                    كتاب الرفع
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="ml-1.5 h-3.5 w-3.5" />
                    مشروع القرار
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-medium">الاسم</TableHead>
                      <TableHead className="text-right font-medium">الصفة في المجلس</TableHead>
                      <TableHead className="text-right font-medium">الاختصاص / القطاع</TableHead>
                      <TableHead className="text-center font-medium">التصنيف</TableHead>
                      <TableHead className="text-right font-medium">المدينة الأصل</TableHead>
                      <TableHead className="text-right font-medium">بلد الإقامة الحالي</TableHead>
                      <TableHead className="text-center font-medium">تعديل الصفة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {councilMembers.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{member.applicant_name}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              member.assigned_role === "رئيس المجلس"
                                ? "bg-primary/10 text-primary border-primary/30"
                                : member.assigned_role === "نائب رئيس المجلس"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-slate-100 text-slate-800 border-slate-300"
                            }
                          >
                            {member.assigned_role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{member.economic_sector}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm">{member.evaluation?.total_score}/35</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {member.origin_city}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {member.current_residence_country}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.assigned_role || ""}
                            onValueChange={(v) => updateRole(member.id, v as CandidateRole)}
                          >
                            <SelectTrigger className="h-8 w-36 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CANDIDATE_ROLES.filter((r) => r !== "غير محدد").map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {councilMembers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          لم يتم اعتماد أي أعضاء بعد
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats for formation */}
          {councilMembers.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card className="border-border bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">رئيس المجلس</p>
                  <p className="mt-1 text-sm font-medium">
                    {councilMembers.find((m) => m.assigned_role === "رئيس المجلس")?.applicant_name || "-"}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">نواب الرئيس</p>
                  <p className="mt-1 text-sm font-medium">
                    {councilMembers.filter((m) => m.assigned_role === "نائب رئيس المجلس").length} عضو
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">أعضاء المجلس</p>
                  <p className="mt-1 text-sm font-medium">
                    {councilMembers.filter((m) => m.assigned_role === "عضو مجلس إدارة").length} عضو
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border bg-muted/30">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">إجمالي التشكيلة</p>
                  <p className="mt-1 text-sm font-medium">{councilMembers.length} عضو</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Candidate Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto" dir="rtl">
          {selectedCandidate && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <UserCheck className="h-5 w-5 text-primary" />
                  {selectedCandidate.applicant_name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge className={STATUS_CONFIG[selectedCandidate.status].color}>
                    {selectedCandidate.status}
                  </Badge>
                  {selectedCandidate.evaluation && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium">{selectedCandidate.evaluation.total_score}/35</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">الدولة الشريكة</p>
                      <p className="font-medium">{selectedCandidate.target_country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">بلد الإقامة</p>
                      <p className="font-medium">{selectedCandidate.current_residence_country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">المدينة الأصل</p>
                      <p className="font-medium">{selectedCandidate.origin_city}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">القطاع</p>
                      <p className="font-medium">{selectedCandidate.economic_sector}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">نوع النشاط</p>
                      <p className="font-medium">{selectedCandidate.activity_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">حجم النشاط</p>
                      <p className="font-medium">{selectedCandidate.business_size}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Initiative Description */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">وصف المبادرة</p>
                  <p className="text-sm">{selectedCandidate.initiative_description}</p>
                </div>

                {/* Network */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">شبكة العلاقات</p>
                  <p className="text-sm">{selectedCandidate.partner_country_network}</p>
                </div>

                {/* Professional Record */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">السجل المهني</p>
                  <p className="text-sm">{selectedCandidate.professional_record}</p>
                </div>

                <Separator />

                {/* Files */}
                <div className="flex gap-2">
                  {selectedCandidate.company_profile_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedCandidate.company_profile_url} target="_blank" rel="noreferrer">
                        <FileText className="ml-1.5 h-3.5 w-3.5" />
                        بروفايل الشركة
                      </a>
                    </Button>
                  )}
                  {selectedCandidate.cv_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={selectedCandidate.cv_url} target="_blank" rel="noreferrer">
                        <FileText className="ml-1.5 h-3.5 w-3.5" />
                        السيرة الذاتية
                      </a>
                    </Button>
                  )}
                </div>

                {/* Evaluation Details */}
                {selectedCandidate.evaluation && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-3">تفاصيل التقييم</p>
                      <div className="space-y-2">
                        {EVALUATION_CRITERIA.map((criterion) => (
                          <div key={criterion.key} className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{criterion.label}</span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <Star
                                  key={score}
                                  className={`h-3 w-3 ${
                                    score <= (selectedCandidate.evaluation as any)[criterion.key]
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Action Button */}
                <Button onClick={() => openEvaluation(selectedCandidate)} className="w-full">
                  <Edit className="ml-1.5 h-4 w-4" />
                  تقييم المرشح
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Evaluation Dialog */}
      <Dialog open={evaluationDialogOpen} onOpenChange={setEvaluationDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>تقييم المرشح: {evaluatingCandidate?.applicant_name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {EVALUATION_CRITERIA.map((criterion) => (
              <div key={criterion.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{criterion.label}</Label>
                  <span className="text-sm font-medium text-primary">
                    {(evaluationForm as any)[criterion.key]}/5
                  </span>
                </div>
                <Slider
                  value={[(evaluationForm as any)[criterion.key]]}
                  onValueChange={([value]) =>
                    setEvaluationForm((prev) => ({
                      ...prev,
                      [criterion.key]: value,
                      total_score: calculateTotalScore({ ...prev, [criterion.key]: value }),
                    }))
                  }
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <span className="font-medium">المجموع الكلي</span>
              <span className="text-lg font-bold text-primary">
                {calculateTotalScore(evaluationForm)}/35
              </span>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => saveEvaluation("مرفوض")}>
              <XCircle className="ml-1.5 h-4 w-4" />
              رفض
            </Button>
            <Button variant="outline" onClick={() => saveEvaluation("احتياطية")}>
              <Clock className="ml-1.5 h-4 w-4" />
              احتياطي
            </Button>
            <Button variant="outline" onClick={() => saveEvaluation("مقبول")}>
              <CheckCircle className="ml-1.5 h-4 w-4" />
              قبول
            </Button>
            <Button onClick={() => saveEvaluation("معتمدة ضمن التشكيلة", evaluatingCandidate?.desired_role || "عضو مجلس إدارة")}>
              <Award className="ml-1.5 h-4 w-4" />
              اعتماد ضمن التشكيلة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
