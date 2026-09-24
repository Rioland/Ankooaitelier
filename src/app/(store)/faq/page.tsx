import type { Metadata } from "next";
import Faq from "@/components/store/Faq";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/queries";
import { naira } from "@/lib/utils";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqPage() {
  const s = await getSettings();
  const items = [
    { q: "How do I place an order?", a: "Add items to your bag, go to checkout and fill in your delivery details. When you tap “Place order on WhatsApp”, your order is saved and a pre-filled WhatsApp message opens — just hit send and our team will confirm availability, payment and delivery." },
    { id: "payment", q: "How do I pay?", a: "Once we confirm your order on WhatsApp, we'll share payment options (bank transfer, and pay-on-delivery in selected cities). We never ask for card details over chat." },
    { id: "delivery", q: "How long does delivery take?", a: `Lagos: 1–2 working days. Other states: 2–5 working days.\nDelivery costs ${naira(s.deliveryFee)}${s.freeShippingThreshold ? `, and it's free on orders above ${naira(s.freeShippingThreshold)}` : ""}.` },
    { id: "returns", q: "Can I return or exchange an item?", a: "Yes. If something doesn't fit, message us within 7 days of delivery. Items must be unworn with tags attached. Exchanges are free for size swaps; refunds are processed once we receive the item." },
    { id: "sizes", q: "How do I find my size?", a: "Clothing: XS (6), S (8), M (10–12), L (14), XL (16), XXL (18).\nShoes use EU sizing (38–45). If you're between sizes, we recommend sizing up — or ask us on WhatsApp and we'll help." },
    { q: "Do you restock sold-out items?", a: "Popular pieces are often restocked. Join our newsletter or message us on WhatsApp to be notified." },
  ];
  return (
    <div className="container-x max-w-4xl py-16 lg:py-24">
      <Reveal className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Help centre</p>
        <h1 className="mt-4 font-display text-5xl font-medium tracking-tight sm:text-6xl">Frequently asked questions</h1>
      </Reveal>
      <Reveal delay={0.1}><Faq items={items} /></Reveal>
    </div>
  );
}
