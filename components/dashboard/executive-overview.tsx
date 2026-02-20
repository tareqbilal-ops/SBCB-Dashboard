"use client";

import type { Country } from "@/lib/types";
import { computeKPIs } from "@/lib/business-logic";
import { KPICards } from "./kpi-cards";
import { PipelineFunnel } from "./pipeline-funnel";
import { OverviewCharts } from "./overview-charts";

interface ExecutiveOverviewProps {
  countries: Country[];
}

export function ExecutiveOverview({ countries }: ExecutiveOverviewProps) {
  const kpis = computeKPIs(countries);

  return (
    <div className="flex flex-col gap-6">
      <KPICards kpis={kpis} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PipelineFunnel kpis={kpis} />
        </div>
        <div className="lg:col-span-2">
          <OverviewCharts countries={countries} kpis={kpis} />
        </div>
      </div>
    </div>
  );
}
