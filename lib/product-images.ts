const PRODUCTS_DIR = "/images/Products";

/** Encode filename for use in next/image src (spaces, Persian chars, etc.) */
export function productImagePath(fileName: string): string {
  return `${PRODUCTS_DIR}/${encodeURIComponent(fileName)}`;
}

function sortByVariantSuffix(files: string[]): string[] {
  return [...files].sort((a, b) => {
    const numA = a.match(/\((\d+)\)\.jpg$/i)?.[1];
    const numB = b.match(/\((\d+)\)\.jpg$/i)?.[1];
    if (!numA && !numB) return a.localeCompare(b, "fa");
    if (!numA) return -1;
    if (!numB) return 1;
    return Number(numA) - Number(numB);
  });
}

function paths(files: string[]): string[] {
  return sortByVariantSuffix(files).map(productImagePath);
}

const ZOOM_FLY_6 = paths([
  "ZOOM FLY 6 38.jpg",
  "ZOOM FLY 6 38 (1).jpg",
  "ZOOM FLY 6 38 (2).jpg",
]);

const ADIZERO_BOSTON_12 = paths([
  "_ADIZERO BOSTON 1238 2-339 1-341 1-342.jpg",
  "_ADIZERO BOSTON 1238 2-339 1-341 1-342 (1).jpg",
  "_ADIZERO BOSTON 1238 2-339 1-341 1-342 (2).jpg",
  "_ADIZERO BOSTON 1238 2-339 1-341 1-342 (3).jpg",
  "_ADIZERO BOSTON 1238 2-339 1-341 1-342 (4).jpg",
]);

const CLOUDMONSTER_2 = paths([
  "__موجود تهران_On Cloudmonster 2.jpg",
  "__موجود تهران_On Cloudmonster 2 (1).jpg",
  "__موجود تهران_On Cloudmonster 2 (2).jpg",
  "__موجود تهران_On Cloudmonster 2 (3).jpg",
  "__موجود تهران_On Cloudmonster 2 (4).jpg",
  "__موجود تهران_On Cloudmonster 2 (5).jpg",
  "__موجود تهران_On Cloudmonster 2 (6).jpg",
]);

const ADIZERO_EVO_SL_ATR = paths([
  "adidas Running Adizero EVO SL ATR all terrain trail trainersجدیدترین کتونی دنیا یه کفش همه_کاره .jpg",
  "adidas Running Adizero EVO SL ATR all terrain trail trainersجدیدترین کتونی دنیا یه کفش همه_کاره  (1).jpg",
  "adidas Running Adizero EVO SL ATR all terrain trail trainersجدیدترین کتونی دنیا یه کفش همه_کاره  (2).jpg",
]);

const PRO_444 = paths([
  "Pro 444.jpg",
  "Pro 444 (1).jpg",
  "Pro 444 (2).jpg",
  "Pro 444 (3).jpg",
]);

/** slug → تصاویر اختصاصی (بر اساس نام فایل‌ها در public/images/Products) */
const IMAGES_BY_SLUG: Record<string, string[]> = {
  "nike-zoom-fly-6": ZOOM_FLY_6,
  "adidas-boston-12": ADIZERO_BOSTON_12,
  "on-cloudmonster-2": CLOUDMONSTER_2,
  "adidas-terrex-agravic": ADIZERO_EVO_SL_ATR,
  "asics-gel-trabuco-12": PRO_444,
};

const FALLBACK_SETS = [
  ZOOM_FLY_6,
  ADIZERO_BOSTON_12,
  CLOUDMONSTER_2,
  ADIZERO_EVO_SL_ATR,
  PRO_444,
];

export function getProductImages(slug: string, productId: string): string[] {
  const dedicated = IMAGES_BY_SLUG[slug];
  if (dedicated?.length) return dedicated;

  const index = Math.max(0, parseInt(productId, 10) - 1) % FALLBACK_SETS.length;
  return FALLBACK_SETS[index] ?? ZOOM_FLY_6;
}
