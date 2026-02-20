"use client";

import { useState, useMemo } from "react";
import type { Country, Stage, Tier } from "@/lib/types";
import { STAGES, TIERS, PHASE2_TRACKS } from "@/lib/types";
import {
  getReadinessLabel,
  getStageBadgeColor,
  getScoreColor,
  getStageLabel,
} from "@/lib/business-logic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, ArrowUpDown, Eye, X } from "lucide-react";

interface CountriesTableProps {
  countries: Country[];
  onSelectCountry: (country: Country) => void;
}

type SortKey = "score_total" | "country_name_ar" | "stage" | "tier";
type SortDir = "asc" | "desc";

const stageOrder: Record<string, number> = {
  Candidate: 0,
  "Under Assessment": 1,
  Provisional: 2,
  "Ready for Approval": 3,
  Approved: 4,
};

export function CountriesTable({ countries, onSelectCountry }: CountriesTableProps) {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterTrack, setFilterTrack] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score_total");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...countries];

    // Search
    if (search) {
      result = result.filter((c) =>
        c.country_name_ar.includes(search)
      );
    }

    // Filter stage
    if (filterStage !== "all") {
      result = result.filter((c) => c.stage === filterStage);
    }

    // Filter tier
    if (filterTier !== "all") {
      result = result.filter((c) => c.tier === filterTier);
    }

    // Filter track
    if (filterTrack !== "all") {
      result = result.filter((c) => c.phase2_track === filterTrack);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "score_total":
          cmp = a.score_total - b.score_total;
          break;
        case "country_name_ar":
          cmp = a.country_name_ar.localeCompare(b.country_name_ar, "ar");
          break;
        case "stage":
          cmp = stageOrder[a.stage] - stageOrder[b.stage];
          break;
        case "tier":
          cmp = a.tier.localeCompare(b.tier);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [countries, search, filterStage, filterTier, filterTrack, sortKey, sortDir]);

  const hasActiveFilters = filterStage !== "all" || filterTier !== "all" || filterTrack !== "all" || search !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterStage("all");
    setFilterTier("all");
    setFilterTrack("all");
  };

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">
            جدول الدول ({filtered.length})
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
              <X className="ml-1 h-3 w-3" />
              مسح الفلاتر
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 text-sm"
            />
          </div>
          <Select value={filterStage} onValueChange={setFilterStage}>
            <SelectTrigger className="w-full md:w-40 text-sm">
              <SelectValue placeholder="المرحلة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {getStageLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-full md:w-32 text-sm">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الـTier</SelectItem>
              {TIERS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterTrack} onValueChange={setFilterTrack}>
            <SelectTrigger className="w-full md:w-40 text-sm">
              <SelectValue placeholder="المسار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المسارات</SelectItem>
              {PHASE2_TRACKS.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
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
                <TableHead className="text-right">
                  <button onClick={() => toggleSort("country_name_ar")} className="flex items-center gap-1 text-xs font-semibold">
                    الدولة
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button onClick={() => toggleSort("tier")} className="flex items-center gap-1 text-xs font-semibold">
                    Tier
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button onClick={() => toggleSort("stage")} className="flex items-center gap-1 text-xs font-semibold">
                    المرحلة
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button onClick={() => toggleSort("score_total")} className="flex items-center gap-1 text-xs font-semibold">
                    النتيجة
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right text-xs font-semibold">الجاهزية</TableHead>
                <TableHead className="text-right text-xs font-semibold">المالك</TableHead>
                <TableHead className="text-right text-xs font-semibold">مسار الاختبار</TableHead>
                <TableHead className="text-right text-xs font-semibold">الاختبار</TableHead>
                <TableHead className="text-center text-xs font-semibold">تفاصيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((country) => {
                const readiness = getReadinessLabel(country.score_total);
                return (
                  <TableRow
                    key={country.id}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => onSelectCountry(country)}
                  >
                    <TableCell className="font-medium text-sm text-foreground">
                      {country.country_name_ar}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-medium">
                        {country.tier}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] border ${getStageBadgeColor(country.stage)}`}>
                        {getStageLabel(country.stage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-bold ${getScoreColor(country.score_total)}`}>
                        {country.score_total}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{readiness}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{country.owner}</span>
                    </TableCell>
                    <TableCell>
                      {country.stage === "Provisional" && country.phase2_track ? (
                        <span className="text-xs text-foreground">{country.phase2_track}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {country.stage === "Provisional" ? (
                        <Badge
                          className={`text-[10px] border ${
                            country.phase2_activity_done === "نعم"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {country.phase2_activity_done === "نعم" ? "مستوفى" : "غير مستوفى"}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/40">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCountry(country);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">عرض التفاصيل</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
                    لا توجد نتائج مطابقة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
