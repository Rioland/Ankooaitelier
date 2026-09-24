"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function Faq({ items }: { items: { id?: string; q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y rounded-3xl border bg-white">
      {items.map((it, i) => (
        <div key={it.q} id={it.id} className="scroll-mt-28">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8">
            <span className="font-medium sm:text-lg">{it.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><Plus className="h-4 w-4" /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <p className="whitespace-pre-line px-6 pb-6 leading-relaxed text-neutral-600 sm:px-8">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
