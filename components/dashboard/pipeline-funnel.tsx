"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KPIs } from "@/lib/types";

interface PipelineFunnelProps {
  kpis: KPIs;
}

const stages = [
  { key: "candidateCount" as const, label: "مرشح", labelEn: "Candidate", color: "bg-slate-400" },
  { key: "underAssessmentCount" as const, label: "قيد التقييم", labelEn: "Under Assessment", color: "bg-orange-400" },
  { key: "provisionalCount" as const, label: "مرحلة مؤقتة", labelEn: "Provisional", color: "bg-amber-400" },
  { key: "readyCount" as const, label: "جاهز للاعتماد", labelEn: "Ready", color: "bg-teal-400" },
  { key: "approvedCount" as const, label: "معتمد", labelEn: "Approved", color: "bg-emerald-500" },
];

export function PipelineFunnel({ kpis }: PipelineFunnelProps) {
  const total = stages.reduce((sum, s) => sum + (kpis[s.key] || 0), 0);
  const maxCount = Math.max(...stages.map((s) => kpis[s.key] || 0), 1);

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">
          خط الأنابيب (Pipeline)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {stages.map((stage) => {
          const count = kpis[stage.key] || 0;
          const width = Math.max((count / maxCount) * 100, 8);
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="w-24 shrink-0 text-left">
                <span className="text-xs font-medium text-muted-foreground">
                  {stage.label}
                </span>
              </div>
              <div className="flex-1 h-8 rounded-md bg-muted overflow-hidden relative">
                <div
                  className={`h-full rounded-md ${stage.color} transition-all duration-500 flex items-center justify-end px-2`}
                  style={{ width: `${width}%` }}
                >
                  <span className="text-xs font-bold text-card">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="mt-2 pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            إجمالي المجالس في النظام: <span className="font-bold text-foreground">{total}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
