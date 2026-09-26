import type { Metadata } from "next";
import Link from "next/link";
import Reveal, { Stagger, StaggerItem } from "@/components/Reveal";
import SafeImage from "@/components/SafeImage";
import { getSettings } from "@/lib/queries";
import { Leaf, HeartHandshake, Truck, Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "About" };

export default async function About() {
  const s = await getSettings();
  const values = [
    { icon: Sparkles, t: "Considered design", d: "Pieces chosen for fit, fabric and how they make you feel." },
    { icon: Leaf, t: "Made to last", d: "Quality you can wear again and again — not just once." },
    { icon: HeartHandshake, t: "Real service", d: "Talk to a real person on WhatsApp before and after you buy." },
    { icon: Truck, t: "Delivered to you", d: "Reliable delivery to every state in Nigeria." },
  ];
  return (
    <div>
      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Our story</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">Fashion that fits your life.</h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            {s.storeName} started with a simple idea: shopping for great clothes in Nigeria should be easy, honest and enjoyable.
            We curate modern everyday wear and contemporary native pieces for men and women, then make ordering as simple as sending a message.
          </p>
          <Link href="/shop" className="btn-primary mt-8">Explore the collection</Link>
        </Reveal>
        <Reveal delay={0.15} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-100">
          <SafeImage src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80" alt="Inside the store" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </Reveal>
      </section>

      {(s.ceoName || s.ceoAbout) && (
        <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-100 lg:order-last">
            <SafeImage src={s.ceoImage || "/ceo.jpeg"} alt={s.ceoName || "Founder"} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Meet the founder</p>
            <h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">{s.ceoName}</h2>
            {s.ceoName && <p className="mt-1 text-sm font-medium text-neutral-500">Founder, {s.storeName}</p>}
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-neutral-600">
              {s.ceoAbout.split(/\n\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Reveal>
        </section>
      )}

      <section className="bg-brand-50 py-20">
        <div className="container-x">
          <Reveal><h2 className="font-display text-4xl font-medium sm:text-5xl">What we stand for</h2></Reveal>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: I, t, d }) => (
              <StaggerItem key={t} className="rounded-3xl bg-white p-7 transition duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/5">
                <I className="h-7 w-7 text-brand-600" />
                <p className="mt-5 text-lg font-semibold">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
