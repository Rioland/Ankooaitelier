"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "../SafeImage";
import type { HeroSlide } from "@/db/schema";

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const n = slides.length;
  const go = useCallback((d: number) => { setDir(d); setI((x) => (x + d + n) % n); }, [n]);

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [go, n, i]);

  if (!n) return null;
  const s = slides[i];

  return (
    <section className="relative px-3 pt-3 sm:px-4">
      <div className="relative h-[78vh] min-h-[520px] overflow-hidden rounded-[2rem] bg-brand-950">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={s.id}
            custom={dir}
            initial={{ opacity: 0, scale: 1.12, x: dir * 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.02, x: dir * -60 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage src={s.image} alt={s.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-950/85 via-brand-950/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="container-x relative flex h-full items-center">
          <AnimatePresence mode="wait">
            <motion.div key={s.id} className="max-w-2xl text-white" initial="hidden" animate="show" exit="exit"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } }, exit: { opacity: 0, transition: { duration: 0.25 } } }}>
              {s.eyebrow && (
                <motion.p variants={item} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> {s.eyebrow}
                </motion.p>
              )}
              <h1 className="font-display text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
                {s.title.split(" ").map((w, k) => (
                  <span key={k} className="inline-block overflow-hidden pb-2 align-bottom">
                    <motion.span variants={word} className="inline-block">{w}&nbsp;</motion.span>
                  </span>
                ))}
              </h1>
              {s.subtitle && <motion.p variants={item} className="mt-5 max-w-lg text-base text-white/80 sm:text-lg">{s.subtitle}</motion.p>}
              <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
                <Link href={s.ctaHref || "/shop"} className="btn-white group !px-7 !py-4">
                  {s.ctaLabel || "Shop now"} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
                <Link href="/shop?gender=women" className="btn border border-white/30 !px-7 !py-4 text-white backdrop-blur hover:bg-white/10">Shop Women</Link>
                <Link href="/shop?gender=men" className="btn border border-white/30 !px-7 !py-4 text-white backdrop-blur hover:bg-white/10">Shop Men</Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {n > 1 && (
          <div className="absolute bottom-6 left-0 right-0">
            <div className="container-x flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((sl, k) => (
                  <button key={sl.id} onClick={() => { setDir(k > i ? 1 : -1); setI(k); }} className="relative h-1 w-12 overflow-hidden rounded-full bg-white/25" aria-label={`Slide ${k + 1}`}>
                    {k === i && <motion.span key={i} className="absolute inset-y-0 left-0 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6.5, ease: "linear" }} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => go(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white backdrop-blur transition hover:bg-white hover:text-brand-900" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => go(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white backdrop-blur transition hover:bg-white hover:text-brand-900" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } };
const word = { hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };
