"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Council,
  CouncilStatus,
  EstablishmentStage,
  COUNCIL_STATUS_LABELS,
  ESTABLISHMENT_STAGE_LABELS,
  SECTOR_CODES,
  SECTOR_LABELS,
  SectorCode,
  SystemUser,
  Membership,
  MEMBER_TYPE_LABELS,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Plus,
  Building2,
  Globe,
  Users,
  ChevronLeft,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  FileText,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
    summary: "مجلس أعمال ثنائي يهدف لتعزيز التعاون الاقتصادي بين سوريا وتركيا",
    sectors: ["trade", "industry", "construction"],
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "c2",
    uuid: "council-uuid-2",
    name_ar: "مجلس الأعمال السوري الإماراتي",
    name_en: "Syrian-UAE Business Council",
    partner_country_code: "AE",
    partner_country_name: "الإمارات",
    status: "active",
    establishment_stage: "approved",
    chairman_user_id: null,
    summary: "يعمل على جذب الاستثمارات الإماراتية وتنمية العلاقات التجارية",
    sectors: ["investment", "services", "tourism"],
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "c3",
    uuid: "council-uuid-3",
    name_ar: "مجلس الأعمال السوري الأردني",
    name_en: "Syrian-Jordanian Business Council",
    partner_country_code: "JO",
    partner_country_name: "الأردن",
    status: "draft",
    establishment_stage: "under_establishment",
    chairman_user_id: null,
    summary: null,
    sectors: ["trade", "transport"],
    created_at: "2026-03-15T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "c4",
    uuid: "council-uuid-4",
    name_ar: "مجلس الأعمال السوري العراقي",
    name_en: "Syrian-Iraqi Business Council",
    partner_country_code: "IQ",
    partner_country_name: "العراق",
    status: "frozen",
    establishment_stage: "reorganized",
    chairman_user_id: null,
    summary: "مجلس معاد هيكلته بعد فترة توقف",
    sectors: ["energy", "trade"],
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
];

const SAMPLE_MEMBERSHIPS: Membership[] = [
  {
    id: "m1",
    uuid: "member-uuid-1",
    council_id: "c1",
    member_type: "company",
    name: "شركة النور للتجارة",
    representative_name: "أحمد السيد",
    sector_code: "trade",
    status: "active",
    email: "info@alnour.sy",
    phone: "+963 11 123 4567",
    country_relation: "تركيا",
    joined_at: "2026-01-15",
    deactivation_reason: null,
    created_at: "2026-01-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
  {
    id: "m2",
    uuid: "member-uuid-2",
    council_id: "c1",
    member_type: "individual",
    name: "محمد العلي",
    representative_name: null,
    sector_code: "construction",
    status: "active",
    email: "mohamad@email.com",
    phone: "+963 944 123 456",
    country_relation: "تركيا - إسطنبول",
    joined_at: "2026-02-01",
    deactivation_reason: null,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "m3",
    uuid: "member-uuid-3",
    council_id: "c2",
    member_type: "institution",
    name: "غرفة تجارة دمشق",
    representative_name: "سمير حداد",
    sector_code: "services",
    status: "active",
    email: "info@dcc.sy",
    phone: "+963 11 222 3333",
    country_relation: null,
    joined_at: "2026-02-10",
    deactivation_reason: null,
    created_at: "2026-02-10T00:00:00Z",
    updated_at: "2026-02-10T00:00:00Z",
  },
];

interface CouncilsManagementProps {
  initialCouncils?: Council[];
  memberships?: Membership[];
  users?: SystemUser[];
}

export function CouncilsManagement({
  initialCouncils = SAMPLE_COUNCILS,
  memberships = SAMPLE_MEMBERSHIPS,
  users = [],
}: CouncilsManagementProps) {
  const [councils, setCouncils] = useState<Council[]>(initialCouncils);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouncilStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [detailCouncil, setDetailCouncil] = useState<Council | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    partner_country_name: "",
    partner_country_code: "",
    status: "draft" as CouncilStatus,
    establishment_stage: "under_establishment" as EstablishmentStage,
    summary: "",
    sectors: [] as SectorCode[],
  });

  // Filter councils
  const filteredCouncils = useMemo(() => {
    return councils.filter((council) => {
      const matchesSearch =
        council.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
        council.partner_country_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || council.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [councils, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: councils.length,
      active: councils.filter((c) => c.status === "active").length,
      draft: councils.filter((c) => c.status === "draft").length,
      frozen: councils.filter((c) => c.status === "frozen").length,
    };
  }, [councils]);

  // Council memberships
  const getCouncilMemberships = useCallback(
    (councilId: string) => memberships.filter((m) => m.council_id === councilId),
    [memberships]
  );

  const openAddDialog = useCallback(() => {
    setEditingCouncil(null);
    setForm({
      name_ar: "",
      name_en: "",
      partner_country_name: "",
      partner_country_code: "",
      status: "draft",
      establishment_stage: "under_establishment",
      summary: "",
      sectors: [],
    });
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((council: Council) => {
    setEditingCouncil(council);
    setForm({
      name_ar: council.name_ar,
      name_en: council.name_en || "",
      partner_country_name: council.partner_country_name,
      partner_country_code: council.partner_country_code,
      status: council.status,
      establishment_stage: council.establishment_stage,
      summary: council.summary || "",
      sectors: council.sectors,
    });
    setDialogOpen(true);
  }, []);

  const openDetail = useCallback((council: Council) => {
    setDetailCouncil(council);
    setDetailOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name_ar.trim() || !form.partner_country_name.trim()) return;

    if (editingCouncil) {
      setCouncils((prev) =>
        prev.map((c) =>
          c.id === editingCouncil.id
            ? {
                ...c,
                name_ar: form.name_ar,
                name_en: form.name_en || null,
                partner_country_name: form.partner_country_name,
                partner_country_code: form.partner_country_code,
                status: form.status,
                establishment_stage: form.establishment_stage,
                summary: form.summary || null,
                sectors: form.sectors,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
    } else {
      const newCouncil: Council = {
        id: `c-${Date.now()}`,
        uuid: `uuid-${Date.now()}`,
        name_ar: form.name_ar,
        name_en: form.name_en || null,
        partner_country_name: form.partner_country_name,
        partner_country_code: form.partner_country_code.toUpperCase(),
        status: form.status,
        establishment_stage: form.establishment_stage,
        chairman_user_id: null,
        summary: form.summary || null,
        sectors: form.sectors,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCouncils((prev) => [...prev, newCouncil]);
    }
    setDialogOpen(false);
  }, [form, editingCouncil]);

  const getStatusColor = (status: CouncilStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "draft":
        return "bg-amber-500/10 text-amber-700 border-amber-200";
      case "frozen":
        return "bg-blue-500/10 text-blue-700 border-blue-200";
      case "closed":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي المجالس</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-xs text-muted-foreground">مجلس نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">قيد التأسيس</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <XCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.frozen}</p>
                <p className="text-xs text-muted-foreground">مجمد</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">إدارة المجالس</CardTitle>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="ml-1.5 h-4 w-4" />
              إضافة مجلس
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الدولة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as CouncilStatus | "all")}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {(Object.keys(COUNCIL_STATUS_LABELS) as CouncilStatus[]).map((status) => (
                  <SelectItem key={status} value={status}>
                    {COUNCIL_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Councils Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCouncils.map((council) => {
              const councilMembers = getCouncilMemberships(council.id);
              return (
                <Card
                  key={council.id}
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => openDetail(council)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground truncate">
                            {council.partner_country_name}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            {council.name_ar}
                          </p>
                        </div>
                      </div>
                      <Badge className={`text-[9px] shrink-0 ${getStatusColor(council.status)}`}>
                        {COUNCIL_STATUS_LABELS[council.status]}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      {council.sectors.slice(0, 3).map((sector) => (
                        <Badge key={sector} variant="outline" className="text-[9px]">
                          {SECTOR_LABELS[sector]}
                        </Badge>
                      ))}
                      {council.sectors.length > 3 && (
                        <Badge variant="outline" className="text-[9px]">
                          +{council.sectors.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{councilMembers.length} عضو</span>
                      </div>
                      <span>{formatDate(council.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCouncils.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              لا توجد مجالس مطابقة للبحث
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCouncil ? "تعديل مجلس" : "إضافة مجلس جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>اسم المجلس (عربي) *</Label>
                <Input
                  value={form.name_ar}
                  onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))}
                  placeholder="مجلس الأعمال السوري..."
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label>اسم المجلس (إنجليزي)</Label>
                <Input
                  value={form.name_en}
                  onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                  placeholder="Syrian-... Business Council"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>الدولة الشريكة *</Label>
                <Input
                  value={form.partner_country_name}
                  onChange={(e) => setForm((f) => ({ ...f, partner_country_name: e.target.value }))}
                  placeholder="مثال: تركيا"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>رمز الدولة</Label>
                <Input
                  value={form.partner_country_code}
                  onChange={(e) => setForm((f) => ({ ...f, partner_country_code: e.target.value }))}
                  placeholder="TR"
                  dir="ltr"
                  maxLength={3}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>الحالة</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as CouncilStatus }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(COUNCIL_STATUS_LABELS) as CouncilStatus[]).map((status) => (
                      <SelectItem key={status} value={status}>
                        {COUNCIL_STATUS_LABELS[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>مرحلة التأسيس</Label>
                <Select
                  value={form.establishment_stage}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, establishment_stage: v as EstablishmentStage }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ESTABLISHMENT_STAGE_LABELS) as EstablishmentStage[]).map(
                      (stage) => (
                        <SelectItem key={stage} value={stage}>
                          {ESTABLISHMENT_STAGE_LABELS[stage]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>القطاعات</Label>
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 sm:grid-cols-3">
                {SECTOR_CODES.map((sector) => (
                  <div key={sector} className="flex items-center gap-2">
                    <Checkbox
                      id={`sector-${sector}`}
                      checked={form.sectors.includes(sector)}
                      onCheckedChange={(checked) => {
                        setForm((f) => ({
                          ...f,
                          sectors: checked
                            ? [...f.sectors, sector]
                            : f.sectors.filter((s) => s !== sector),
                        }));
                      }}
                    />
                    <label
                      htmlFor={`sector-${sector}`}
                      className="text-xs text-foreground cursor-pointer"
                    >
                      {SECTOR_LABELS[sector]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>ملخص</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                placeholder="وصف موجز عن المجلس وأهدافه..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name_ar.trim() || !form.partner_country_name.trim()}
            >
              {editingCouncil ? "حفظ التغييرات" : "إضافة المجلس"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Council Detail Sheet */}
      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="left" className="w-full sm:max-w-lg overflow-y-auto">
          {detailCouncil && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setDetailOpen(false)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <SheetTitle>{detailCouncil.name_ar}</SheetTitle>
                </div>
              </SheetHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">معلومات</TabsTrigger>
                  <TabsTrigger value="members">الأعضاء</TabsTrigger>
                  <TabsTrigger value="activity">النشاط</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(detailCouncil.status)}>
                      {COUNCIL_STATUS_LABELS[detailCouncil.status]}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => {
                      openEditDialog(detailCouncil);
                      setDetailOpen(false);
                    }}>
                      <Edit className="ml-1.5 h-3.5 w-3.5" />
                      تعديل
                    </Button>
                  </div>

                  <div className="rounded-lg border border-border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">الدولة الشريكة</p>
                        <p className="text-sm font-medium">{detailCouncil.partner_country_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">مرحلة التأسيس</p>
                        <p className="text-sm font-medium">
                          {ESTABLISHMENT_STAGE_LABELS[detailCouncil.establishment_stage]}
                        </p>
                      </div>
                    </div>
                    {detailCouncil.name_en && (
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">الاسم الإنجليزي</p>
                          <p className="text-sm font-medium" dir="ltr">{detailCouncil.name_en}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">القطاعات</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {detailCouncil.sectors.map((sector) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {SECTOR_LABELS[sector]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {detailCouncil.summary && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">الملخص</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {detailCouncil.summary}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground pt-4 border-t">
                    <p>تاريخ الإنشاء: {formatDate(detailCouncil.created_at)}</p>
                    <p>آخر تحديث: {formatDate(detailCouncil.updated_at)}</p>
                  </div>
                </TabsContent>

                <TabsContent value="members" className="mt-4">
                  {(() => {
                    const councilMembers = getCouncilMemberships(detailCouncil.id);
                    if (councilMembers.length === 0) {
                      return (
                        <div className="py-8 text-center text-muted-foreground">
                          لا يوجد أعضاء مسجلين
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-3">
                        {councilMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between rounded-lg border border-border p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                {member.member_type === "company" ? (
                                  <Briefcase className="h-4 w-4 text-primary" />
                                ) : member.member_type === "institution" ? (
                                  <Building2 className="h-4 w-4 text-primary" />
                                ) : (
                                  <Users className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {MEMBER_TYPE_LABELS[member.member_type]}
                                  {member.sector_code && ` • ${SECTOR_LABELS[member.sector_code]}`}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={member.status === "active" ? "default" : "outline"}
                              className={`text-[9px] ${
                                member.status === "active"
                                  ? "bg-green-500/10 text-green-700 border-green-200"
                                  : ""
                              }`}
                            >
                              {member.status === "active" ? "نشط" : "غير نشط"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </TabsContent>

                <TabsContent value="activity" className="mt-4">
                  <div className="py-8 text-center text-muted-foreground">
                    سجل النشاط قادم قريباً
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
