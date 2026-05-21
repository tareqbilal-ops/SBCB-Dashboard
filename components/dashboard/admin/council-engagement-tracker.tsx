"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Calendar,
  Bell,
  TrendingUp,
  AlertTriangle,
  ChevronLeft,
  Plus,
  Eye,
  Send,
  Upload,
  Loader2,
} from "lucide-react";

// Engagement checklist items
const ENGAGEMENT_ITEMS = [
  {
    id: "quarterly_report",
    label: "رفع التقرير الربع سنوي",
    description: "تقديم تقرير ربع سنوي عن أنشطة المجلس",
    frequency: "ربع سنوي",
    required: true,
    icon: FileText,
  },
  {
    id: "official_response",
    label: "إجابة كتاب رسمي",
    description: "الرد على المراسلات الرسمية من المجلس التنسيقي",
    frequency: "حسب الطلب",
    required: true,
    icon: Send,
  },
  {
    id: "book_comm_window",
    label: "حجز نافذة تواصل زمنية",
    description: "حجز موعد للتواصل مع المجلس التنسيقي",
    frequency: "شهري",
    required: false,
    icon: Calendar,
  },
  {
    id: "offer_comm_window",
    label: "طرح نافذة تواصل زمنية",
    description: "إتاحة نوافذ زمنية للتواصل مع الأعضاء والجهات المهتمة",
    frequency: "شهري",
    required: false,
    icon: Clock,
  },
  {
    id: "propose_event",
    label: "اقتراح فعالية",
    description: "اقتراح فعالية أو نشاط للتنفيذ",
    frequency: "ربع سنوي",
    required: false,
    icon: Bell,
  },
] as const;

// Quarter options
const QUARTERS = [
  { value: "2026-Q1", label: "الربع الأول 2026" },
  { value: "2026-Q2", label: "الربع الثاني 2026" },
  { value: "2026-Q3", label: "الربع الثالث 2026" },
  { value: "2026-Q4", label: "الربع الرابع 2026" },
] as const;

// Sample council engagement data
interface EngagementRecord {
  id: string;
  item_id: string;
  period: string;
  completed_at: string | null;
  notes: string;
  file_url: string | null;
  status: "pending" | "completed" | "overdue";
}

interface CouncilEngagement {
  council_id: string;
  council_name: string;
  records: EngagementRecord[];
}

// Sample approved councils
const SAMPLE_COUNCILS = [
  { id: "c-001", name: "مجلس الأعمال السوري التركي" },
  { id: "c-002", name: "مجلس الأعمال السوري الأمريكي" },
  { id: "c-003", name: "مجلس الأعمال السوري الكندي" },
  { id: "c-004", name: "مجلس الأعمال السوري البريطاني" },
  { id: "c-005", name: "مجلس الأعمال السوري الفرنسي" },
  { id: "c-006", name: "مجلس الأعمال السوري السعودي" },
  { id: "c-007", name: "مجلس الأعمال السوري الصيني" },
  { id: "c-008", name: "مجلس الأعمال السوري الألماني" },
  { id: "c-009", name: "مجلس الأعمال السوري الهولندي" },
  { id: "c-010", name: "مجلس الأعمال السوري الإيطالي" },
  { id: "c-011", name: "مجلس الأعمال السوري الإسباني" },
  { id: "c-012", name: "مجلس الأعمال السوري اللبناني" },
  { id: "c-013", name: "مجلس الأعمال السوري الكويتي" },
  { id: "c-014", name: "مجلس الأعمال السوري الروماني" },
  { id: "c-015", name: "مجلس الأعمال السوري المجري" },
  { id: "c-016", name: "مجلس الأعمال السوري الأردني" },
  { id: "c-017", name: "مجلس الأعمال السوري المصري" },
  { id: "c-018", name: "مجلس الأعمال السوري الأسترالي" },
  { id: "c-019", name: "مجلس الأعمال السوري الأذربيجاني" },
  { id: "c-020", name: "مجلس الأعمال السوري القطري" },
];

// Generate sample engagement data
function generateSampleEngagement(): Map<string, CouncilEngagement> {
  const engagements = new Map<string, CouncilEngagement>();
  
  SAMPLE_COUNCILS.forEach((council) => {
    const records: EngagementRecord[] = [];
    
    // Generate random completion status for each item in current quarter
    ENGAGEMENT_ITEMS.forEach((item) => {
      const isCompleted = Math.random() > 0.4;
      const isOverdue = !isCompleted && Math.random() > 0.6;
      
      records.push({
        id: `${council.id}-${item.id}-2026-Q2`,
        item_id: item.id,
        period: "2026-Q2",
        completed_at: isCompleted ? "2026-05-15" : null,
        notes: isCompleted ? "تم الإنجاز بنجاح" : "",
        file_url: isCompleted && item.id === "quarterly_report" ? "/uploads/report.pdf" : null,
        status: isCompleted ? "completed" : isOverdue ? "overdue" : "pending",
      });
    });
    
    engagements.set(council.id, {
      council_id: council.id,
      council_name: council.name,
      records,
    });
  });
  
  return engagements;
}

interface CouncilEngagementTrackerProps {
  onBack?: () => void;
}

export function CouncilEngagementTracker({ onBack }: CouncilEngagementTrackerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2026-Q2");
  const [selectedCouncil, setSelectedCouncil] = useState<string | null>(null);
  const [engagementData, setEngagementData] = useState(() => generateSampleEngagement());
  const [activeTab, setActiveTab] = useState<"overview" | "details">("overview");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof ENGAGEMENT_ITEMS[number] | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const stats = {
      totalCouncils: SAMPLE_COUNCILS.length,
      totalItems: ENGAGEMENT_ITEMS.length,
      completedByItem: new Map<string, number>(),
      overdueByItem: new Map<string, number>(),
      councilScores: new Map<string, { completed: number; total: number; percentage: number }>(),
    };

    ENGAGEMENT_ITEMS.forEach((item) => {
      stats.completedByItem.set(item.id, 0);
      stats.overdueByItem.set(item.id, 0);
    });

    engagementData.forEach((council) => {
      let completed = 0;
      const periodRecords = council.records.filter((r) => r.period === selectedPeriod);
      
      periodRecords.forEach((record) => {
        if (record.status === "completed") {
          completed++;
          stats.completedByItem.set(
            record.item_id,
            (stats.completedByItem.get(record.item_id) || 0) + 1
          );
        } else if (record.status === "overdue") {
          stats.overdueByItem.set(
            record.item_id,
            (stats.overdueByItem.get(record.item_id) || 0) + 1
          );
        }
      });

      stats.councilScores.set(council.council_id, {
        completed,
        total: ENGAGEMENT_ITEMS.length,
        percentage: Math.round((completed / ENGAGEMENT_ITEMS.length) * 100),
      });
    });

    return stats;
  }, [engagementData, selectedPeriod]);

  // Get council engagement details
  const getCouncilEngagement = useCallback(
    (councilId: string) => {
      return engagementData.get(councilId);
    },
    [engagementData]
  );

  // Toggle item completion
  const toggleItemCompletion = useCallback(
    (councilId: string, itemId: string) => {
      setEngagementData((prev) => {
        const newData = new Map(prev);
        const council = newData.get(councilId);
        if (!council) return prev;

        const updatedRecords = council.records.map((record) => {
          if (record.item_id === itemId && record.period === selectedPeriod) {
            const isNowCompleted = record.status !== "completed";
            return {
              ...record,
              status: isNowCompleted ? "completed" : "pending",
              completed_at: isNowCompleted ? new Date().toISOString().split("T")[0] : null,
            } as EngagementRecord;
          }
          return record;
        });

        newData.set(councilId, { ...council, records: updatedRecords });
        return newData;
      });
    },
    [selectedPeriod]
  );

  // Get status badge color
  const getStatusColor = (status: EngagementRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getStatusLabel = (status: EngagementRecord["status"]) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "overdue":
        return "متأخر";
      default:
        return "قيد الانتظار";
    }
  };

  // Open action dialog
  const openActionDialog = useCallback((item: typeof ENGAGEMENT_ITEMS[number]) => {
    setSelectedItem(item);
    setActionNotes("");
    setActionDialogOpen(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="ml-1 h-4 w-4" />
              العودة
            </Button>
          )}
          <div>
            <h1 className="text-lg font-bold text-foreground">متابعة تفاعل المجالس المعتمدة</h1>
            <p className="text-sm text-muted-foreground">
              قياس مدى التزام المجالس بمتطلبات التفاعل والتواصل
            </p>
          </div>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QUARTERS.map((q) => (
              <SelectItem key={q.value} value={q.value}>
                {q.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ENGAGEMENT_ITEMS.map((item) => {
          const completed = overallStats.completedByItem.get(item.id) || 0;
          const overdue = overallStats.overdueByItem.get(item.id) || 0;
          const percentage = Math.round((completed / overallStats.totalCouncils) * 100);
          const Icon = item.icon;

          return (
            <Card key={item.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    percentage >= 80 ? "bg-emerald-100" : percentage >= 50 ? "bg-amber-100" : "bg-red-100"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      percentage >= 80 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"
                    }`} />
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {item.frequency}
                  </Badge>
                </div>
                <h3 className="mt-3 text-sm font-medium text-foreground line-clamp-1">
                  {item.label}
                </h3>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {completed}/{overallStats.totalCouncils} مجلس
                  </span>
                  <span className={`font-semibold ${
                    percentage >= 80 ? "text-emerald-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className="mt-2 h-1.5" />
                {overdue > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>{overdue} متأخر</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة على المجالس</TabsTrigger>
          <TabsTrigger value="details">تفاصيل التفاعل</TabsTrigger>
        </TabsList>

        {/* Overview Tab - All Councils */}
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">حالة التفاعل للمجالس المعتمدة</CardTitle>
              <CardDescription>
                عرض موجز لحالة التزام كل مجلس بمتطلبات التفاعل للفترة {QUARTERS.find(q => q.value === selectedPeriod)?.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المجلس</TableHead>
                      {ENGAGEMENT_ITEMS.map((item) => (
                        <TableHead key={item.id} className="text-center w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-[10px] line-clamp-1">{item.label.split(" ").slice(0, 2).join(" ")}</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">النسبة</TableHead>
                      <TableHead className="text-center w-[80px]">إجراء</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_COUNCILS.map((council) => {
                      const engagement = getCouncilEngagement(council.id);
                      const score = overallStats.councilScores.get(council.id);

                      return (
                        <TableRow key={council.id}>
                          <TableCell className="font-medium text-sm">
                            {council.name}
                          </TableCell>
                          {ENGAGEMENT_ITEMS.map((item) => {
                            const record = engagement?.records.find(
                              (r) => r.item_id === item.id && r.period === selectedPeriod
                            );
                            return (
                              <TableCell key={item.id} className="text-center">
                                <button
                                  onClick={() => toggleItemCompletion(council.id, item.id)}
                                  className="inline-flex items-center justify-center"
                                >
                                  {record?.status === "completed" ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                  ) : record?.status === "overdue" ? (
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground/40" />
                                  )}
                                </button>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                (score?.percentage || 0) >= 80
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : (score?.percentage || 0) >= 50
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {score?.percentage || 0}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCouncil(council.id);
                                setActiveTab("details");
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab - Single Council */}
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">تفاصيل التفاعل</CardTitle>
                  <CardDescription>
                    عرض تفصيلي لحالة كل بند من بنود التفاعل
                  </CardDescription>
                </div>
                <Select
                  value={selectedCouncil || ""}
                  onValueChange={setSelectedCouncil}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="اختر مجلساً..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_COUNCILS.map((council) => (
                      <SelectItem key={council.id} value={council.id}>
                        {council.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedCouncil ? (
                <div className="space-y-4">
                  {/* Council Score */}
                  {(() => {
                    const score = overallStats.councilScores.get(selectedCouncil);
                    return (
                      <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <div className="relative">
                          <svg className="h-20 w-20 -rotate-90 transform">
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              className="text-muted/30"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="35"
                              stroke="currentColor"
                              strokeWidth="6"
                              fill="none"
                              strokeDasharray={`${(score?.percentage || 0) * 2.2} 220`}
                              strokeLinecap="round"
                              className="text-primary transition-all duration-500"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-foreground">
                              {score?.percentage || 0}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {SAMPLE_COUNCILS.find((c) => c.id === selectedCouncil)?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {score?.completed || 0} من {score?.total || 0} بند مكتمل
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Items List */}
                  <div className="space-y-3">
                    {ENGAGEMENT_ITEMS.map((item) => {
                      const engagement = getCouncilEngagement(selectedCouncil);
                      const record = engagement?.records.find(
                        (r) => r.item_id === item.id && r.period === selectedPeriod
                      );
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                            record?.status === "completed"
                              ? "border-emerald-200 bg-emerald-50/50"
                              : record?.status === "overdue"
                              ? "border-red-200 bg-red-50/50"
                              : "border-border"
                          }`}
                        >
                          <Checkbox
                            checked={record?.status === "completed"}
                            onCheckedChange={() =>
                              toggleItemCompletion(selectedCouncil, item.id)
                            }
                          />
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            record?.status === "completed"
                              ? "bg-emerald-100"
                              : record?.status === "overdue"
                              ? "bg-red-100"
                              : "bg-muted"
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              record?.status === "completed"
                                ? "text-emerald-600"
                                : record?.status === "overdue"
                                ? "text-red-600"
                                : "text-muted-foreground"
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{item.label}</h4>
                              {item.required && (
                                <Badge variant="outline" className="text-[9px]">
                                  إلزامي
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {item.frequency}
                            </Badge>
                            <Badge className={getStatusColor(record?.status || "pending")}>
                              {getStatusLabel(record?.status || "pending")}
                            </Badge>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openActionDialog(item)}
                          >
                            <Plus className="ml-1 h-3.5 w-3.5" />
                            إضافة
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/40" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    اختر مجلساً لعرض تفاصيل التفاعل
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.label}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="أضف ملاحظات حول هذا البند..."
                rows={3}
              />
            </div>
            {selectedItem?.id === "quarterly_report" && (
              <div className="space-y-2">
                <Label>رفع التقرير</Label>
                <div className="flex gap-2">
                  <Input type="file" accept=".pdf,.doc,.docx" className="flex-1" />
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>
            )}
            {selectedItem?.id === "propose_event" && (
              <div className="space-y-2">
                <Label>اسم الفعالية المقترحة</Label>
                <Input placeholder="مثال: مؤتمر الاستثمار السوري" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={() => {
              if (selectedCouncil && selectedItem) {
                toggleItemCompletion(selectedCouncil, selectedItem.id);
              }
              setActionDialogOpen(false);
            }}>
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
