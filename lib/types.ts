export type FootType =
  | "flat"
  | "normal"
  | "high_arch"
  | "pronation"
  | "supination";

export type Surface = "road" | "trail" | "track";

export type Category =
  | "running"
  | "trail"
  | "race"
  | "training"
  | "walking";

export type Gender = "men" | "women" | "unisex";

export type Brand =
  | "Adidas"
  | "Nike"
  | "On Running"
  | "ASICS"
  | "Hoka"
  | "New Balance"
  | "Saucony"
  | "Brooks";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  category: Category;
  gender: Gender;
  price: number;
  originalPrice?: number;
  discount?: number;
  sizes: number[];
  unavailableSizes?: number[];
  footType: FootType[];
  surface: Surface[];
  drop: number;
  weight: number;
  stackHeight?: number;
  isNew: boolean;
  isBestseller: boolean;
  isSpecial?: boolean;
  images: string[];
  description: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  brand: Brand;
  price: number;
  size: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export type SortOption =
  | "newest"
  | "bestseller"
  | "price_asc"
  | "price_desc";

export interface ProductFilters {
  search?: string;
  category?: string;
  brands?: Brand[];
  sizes?: number[];
  footTypes?: FootType[];
  surfaces?: Surface[];
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
}
