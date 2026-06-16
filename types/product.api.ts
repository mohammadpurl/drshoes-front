import type {
  Brand,
  Category,
  FootType,
  Gender,
  Product,
  Review,
  Surface,
} from "@/lib/types";

/** پاسخ `GET /products` */
export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
};

/** بدنه `POST /admin/products` */
export type ProductCreateBody = {
  name: string;
  slug?: string;
  brand: Brand;
  category: Category;
  gender: Gender;
  price: number;
  originalPrice?: number;
  discount?: number;
  drop: number;
  weight: number;
  stackHeight?: number;
  description: string;
  images: string[];
  videos?: string[];
  tags: string[];
  footType: FootType[];
  surface: Surface[];
  sizes: number[];
  unavailableSizes?: number[];
  isNew?: boolean;
  isBestseller?: boolean;
  isSpecial?: boolean;
};

/** بدنه `PATCH /admin/products/{productId}` — همه فیلدها اختیاری */
export type ProductPatchBody = Partial<ProductCreateBody>;

/** پاسخ `GET /products/{slug}/reviews` */
export type ProductReviewsResponse = {
  reviews?: Review[];
  items?: Review[];
};
