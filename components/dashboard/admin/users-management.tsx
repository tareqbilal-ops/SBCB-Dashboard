"use client";

import { useState, useMemo, useCallback } from "react";
import {
  SystemUser,
  RoleCode,
  ROLE_CODES,
  ROLE_LABELS,
  Council,
} from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX,
  Edit,
  Shield,
  Users,
  Building,
  Clock,
  Mail,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

// Sample data
const SAMPLE_USERS: SystemUser[] = [
  {
    id: "1",
    uuid: "uuid-1",
    council_id: null,
    name: "أحمد محمد",
    email: "ahmed@sbcb.sy",
    role_code: "super_admin",
    is_active: true,
    last_login_at: "2026-04-10T10:30:00Z",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-04-10T10:30:00Z",
  },
  {
    id: "2",
    uuid: "uuid-2",
    council_id: "c1",
    name: "سارة العلي",
    email: "sara@sbcb.sy",
    role_code: "council_chairman",
    is_active: true,
    last_login_at: "2026-04-09T14:20:00Z",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-04-09T14:20:00Z",
  },
  {
    id: "3",
    uuid: "uuid-3",
    council_id: "c2",
    name: "محمد خالد",
    email: "mohamad@sbcb.sy",
    role_code: "executive_member",
    is_active: true,
    last_login_at: null,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "4",
    uuid: "uuid-4",
    council_id: null,
    name: "ليلى حسن",
    email: "laila@sbcb.sy",
    role_code: "coordination_admin",
    is_active: false,
    last_login_at: "2026-01-20T09:00:00Z",
    created_at: "2026-01-10T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "5",
    uuid: "uuid-5",
    council_id: "c1",
    name: "عمر سعيد",
    email: "omar@sbcb.sy",
    role_code: "media_editor",
    is_active: true,
    last_login_at: "2026-04-11T08:00:00Z",
    created_at: "2026-02-20T00:00:00Z",
    updated_at: "2026-04-11T08:00:00Z",
  },
];

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
    summary: null,
    sectors: ["investment", "services", "tourism"],
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-03-15T00:00:00Z",
  },
];

interface UsersManagementProps {
  initialUsers?: SystemUser[];
  councils?: Council[];
}

export function UsersManagement({
  initialUsers = SAMPLE_USERS,
  councils = SAMPLE_COUNCILS,
}: UsersManagementProps) {
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleCode | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role_code: "viewer" as RoleCode,
    council_id: "" as string,
    is_active: true,
  });

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role_code === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.is_active).length,
      admins: users.filter((u) =>
        ["super_admin", "coordination_admin"].includes(u.role_code)
      ).length,
      recentLogin: users.filter((u) => {
        if (!u.last_login_at) return false;
        const loginDate = new Date(u.last_login_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return loginDate >= weekAgo;
      }).length,
    };
  }, [users]);

  const openAddDialog = useCallback(() => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      role_code: "viewer",
      council_id: "",
      is_active: true,
    });
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((user: SystemUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role_code: user.role_code,
      council_id: user.council_id || "",
      is_active: user.is_active,
    });
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim() || !form.email.trim()) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: form.name,
                email: form.email,
                role_code: form.role_code,
                council_id: form.council_id || null,
                is_active: form.is_active,
                updated_at: new Date().toISOString(),
              }
            : u
        )
      );
    } else {
      const newUser: SystemUser = {
        id: `u-${Date.now()}`,
        uuid: `uuid-${Date.now()}`,
        name: form.name,
        email: form.email,
        role_code: form.role_code,
        council_id: form.council_id || null,
        is_active: form.is_active,
        last_login_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setDialogOpen(false);
  }, [form, editingUser]);

  const toggleUserStatus = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_active: !u.is_active, updated_at: new Date().toISOString() }
          : u
      )
    );
  }, []);

  const getCouncilName = useCallback(
    (councilId: string | null) => {
      if (!councilId) return "—";
      const council = councils.find((c) => c.id === councilId);
      return council?.name_ar || "—";
    },
    [councils]
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
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
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">إجمالي المستخدمين</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-xs text-muted-foreground">مستخدم نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">مدير / مشرف</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.recentLogin}</p>
                <p className="text-xs text-muted-foreground">دخول هذا الأسبوع</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">إدارة المستخدمين والصلاحيات</CardTitle>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="ml-1.5 h-4 w-4" />
              إضافة مستخدم
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو البريد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(v) => setRoleFilter(v as RoleCode | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="الدور" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                {ROLE_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {ROLE_LABELS[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as "all" | "active" | "inactive")}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">الدور</TableHead>
                  <TableHead className="text-right hidden md:table-cell">المجلس</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">آخر دخول</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-center w-[60px]">إجراء</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ["super_admin", "coordination_admin"].includes(user.role_code)
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {ROLE_LABELS[user.role_code]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-foreground">
                          {getCouncilName(user.council_id)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(user.last_login_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_active ? "default" : "outline"}
                          className={`text-[10px] ${
                            user.is_active
                              ? "bg-green-500/10 text-green-700 border-green-200"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.is_active ? "نشط" : "غير نشط"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(user)}>
                              <Edit className="ml-2 h-4 w-4" />
                              تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                              {user.is_active ? (
                                <>
                                  <UserX className="ml-2 h-4 w-4" />
                                  تعطيل
                                </>
                              ) : (
                                <>
                                  <UserCheck className="ml-2 h-4 w-4" />
                                  تفعيل
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            عرض {filteredUsers.length} من {users.length} مستخدم
          </p>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "تعديل مستخدم" : "إضافة مستخدم جديد"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Label>الاسم الكامل *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="أدخل الاسم الكامل"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>البريد الإلكتروني *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@sbcb.sy"
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>الدور</Label>
              <Select
                value={form.role_code}
                onValueChange={(v) => setForm((f) => ({ ...f, role_code: v as RoleCode }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {ROLE_LABELS[code]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>المجلس (اختياري)</Label>
              <Select
                value={form.council_id}
                onValueChange={(v) => setForm((f) => ({ ...f, council_id: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر مجلس..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون مجلس</SelectItem>
                  {councils.map((council) => (
                    <SelectItem key={council.id} value={council.id}>
                      {council.name_ar}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <Label className="cursor-pointer">حساب نشط</Label>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, is_active: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim()}>
              {editingUser ? "حفظ التغييرات" : "إضافة المستخدم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
