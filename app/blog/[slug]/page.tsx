import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { BLOG_POSTS, getBlogPost } from "@/data/blog-posts";
import { absoluteUrl, SITE_NAME } from "@/lib/seo/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "مقاله یافت نشد" };
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fa_IR",
      url,
      title: post.title,
      description: post.description,
      siteName: SITE_NAME,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const breadcrumbs = [
    { name: "خانه", href: "/" },
    { name: "مجله", href: "/blog" },
    { name: post.title, href: `/blog/${slug}` },
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    inLanguage: "fa-IR",
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Header />
      <main className="page-container py-6 pb-24 md:pb-8">
        <Breadcrumbs items={breadcrumbs} />
        <article>
          <h1 className="mb-4 text-2xl font-bold">{post.title}</h1>
          <p className="mb-6 text-sm text-muted-foreground">{post.description}</p>
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </article>
        <Link
          href="/blog"
          className="mt-8 inline-block text-sm text-primary underline"
        >
          بازگشت به مجله
        </Link>
      </main>
      <BottomNav />
      <CartDrawer />
    </>
  );
}
