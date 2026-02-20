"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Country, KPIs } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface OverviewChartsProps {
  countries: Country[];
  kpis: KPIs;
}

const STAGE_COLORS: Record<string, string> = {
  "معتمد": "#059669",
  "جاهز للاعتماد": "#0d9488",
  "مرحلة مؤقتة": "#d97706",
  "قيد التقييم": "#ea580c",
  "مرشح": "#94a3b8",
};

const TIER_COLORS: Record<string, string> = {
  "Tier 1": "#1e4d5c",
  "Tier 2": "#c5a044",
  "Tier 3": "#7c9aa0",
};

const TRACK_COLORS: Record<string, string> = {
  "زيادة صادرات": "#059669",
  "جلب استثمارات": "#c5a044",
  "بيع خدمات": "#1e4d5c",
};

export function OverviewCharts({ countries, kpis }: OverviewChartsProps) {
  // Tier distribution
  const tierData = [
    { name: "Tier 1", value: countries.filter((c) => c.tier === "Tier 1").length },
    { name: "Tier 2", value: countries.filter((c) => c.tier === "Tier 2").length },
    { name: "Tier 3", value: countries.filter((c) => c.tier === "Tier 3").length },
  ];

  // Stage distribution
  const stageData = [
    { name: "معتمد", value: kpis.approvedCount },
    { name: "جاهز للاعتماد", value: kpis.readyCount },
    { name: "مرحلة مؤقتة", value: kpis.provisionalCount },
    { name: "قيد التقييم", value: kpis.underAssessmentCount },
    { name: "مرشح", value: kpis.candidateCount },
  ];

  // Phase 2 track distribution
  const provisionalCountries = countries.filter((c) => c.stage === "Provisional");
  const trackData = [
    {
      name: "زيادة صادرات",
      value: provisionalCountries.filter((c) => c.phase2_track === "زيادة صادرات").length,
    },
    {
      name: "جلب استثمارات",
      value: provisionalCountries.filter((c) => c.phase2_track === "جلب استثمارات").length,
    },
    {
      name: "بيع خدمات",
      value: provisionalCountries.filter((c) => c.phase2_track === "بيع خدمات").length,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Tier Pie Chart */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            توزيع الـTier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={tierData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {tierData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={TIER_COLORS[entry.name]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stage Bar Chart */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            توزيع المراحل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={90}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {stageData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={STAGE_COLORS[entry.name]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Phase 2 Track */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            مسارات اختبار المرحلة المؤقتة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={trackData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  borderColor: "var(--color-border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {trackData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={TRACK_COLORS[entry.name]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Phase 2 pass/fail */}
          <div className="mt-3 flex items-center gap-4 rounded-lg border border-border p-3">
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-emerald-600">{kpis.phase2PassCount}</p>
              <p className="text-[10px] text-muted-foreground">{"مستوفى الاختبار"}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex-1 text-center">
              <p className="text-lg font-bold text-red-500">{kpis.phase2FailCount}</p>
              <p className="text-[10px] text-muted-foreground">{"غير مستوفى"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
