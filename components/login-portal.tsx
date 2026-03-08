"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Users,
  Globe,
  FileText,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const MEMBERSHIP_INFO = [
  {
    level: "مشرف عام",
    description: "صلاحية كاملة على جميع وظائف النظام",
    icon: Shield,
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    level: "مدير إقليمي",
    description: "إدارة الدول والمشاريع والمشاركين في الإقليم",
    icon: Globe,
    color: "bg-sky-100 text-sky-800 border-sky-300",
  },
  {
    level: "مدير مجلس",
    description: "إدارة بيانات المجلس والمشاريع والمخاطر",
    icon: Users,
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    level: "عضو",
    description: "عرض البيانات وتقديم المبادرات",
    icon: FileText,
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
  {
    level: "زائر",
    description: "عرض لوحة التحكم والخارطة فقط (قراءة)",
    icon: Eye,
    color: "bg-gray-100 text-gray-700 border-gray-300",
  },
];

export function LoginPortal() {
  const { login } = useAuth();
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!accessKey.trim()) {
      setError("يرجى إدخال مفتاح الوصول");
      return;
    }
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const result = login(accessKey);
      if (!result.success) {
        setError(result.error || "خطأ في تسجيل الدخول");
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4" dir="rtl">
      <div className="flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        {/* Login Card */}
        <Card className="w-full border-border shadow-lg lg:max-w-md">
          <CardHeader className="flex flex-col items-center gap-4 border-b border-border bg-primary/5 pb-6 pt-8">
            <Image
              src="/images/sbcb-logo.png"
              alt="SBCB Logo"
              width={64}
              height={64}
              className="shrink-0"
            />
            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground text-balance">
                مجالس الأعمال السورية المشتركة
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                بوابة الدخول إلى لوحة التحكم
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="access-key" className="text-sm font-medium text-foreground">
                مفتاح الوصول
              </Label>
              <div className="relative">
                <KeyRound className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="access-key"
                  type={showKey ? "text" : "password"}
                  placeholder="أدخل مفتاح الوصول الخاص بك"
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="pr-10 pl-10 text-sm"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {error}
                </div>
              )}
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground"
              size="lg"
            >
              {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
            </Button>

            {/* Demo keys hint */}
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lightbulb className="h-3.5 w-3.5" />
                مفاتيح تجريبية للاختبار
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {[
                  { key: "ADMIN-2026", label: "مشرف" },
                  { key: "REGION-2026", label: "إقليمي" },
                  { key: "COUNCIL-2026", label: "مجلس" },
                  { key: "MEMBER-2026", label: "عضو" },
                  { key: "VISITOR-2026", label: "زائر" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setAccessKey(item.key);
                      setError(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-mono text-foreground/80 hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span>{item.key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link to initiatives portal */}
            <div className="border-t border-border pt-4">
              <p className="text-center text-xs text-muted-foreground">
                هل تريد تقديم مبادرة لتأسيس مجلس أعمال؟
              </p>
              <Link href="/initiatives" className="mt-2 block">
                <Button variant="outline" className="w-full" size="sm">
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  بوابة المبادرات (بدون مفتاح)
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Membership Levels Info */}
        <div className="flex w-full flex-col gap-4 lg:max-w-md">
          <div>
            <h2 className="text-lg font-semibold text-foreground">مستويات العضوية</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              يتم تحديد الصلاحيات تلقائيا بناء على مفتاح الوصول المستخدم
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {MEMBERSHIP_INFO.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.level} className="border-border">
                  <CardContent className="flex items-center gap-3 p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{item.level}</span>
                        <Badge variant="outline" className={`text-[10px] ${item.color}`}>
                          المستوى {MEMBERSHIP_INFO.indexOf(item) + 1}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
