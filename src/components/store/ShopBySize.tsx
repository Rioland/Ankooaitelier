"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SETS = {
  Clothing: ["XS", "S", "M", "L", "XL", "XXL"],
  Shoes: ["38", "39", "40", "41", "42", "43", "44", "45"],
};

export default function ShopBySize() {
  const [tab, setTab] = useState<keyof typeof SETS>("Clothing");
  const [gender, setGender] = useState<"women" | "men">("women");
  return (
    <div className="rounded-[2rem] bg-brand-50 p-8 sm:p-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">Find your fit</p>
          <h2 className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">Shop by size</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {(["women", "men"] as const).map((g) => (
            <button key={g} onClick={() => setGender(g)} className={cn("relative rounded-full px-5 py-2 text-sm font-semibold capitalize transition", gender === g ? "text-white" : "text-brand-800 hover:bg-white")}>
              {gender === g && <motion.span layoutId="g-pill" className="absolute inset-0 rounded-full bg-brand-600" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{g}</span>
            </button>
          ))}
          <span className="mx-1 w-px bg-brand-200" />
          {(Object.keys(SETS) as (keyof typeof SETS)[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("relative rounded-full px-5 py-2 text-sm font-semibold transition", tab === t ? "text-brand-900" : "text-brand-700/70 hover:bg-white")}>
              {tab === t && <motion.span layoutId="t-pill" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={tab + gender} initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.04 } } }} className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-8">
        {SETS[tab].map((size) => (
          <motion.div key={size} variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }}>
            <Link href={`/shop?size=${size}&gender=${gender}`} className="grid aspect-square place-items-center rounded-2xl border border-brand-200 bg-white font-display text-2xl font-medium text-brand-900 transition duration-300 hover:-translate-y-1 hover:border-brand-600 hover:bg-brand-600 hover:text-white hover:shadow-xl hover:shadow-brand-600/20">
              {size}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
