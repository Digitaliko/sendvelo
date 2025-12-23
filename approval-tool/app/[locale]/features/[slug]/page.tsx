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

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = getLandingPageSlugs("feature");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getLandingPageBySlug("feature", slug);

  if (!config) {
    return { title: "Not Found" };
  }

  return generateLandingPageMetadata(config, `/features/${slug}`);
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const config = getLandingPageBySlug("feature", slug);

  if (!config || config.status !== "published") {
    notFound();
  }

  const structuredData = generateStructuredData(config, `/features/${slug}`);

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <LandingPageTemplate config={config} />
    </>
  );
}
