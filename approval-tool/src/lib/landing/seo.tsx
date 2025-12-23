import type { Metadata } from "next";
import type { LandingPageConfig } from "@/config/landing-pages/schema";
import { env } from "@/env";

const APP_URL = env.NEXT_PUBLIC_APP_URL ?? "https://thumbway.app";
const APP_NAME = "Thumbway";

export function generateLandingPageMetadata(
  config: LandingPageConfig,
  basePath: string
): Metadata {
  const { seo } = config;
  const canonicalUrl = seo.canonicalUrl ?? `${APP_URL}${basePath}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),

    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: "website",
      locale: "en_US",
      images: seo.ogImage
        ? [
            {
              url: seo.ogImage.src.startsWith("http")
                ? seo.ogImage.src
                : `${APP_URL}${seo.ogImage.src}`,
              alt: seo.ogImage.alt,
              width: seo.ogImage.width ?? 1200,
              height: seo.ogImage.height ?? 630,
            },
          ]
        : [
            {
              url: `${APP_URL}/og-default.png`,
              alt: `${APP_NAME} - The approval layer for the AI generation era`,
              width: 1200,
              height: 630,
            },
          ],
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage
        ? [
            seo.ogImage.src.startsWith("http")
              ? seo.ogImage.src
              : `${APP_URL}${seo.ogImage.src}`,
          ]
        : [`${APP_URL}/og-default.png`],
    },

    alternates: {
      canonical: canonicalUrl,
    },

    robots: seo.noIndex === true
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

interface StructuredDataOrganization {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
}

interface StructuredDataSoftwareApplication {
  "@context": "https://schema.org";
  "@type": "SoftwareApplication";
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
  };
}

interface StructuredDataFAQPage {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

interface StructuredDataWebPage {
  "@context": "https://schema.org";
  "@type": "WebPage";
  name: string;
  description: string;
  url: string;
  isPartOf: {
    "@type": "WebSite";
    name: string;
    url: string;
  };
}

type StructuredData =
  | StructuredDataOrganization
  | StructuredDataSoftwareApplication
  | StructuredDataFAQPage
  | StructuredDataWebPage;

export function generateStructuredData(
  config: LandingPageConfig,
  basePath: string
): StructuredData[] {
  const { seo, sections } = config;
  const canonicalUrl = seo.canonicalUrl ?? `${APP_URL}${basePath}`;
  const structuredData: StructuredData[] = [];

  // Organization schema (always included)
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    sameAs: [
      "https://twitter.com/thumbwayapp",
      "https://linkedin.com/company/thumbway",
    ],
  });

  // WebPage schema
  structuredData.push({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: APP_NAME,
      url: APP_URL,
    },
  });

  // SoftwareApplication schema
  if (seo.structuredData?.type === "SoftwareApplication") {
    const appSchema: StructuredDataSoftwareApplication = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: APP_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    };

    if (seo.structuredData.aggregateRating) {
      appSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: seo.structuredData.aggregateRating.ratingValue,
        reviewCount: seo.structuredData.aggregateRating.reviewCount,
      };
    }

    structuredData.push(appSchema);
  }

  // FAQ schema (if page has FAQ section)
  if (sections.faq && sections.faq.faqs.length > 0) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: sections.faq.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return structuredData;
}

export function StructuredDataScript({
  data,
}: {
  data: StructuredData[];
}): React.ReactElement {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
}
