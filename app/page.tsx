"use client";

import { useState, useCallback } from "react";
import type { Country, Risk } from "@/lib/types";
import { seedCountries, seedRisks } from "@/lib/seed-data";
import { computeScoreTotal } from "@/lib/business-logic";
import { DashboardShell } from "@/components/dashboard-shell";
import { ExecutiveOverview } from "@/components/dashboard/executive-overview";
import { CountriesTable } from "@/components/dashboard/countries-table";
import { CountryDetail } from "@/components/dashboard/country-detail";
import { RisksManagement } from "@/components/dashboard/risks-management";
import { WorldMap } from "@/components/dashboard/world-map";

type View = "dashboard" | "countries" | "map" | "risks";

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [countries, setCountries] = useState<Country[]>(seedCountries);
  const [risks, setRisks] = useState<Risk[]>(seedRisks);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleSelectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
    setDetailOpen(true);
  }, []);

  const handleSaveCountry = useCallback(
    (id: string, updates: Partial<Country>) => {
      setCountries((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const updated = { ...c, ...updates, updated_at: new Date().toISOString() };
          updated.score_total = computeScoreTotal(updated);
          return updated;
        })
      );
      // Update selected country too
      setSelectedCountry((prev) => {
        if (!prev || prev.id !== id) return prev;
        const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
        updated.score_total = computeScoreTotal(updated);
        return updated;
      });
    },
    []
  );

  const handleAddRisk = useCallback(
    (risk: Omit<Risk, "id" | "created_at" | "updated_at">) => {
      const newRisk: Risk = {
        ...risk,
        id: `r-${String(Date.now()).slice(-6)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setRisks((prev) => [...prev, newRisk]);
    },
    []
  );

  const handleUpdateRisk = useCallback(
    (id: string, updates: Partial<Risk>) => {
      setRisks((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
        )
      );
    },
    []
  );

  return (
    <DashboardShell currentView={currentView} onViewChange={setCurrentView}>
      {currentView === "dashboard" && <ExecutiveOverview countries={countries} />}
      {currentView === "countries" && (
        <CountriesTable countries={countries} onSelectCountry={handleSelectCountry} />
      )}
      {currentView === "map" && (
        <WorldMap countries={countries} onSelectCountry={handleSelectCountry} />
      )}
      {currentView === "risks" && (
        <RisksManagement
          risks={risks}
          countries={countries}
          onAddRisk={handleAddRisk}
          onUpdateRisk={handleUpdateRisk}
        />
      )}

      <CountryDetail
        country={selectedCountry}
        risks={risks}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSave={handleSaveCountry}
      />
    </DashboardShell>
  );
}
