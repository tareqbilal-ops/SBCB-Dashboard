"use client";

import { useState, useCallback } from "react";
import type { Country, Risk, Project, Participant } from "@/lib/types";
import { seedCountries, seedRisks, seedProjects, seedParticipants } from "@/lib/seed-data";
import { computeScoreTotal } from "@/lib/business-logic";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { LoginPortal } from "@/components/login-portal";
import { DashboardShell } from "@/components/dashboard-shell";
import { ExecutiveOverview } from "@/components/dashboard/executive-overview";
import { CountriesTable } from "@/components/dashboard/countries-table";
import { CountryDetail } from "@/components/dashboard/country-detail";
import { RisksManagement } from "@/components/dashboard/risks-management";
import { WorldMap } from "@/components/dashboard/world-map";
import { ProjectsPortfolio } from "@/components/dashboard/projects-portfolio";
import { ParticipantsDatabase } from "@/components/dashboard/participants-database";
import { InitiativePortal } from "@/components/dashboard/initiative-portal";
import { UsersManagement } from "@/components/dashboard/admin/users-management";
import { CouncilsManagement } from "@/components/dashboard/admin/councils-management";
import { GovernanceCompliance } from "@/components/dashboard/admin/governance-compliance";
import { ScoresAlerts } from "@/components/dashboard/admin/scores-alerts";

type View = "dashboard" | "countries" | "map" | "risks" | "projects" | "participants" | "initiatives" | "admin-users" | "admin-councils" | "admin-governance" | "admin-scores";

function DashboardContent() {
  const { isAuthenticated, user, hasPermission } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [countries, setCountries] = useState<Country[]>(seedCountries);
  const [risks, setRisks] = useState<Risk[]>(seedRisks);
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [participants, setParticipants] = useState<Participant[]>(seedParticipants);
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

  // Projects CRUD
  const handleAddProject = useCallback(
    (project: Omit<Project, "id" | "created_at" | "updated_at">) => {
      const newProject: Project = {
        ...project,
        id: `p-${String(Date.now()).slice(-6)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, newProject]);
    },
    []
  );

  const handleUpdateProject = useCallback(
    (id: string, updates: Partial<Project>) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        )
      );
    },
    []
  );

  // Participants CRUD
  const handleAddParticipant = useCallback(
    (participant: Omit<Participant, "id" | "created_at" | "updated_at">) => {
      const newParticipant: Participant = {
        ...participant,
        id: `pt-${String(Date.now()).slice(-6)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setParticipants((prev) => [...prev, newParticipant]);
    },
    []
  );

  const handleUpdateParticipant = useCallback(
    (id: string, updates: Partial<Participant>) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
        )
      );
    },
    []
  );

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPortal />;
  }

  // Permission checks
  const canEditCountries = hasPermission("مدير مجلس");
  const canManageProjects = hasPermission("مدير مجلس");
  const canManageParticipants = hasPermission("مدير إقليمي");
  const canSubmitInitiatives = hasPermission("عضو");
  const canReviewInitiatives = hasPermission("مدير إقليمي");
  const isAdmin = user?.membership_level === "مشرف عام";

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
      {currentView === "projects" && (
        <ProjectsPortfolio
          projects={projects}
          countries={countries}
          canEdit={canManageProjects}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
        />
      )}
      {currentView === "participants" && (
        <ParticipantsDatabase
          participants={participants}
          countries={countries}
          canEdit={canManageParticipants}
          onAddParticipant={handleAddParticipant}
          onUpdateParticipant={handleUpdateParticipant}
        />
      )}
      {currentView === "initiatives" && (
        <InitiativePortal
          canSubmit={canSubmitInitiatives}
          canReview={canReviewInitiatives}
          userId={user?.id || ""}
        />
      )}
      {currentView === "admin-users" && isAdmin && <UsersManagement />}
      {currentView === "admin-councils" && isAdmin && <CouncilsManagement />}
      {currentView === "admin-governance" && isAdmin && <GovernanceCompliance />}
      {currentView === "admin-scores" && isAdmin && <ScoresAlerts />}

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

export default function HomePage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
