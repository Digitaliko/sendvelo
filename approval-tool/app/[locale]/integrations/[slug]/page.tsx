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
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = getLandingPageSlugs("integration");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const config = getLandingPageBySlug("integration", slug, locale as Locale);

  if (!config) {
    return { title: "Not Found" };
  }

  return generateLandingPageMetadata(config, `/integrations/${slug}`);
}

export default async function IntegrationPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const config = getLandingPageBySlug("integration", slug, locale as Locale);

  if (!config || config.status !== "published") {
    notFound();
  }

  const structuredData = generateStructuredData(config, `/integrations/${slug}`);

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <LandingPageTemplate config={config} />
    </>
  );
}
