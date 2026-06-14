"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  MapPin,
  Search,
  ListChecks,
  Filter,
  UserCheck,
  Users2,
  ClipboardCheck,
  Phone,
  ListOrdered,
  MessagesSquare,
  ScrollText,
  Rocket,
  Database,
  ChevronLeft,
} from "lucide-react";

// ========== THE 11 APPROVED ESTABLISHMENT STAGES ==========
export const ESTABLISHMENT_STAGES = [
  {
    id: 1,
    short: "تحديد الدولة",
    title: "تحديد الدولة وفتح ملف تأسيس",
    description:
      "يتم اختيار الدولة المستهدفة، وفتح ملف خاص بها داخل النظام، يتضمن سبب الأولوية، الوضع الاقتصادي، وأهمية تأسيس مجلس معها.",
    owner: "رواد",
    icon: MapPin,
  },
  {
    id: 2,
    short: "البحث عن الأسماء",
    title: "البحث عن الأسماء وتوليد قائمة واسعة",
    description:
      "نبدأ بالبحث المباشر عن شخصيات مناسبة، مع رمي الشبكة عبر العلاقات، المنصة، الترشيحات، التزكيات، الجهات الرسمية، رجال الأعمال، والسفارات إن لزم.",
    owner: "طارق",
    icon: Search,
  },
  {
    id: 3,
    short: "القائمة الطويلة",
    title: "تجميع القائمة الطويلة",
    description:
      "يتم جمع كل الأسماء في قائمة واحدة، مع توثيق مصدر كل اسم: طلب مباشر، ترشيح شخصي، ترشيح رسمي، تزكية، بحث داخلي، أو منصة.",
    owner: "طارق",
    icon: ListChecks,
  },
  {
    id: 4,
    short: "الفرز الأولي",
    title: "الفرز الأولي",
    description:
      "يتم حذف الأسماء غير المناسبة بوضوح: من لا يملك علاقة حقيقية بالدولة، أو لا يملك خبرة اقتصادية كافية، أو ملفه ناقص، أو تظهر عليه ملاحظات أولية واضحة.",
    owner: "معتز",
    icon: Filter,
  },
  {
    id: 5,
    short: "التحقق العميق",
    title: "البحث والتحقق العميق",
    description:
      "يتم إعداد ملف مختصر لكل مرشح يشمل: السيرة، الشركات، السمعة، العلاقات، النشاط الاقتصادي، الارتباط بالدولة المستهدفة، القدرة على الإضافة، وأي تضارب مصالح محتمل.",
    owner: "معتز",
    icon: UserCheck,
  },
  {
    id: 6,
    short: "المشاورة الرسمية",
    title: "المشاورة الرسمية ضمن التحقق العميق",
    description:
      "بعد تضييق القائمة، تتم مشاورة الجهات المحددة وليس بشكل عشوائي، مثل وزارة الاقتصاد والصناعة، وزارة الخارجية، وزارة الداخلية عند الحاجة، السفارة أو البعثة السورية في الدولة المستهدفة، والغرف أو الاتحادات ذات الصلة.",
    owner: "رواد",
    icon: Phone,
  },
  {
    id: 7,
    short: "القائمة القصيرة",
    title: "إعداد القائمة القصيرة",
    description:
      "بعد البحث والتحقق والمشاورة، يتم اختيار قائمة مختصرة من الأشخاص الأكثر جدية وملاءمة للانتقال إلى المقابلات.",
    owner: "طارق",
    icon: ListOrdered,
  },
  {
    id: 8,
    short: "المقابلات",
    title: "إجراء المقابلات",
    description:
      "تُجرى مقابلات منظمة مع المرشحين لفهم الدافع، العلاقات، القدرة التنفيذية، الوقت المتاح، الرؤية، والاستعداد للعمل الجماعي.",
    owner: "غير محدد",
    icon: MessagesSquare,
  },
  {
    id: 9,
    short: "تقييم الفريق",
    title: "تقييم الفريق المؤسس",
    description:
      "لا يتم تقييم كل شخص منفرداً فقط، بل يتم تقييم تركيبة الفريق ككل: هل يكملون بعضهم؟ هل لديهم علاقات حقيقية؟ هل فيهم قيادة وتنفيذ؟ هل يمثلون قطاعات مفيدة؟",
    owner: "طارق",
    icon: Users2,
  },
  {
    id: 10,
    short: "اعتماد الإطلاق",
    title: "اعتماد الإطلاق",
    description:
      "بعد التقييم النهائي، يتم رفع التوصية لاعتماد الفريق المؤسس وإطلاق المجلس أو تأجيله أو إعادة البحث عن أسماء إضافية.",
    owner: "مايا",
    icon: Rocket,
  },
  {
    id: 11,
    short: "الإدخال والأرشفة",
    title: "الإدخال على النظام والأرشفة",
    description:
      "بعد الاعتماد، يتم إدخال المجلس والفريق المؤسس والوثائق والقرارات في المنصة، ليبدأ الانتقال إلى مسار إدارة وتقييم أداء المجلس القائم.",
    owner: "مايا",
    icon: Database,
  },
] as const;

type CellStatus = "done" | "in_progress" | "pending" | "blocked";

interface CouncilTrack {
  id: string;
  country: string;
  startedAt: string;
  // stageId -> status
  stages: Record<number, CellStatus>;
  note?: string;
}

// Demo data for councils currently under establishment, with progress per stage.
const COUNCIL_TRACKS: CouncilTrack[] = [
  {
    id: "t-001",
    country: "هولندا",
    startedAt: "2026-02-10",
    note: "تقدم جيد، بانتظار المقابلات",
    stages: {
      1: "done", 2: "done", 3: "done", 4: "done", 5: "done",
      6: "done", 7: "in_progress", 8: "pending", 9: "pending",
      10: "pending", 11: "pending",
    },
  },
  {
    id: "t-002",
    country: "إيطاليا",
    startedAt: "2026-02-18",
    note: "تأخر في المشاورة الرسمية",
    stages: {
      1: "done", 2: "done", 3: "done", 4: "in_progress", 5: "pending",
      6: "blocked", 7: "pending", 8: "pending", 9: "pending",
      10: "pending", 11: "pending",
    },
  },
  {
    id: "t-003",
    country: "العراق",
    startedAt: "2026-01-28",
    note: "في مرحلة التحقق العميق",
    stages: {
      1: "done", 2: "done", 3: "done", 4: "done", 5: "in_progress",
      6: "pending", 7: "pending", 8: "pending", 9: "pending",
      10: "pending", 11: "pending",
    },
  },
  {
    id: "t-004",
    country: "ماليزيا",
    startedAt: "2026-01-30",
    note: "بداية البحث عن الأسماء",
    stages: {
      1: "done", 2: "in_progress", 3: "pending", 4: "pending", 5: "pending",
      6: "pending", 7: "pending", 8: "pending", 9: "pending",
      10: "pending", 11: "pending",
    },
  },
  {
    id: "t-005",
    country: "بلجيكا",
    startedAt: "2026-01-15",
    note: "جاهز لاعتماد الإطلاق",
    stages: {
      1: "done", 2: "done", 3: "done", 4: "done", 5: "done",
      6: "done", 7: "done", 8: "done", 9: "in_progress",
      10: "pending", 11: "pending",
    },
  },
  {
    id: "t-006",
    country: "السويد",
    startedAt: "2026-01-27",
    note: "تم فتح الملف فقط",
    stages: {
      1: "in_progress", 2: "pending", 3: "pending", 4: "pending", 5: "pending",
      6: "pending", 7: "pending", 8: "pending", 9: "pending",
      10: "pending", 11: "pending",
    },
  },
];

const statusConfig: Record<
  CellStatus,
  { label: string; bg: string; text: string; border: string; icon: typeof CheckCircle2 }
> = {
  done: {
    label: "مكتمل",
    bg: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-300",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "قيد التنفيذ",
    bg: "bg-amber-400",
    text: "text-amber-700",
    border: "border-amber-300",
    icon: Clock,
  },
  blocked: {
    label: "متوقف",
    bg: "bg-red-500",
    text: "text-red-700",
    border: "border-red-300",
    icon: AlertTriangle,
  },
  pending: {
    label: "لم يبدأ",
    bg: "bg-muted-foreground/20",
    text: "text-muted-foreground",
    border: "border-border",
    icon: Circle,
  },
};

// Owner color mapping for chips
const ownerColors: Record<string, string> = {
  "رواد": "bg-sky-100 text-sky-800 border-sky-300",
  "طارق": "bg-violet-100 text-violet-800 border-violet-300",
  "معتز": "bg-orange-100 text-orange-800 border-orange-300",
  "مايا": "bg-pink-100 text-pink-800 border-pink-300",
  "غير محدد": "bg-muted text-muted-foreground border-border",
};

function computeProgress(stages: Record<number, CellStatus>): number {
  const total = ESTABLISHMENT_STAGES.length;
  let score = 0;
  for (const stage of ESTABLISHMENT_STAGES) {
    const s = stages[stage.id];
    if (s === "done") score += 1;
    else if (s === "in_progress") score += 0.5;
  }
  return Math.round((score / total) * 100);
}

export function EstablishmentTracksMatrix() {
  const [selectedStage, setSelectedStage] = useState<(typeof ESTABLISHMENT_STAGES)[number] | null>(null);
  const [selectedCouncil, setSelectedCouncil] = useState<CouncilTrack | null>(null);

  const sortedTracks = useMemo(
    () =>
      [...COUNCIL_TRACKS].sort(
        (a, b) => computeProgress(b.stages) - computeProgress(a.stages)
      ),
    []
  );

  // Aggregate stats
  const stats = useMemo(() => {
    const avg =
      Math.round(
        sortedTracks.reduce((acc, t) => acc + computeProgress(t.stages), 0) /
          sortedTracks.length
      ) || 0;
    const blocked = sortedTracks.filter((t) =>
      Object.values(t.stages).includes("blocked")
    ).length;
    const nearLaunch = sortedTracks.filter(
      (t) => computeProgress(t.stages) >= 75
    ).length;
    return { avg, blocked, nearLaunch, total: sortedTracks.length };
  }, [sortedTracks]);

  return (
    <div className="flex flex-col gap-4" dir="rtl">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
              <p className="text-[11px] text-muted-foreground">مجلس قيد التأسيس</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.avg}%</p>
              <p className="text-[11px] text-muted-foreground">متوسط الإنجاز</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.nearLaunch}</p>
              <p className="text-[11px] text-muted-foreground">قارب على الإطلاق</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.blocked}</p>
              <p className="text-[11px] text-muted-foreground">مسارات متوقفة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2.5">
        <span className="text-xs font-medium text-foreground">دليل الحالات:</span>
        {(Object.keys(statusConfig) as CellStatus[]).map((key) => {
          const cfg = statusConfig[key];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded-sm ${cfg.bg}`} />
              <span className="text-[11px] text-muted-foreground">{cfg.label}</span>
            </div>
          );
        })}
      </div>

      {/* Matrix */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="sticky right-0 z-10 min-w-[160px] bg-muted/50 px-3 py-3 text-right text-xs font-semibold text-foreground">
                    المجلس / المرحلة
                  </th>
                  {ESTABLISHMENT_STAGES.map((stage) => {
                    const Icon = stage.icon;
                    return (
                      <th
                        key={stage.id}
                        className="min-w-[88px] px-1.5 py-3 text-center align-top"
                      >
                        <button
                          onClick={() => setSelectedStage(stage)}
                          className="flex w-full flex-col items-center gap-1.5 rounded-md p-1 transition-colors hover:bg-accent"
                          title={stage.title}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[10px] font-bold text-foreground">
                            {stage.id}
                          </span>
                          <span className="text-[9px] leading-tight text-muted-foreground line-clamp-2">
                            {stage.short}
                          </span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sortedTracks.map((track) => {
                  const progress = computeProgress(track.stages);
                  return (
                    <tr
                      key={track.id}
                      className="border-b border-border last:border-0 hover:bg-accent/30"
                    >
                      {/* Council name + progress */}
                      <td className="sticky right-0 z-10 bg-card px-3 py-3">
                        <button
                          onClick={() => setSelectedCouncil(track)}
                          className="flex w-full flex-col gap-1.5 text-right"
                        >
                          <span className="text-xs font-semibold text-foreground">
                            مجلس سوري - {track.country}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-primary">
                              {progress}%
                            </span>
                          </div>
                        </button>
                      </td>
                      {/* Stage cells */}
                      {ESTABLISHMENT_STAGES.map((stage) => {
                        const status = track.stages[stage.id] ?? "pending";
                        const cfg = statusConfig[status];
                        const Icon = cfg.icon;
                        return (
                          <td key={stage.id} className="px-1.5 py-3 text-center">
                            <div
                              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-md ${cfg.bg} ${
                                status === "pending" ? "" : "text-white"
                              }`}
                              title={`${stage.short}: ${cfg.label}`}
                            >
                              <Icon
                                className={`h-4 w-4 ${
                                  status === "pending"
                                    ? "text-muted-foreground"
                                    : "text-white"
                                }`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stage detail dialog */}
      <Dialog open={!!selectedStage} onOpenChange={(o) => !o && setSelectedStage(null)}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          {selectedStage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <selectedStage.icon className="h-4 w-4" />
                  </span>
                  <span>
                    المرحلة {selectedStage.id}: {selectedStage.title}
                  </span>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-2">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedStage.description}
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">المسؤول:</span>
                  <Badge
                    variant="outline"
                    className={`text-[11px] border ${ownerColors[selectedStage.owner]}`}
                  >
                    {selectedStage.owner}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Council detail dialog */}
      <Dialog open={!!selectedCouncil} onOpenChange={(o) => !o && setSelectedCouncil(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" dir="rtl">
          {selectedCouncil && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  مجلس سوري - {selectedCouncil.country}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">نسبة الإنجاز الكلية</p>
                    <p className="text-2xl font-bold text-primary">
                      {computeProgress(selectedCouncil.stages)}%
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">تاريخ البدء</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(selectedCouncil.startedAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
                {selectedCouncil.note && (
                  <div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">ملاحظة: </span>
                    {selectedCouncil.note}
                  </div>
                )}
                {/* Stage list timeline */}
                <div className="flex flex-col gap-1.5">
                  {ESTABLISHMENT_STAGES.map((stage) => {
                    const status = selectedCouncil.stages[stage.id] ?? "pending";
                    const cfg = statusConfig[status];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={stage.id}
                        className="flex items-center gap-3 rounded-md border border-border p-2"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${cfg.bg}`}
                        >
                          <Icon
                            className={`h-3.5 w-3.5 ${
                              status === "pending" ? "text-muted-foreground" : "text-white"
                            }`}
                          />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {stage.id}. {stage.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            المسؤول: {stage.owner}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] border ${cfg.border} ${cfg.text} shrink-0`}
                        >
                          {cfg.label}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
