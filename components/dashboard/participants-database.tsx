"use client";

import { useState, useMemo, useCallback } from "react";
import type { Participant, Country, ParticipantType } from "@/lib/types";
import { PARTICIPANT_TYPES } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
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
  Users,
  Search,
  Plus,
  User,
  Building,
  Landmark,
  Network,
  Mail,
  Phone,
  Globe,
  Pencil,
} from "lucide-react";

interface ParticipantsDatabaseProps {
  participants: Participant[];
  countries: Country[];
  canEdit: boolean;
  onAddParticipant: (p: Omit<Participant, "id" | "created_at" | "updated_at">) => void;
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
}

const typeConfig: Record<ParticipantType, { icon: typeof User; color: string }> = {
  "شخصية حقيقية": { icon: User, color: "bg-sky-100 text-sky-800 border-sky-300" },
  "شركة": { icon: Building, color: "bg-amber-100 text-amber-800 border-amber-300" },
  "هيئة": { icon: Landmark, color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  "مجلس": { icon: Network, color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
};

const emptyParticipant = {
  name: "",
  type: "شخصية حقيقية" as ParticipantType,
  email: "",
  phone: "",
  country: "",
  organization: "" as string | null,
  role: "",
  council_ids: [] as string[],
  notes: "",
};

export function ParticipantsDatabase({
  participants,
  countries,
  canEdit,
  onAddParticipant,
  onUpdateParticipant,
}: ParticipantsDatabaseProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [form, setForm] = useState(emptyParticipant);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchSearch =
        !search ||
        p.name.includes(search) ||
        p.email.includes(search) ||
        p.country.includes(search) ||
        (p.organization || "").includes(search) ||
        p.role.includes(search);
      const matchType = typeFilter === "all" || p.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [participants, search, typeFilter]);

  const stats = useMemo(() => {
    const total = participants.length;
    const byType = PARTICIPANT_TYPES.map((t) => ({
      type: t,
      count: participants.filter((p) => p.type === t).length,
    }));
    return { total, byType };
  }, [participants]);

  const openAddDialog = useCallback(() => {
    setEditingParticipant(null);
    setForm(emptyParticipant);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((p: Participant) => {
    setEditingParticipant(p);
    setForm({
      name: p.name,
      type: p.type,
      email: p.email,
      phone: p.phone,
      country: p.country,
      organization: p.organization,
      role: p.role,
      council_ids: p.council_ids,
      notes: p.notes,
    });
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim()) return;
    if (editingParticipant) {
      onUpdateParticipant(editingParticipant.id, {
        ...form,
        organization: form.type === "شخصية حقيقية" ? form.organization : null,
      });
    } else {
      onAddParticipant({
        ...form,
        organization: form.type === "شخصية حقيقية" ? form.organization : null,
      });
    }
    setDialogOpen(false);
  }, [form, editingParticipant, onAddParticipant, onUpdateParticipant]);

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">قاعدة بيانات المشاركين</h2>
            <p className="text-sm text-muted-foreground">
              إدارة بيانات الأشخاص والشركات والهيئات والمجالس المشاركة
            </p>
          </div>
        </div>
        {canEdit && (
          <Button onClick={openAddDialog} className="bg-primary text-primary-foreground">
            <Plus className="ml-1.5 h-4 w-4" />
            إضافة مشارك
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Card className="border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-foreground" />
              <span className="text-[10px] text-muted-foreground">إجمالي المشاركين</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{stats.total}</p>
          </CardContent>
        </Card>
        {stats.byType.map((item) => {
          const cfg = typeConfig[item.type];
          const Icon = cfg.icon;
          return (
            <Card key={item.type} className="border-border">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{item.type}</span>
                </div>
                <p className="mt-1 text-xl font-bold text-foreground">{item.count}</p>
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
            placeholder="بحث بالاسم أو البريد أو الدولة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 text-sm"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="نوع المشارك" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            {PARTICIPANT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Participants Grid */}
      {filtered.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">لا توجد نتائج مطابقة</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => {
            const cfg = typeConfig[p.type];
            const Icon = cfg.icon;
            return (
              <Card key={p.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{p.name}</h3>
                        <Badge variant="outline" className={`mt-0.5 text-[10px] border ${cfg.color}`}>
                          {p.type}
                        </Badge>
                      </div>
                    </div>
                    {canEdit && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => openEditDialog(p)}>
                        <Pencil className="h-3 w-3" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="text-[10px] font-medium text-foreground">{p.role}</span>
                    </div>
                    {p.organization && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building className="h-3 w-3 shrink-0" />
                        <span>{p.organization}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3 shrink-0" />
                      <span>{p.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3 shrink-0" />
                      <span dir="ltr">{p.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span dir="ltr">{p.phone}</span>
                    </div>
                  </div>

                  {p.council_ids.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {p.council_ids.map((cid) => {
                        const c = countries.find((co) => co.id === cid);
                        return (
                          <Badge key={cid} variant="secondary" className="text-[10px]">
                            {c?.country_name_ar || cid}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingParticipant ? "تعديل المشارك" : "إضافة مشارك جديد"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الاسم</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="الاسم الكامل"
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">النوع</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as ParticipantType }))}>
                  <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PARTICIPANT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="text-sm"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الهاتف</Label>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+90 555 123 4567"
                  className="text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الدولة</Label>
                <Input
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  placeholder="الدولة"
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">الدور/المنصب</Label>
                <Input
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="المنصب في المجلس"
                  className="text-sm"
                />
              </div>
            </div>

            {form.type === "شخصية حقيقية" && (
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm">المؤسسة / الشركة</Label>
                <Input
                  value={form.organization || ""}
                  onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                  placeholder="اسم المؤسسة أو الشركة"
                  className="text-sm"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm">المجالس المرتبطة</Label>
              <Select
                value=""
                onValueChange={(v) => {
                  if (!form.council_ids.includes(v)) {
                    setForm((f) => ({ ...f, council_ids: [...f.council_ids, v] }));
                  }
                }}
              >
                <SelectTrigger className="text-sm"><SelectValue placeholder="اختر مجلسا لإضافته" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.country_name_ar}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.council_ids.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {form.council_ids.map((cid) => {
                    const c = countries.find((co) => co.id === cid);
                    return (
                      <Badge key={cid} variant="secondary" className="text-[10px] gap-1">
                        {c?.country_name_ar || cid}
                        <button
                          onClick={() => setForm((f) => ({ ...f, council_ids: f.council_ids.filter((i) => i !== cid) }))}
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
              <Label className="text-sm">ملاحظات</Label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="ملاحظات إضافية..."
                className="text-sm"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={!form.name.trim()} className="bg-primary text-primary-foreground">
              {editingParticipant ? "حفظ التعديلات" : "إضافة المشارك"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
