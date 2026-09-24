"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Lock, MessageCircle } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { placeOrder } from "@/app/actions";
import { naira } from "@/lib/utils";
import { NG_STATES } from "@/lib/defaults";
import SafeImage from "../SafeImage";

export default function CheckoutForm({ deliveryFee, freeShippingThreshold }: { deliveryFee: number; freeShippingThreshold: number }) {
  const { items, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ reference: string; whatsappUrl: string } | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => setMounted(true), []);

  const subtotal = cartSubtotal(items);
  const fee = freeShippingThreshold > 0 && subtotal >= freeShippingThreshold ? 0 : deliveryFee;

  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const res = await placeOrder({
        customerName: String(fd.get("customerName") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        address: String(fd.get("address") ?? ""),
        city: String(fd.get("city") ?? ""),
        state: String(fd.get("state") ?? ""),
        note: String(fd.get("note") ?? ""),
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
      });
      if (!res.ok) return setError(res.error);
      setDone(res);
      clear();
      window.open(res.whatsappUrl, "_blank");
    });
  };

  if (!mounted) return <div className="skeleton h-96 rounded-3xl" />;

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg rounded-3xl border bg-white p-10 text-center shadow-xl shadow-brand-900/5">
        <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", delay: 0.15 }}>
          <CheckCircle2 className="mx-auto h-16 w-16 text-brand-500" />
        </motion.div>
        <h2 className="mt-5 font-display text-3xl">Order received!</h2>
        <p className="mt-2 text-neutral-600">Your reference is <b className="text-brand-700">{done.reference}</b>. Send the pre-filled WhatsApp message so we can confirm your order and delivery.</p>
        <a href={done.whatsappUrl} target="_blank" rel="noreferrer" className="btn mt-7 w-full bg-[#25D366] !py-4 text-white hover:bg-[#1ebe5a]"><MessageCircle className="h-5 w-5" /> Send order on WhatsApp</a>
        <Link href="/shop" className="mt-3 block text-sm font-medium text-neutral-600 hover:text-brand-700">Continue shopping</Link>
      </motion.div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-3xl bg-brand-50 py-20 text-center">
        <p className="font-display text-2xl">Your bag is empty</p>
        <Link href="/shop" className="btn-primary mt-6">Shop now</Link>
      </div>
    );
  }

  return (
    <form action={submit} className="grid gap-10 lg:grid-cols-[1fr_420px]">
      <div className="space-y-8">
        <fieldset className="card p-6 sm:p-8">
          <legend className="px-2 font-display text-xl">Contact</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">Full name *</label><input name="customerName" required className="input" placeholder="Adaeze Okafor" /></div>
            <div><label className="label">Phone / WhatsApp *</label><input name="phone" required type="tel" className="input" placeholder="0801 234 5678" /></div>
            <div><label className="label">Email (optional)</label><input name="email" type="email" className="input" placeholder="you@email.com" /></div>
          </div>
        </fieldset>
        <fieldset className="card p-6 sm:p-8">
          <legend className="px-2 font-display text-xl">Delivery</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className="label">Street address *</label><input name="address" required className="input" placeholder="12 Admiralty Way, Lekki Phase 1" /></div>
            <div><label className="label">City *</label><input name="city" required className="input" placeholder="Lagos" /></div>
            <div>
              <label className="label">State *</label>
              <select name="state" required defaultValue="" className="input">
                <option value="" disabled>Select state</option>
                {NG_STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="label">Order note (optional)</label><textarea name="note" rows={3} className="input" placeholder="Landmark, preferred delivery time…" /></div>
          </div>
        </fieldset>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card p-6 sm:p-8">
          <p className="font-display text-xl">Order summary</p>
          <ul className="mt-5 max-h-80 space-y-4 overflow-y-auto">
            {items.map((i) => (
              <li key={i.key} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                  <SafeImage src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-700 text-[10px] font-bold text-white">{i.quantity}</span>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-neutral-500">{[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(" · ")}</p>
                </div>
                <p className="text-sm font-semibold">{naira(i.price * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2 border-t pt-5 text-sm">
            <div className="flex justify-between"><span className="text-neutral-600">Subtotal</span><span>{naira(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-neutral-600">Delivery</span><span>{fee === 0 ? <b className="text-brand-600">FREE</b> : naira(fee)}</span></div>
            <div className="flex justify-between border-t pt-3 text-lg font-semibold"><span>Total</span><span className="text-brand-800">{naira(subtotal + fee)}</span></div>
          </div>
          <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</motion.p>}</AnimatePresence>
          <button disabled={pending} className="btn mt-6 w-full bg-[#25D366] !py-4 text-white shadow-lg shadow-green-600/20 hover:bg-[#1ebe5a]">
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />} Place order on WhatsApp
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-neutral-500"><Lock className="h-3 w-3" /> We'll confirm payment and delivery with you on WhatsApp.</p>
        </div>
      </aside>
    </form>
  );
}
