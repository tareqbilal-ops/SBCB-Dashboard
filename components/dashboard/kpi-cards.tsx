"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { KPIs } from "@/lib/types";
import {
  CheckCircle2,
  FileCheck,
  Clock,
  Search,
  Users,
  TrendingUp,
} from "lucide-react";

interface KPICardsProps {
  kpis: KPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      label: "المجالس المعتمدة",
      value: `${kpis.approvedCount} / ${kpis.totalTarget}`,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "جاهز للاعتماد",
      value: kpis.readyCount,
      icon: FileCheck,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      label: "مرحلة مؤقتة",
      value: kpis.provisionalCount,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "قيد التقييم",
      value: kpis.underAssessmentCount,
      icon: Search,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "مرشح",
      value: kpis.candidateCount,
      icon: Users,
      color: "text-slate-500",
      bgColor: "bg-slate-50",
    },
    {
      label: "متوسط الجاهزية",
      value: `${kpis.avgScore}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/5",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border border-border bg-card">
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </span>
                  <div className={`rounded-lg p-1.5 ${card.bgColor}`}>
                    <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                  </div>
                </div>
                <span className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress bar */}
      <Card className="border border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              التقدم نحو {kpis.totalTarget} مجلس
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(kpis.progress * 100)}%
            </span>
          </div>
          <Progress value={kpis.progress * 100} className="h-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            {kpis.approvedCount} مجلس معتمد من أصل {kpis.totalTarget} مجلس مستهدف
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
