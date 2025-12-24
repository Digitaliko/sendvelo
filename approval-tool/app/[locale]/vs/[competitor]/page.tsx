import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LandingPageTemplate } from "@/components/landing/LandingPageTemplate";
import {
  getLandingPageBySlug,
  getLandingPageSlugs,
} from "@/config/landing-pages";
import {
  generateLandingPageMetadata,
  generateStructuredData,
  StructuredDataScript,
} from "@/lib/landing/seo";
import type { Locale } from "@/i18n/config";

interface PageProps {
  params: Promise<{ competitor: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = getLandingPageSlugs("comparison");
  return slugs.map((slug) => ({ competitor: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { competitor, locale } = await params;
  const config = getLandingPageBySlug("comparison", competitor, locale as Locale);

  if (!config) {
    return { title: "Not Found" };
  }

  return generateLandingPageMetadata(config, `/vs/${competitor}`);
}

export default async function ComparisonPage({ params }: PageProps) {
  const { competitor, locale } = await params;
  const config = getLandingPageBySlug("comparison", competitor, locale as Locale);

  if (!config || config.status !== "published") {
    notFound();
  }

  const structuredData = generateStructuredData(config, `/vs/${competitor}`);

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <LandingPageTemplate config={config} />
    </>
  );
}
