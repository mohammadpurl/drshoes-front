const PRODUCTS_DIR = "/images/Products";

/** Encode path segment for next/image src */
function segment(value: string): string {
  return encodeURIComponent(value);
}

/** مسیر فایل در ریشه Products */
export function productImagePath(fileName: string): string {
  return `${PRODUCTS_DIR}/${segment(fileName)}`;
}

/** مسیر فایل داخل زیرپوشه Products */
function folderImagePath(folder: string, fileName: string): string {
  return `${PRODUCTS_DIR}/${segment(folder)}/${segment(fileName)}`;
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

function folderPaths(folder: string, files: string[]): string[] {
  return sortByVariantSuffix(files).map((f) => folderImagePath(folder, f));
}

const ZOOM_FLY_6 = folderPaths("ZOOM FLY 6", [
  "ZOOM FLY 6 38.jpg",
  "ZOOM FLY 6 38 (1).jpg",
  "ZOOM FLY 6 38 (2).jpg",
]);

const ADIZERO_BOSTON_12 = folderPaths("ADIZERO BOSTON 12", [
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

const NIKE_VAPORFLY_3 = folderPaths("Nike Vaporfly 3", [
  "Nike Vaporfly 3 414546.jpg",
  "Nike Vaporfly 3 414546 (2).jpg",
  "Nike Vaporfly 3 414546 (4).jpg",
]);

const ADIZERO_EVO_SL_ATR = folderPaths("Running Adizero EVO SL ATR", [
  "adidas Running Adizero EVO SL ATR all terrain trail trainersجدیدترین کتونی دنیا یه کفش همه_کاره  (3).jpg",
  "adidas Running Adizero EVO SL ATR all terrain trail trainersجدیدترین کتونی دنیا یه کفش همه_کاره  (4).jpg",
]);

const PRO_444 = folderPaths("Pro 4", [
  "Pro 444.jpg",
  "Pro 444 (1).jpg",
  "Pro 444 (2).jpg",
  "Pro 444 (3).jpg",
]);

/** slug → تصاویر اختصاصی (بر اساس public/images/Products) */
const IMAGES_BY_SLUG: Record<string, string[]> = {
  "nike-zoom-fly-6": ZOOM_FLY_6,
  "adizero-boston-12": ADIZERO_BOSTON_12,
  "adidas-boston-12": ADIZERO_BOSTON_12,
  "on-cloudmonster-2": CLOUDMONSTER_2,
  "nike-vaporfly-3": NIKE_VAPORFLY_3,
  "adidas-terrex-agravic": ADIZERO_EVO_SL_ATR,
  "asics-gel-trabuco-12": PRO_444,
  "asics-novablast-5": PRO_444,
};

const FALLBACK_SETS = [
  ZOOM_FLY_6,
  ADIZERO_BOSTON_12,
  CLOUDMONSTER_2,
  NIKE_VAPORFLY_3,
  ADIZERO_EVO_SL_ATR,
  PRO_444,
];

export function getProductImages(slug: string, productId: string): string[] {
  const dedicated = IMAGES_BY_SLUG[slug];
  if (dedicated?.length) return dedicated;

  const index = Math.max(0, parseInt(productId, 10) - 1) % FALLBACK_SETS.length;
  return FALLBACK_SETS[index] ?? ZOOM_FLY_6;
}
