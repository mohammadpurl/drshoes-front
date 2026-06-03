"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const HERO_IMAGE = "/images/hero.png";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "ضمانت اصالت کالا",
    subtitle: "۱۰۰٪ اورجینال",
  },
  {
    icon: Truck,
    title: "ارسال سریع",
    subtitle: "به سراسر ایران",
  },
  {
    icon: Headphones,
    title: "مشاوره تخصصی",
    subtitle: "انتخاب کفش مناسب",
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

export function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-[320px] overflow-hidden rounded-2xl shadow-lg sm:min-h-[360px] sm:rounded-3xl md:min-h-[400px] lg:min-h-[420px]"
    >
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-left md:object-[15%_center]"
        sizes="100vw"
      />

      <div
        className="absolute inset-0 bg-gradient-to-e from-black from-0% via-black/90 via-45% to-transparent to-100%"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-black/25 md:bg-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-center p-5 sm:p-7 md:p-10 lg:p-12">
        <div className="ms-auto flex w-full max-w-xl flex-col items-start gap-4 text-white md:gap-5">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="space-y-2 text-start md:space-y-3"
          >
            <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-[2.75rem]">
              هر قدم، یک انتخاب{" "}
              <span className="text-[#22c55e]">حرفه‌ای</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/90 sm:text-base md:text-lg">
              کفش‌های رانینگ اورجینال مناسب فرم و آناتومی پای شما
            </p>
          </motion.div>

          <motion.ul
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="flex w-full flex-wrap gap-4 sm:gap-5 md:gap-6"
          >
            {FEATURES.map(({ icon: Icon, title, subtitle }) => (
              <li
                key={title}
                className="flex min-w-[7.5rem] items-center gap-2.5 sm:min-w-0"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="flex flex-col gap-0.5 text-start">
                  <span className="text-[11px] font-semibold leading-tight sm:text-xs">
                    {title}
                  </span>
                  <span className="text-[10px] leading-tight text-white/75 sm:text-[11px]">
                    {subtitle}
                  </span>
                </span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex w-full flex-wrap items-center gap-3"
          >
            <Link
              href="#products"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-neutral-900 transition hover:bg-white/90 sm:h-12 sm:px-8 sm:text-base"
            >
              مشاهده محصولات
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-bold text-white transition hover:bg-[#20bd5a] sm:h-12 sm:px-6 sm:text-base"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0" />
              مشاوره در واتساپ
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
