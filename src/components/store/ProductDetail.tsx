"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Truck, MessageCircle, RefreshCcw } from "lucide-react";
import SafeImage from "../SafeImage";
import { useCart } from "@/lib/cart";
import { cn, discountPct, naira } from "@/lib/utils";
import type { CardProduct } from "./ProductCard";

type P = CardProduct & { description: string };

export default function ProductDetail({ p, whatsapp }: { p: P; whatsapp: string }) {
  const [img, setImg] = useState(0);
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string | undefined>(p.colors[0]);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const off = discountPct(p.price, p.compareAtPrice);
  const images = p.images.length ? p.images : [""];
  const soldOut = p.stock <= 0;

  const addToBag = () => {
    if (p.sizes.length && !size) { setErr(true); return; }
    add({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? "", price: p.price, size, color }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const ask = `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in "${p.name}"${size ? ` (size ${size})` : ""}. Is it available?`)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {images.length > 1 && (
          <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col">
            {images.map((src, k) => (
              <button key={k} onClick={() => setImg(k)} className={cn("relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition", k === img ? "border-brand-600" : "border-transparent opacity-60 hover:opacity-100")}>
                <SafeImage src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-3xl bg-brand-50">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={img} className="absolute inset-0" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <SafeImage src={images[img]} alt={p.name} fill priority sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          {off > 0 && <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">Save {off}%</span>}
        </div>
      </div>

      {/* Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="lg:py-4">
        {p.category && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">{p.category.name}</p>}
        <h1 className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{p.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-brand-800">{naira(p.price)}</span>
          {off > 0 && <span className="text-lg text-neutral-400 line-through">{naira(p.compareAtPrice!)}</span>}
        </div>
        <p className={cn("mt-2 text-sm font-medium", soldOut ? "text-red-600" : p.stock < 5 ? "text-amber-600" : "text-brand-600")}>
          {soldOut ? "Sold out" : p.stock < 5 ? `Only ${p.stock} left` : "In stock, ready to ship"}
        </p>

        {p.colors.length > 0 && (
          <div className="mt-8">
            <p className="label">Colour: <span className="normal-case tracking-normal text-neutral-900">{color}</span></p>
            <div className="flex flex-wrap gap-2">
              {p.colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", color === c ? "border-brand-600 bg-brand-50 text-brand-800" : "border-neutral-200 hover:border-brand-400")}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {p.sizes.length > 0 && (
          <motion.div className="mt-6" animate={err ? { x: [0, -8, 8, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} onAnimationComplete={() => setErr(false)}>
            <div className="flex items-center justify-between">
              <p className="label">Size {size && <span className="normal-case tracking-normal text-neutral-900">: {size}</span>}</p>
              <a href="/faq#sizes" className="text-xs font-semibold text-brand-700 underline underline-offset-4">Size guide</a>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={cn("rounded-xl border py-3 text-sm font-semibold transition", size === s ? "border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/25" : "border-neutral-200 hover:border-brand-500")}>{s}</button>
              ))}
            </div>
            {err && <p className="mt-2 text-sm text-red-600">Please select a size</p>}
          </motion.div>
        )}

        <div className="mt-8 flex gap-3">
          <div className="flex items-center rounded-full border">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3.5" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="p-3.5" aria-label="Increase"><Plus className="h-4 w-4" /></button>
          </div>
          <button onClick={addToBag} disabled={soldOut} className="btn-primary relative flex-1 overflow-hidden !py-4">
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="a" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><Check className="h-4 w-4" /> Added to bag</motion.span>
              ) : (
                <motion.span key="b" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><ShoppingBag className="h-4 w-4" /> {soldOut ? "Sold out" : "Add to bag"}</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <a href={ask} target="_blank" rel="noreferrer" className="btn-outline mt-3 w-full !py-4"><MessageCircle className="h-4 w-4" /> Ask about this item on WhatsApp</a>

        <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-brand-50/70 p-4 text-center text-xs text-brand-900">
          <div><Truck className="mx-auto mb-1.5 h-5 w-5 text-brand-600" />Nationwide delivery</div>
          <div><RefreshCcw className="mx-auto mb-1.5 h-5 w-5 text-brand-600" />7-day exchanges</div>
          <div><MessageCircle className="mx-auto mb-1.5 h-5 w-5 text-brand-600" />WhatsApp support</div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="label">Details</p>
          <div className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-700">{p.description}</div>
        </div>
      </motion.div>
    </div>
  );
}
