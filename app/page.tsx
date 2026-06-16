import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { homePageJsonLd } from "@/lib/seo/json-ld";
import { rootMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...rootMetadata,
  alternates: {
    canonical: SITE_URL,
    languages: { "fa-IR": SITE_URL },
  },
};

export default function Page() {
  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <HomePage />
    </>
  );
}
