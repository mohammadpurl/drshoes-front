import type { Brand, Category, FootType } from "./types";

export const BRAND_GRADIENTS: Record<Brand, string> = {
  Adidas: "from-blue-600 via-blue-500 to-cyan-400",
  Nike: "from-orange-500 via-red-500 to-yellow-400",
  "On Running": "from-slate-700 via-slate-500 to-amber-300",
  ASICS: "from-blue-800 via-indigo-600 to-teal-400",
  Hoka: "from-sky-500 via-blue-400 to-lime-300",
  "New Balance": "from-gray-700 via-red-600 to-gray-400",
  Saucony: "from-yellow-500 via-amber-500 to-orange-400",
  Brooks: "from-emerald-600 via-teal-500 to-cyan-300",
};

export const BRANDS: Brand[] = [
  "Adidas",
  "Nike",
  "On Running",
  "ASICS",
  "Hoka",
  "New Balance",
  "Saucony",
  "Brooks",
];

export const HIGHLIGHTS = [
  { id: "new", label: "تازه‌ها", emoji: "✨", filter: "new" },
  {
    id: "bestseller",
    label: "پرفروش",
    emoji: "🔥",
    filter: "bestseller",
    image: "/images/Bestseller.jfif",
  },
  {
    id: "brands",
    label: "برندها",
    emoji: "👟",
    filter: "brands",
    image: "/images/Brands.jfif",
  },
  {
    id: "discount",
    label: "تخفیف",
    emoji: "💰",
    filter: "discount",
    image: "/images/Discount.jfif",
  },
  {
    id: "trail",
    label: "تریل",
    emoji: "⛰️",
    filter: "trail",
    image: "/images/Trail.jfif",
  },
  {
    id: "race",
    label: "مسابقه",
    emoji: "🏁",
    filter: "race",
    image: "/images/race.jfif",
  },
];

export const CATEGORIES: { id: string; label: string; value?: Category | "all" }[] =
  [
    { id: "all", label: "همه", value: "all" },
    { id: "running", label: "دویدن", value: "running" },
    { id: "trail", label: "تریل", value: "trail" },
    { id: "race", label: "مسابقه", value: "race" },
    { id: "training", label: "تمرین", value: "training" },
    { id: "walking", label: "پیاده‌روی", value: "walking" },
    { id: "women", label: "زنانه", value: "all" },
    { id: "men", label: "مردانه", value: "all" },
  ];

export const FOOT_TYPE_LABELS: Record<FootType, { label: string; emoji: string }> =
  {
    flat: { label: "کف صاف", emoji: "🦶" },
    normal: { label: "معمولی", emoji: "👣" },
    high_arch: { label: "قوس بالا", emoji: "⛰️" },
    pronation: { label: "پرونیشن", emoji: "↩️" },
    supination: { label: "سوپینیشن", emoji: "↪️" },
  };

export const SURFACE_LABELS = {
  road: "جاده",
  trail: "تریل",
  track: "تراک",
};

export const SIZES = [37, 38, 39, 40, 41, 42, 43, 44, 45];

export const PRICE_MAX = 30_000_000;

export const SHIPPING_COST = 350_000;

export const PAGE_SIZE = 8;

export const WHATSAPP_NUMBER = "989051083434";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
