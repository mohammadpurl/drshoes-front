import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BLOG_POSTS } from "@/data/blog-posts";
import { absoluteUrl } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "مجله دکتر شوز | راهنمای کفش رانینگ",
  description:
    "مقالات فارسی درباره انتخاب کفش دویدن، مقایسه برندها و بهترین مدل‌های رانینگ.",
  alternates: { canonical: absoluteUrl("/blog") },
};

export default function BlogIndexPage() {
  const breadcrumbs = [
    { name: "خانه", href: "/" },
    { name: "مجله", href: "/blog" },
  ];

  return (
    <>
      <Header />
      <main className="page-container py-6 pb-24 md:pb-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mb-2 text-2xl font-bold">مجله کفش رانینگ دکتر شوز</h1>
        <p className="mb-8 text-sm text-muted-foreground">
          راهنماها و مقایسه‌های تخصصی برای انتخاب کفش دویدن اورجینال
        </p>
        <ul className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <article className="rounded-2xl border p-5">
                <h2 className="text-lg font-semibold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-block text-sm text-primary underline"
                >
                  مطالعه مقاله
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
