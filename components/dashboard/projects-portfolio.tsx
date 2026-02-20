"use client";

import { useState, useMemo, useCallback } from "react";
import type { Project, Country, ProjectType, ProjectStatus, ProjectPriority, CouncilType } from "@/lib/types";
import { PROJECT_TYPES, PROJECT_STATUSES, PROJECT_PRIORITIES, COUNCIL_TYPES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Briefcase,
  Search,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  BookOpen,
  DollarSign,
  Calendar,
  Pencil,
} from "lucide-react";

interface ProjectsPortfolioProps {
  projects: Project[];
  countries: Country[];
  canEdit: boolean;
  onAddProject: (project: Omit<Project, "id" | "created_at" | "updated_at">) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

const statusConfig: Record<ProjectStatus, { color: string; icon: typeof Clock }> = {
  "مقترح": { color: "bg-sky-100 text-sky-800 border-sky-300", icon: Briefcase },
  "قيد التنفيذ": { color: "bg-amber-100 text-amber-800 border-amber-300", icon: Clock },
  "مكتمل": { color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: CheckCircle2 },
  "معلّق": { color: "bg-orange-100 text-orange-800 border-orange-300", icon: AlertTriangle },
  "ملغى": { color: "bg-red-100 text-red-800 border-red-300", icon: AlertTriangle },
};

const priorityConfig: Record<ProjectPriority, string> = {
  "عاجل": "bg-red-100 text-red-800 border-red-300",
  "مرتفع": "bg-orange-100 text-orange-800 border-orange-300",
  "متوسط": "bg-sky-100 text-sky-800 border-sky-300",
  "منخفض": "bg-gray-100 text-gray-700 border-gray-300",
};

const emptyProject = {
  name: "",
  type: "تجاري" as ProjectType,
  status: "مقترح" as ProjectStatus,
  priority: "متوسط" as ProjectPriority,
  description: "",
  council_type: "ثنائي" as CouncilType | null,
  country_ids: [] as string[],
  sector: "",
  budget: null as number | null,
  start_date: "",
  end_date: "",
  owner: "",
  participants: [] as string[],
};

export function ProjectsPortfolio({
  projects,
  countries,
  canEdit,
  onAddProject,
  onUpdateProject,
}: ProjectsPortfolioProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = !search || p.name.includes(search) || p.description.includes(search) || (p.sector || "").includes(search);
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [projects, search, typeFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const commercial = projects.filter((p) => p.type === "تجاري").length;
    const research = projects.filter((p) => p.type === "بحثي").length;
    const active = projects.filter((p) => p.status === "قيد التنفيذ").length;
    const completed = projects.filter((p) => p.status === "مكتمل").length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    return { total, commercial, research, active, completed, totalBudget };
  }, [projects]);

  const openAddDialog = useCallback(() => {
    setEditingProject(null);
    setForm(emptyProject);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((project: Project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      type: project.type,
      status: project.status,
      priority: project.priority,
      description: project.description,
      council_type: project.council_type,
      country_ids: project.country_ids,
      sector: project.sector || "",
      budget: project.budget,
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      owner: project.owner,
      participants: project.participants,
    });
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) return;
    if (editingProject) {
      onUpdateProject(editingProject.id, {
        ...form,
        sector: form.type === "بحثي" ? form.sector || null : null,
        council_type: form.type === "تجاري" ? form.council_type : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
    } else {
      onAddProject({
        ...form,
        sector: form.type === "بحثي" ? form.sector || null : null,
        council_type: form.type === "تجاري" ? form.council_type : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });
    }
    setDialogOpen(false);
  }, [form, editingProject, onAddProject, onUpdateProject]);

  const getCountryNames = useCallback(
    (ids: string[]) => {
      return ids
        .map((id) => countries.find((c) => c.id === id)?.country_name_ar || "")
        .filter(Boolean)
        .join("، ");
    },
    [countries]
  );

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">محفظة المشاريع</h2>
            <p className="text-sm text-muted-foreground">
              إدارة المشاريع التجارية والبحثية لمجالس الأعمال
            </p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
            <Plus className="ml-1.5 h-4 w-4" />
            إضافة مشروع
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {[
          { label: "إجمالي المشاريع", value: stats.total, icon: Briefcase, color: "text-foreground" },
          { label: "مشاريع تجارية", value: stats.commercial, icon: Building2, color: "text-amber-700" },
          { label: "مشاريع بحثية", value: stats.research, icon: BookOpen, color: "text-sky-700" },
          { label: "قيد التنفيذ", value: stats.active, icon: Clock, color: "text-amber-700" },
          { label: "مكتملة", value: stats.completed, icon: CheckCircle2, color: "text-emerald-700" },
          { label: "الميزانية الكلية", value: `$${(stats.totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, color: "text-foreground" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                </div>
                <p className={`mt-1 text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث في المشاريع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="نوع المشروع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {PROJECT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {PROJECT_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card className="border-border">
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Briefcase className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm">لا توجد مشاريع مطابقة</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((project) => {
            const statusCfg = statusConfig[project.status];
            return (
              <Card key={project.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                        <Badge variant="outline" className={`text-[10px] border ${project.type === "تجاري" ? "bg-amber-50 text-amber-800 border-amber-300" : "bg-sky-50 text-sky-800 border-sky-300"}`}>
                          {project.type === "تجاري" ? <Building2 className="ml-1 h-3 w-3" /> : <BookOpen className="ml-1 h-3 w-3" />}
                          {project.type}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] border ${statusCfg.color}`}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] border ${priorityConfig[project.priority]}`}>
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {project.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {project.type === "تجاري" && project.council_type && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            مجلس {project.council_type}
                          </span>
                        )}
                        {project.type === "بحثي" && project.sector && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {project.sector}
                          </span>
                        )}
                        {project.country_ids.length > 0 && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {getCountryNames(project.country_ids)}
                          </span>
                        )}
                        {project.budget && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${project.budget.toLocaleString()}
                          </span>
                        )}
                        {project.start_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {project.start_date}
                            {project.end_date && ` - ${project.end_date}`}
                          </span>
                        )}
                      </div>
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">تعديل المشروع</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">اسم المشروع</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="اسم المشروع"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as ProjectType }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الأولوية</Label>
                <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as ProjectPriority }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الحالة</Label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProjectStatus }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.type === "تجاري" ? (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm">نوع المجلس</Label>
                  <Select value={form.council_type || ""} onValueChange={(v) => setForm((f) => ({ ...f, council_type: v as CouncilType }))}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="اختر نوع المجلس" /></SelectTrigger>
                    <SelectContent>
                      {COUNCIL_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-sm">القطاع</Label>
                  <Input
                    value={form.sector || ""}
                    onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                    placeholder="القطاع البحثي"
                    className="text-sm"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">الدول المرتبطة</Label>
              <Select
                value=""
                onValueChange={(v) => {
                  if (!form.country_ids.includes(v)) {
                    setForm((f) => ({ ...f, country_ids: [...f.country_ids, v] }));
                  }
                }}
              >
                <SelectTrigger className="text-sm"><SelectValue placeholder="اختر دولة لإضافتها" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.country_name_ar}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.country_ids.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {form.country_ids.map((cid) => {
                    const c = countries.find((co) => co.id === cid);
                    return (
                      <Badge key={cid} variant="secondary" className="text-[10px] gap-1">
                        {c?.country_name_ar || cid}
                        <button
                          onClick={() => setForm((f) => ({ ...f, country_ids: f.country_ids.filter((i) => i !== cid) }))}
                          className="mr-0.5 text-muted-foreground hover:text-foreground"
                        >
                          x
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">الوصف</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="وصف تفصيلي للمشروع"
                className="text-sm"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الميزانية (USD)</Label>
                <Input
                  type="number"
                  value={form.budget || ""}
                  onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value ? Number(e.target.value) : null }))}
                  placeholder="0"
                  className="text-sm"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">المسؤول</Label>
                <Input
                  value={form.owner}
                  onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                  placeholder="الجهة المسؤولة"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">تاريخ البدء</Label>
                <Input
                  type="date"
                  value={form.start_date || ""}
                  onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                  className="text-sm"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">تاريخ الانتهاء</Label>
                <Input
                  type="date"
                  value={form.end_date || ""}
                  onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                  className="text-sm"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} className="bg-primary text-primary-foreground">
              {editingProject ? "حفظ التعديلات" : "إضافة المشروع"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
