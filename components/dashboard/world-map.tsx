"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  TrendingUp,
  Target,
  Layers,
  Eye,
} from "lucide-react";
import type { Country } from "@/lib/types";
import {
  ARABIC_TO_ISO,
  STAGE_MAP_COLORS,
  COUNTRY_CENTROIDS,
} from "@/lib/country-geo";
import { getStageLabel, getReadinessLabel } from "@/lib/business-logic";

// Dynamically import the Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[2/1] w-full items-center justify-center rounded-lg bg-muted">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Layers className="h-8 w-8 animate-pulse" />
        <span className="text-sm">جاري تحميل الخارطة...</span>
      </div>
    </div>
  ),
});

interface WorldMapProps {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
}

export function WorldMap({ countries, onSelectCountry }: WorldMapProps) {
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const mapRef = useRef<{ zoomIn: () => void; zoomOut: () => void; resetView: () => void } | null>(null);

  // Build ISO -> Country lookup
  const isoToCountry = useMemo(() => {
    const map: Record<string, Country> = {};
    for (const c of countries) {
      const iso = ARABIC_TO_ISO[c.country_name_ar];
      if (iso) map[iso] = c;
    }
    return map;
  }, [countries]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    if (stageFilter === "all") return countries;
    return countries.filter((c) => c.stage === stageFilter);
  }, [countries, stageFilter]);

  // Stats per stage
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of countries) {
      counts[c.stage] = (counts[c.stage] || 0) + 1;
    }
    return counts;
  }, [countries]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header + Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              خارطة مسار الدول
            </h2>
            <p className="text-sm text-muted-foreground">
              عرض تفاعلي لتوزّع الدول حسب مرحلة المسار - مدعوم بخرائط GIS
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="تصفية حسب المرحلة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              <SelectItem value="Approved">معتمد</SelectItem>
              <SelectItem value="Ready for Approval">جاهز للاعتماد</SelectItem>
              <SelectItem value="Provisional">مرحلة مؤقتة</SelectItem>
              <SelectItem value="Under Assessment">قيد التقييم</SelectItem>
              <SelectItem value="Candidate">مرشح</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => mapRef.current?.zoomIn()}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">تكبير</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => mapRef.current?.zoomOut()}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">تصغير</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => mapRef.current?.resetView()}
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">إعادة تعيين</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Legend bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5">
        <span className="text-xs font-medium text-muted-foreground">
          دليل الألوان:
        </span>
        {Object.entries(STAGE_MAP_COLORS).map(([stage, colors]) => (
          <button
            key={stage}
            onClick={() =>
              setStageFilter(stageFilter === stage ? "all" : stage)
            }
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all hover:bg-muted"
            style={{
              opacity:
                stageFilter === "all" || stageFilter === stage ? 1 : 0.4,
            }}
          >
            <span
              className="inline-block h-3 w-3 rounded-sm border"
              style={{
                backgroundColor: colors.fill,
                borderColor: colors.stroke,
              }}
            />
            <span className="text-foreground">{colors.label}</span>
            <span className="text-muted-foreground">
              ({stageCounts[stage] || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Map Card */}
      <Card className="overflow-hidden border-border">
        <CardContent className="relative p-0">
          <div className="aspect-[2/1] w-full min-h-[400px]">
            <LeafletMap
              ref={mapRef}
              countries={filteredCountries}
              allCountries={countries}
              onSelectCountry={onSelectCountry}
              onHoverCountry={setHoveredCountry}
            />
          </div>

          {/* Floating Tooltip */}
          {hoveredCountry && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] w-72 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-foreground">
                  {hoveredCountry.country_name_ar}
                </span>
                <Badge
                  variant="outline"
                  className="px-1.5 py-0.5 text-[10px]"
                  style={{
                    backgroundColor:
                      STAGE_MAP_COLORS[hoveredCountry.stage]?.fill + "20",
                    borderColor:
                      STAGE_MAP_COLORS[hoveredCountry.stage]?.fill,
                    color:
                      STAGE_MAP_COLORS[hoveredCountry.stage]?.stroke,
                  }}
                >
                  {getStageLabel(hoveredCountry.stage)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>{hoveredCountry.tier}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    {hoveredCountry.score_total}
                  </span>
                  <span>/100</span>
                </div>
              </div>

              {/* Score bar */}
              <div className="mt-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${hoveredCountry.score_total}%`,
                      backgroundColor:
                        STAGE_MAP_COLORS[hoveredCountry.stage]?.fill,
                    }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>
                    {getReadinessLabel(hoveredCountry.score_total)}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Eye className="h-2.5 w-2.5" />
                    انقر للتفاصيل
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Summary Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Object.entries(STAGE_MAP_COLORS).map(([stage, colors]) => {
          const count = stageCounts[stage] || 0;
          const stageCountries = countries.filter((c) => c.stage === stage);
          const avgScore =
            stageCountries.length > 0
              ? Math.round(
                  stageCountries.reduce((s, c) => s + c.score_total, 0) /
                    stageCountries.length
                )
              : 0;
          const isActive = stageFilter === "all" || stageFilter === stage;

          return (
            <Card
              key={stage}
              className={`cursor-pointer border transition-all hover:shadow-md ${
                isActive ? "border-border" : "border-border opacity-50"
              }`}
              onClick={() =>
                setStageFilter(stageFilter === stage ? "all" : stage)
              }
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: colors.fill }}
                  />
                  {colors.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-foreground">
                  {count}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">
                  {"متوسط الدرجة: "}
                  <span className="font-semibold text-foreground">
                    {avgScore}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
