import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import ShopFilters from "@/components/store/ShopFilters";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { getCategories, getProducts, type ShopFilters as F } from "@/lib/queries";
import { SearchX } from "lucide-react";

export const metadata: Metadata = { title: "Shop" };

export default async function ShopPage({ searchParams }: { searchParams: Promise<F> }) {
  const f = await searchParams;
  const [items, cats] = await Promise.all([getProducts(f), getCategories()]);
  const cat = cats.find((c) => c.slug === f.category);
  const title = f.q ? `Results for “${f.q}”` : cat?.name ?? (f.gender === "men" ? "Men" : f.gender === "women" ? "Women" : f.sale ? "Sale" : "Shop all");

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-200/50 blur-3xl" />
        <div className="container-x relative py-16 sm:py-20">
          <nav className="text-xs text-neutral-500"><Link href="/" className="hover:text-brand-700">Home</Link> / <span className="text-brand-700">Shop</span></nav>
          <h1 className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">{title}</h1>
          {cat?.description && <p className="mt-3 max-w-xl text-neutral-600">{cat.description}</p>}
        </div>
      </section>

      <section className="container-x py-10">
        <ShopFilters mode="bar" categories={cats.map((c) => ({ name: c.name, slug: c.slug }))} total={items.length} />
        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ShopFilters mode="panel" categories={cats.map((c) => ({ name: c.name, slug: c.slug }))} total={items.length} />
        </div>
        <div>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-brand-50/60 py-24 text-center">
              <SearchX className="h-10 w-10 text-brand-500" />
              <p className="mt-4 font-display text-2xl">No products found</p>
              <p className="mt-1 text-sm text-neutral-500">Try removing a filter or searching for something else.</p>
              <Link href="/shop" className="btn-primary mt-6">Clear filters</Link>
            </div>
          ) : (
            <Stagger key={JSON.stringify(f)} className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3">
              {items.map((p, i) => (
                <StaggerItem key={p.id}><ProductCard p={p} priority={i < 3} /></StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}
