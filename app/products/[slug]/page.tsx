import { notFound } from "next/navigation";
import { readData } from "@/app/core/http-service/http-service";
import {
  getProductBySlugAction,
  getProductReviewsAction,
  getRelatedProductsAction,
} from "@/app/_actions/product-actions";
import { ProductPageShell } from "@/components/product/product-page-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { buildProductMetadata } from "@/lib/seo/metadata";
import { productJsonLd } from "@/lib/seo/json-ld";
import { brandPath, productPath } from "@/lib/seo/site";
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

type ProductListRaw = {
  products?: { slug: string }[];
  items?: { slug: string }[];
};

export async function generateStaticParams() {
  try {
    const data = await readData<ProductListRaw>(
      "/products?sort=newest&page=1&pageSize=200"
    );
    const products = data.products ?? data.items ?? [];
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProductBySlugAction(slug);
  if (!result.success) return { title: "محصول یافت نشد" };
  return buildProductMetadata(result.data);
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const productResult = await getProductBySlugAction(slug);
  if (!productResult.success) notFound();

  const product = productResult.data;
  const relatedResult = await getRelatedProductsAction(slug);
  const related = relatedResult.success ? relatedResult.data : [];
  const reviewsResult = await getProductReviewsAction(slug);
  const reviews = reviewsResult.success ? reviewsResult.data : [];

  const breadcrumbs = [
    { name: "خانه", href: "/" },
    { name: "محصولات", href: "/products" },
    {
      name: product.brand,
      href: brandPath(product.brand),
    },
    {
      name: product.name,
      href: productPath(product.slug),
    },
  ];

  return (
    <>
      <JsonLd data={productJsonLd(product)} />
      <ProductPageShell
        product={product}
        related={related}
        reviews={reviews}
        breadcrumbs={breadcrumbs}
      />
    </>
  );
}
