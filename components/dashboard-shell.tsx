"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Globe,
  AlertTriangle,
  Map,
  ChevronRight,
  ChevronLeft,
  Menu,
  Briefcase,
  Users,
  Lightbulb,
  LogOut,
  User,
  Shield,
  Building2,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "dashboard" | "countries" | "map" | "risks" | "projects" | "participants" | "initiatives" | "admin-users" | "admin-councils" | "admin-governance" | "admin-scores";

interface DashboardShellProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: React.ReactNode;
}

const navItems: { id: View; label: string; icon: React.ElementType; section?: string; adminOnly?: boolean }[] = [
  { id: "dashboard", label: "اللوحة الرئيسية", icon: LayoutDashboard, section: "الرئيسية" },
  { id: "countries", label: "جدول الدول", icon: Globe },
  { id: "map", label: "خارطة الدول", icon: Map },
  { id: "risks", label: "إدارة المخاطر", icon: AlertTriangle },
  { id: "projects", label: "محفظة المشاريع", icon: Briefcase, section: "الإدارة" },
  { id: "participants", label: "قاعدة البيانات", icon: Users },
  { id: "initiatives", label: "بوابة المبادرات", icon: Lightbulb },
  { id: "admin-users", label: "المستخدمون", icon: Shield, section: "الإدارة المركزية", adminOnly: true },
  { id: "admin-councils", label: "المجالس", icon: Building2, adminOnly: true },
  { id: "admin-governance", label: "الحوكمة والامتثال", icon: BarChart3, adminOnly: true },
  { id: "admin-scores", label: "التقييم والتنبيهات", icon: Bell, adminOnly: true },
];

export function DashboardShell({ currentView, onViewChange, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();

  // Filter nav items based on user permissions (admin sections only for مشرف عام)
  const isAdmin = user?.membership_level === "مشرف عام";
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 lg:relative lg:right-auto",
          sidebarOpen ? "w-64" : "w-[72px]",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
          <Image
            src="/images/sbcb-logo.png"
            alt="SBCB Logo"
            width={40}
            height={40}
            className="shrink-0"
          />
          {sidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-sidebar-primary leading-tight">
                مجالس الأعمال السورية
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 leading-tight">
                SBCB Dashboard
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {visibleNavItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const showSection = item.section && sidebarOpen;
              return (
                <li key={item.id}>
                  {showSection && (
                    <div className={cn("px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40", idx > 0 && "pt-4")}>
                      {item.section}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onViewChange(item.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary font-medium"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info + Collapse toggle */}
        <div className="border-t border-sidebar-border">
          {user && sidebarOpen && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent">
                <User className="h-4 w-4 text-sidebar-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-medium text-sidebar-foreground">{user.name}</p>
                <Badge className="mt-0.5 text-[8px] bg-sidebar-accent text-sidebar-primary border-sidebar-border">
                  {user.membership_level}
                </Badge>
              </div>
              <button
                onClick={logout}
                className="shrink-0 rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
          {user && !sidebarOpen && (
            <div className="flex flex-col items-center gap-1 px-3 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
                <User className="h-4 w-4 text-sidebar-primary" />
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <div className="hidden border-t border-sidebar-border p-3 lg:block">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex w-full items-center justify-center rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              {sidebarOpen ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">القائمة</span>
          </Button>
          <h1 className="text-base font-semibold text-foreground">
            {visibleNavItems.find((n) => n.id === currentView)?.label || navItems.find((n) => n.id === currentView)?.label}
          </h1>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
