import type { Country, Risk, Project, Participant, Initiative } from "./types";
import { seedCountries, seedRisks, seedProjects, seedParticipants, seedInitiatives } from "./seed-data";
import { computeScoreTotal } from "./business-logic";

// In-memory store for prototype (simulates database)
let countries: Country[] = [...seedCountries];
let risks: Risk[] = [...seedRisks];
let projects: Project[] = [...seedProjects];
let participants: Participant[] = [...seedParticipants];
let initiatives: Initiative[] = [...seedInitiatives];

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

// ========== PROJECTS ==========

export function getProjects(): Project[] {
  return [...projects];
}

export function addProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Project {
  const newProject: Project = {
    ...project,
    id: `p-${String(projects.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  projects.push(newProject);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const updated = { ...projects[index], ...updates, updated_at: new Date().toISOString() };
  projects[index] = updated;
  return updated;
}

// ========== PARTICIPANTS ==========

export function getParticipants(): Participant[] {
  return [...participants];
}

export function addParticipant(participant: Omit<Participant, "id" | "created_at" | "updated_at">): Participant {
  const newParticipant: Participant = {
    ...participant,
    id: `pt-${String(participants.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  participants.push(newParticipant);
  return newParticipant;
}

export function updateParticipant(id: string, updates: Partial<Participant>): Participant | undefined {
  const index = participants.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  const updated = { ...participants[index], ...updates, updated_at: new Date().toISOString() };
  participants[index] = updated;
  return updated;
}

// ========== INITIATIVES ==========

export function getInitiatives(): Initiative[] {
  return [...initiatives];
}

export function addInitiative(initiative: Omit<Initiative, "id" | "submitted_at" | "reviewed_at" | "reviewer_notes">): Initiative {
  const newInitiative: Initiative = {
    ...initiative,
    id: `i-${String(initiatives.length + 1).padStart(3, "0")}`,
    submitted_at: new Date().toISOString(),
    reviewed_at: null,
    reviewer_notes: null,
  };
  initiatives.push(newInitiative);
  return newInitiative;
}

export function updateInitiative(id: string, updates: Partial<Initiative>): Initiative | undefined {
  const index = initiatives.findIndex((i) => i.id === id);
  if (index === -1) return undefined;
  const updated = { ...initiatives[index], ...updates };
  initiatives[index] = updated;
  return updated;
}
