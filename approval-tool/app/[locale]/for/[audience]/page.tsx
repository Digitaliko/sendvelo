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
  params: Promise<{ audience: string; locale: string }>;
}

export async function generateStaticParams() {
  const slugs = getLandingPageSlugs("audience");
  return slugs.map((slug) => ({ audience: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience } = await params;
  const config = getLandingPageBySlug("audience", audience);

  if (!config) {
    return { title: "Not Found" };
  }

  return generateLandingPageMetadata(config, `/for/${audience}`);
}

export default async function AudiencePage({ params }: PageProps) {
  const { audience } = await params;
  const config = getLandingPageBySlug("audience", audience);

  if (!config || config.status !== "published") {
    notFound();
  }

  const structuredData = generateStructuredData(config, `/for/${audience}`);

  return (
    <>
      <StructuredDataScript data={structuredData} />
      <LandingPageTemplate config={config} />
    </>
  );
}
