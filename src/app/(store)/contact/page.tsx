import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import ContactForm from "@/components/store/ContactForm";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Contact" };

export default async function Contact() {
  const s = await getSettings();
  const rows = [
    { i: MessageCircle, l: "WhatsApp", v: "+" + s.whatsappNumber, href: `https://wa.me/${s.whatsappNumber}` },
    { i: Phone, l: "Phone", v: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { i: Mail, l: "Email", v: s.email, href: `mailto:${s.email}` },
    { i: MapPin, l: "Address", v: s.address },
    { i: Clock, l: "Hours", v: s.hours },
  ];
  return (
    <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.3fr] lg:py-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Contact</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">We'd love to hear from you.</h1>
        <p className="mt-5 text-neutral-600">Questions about sizing, an order or a collaboration? Reach us any of these ways.</p>
        <ul className="mt-10 space-y-3">
          {rows.map(({ i: I, l, v, href }) => (
            <li key={l}>
              <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-transparent p-3 transition hover:border-brand-100 hover:bg-brand-50">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white"><I className="h-5 w-5" /></span>
                <span><span className="block text-xs text-neutral-500">{l}</span><span className="font-medium">{v}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1}><ContactForm /></Reveal>
    </div>
  );
}
