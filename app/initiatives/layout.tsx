import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بوابة المبادرات - مجالس الأعمال السورية المشتركة",
  description: "سجّل مبادرتك لتأسيس مجلس أعمال سوري مشترك مع الدولة التي تقيم فيها",
};

export default function InitiativesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
