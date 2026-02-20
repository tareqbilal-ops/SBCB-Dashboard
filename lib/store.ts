import type { Country, Risk } from "./types";
import { seedCountries, seedRisks } from "./seed-data";
import { computeScoreTotal } from "./business-logic";

// In-memory store for prototype (simulates database)
let countries: Country[] = [...seedCountries];
let risks: Risk[] = [...seedRisks];

// ========== COUNTRIES ==========

export function getCountries(): Country[] {
  return [...countries];
}

export function getCountryById(id: string): Country | undefined {
  return countries.find((c) => c.id === id);
}

export function updateCountry(id: string, updates: Partial<Country>): Country | undefined {
  const index = countries.findIndex((c) => c.id === id);
  if (index === -1) return undefined;

  const updated = { ...countries[index], ...updates, updated_at: new Date().toISOString() };
  // Recompute total
  updated.score_total = computeScoreTotal(updated);
  countries[index] = updated;
  return updated;
}

// ========== RISKS ==========

export function getRisks(countryId?: string): Risk[] {
  if (countryId) {
    return risks.filter((r) => r.country_id === countryId);
  }
  return [...risks];
}

export function addRisk(risk: Omit<Risk, "id" | "created_at" | "updated_at">): Risk {
  const newRisk: Risk = {
    ...risk,
    id: `r-${String(risks.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  risks.push(newRisk);
  return newRisk;
}

export function updateRisk(id: string, updates: Partial<Risk>): Risk | undefined {
  const index = risks.findIndex((r) => r.id === id);
  if (index === -1) return undefined;

  const updated = { ...risks[index], ...updates, updated_at: new Date().toISOString() };
  risks[index] = updated;
  return updated;
}
