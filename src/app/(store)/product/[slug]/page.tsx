import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/store/ProductDetail";
import ProductCard from "@/components/store/ProductCard";
import SectionHeading from "@/components/store/SectionHeading";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { getProductBySlug, getRelated, getSettings } from "@/lib/queries";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Product not found" };
  return { title: p.name, description: p.description.slice(0, 150), openGraph: { images: p.images.slice(0, 1) } };
}

export default async function ProductPage({ params }: Params) {
  const p = await getProductBySlug((await params).slug);
  if (!p) notFound();
  const [related, s] = await Promise.all([getRelated(p.categoryId, p.id), getSettings()]);

  return (
    <div className="container-x py-10">
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
