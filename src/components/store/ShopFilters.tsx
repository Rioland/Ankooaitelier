"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Cat = { name: string; slug: string };
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43", "44", "45"];
const PRICES = [
  { label: "Under ₦15,000", min: "", max: "15000" },
  { label: "₦15,000 – ₦30,000", min: "15000", max: "30000" },
  { label: "₦30,000 – ₦50,000", min: "30000", max: "50000" },
  { label: "Over ₦50,000", min: "50000", max: "" },
];

export default function ShopFilters({ categories, total, mode }: { categories: Cat[]; total: number; mode: "bar" | "panel" }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k));
    start(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  };
  const active = (k: string, v: string) => sp.get(k) === v;
  const activeCount = ["category", "gender", "size", "min", "max", "sale", "q"].filter((k) => sp.get(k)).length;

  const Panel = (
    <div className="space-y-8">
      <Group title="Category">
        <Chip on={!sp.get("category")} onClick={() => set({ category: null })}>All</Chip>
        {categories.map((c) => (
          <Chip key={c.slug} on={active("category", c.slug)} onClick={() => set({ category: active("category", c.slug) ? null : c.slug })}>{c.name}</Chip>
        ))}
      </Group>
      <Group title="Shop for">
        {["women", "men"].map((g) => (
          <Chip key={g} on={active("gender", g)} onClick={() => set({ gender: active("gender", g) ? null : g })}><span className="capitalize">{g}</span></Chip>
        ))}
      </Group>
      <Group title="Size">
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => (
            <button key={s} onClick={() => set({ size: active("size", s) ? null : s })} className={cn("rounded-lg border py-2 text-sm font-medium transition", active("size", s) ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-200 hover:border-brand-400")}>{s}</button>
          ))}
        </div>
      </Group>
      <Group title="Price">
        {PRICES.map((p) => {
          const on = (sp.get("min") ?? "") === p.min && (sp.get("max") ?? "") === p.max;
          return <Chip key={p.label} on={on} onClick={() => set(on ? { min: null, max: null } : { min: p.min || null, max: p.max || null })}>{p.label}</Chip>;
        })}
      </Group>
      <Group title="Offers">
        <Chip on={active("sale", "1")} onClick={() => set({ sale: active("sale", "1") ? null : "1" })}>On sale</Chip>
      </Group>
      {activeCount > 0 && (
        <button onClick={() => start(() => router.push(pathname))} className="text-sm font-semibold text-brand-700 underline underline-offset-4">Clear all filters</button>
      )}
    </div>
  );

  if (mode === "panel") return <aside className={cn("hidden lg:block", pending && "pointer-events-none opacity-60")}>{Panel}</aside>;

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4 border-b pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="btn-outline !px-4 !py-2 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[10px] text-white">{activeCount}</span>}
          </button>
          <p className={cn("text-sm text-neutral-500 transition", pending && "opacity-50")}>{total} {total === 1 ? "product" : "products"}</p>
        </div>
        <select value={sp.get("sort") ?? "new"} onChange={(e) => set({ sort: e.target.value === "new" ? null : e.target.value })} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium">
          <option value="new">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-brand-950/40 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 lg:hidden" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl">Filters</p>
                <button onClick={() => setOpen(false)}><X /></button>
              </div>
              {Panel}
              <button onClick={() => setOpen(false)} className="btn-primary mt-8 w-full">Show {total} results</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">{title}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", on ? "border-brand-600 bg-brand-600 text-white" : "border-neutral-200 text-neutral-700 hover:border-brand-400 hover:text-brand-700")}>
      {children}
    </button>
  );
}
