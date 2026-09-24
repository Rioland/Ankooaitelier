"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import SafeImage from "../SafeImage";
import { useCart } from "@/lib/cart";
import { discountPct, naira } from "@/lib/utils";

export type CardProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  isNew: boolean;
  stock: number;
  category?: { name: string } | null;
};

export default function ProductCard({ p, priority }: { p: CardProduct; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const off = discountPct(p.price, p.compareAtPrice);
  const needsOptions = p.sizes.length > 0;

  return (
    <motion.div whileHover="hover" initial="rest" animate="rest" className="group relative">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-50">
          <motion.div className="absolute inset-0" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <SafeImage src={p.images[0]} alt={p.name} fill priority={priority} sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
            {p.images[1] && (
              <SafeImage src={p.images[1]} alt="" fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            )}
          </motion.div>

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {off > 0 && <span className="rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-bold text-white">-{off}%</span>}
            {p.isNew && <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-brand-800 backdrop-blur">NEW</span>}
            {p.stock === 0 && <span className="rounded-full bg-neutral-900/80 px-2.5 py-1 text-[11px] font-bold text-white">SOLD OUT</span>}
          </div>

          <motion.div
            variants={{ rest: { y: 20, opacity: 0 }, hover: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.35 }}
            className="absolute inset-x-3 bottom-3 hidden md:block"
          >
            <span className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-sm font-semibold text-brand-800 shadow-lg backdrop-blur">
              {needsOptions ? "Choose options" : "View product"}
            </span>
          </motion.div>
        </div>
      </Link>

      {!needsOptions && p.stock > 0 && (
        <button
          onClick={() => add({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? "", price: p.price, color: p.colors[0] })}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-brand-700 shadow-md transition hover:scale-110 hover:bg-brand-600 hover:text-white"
          aria-label={`Add ${p.name} to bag`}
        >
          <Plus className="h-4 w-4" />
        </button>
      )}

      <div className="mt-3.5 space-y-1 px-0.5">
        {p.category && <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand-600/80">{p.category.name}</p>}
        <Link href={`/product/${p.slug}`} className="line-clamp-1 font-medium text-neutral-900 transition hover:text-brand-700">{p.name}</Link>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-brand-800">{naira(p.price)}</span>
          {off > 0 && <span className="text-sm text-neutral-400 line-through">{naira(p.compareAtPrice!)}</span>}
        </div>
      </div>
    </motion.div>
  );
}
