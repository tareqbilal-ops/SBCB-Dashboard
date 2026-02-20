"use client";

import { useState } from "react";
import type { Country, Risk, RiskType, RiskLevel, RiskStatus } from "@/lib/types";
import { RISK_TYPES, RISK_LEVELS, RISK_STATUSES } from "@/lib/types";
import { getRiskLevelColor, getRiskStatusColor } from "@/lib/business-logic";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Filter, Shield, AlertTriangle } from "lucide-react";

interface RisksManagementProps {
  risks: Risk[];
  countries: Country[];
  onAddRisk: (risk: Omit<Risk, "id" | "created_at" | "updated_at">) => void;
  onUpdateRisk: (id: string, updates: Partial<Risk>) => void;
}

export function RisksManagement({
  risks,
  countries,
  onAddRisk,
  onUpdateRisk,
}: RisksManagementProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newRisk, setNewRisk] = useState({
    country_id: "",
    risk_type: "" as RiskType | "",
    risk_level: "" as RiskLevel | "",
    mitigation: "",
    status: "مفتوح" as RiskStatus,
  });

  const filteredRisks = risks.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterLevel !== "all" && r.risk_level !== filterLevel) return false;
    return true;
  });

  const getCountryName = (id: string) =>
    countries.find((c) => c.id === id)?.country_name_ar ?? id;

  const handleAdd = () => {
    if (!newRisk.country_id || !newRisk.risk_type || !newRisk.risk_level) return;
    onAddRisk({
      country_id: newRisk.country_id,
      risk_type: newRisk.risk_type as RiskType,
      risk_level: newRisk.risk_level as RiskLevel,
      mitigation: newRisk.mitigation,
      status: newRisk.status,
    });
    setShowAddDialog(false);
    setNewRisk({ country_id: "", risk_type: "", risk_level: "", mitigation: "", status: "مفتوح" });
  };

  // Summary counts
  const openCount = risks.filter((r) => r.status === "مفتوح").length;
  const inProgressCount = risks.filter((r) => r.status === "قيد المعالجة").length;
  const closedCount = risks.filter((r) => r.status === "مغلق").length;
  const highCount = risks.filter((r) => r.risk_level === "مرتفع").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border border-border bg-card">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-muted-foreground">إجمالي المخاطر</span>
            <span className="text-2xl font-bold text-foreground">{risks.length}</span>
          </CardContent>
        </Card>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-red-700">مفتوحة</span>
            <span className="text-2xl font-bold text-red-700">{openCount}</span>
          </CardContent>
        </Card>
        <Card className="border border-amber-200 bg-amber-50">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-amber-700">قيد المعالجة</span>
            <span className="text-2xl font-bold text-amber-700">{inProgressCount}</span>
          </CardContent>
        </Card>
        <Card className="border border-red-300 bg-red-50">
          <CardContent className="flex flex-col gap-1 p-4">
            <span className="text-xs text-red-800">مخاطر مرتفعة</span>
            <span className="text-2xl font-bold text-red-800">{highCount}</span>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Shield className="h-4 w-4" />
              سجل المخاطر
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="bg-primary text-primary-foreground"
            >
              <Plus className="ml-1 h-3.5 w-3.5" />
              إضافة خطر
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 text-sm">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {RISK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-40 text-sm">
                <SelectValue placeholder="مستوى الخطر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المستويات</SelectItem>
                {RISK_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-right text-xs font-semibold">الدولة</TableHead>
                  <TableHead className="text-right text-xs font-semibold">نوع الخطر</TableHead>
                  <TableHead className="text-right text-xs font-semibold">المستوى</TableHead>
                  <TableHead className="text-right text-xs font-semibold">الحالة</TableHead>
                  <TableHead className="text-right text-xs font-semibold">الإجراء التخفيفي</TableHead>
                  <TableHead className="text-center text-xs font-semibold">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRisks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="text-sm font-medium text-foreground">
                      {getCountryName(risk.country_id)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{risk.risk_type}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${getRiskLevelColor(risk.risk_level)}`}>
                        {risk.risk_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${getRiskStatusColor(risk.status)}`}>
                        {risk.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {risk.mitigation}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Select
                        value={risk.status}
                        onValueChange={(v) => onUpdateRisk(risk.id, { status: v as RiskStatus })}
                      >
                        <SelectTrigger className="h-7 w-28 text-[10px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RISK_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRisks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                      لا توجد مخاطر مطابقة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Risk Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-4 w-4" />
              إضافة خطر جديد
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label className="text-xs text-foreground">الدولة</Label>
              <Select value={newRisk.country_id} onValueChange={(v) => setNewRisk((p) => ({ ...p, country_id: v }))}>
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue placeholder="اختر الدولة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.country_name_ar}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-foreground">نوع الخطر</Label>
              <Select value={newRisk.risk_type} onValueChange={(v) => setNewRisk((p) => ({ ...p, risk_type: v as RiskType }))}>
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-foreground">المستوى</Label>
              <Select value={newRisk.risk_level} onValueChange={(v) => setNewRisk((p) => ({ ...p, risk_level: v as RiskLevel }))}>
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-foreground">الإجراء التخفيفي</Label>
              <Textarea
                value={newRisk.mitigation}
                onChange={(e) => setNewRisk((p) => ({ ...p, mitigation: e.target.value }))}
                placeholder="وصف الإجراء التخفيفي..."
                className="mt-1 text-sm"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>إلغاء</Button>
            <Button
              onClick={handleAdd}
              disabled={!newRisk.country_id || !newRisk.risk_type || !newRisk.risk_level}
              className="bg-primary text-primary-foreground"
            >
              إضافة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
