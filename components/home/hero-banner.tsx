"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HERO_IMAGE = "/images/hero.png";

export function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full min-h-[220px] overflow-hidden rounded-2xl shadow-lg sm:min-h-[260px] sm:rounded-3xl md:min-h-[300px] lg:min-h-[340px]"
    >
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/15"
        aria-hidden
      />
      <div className="relative z-10 flex w-full flex-col gap-3 p-5 text-white sm:p-6 md:gap-4 md:p-8 lg:max-w-3xl">
        <motion.h1
          className="text-xl font-black leading-tight sm:text-2xl md:text-3xl lg:text-4xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Dr.Shoes Running
        </motion.h1>
        <motion.p
          className="text-sm leading-relaxed opacity-95 sm:text-base md:text-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          فروشگاه تخصصی کفش‌های دویدن — از تریل تا مسابقه، با بهترین برندهای
          جهان
        </motion.p>
        <motion.span
          className="inline-flex w-fit max-w-full rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold backdrop-blur sm:px-4 sm:text-xs"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ارسال رایگان بالای ۵ میلیون تومان
        </motion.span>
      </div>
    </motion.section>
  );
}
