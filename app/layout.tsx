import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dr.Shoes Running | فروشگاه کفش دویدن",
  description:
    "فروشگاه تخصصی کفش‌های دویدن — نایک، آدیداس، هوکا، بروکس و برندهای برتر",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          {children}
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
