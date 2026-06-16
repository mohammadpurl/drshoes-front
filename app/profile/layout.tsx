import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "حساب کاربری",
  description: "مدیریت سفارش‌ها و تنظیمات حساب در دکتر شوز.",
  alternates: { canonical: absoluteUrl("/profile") },
  robots: { index: false, follow: true },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
