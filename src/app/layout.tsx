import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/fraunces";
import "./globals.css";
import { getSettings } from "@/lib/queries";
import { SITE_URL, realLinks } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const DESCRIPTION =
  "Shop dresses, shirts, native wear, sneakers and accessories for men and women. Order easily on WhatsApp with fast, nationwide delivery across Nigeria.";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.storeName} — ${s.tagline}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${s.storeName}` },
    description: DESCRIPTION,
    applicationName: s.storeName,
    keywords: [
      "Nigerian fashion",
      "online clothing store Nigeria",
      "native wear",
      "men's fashion",
      "women's fashion",
      "dresses",
      "sneakers",
      "ankara",
      "shop on WhatsApp",
      "Lagos fashion store",
      s.storeName,
    ],
    authors: [{ name: s.storeName }],
    creator: s.storeName,
    publisher: s.storeName,
    category: "shopping",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: s.storeName,
      title,
      description: DESCRIPTION,
      url: SITE_URL,
      locale: "en_NG",
    },
    twitter: { card: "summary_large_image", title, description: DESCRIPTION },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#177c4e",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    name: s.storeName,
    description: s.tagline,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    ...(s.phone ? { telephone: s.phone } : {}),
    ...(s.email ? { email: s.email } : {}),
    address: { "@type": "PostalAddress", addressLocality: s.address || "Lagos", addressCountry: "NG" },
    areaServed: "NG",
    currenciesAccepted: "NGN",
    sameAs: realLinks(s.instagram, s.facebook, s.twitter, s.tiktok),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: s.storeName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body>
        {children}
        <JsonLd data={[organization, website]} />
      </body>
    </html>
  );
}
