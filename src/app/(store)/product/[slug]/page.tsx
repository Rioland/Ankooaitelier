import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/ProductDetail";
import ProductCard from "@/components/store/ProductCard";
import SectionHeading from "@/components/store/SectionHeading";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { getProductBySlug, getRelated, getSettings } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Product not found", robots: { index: false, follow: true } };
  const description =
    (p.description || `${p.name} — available now at Ankooaitelier.`).slice(0, 160);
  const path = `/product/${p.slug}`;
  return {
    title: p.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: p.name,
      description,
      url: path,
      images: p.images.slice(0, 1),
    },
    twitter: { card: "summary_large_image", title: p.name, description },
  };
}

export default async function ProductPage({ params }: Params) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  const [related, s] = await Promise.all([getRelated(p.categoryId, p.id), getSettings()]);
  const url = `${SITE_URL}/product/${p.slug}`;

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description || p.name,
    image: p.images.length ? p.images : undefined,
    sku: String(p.id),
    ...(p.category ? { category: p.category.name } : {}),
    brand: { "@type": "Brand", name: s.storeName },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "NGN",
      price: p.price,
      itemCondition: "https://schema.org/NewCondition",
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: s.storeName },
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${SITE_URL}/shop` },
      ...(p.category
        ? [{ "@type": "ListItem", position: 3, name: p.category.name, item: `${SITE_URL}/shop?category=${p.category.slug}` }]
        : []),
      { "@type": "ListItem", position: p.category ? 4 : 3, name: p.name, item: url },
    ],
  };

  return (
    <div className="container-x py-10">
      <JsonLd data={[productLd, breadcrumbLd]} />
      <nav className="mb-8 text-xs text-neutral-500">
        <Link href="/" className="hover:text-brand-700">Home</Link> / <Link href="/shop" className="hover:text-brand-700">Shop</Link>
        {p.category && <> / <Link href={`/shop?category=${p.category.slug}`} className="hover:text-brand-700">{p.category.name}</Link></>}
        {" / "}<span className="text-brand-700">{p.name}</span>
      </nav>
      <ProductDetail p={p} whatsapp={s.whatsappNumber} />
      {related.length > 0 && (
        <section className="mt-24">
          <SectionHeading eyebrow="Complete the look" title="You may also like" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {related.map((r) => <StaggerItem key={r.id}><ProductCard p={r} /></StaggerItem>)}
          </Stagger>
        </section>
      )}
    </div>
  );
}
