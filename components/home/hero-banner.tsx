"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Globe,
  Headphones,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const HERO_BG_DESKTOP = "/images/brands/Hero Baner4.png";
const HERO_BG_MOBILE = "/images/brands/mobileBaner.png";
const LOGO = "/images/Logo.png";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    subtitle: "۱۰۰٪ اورجینال",
  },
  {
    icon: Globe,
    title: "واردات مستقیم",
    subtitle: "برندهای معتبر جهانی",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    subtitle: "به سراسر ایران",
  },
  {
    icon: Headphones,
    title: "پشتیبانی تخصصی",
    subtitle: "قبل و بعد از خرید",
  },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function HeroContent() {
  return (
    <>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Image
          src={LOGO}
          alt="Dr. Shoes"
          width={160}
          height={100}
          className="h-11 w-auto object-contain object-left sm:h-14 lg:h-16"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
        className="space-y-1.5 text-start sm:space-y-2"
      >
        <h1 className="text-lg font-black leading-[1.25] text-black sm:text-2xl lg:text-3xl">
          <span className="text-blue-800">اورجینال‌ترین</span>
          <br />
          کفش‌های{" "}
          <span className="bg-gradient-to-l from-blue-700 via-blue-800 to-blue-950 bg-clip-text text-transparent">
            رانینگ دنیا
          </span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-neutral-800 sm:text-sm">
          واردات مستقیم برندهای معتبر جهانی با ضمانت اصالت کالا
        </p>
      </motion.div>

      <motion.ul
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-3 sm:gap-y-3"
      >
        {FEATURES.map(({ icon: Icon, title, subtitle }) => (
          <li key={title} className="flex items-start gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-700/40 bg-blue-100 text-blue-800 sm:h-8 sm:w-8">
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5 text-start">
              <span className="text-[11px] font-semibold leading-tight text-black sm:text-[10px]">
                {title}
              </span>
              <span className="text-[10px] leading-tight text-neutral-700 sm:text-[9px]">
                {subtitle}
              </span>
            </span>
          </li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.16 }}
        className="flex flex-wrap items-center gap-2.5 sm:gap-3"
      >
        <Link
          href="#products"
          className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-full bg-blue-700 px-4 text-sm font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 sm:h-10 sm:flex-none sm:px-6 sm:text-sm"
        >
          مشاهده محصولات
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border border-black/15 bg-white px-4 text-sm font-semibold text-black shadow-sm transition hover:bg-neutral-50 sm:h-10 sm:flex-none sm:px-5 sm:text-sm"
        >
          <WhatsAppIcon className="h-5 w-5 text-success" />
          واتساپ
        </a>
      </motion.div>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-700/20 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-black sm:w-fit sm:rounded-full sm:px-3 sm:py-1.5 sm:text-[10px]"
      >
        <ShieldCheck className="h-4 w-4 shrink-0 text-blue-800" strokeWidth={2} />
        اصالت را با ما تجربه کنید — ۱۰۰٪ اورجینال
      </motion.div>
    </>
  );
}

/** دسکتاپ: بنر افقی + متن روی تصویر — موبایل: بنر عمودی + متن زیر تصویر */
export function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full overflow-hidden rounded-2xl bg-white shadow-lg sm:rounded-3xl md:bg-transparent"
    >
      {/* موبایل */}
      <Image
        src={HERO_BG_MOBILE}
        alt=""
        width={1080}
        height={1620}
        priority
        className="h-auto w-full md:hidden"
        sizes="100vw"
        aria-hidden
      />

      {/* دسکتاپ */}
      <Image
        src={HERO_BG_DESKTOP}
        alt=""
        width={2400}
        height={960}
        priority
        className="hidden h-auto w-full md:block"
        sizes="100vw"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[min(100%,560px)] bg-gradient-to-r from-white/90 from-0% via-white/55 via-[50%] to-transparent to-[100%] md:block lg:via-[45%] lg:to-[88%]"
        aria-hidden
      />

      <div className="flex flex-col gap-4 px-4 py-4 md:absolute md:inset-y-0 md:left-0 md:z-10 md:max-w-[min(100%,520px)] md:justify-center md:gap-4 md:px-6 md:py-8 lg:gap-5 lg:px-8 lg:py-10">
        <HeroContent />
      </div>
    </motion.section>
  );
}
