import Link from "next/link";
import { ArrowRight, Truck, MessageCircle, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";
import HeroCarousel from "@/components/store/HeroCarousel";
import ProductCard from "@/components/store/ProductCard";
import SectionHeading from "@/components/store/SectionHeading";
import ShopBySize from "@/components/store/ShopBySize";
import Reveal, { Stagger, StaggerItem } from "@/components/Reveal";
import SafeImage from "@/components/SafeImage";
import { getCategories, getFeaturedProducts, getHeroSlides, getNewArrivals, getSettings } from "@/lib/queries";
import { naira, cn } from "@/lib/utils";

export default async function Home() {
  const [slides, cats, featured, arrivals, s] = await Promise.all([
    getHeroSlides(), getCategories(), getFeaturedProducts(8), getNewArrivals(8), getSettings(),
  ]);

  const perks = [
    { icon: Truck, title: "Nationwide delivery", text: s.freeShippingThreshold ? `Free on orders over ${naira(s.freeShippingThreshold)}` : "Fast delivery to all 36 states" },
    { icon: MessageCircle, title: "Order on WhatsApp", text: "Checkout in one message, real people reply" },
    { icon: RefreshCcw, title: "Easy exchanges", text: "Wrong size? Swap within 7 days" },
    { icon: ShieldCheck, title: "Quality checked", text: "Every piece inspected before dispatch" },
  ];

  return (
    <>
      <HeroCarousel slides={slides} />

      {/* Perks */}
      <section className="container-x py-12">
        <Stagger className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="group flex items-start gap-4 rounded-2xl p-4 transition hover:bg-brand-50">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-700 transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-brand-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Categories bento */}
      {cats.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow="Collections" title="Shop by category" href="/shop" cta="Browse everything" />
          <Stagger className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
            {cats.slice(0, 6).map((c, i) => (
              <StaggerItem key={c.id} className={cn(i === 0 && "md:col-span-2 md:row-span-2", (i === 3 || i === 4 || i === 5) && "md:col-span-2")}>
                <Link href={`/shop?category=${c.slug}`} className="group relative block h-full overflow-hidden rounded-3xl bg-brand-100">
                  <SafeImage src={c.image || ""} alt={c.name} fill sizes="(max-width:768px) 50vw, 40vw" className="object-cover transition duration-[1.2s] ease-out group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/10 to-transparent transition group-hover:from-brand-900/90" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-6">
                    <div>
                      <p className={cn("font-display font-medium", i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl")}>{c.name}</p>
                      {i === 0 && c.description && <p className="mt-1 max-w-xs text-sm text-white/75">{c.description}</p>}
                    </div>
                    <span className="grid h-10 w-10 shrink-0 translate-y-2 place-items-center rounded-full bg-white text-brand-800 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowRight className="h-4 w-4 -rotate-45" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow="Handpicked" title="Featured pieces" href="/shop" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <StaggerItem key={p.id}><ProductCard p={p} priority={i < 4} /></StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* Editorial split */}
      <section className="container-x py-12">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "For Her", title: "Effortless, every day.", href: "/shop?gender=women", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" },
            { label: "For Him", title: "Sharp, without trying.", href: "/shop?gender=men", img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80" },
          ].map((b, i) => (
            <Reveal key={b.label} delay={i * 0.12}>
              <Link href={b.href} className="group relative block h-[480px] overflow-hidden rounded-[2rem] bg-brand-900">
                <SafeImage src={b.img} alt={b.label} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition duration-[1.4s] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/20 to-transparent" />
                <div className="absolute bottom-0 p-8 text-white sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-300">{b.label}</p>
                  <p className="mt-3 font-display text-4xl font-medium sm:text-5xl">{b.title}</p>
                  <span className="mt-6 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-sm font-semibold transition group-hover:gap-4 group-hover:border-white">
                    Shop the edit <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Shop by size */}
      <section className="container-x py-12">
        <Reveal><ShopBySize /></Reveal>
      </section>

      {/* New arrivals */}
      {arrivals.length > 0 && (
        <section className="container-x py-12">
          <SectionHeading eyebrow="Just landed" title="New arrivals" href="/shop?sort=new" />
          <Stagger className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {arrivals.map((p) => (
              <StaggerItem key={p.id}><ProductCard p={p} /></StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <Link href="/shop" className="btn-outline !px-8">View all products <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </section>
      )}

      {/* WhatsApp CTA */}
      <section className="container-x py-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-brand-600 px-8 py-16 text-center text-white sm:px-16">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-400/40 blur-3xl animate-float" />
            <div className="absolute -bottom-24 -right-10 h-80 w-80 rounded-full bg-brand-800/60 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <Sparkles className="mx-auto h-8 w-8 text-brand-200" />
              <h2 className="mt-4 font-display text-4xl font-medium sm:text-5xl">Need help choosing?</h2>
              <p className="mt-4 text-brand-50/85">Send us a message on WhatsApp — we'll help with sizing, styling and anything else before you order.</p>
              <a href={`https://wa.me/${s.whatsappNumber}`} target="_blank" rel="noreferrer" className="btn-white mt-8 !px-8 !py-4">
                <MessageCircle className="h-4 w-4" /> Chat with us
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
