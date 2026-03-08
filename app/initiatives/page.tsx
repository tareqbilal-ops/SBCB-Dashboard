"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { InitiativePortal } from "@/components/dashboard/initiative-portal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Home,
  Info,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// Simple session for initiative portal only
interface GuestUser {
  id: string;
  name: string;
  email: string;
  type: "guest" | "member";
}

export default function InitiativesPage() {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [mode, setMode] = useState<"info" | "register" | "login">("info");
  
  // Registration form
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  // Login form (for existing members)
  const [loginEmail, setLoginEmail] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleGuestRegister = useCallback(() => {
    if (!regForm.name.trim() || !regForm.email.trim()) {
      alert("يرجى إدخال الاسم والبريد الإلكتروني");
      return;
    }
    // Create a guest session
    const guest: GuestUser = {
      id: `guest-${Date.now()}`,
      name: regForm.name.trim(),
      email: regForm.email.trim(),
      type: "guest",
    };
    setGuestUser(guest);
  }, [regForm]);

  const handleMemberLogin = useCallback(() => {
    if (!loginEmail.trim()) {
      alert("يرجى إدخال البريد الإلكتروني");
      return;
    }
    // Simple member session (in production, verify against database)
    const member: GuestUser = {
      id: `member-${Date.now()}`,
      name: loginEmail.split("@")[0],
      email: loginEmail.trim(),
      type: "member",
    };
    setGuestUser(member);
  }, [loginEmail]);

  const handleLogout = useCallback(() => {
    setGuestUser(null);
    setMode("info");
    setRegForm({ name: "", email: "", phone: "" });
    setLoginEmail("");
  }, []);

  // If logged in, show the initiative portal
  if (guestUser) {
    return (
      <div className="min-h-screen bg-background">
        {/* Simple header */}
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="container mx-auto flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/sbcb-logo.png"
                alt="SBCB Logo"
                width={36}
                height={36}
                className="rounded-full"
              />
              <div>
                <h1 className="text-sm font-semibold text-foreground">بوابة المبادرات</h1>
                <p className="text-[10px] text-muted-foreground">مجالس الأعمال السورية المشتركة</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-[10px]">
                {guestUser.type === "guest" ? "زائر" : "عضو"}
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:inline">{guestUser.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <ArrowLeft className="ml-1 h-3.5 w-3.5" />
                خروج
              </Button>
            </div>
          </div>
        </header>

        {/* Initiative Portal */}
        <main className="container mx-auto p-4 md:p-6">
          <InitiativePortal
            canSubmit={true}
            canReview={false}
            userId={guestUser.id}
          />
        </main>
      </div>
    );
  }

  // Landing page with info and registration options
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/sbcb-logo.png"
              alt="SBCB Logo"
              width={44}
              height={44}
              className="rounded-full"
            />
            <div>
              <h1 className="text-base font-semibold text-foreground">بوابة تسجيل المبادرات</h1>
              <p className="text-xs text-muted-foreground">مجالس الأعمال السورية المشتركة</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="ml-1 h-4 w-4" />
              لوحة التحكم
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              أسّس مجلس أعمال سوري مشترك
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              هل أنت رجل أعمال سوري مقيم في الخارج وترغب بتأسيس مجلس أعمال مشترك مع الدولة التي تقيم فيها؟
              سجّل مبادرتك هنا وسنتواصل معك لدراسة طلبك.
            </p>
          </div>

          {/* Info Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">اطلع على الشروط</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  تعرّف على متطلبات تأسيس المجلس والمعايير المطلوبة قبل تقديم طلبك
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">سجّل مبادرتك</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  أكمل نموذج التقديم وارفق المستندات المطلوبة بخطوات بسيطة
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-sm">تابع طلبك</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  سيتم دراسة طلبك وإعلامك بنتيجة التقييم عبر البريد الإلكتروني
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Action Section */}
          <div className="mx-auto max-w-md">
            {mode === "info" && (
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>ابدأ الآن</CardTitle>
                  <CardDescription>
                    اختر طريقة الدخول المناسبة لك
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button onClick={() => setMode("register")} className="w-full">
                    <UserPlus className="ml-2 h-4 w-4" />
                    تسجيل جديد (زائر)
                  </Button>
                  <Button variant="outline" onClick={() => setMode("login")} className="w-full">
                    <LogIn className="ml-2 h-4 w-4" />
                    دخول الأعضاء
                  </Button>
                </CardContent>
              </Card>
            )}

            {mode === "register" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">تسجيل زائر جديد</CardTitle>
                  <CardDescription>
                    أدخل بياناتك للوصول إلى بوابة المبادرات
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">الاسم الكامل *</Label>
                    <Input
                      value={regForm.name}
                      onChange={(e) => setRegForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">البريد الإلكتروني *</Label>
                    <Input
                      type="email"
                      value={regForm.email}
                      onChange={(e) => setRegForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">رقم الهاتف (اختياري)</Label>
                    <Input
                      type="tel"
                      value={regForm.phone}
                      onChange={(e) => setRegForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+90 555 123 4567"
                      dir="ltr"
                    />
                  </div>
                  <Button onClick={handleGuestRegister} className="mt-2 w-full">
                    متابعة
                  </Button>
                  <Button variant="ghost" onClick={() => setMode("info")} className="w-full">
                    رجوع
                  </Button>
                </CardContent>
              </Card>
            )}

            {mode === "login" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">دخول الأعضاء</CardTitle>
                  <CardDescription>
                    أدخل بريدك الإلكتروني المسجل
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-sm">البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>
                  <Button onClick={handleMemberLogin} className="mt-2 w-full">
                    دخول
                  </Button>
                  <Button variant="ghost" onClick={() => setMode("info")} className="w-full">
                    رجوع
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Note */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            للوصول إلى لوحة التحكم الكاملة، يرجى{" "}
            <Link href="/" className="text-primary hover:underline">
              تسجيل الدخول من هنا
            </Link>
            {" "}باستخدام مفتاح الوصول الخاص بك.
          </p>
        </div>
      </main>
    </div>
  );
}
