import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "علاقه‌مندی‌ها",
  description: "لیست کفش‌های رانینگ ذخیره‌شده در دکتر شوز.",
  alternates: { canonical: absoluteUrl("/wishlist") },
  robots: { index: false, follow: true },
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
