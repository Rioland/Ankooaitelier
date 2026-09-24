import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import type { StoreSettings, Category } from "@/db/schema";
import Newsletter from "./Newsletter";

const Social = ({ href, label, d }: { href: string; label: string; d: string }) =>
  href ? (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition hover:-translate-y-0.5 hover:bg-white hover:text-brand-900">
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d={d} /></svg>
    </a>
  ) : null;

export default function Footer({ s, categories }: { s: StoreSettings; categories: Pick<Category, "name" | "slug">[] }) {
  return (
    <footer className="relative mt-24 overflow-hidden bg-brand-950 text-brand-50">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
      <div className="container-x relative">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-display text-3xl font-medium sm:text-4xl">Join the {s.storeName} list.</h3>
            <p className="mt-2 text-brand-200/80">New drops, restocks and members-only offers. No spam.</p>
          </div>
          <Newsletter />
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-3xl font-semibold">{s.storeName}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-200/80">{s.tagline}</p>
            <div className="mt-6 flex gap-2">
              <Social href={s.instagram} label="Instagram" d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.1-9.4a1.1 1.1 0 1 0 0 2.3 1.1 1.1 0 0 0 0-2.3Z" />
              <Social href={s.facebook} label="Facebook" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.4 1.5-1.4h1.5V4.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.3H8v3h2.6V21h2.9Z" />
              <Social href={s.twitter} label="X" d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
              <Social href={s.tiktok} label="TikTok" d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3s-1.9.1-3.2-1.5Z" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/90">
              <li><Link className="link-underline" href="/shop">All products</Link></li>
              <li><Link className="link-underline" href="/shop?gender=men">Men</Link></li>
              <li><Link className="link-underline" href="/shop?gender=women">Women</Link></li>
              {categories.slice(0, 4).map((c) => (
                <li key={c.slug}><Link className="link-underline" href={`/shop?category=${c.slug}`}>{c.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Help</p>
            <ul className="mt-4 space-y-2.5 text-sm text-brand-100/90">
              <li><Link className="link-underline" href="/about">About us</Link></li>
              <li><Link className="link-underline" href="/contact">Contact</Link></li>
              <li><Link className="link-underline" href="/faq">FAQs</Link></li>
              <li><Link className="link-underline" href="/faq#delivery">Delivery information</Link></li>
              <li><Link className="link-underline" href="/faq#returns">Returns & exchanges</Link></li>
              <li><Link className="link-underline" href="/faq#sizes">Size guide</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Get in touch</p>
            <ul className="mt-4 space-y-3 text-sm text-brand-100/90">
              <li className="flex gap-3"><MapPin className="h-4 w-4 shrink-0 text-brand-300" />{s.address}</li>
              <li className="flex gap-3"><Phone className="h-4 w-4 shrink-0 text-brand-300" />{s.phone}</li>
              <li className="flex gap-3"><Mail className="h-4 w-4 shrink-0 text-brand-300" />{s.email}</li>
              <li className="flex gap-3"><Clock className="h-4 w-4 shrink-0 text-brand-300" />{s.hours}</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs text-brand-200/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.storeName}. All rights reserved.</p>
          <p>Secure ordering via WhatsApp · Nationwide delivery</p>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none select-none text-center font-display text-[22vw] font-bold leading-[0.8] tracking-tighter text-white/[0.04]">{s.storeName}</p>
    </footer>
  );
}
