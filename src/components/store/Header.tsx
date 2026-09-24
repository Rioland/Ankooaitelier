"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingBag, Menu, X, ArrowRight } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import type { Category } from "@/db/schema";

type Props = { storeName: string; announcement: string; categories: Pick<Category, "name" | "slug">[] };

export default function Header({ storeName, announcement, categories }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const [mounted, setMounted] = useState(false);
  const items = useCart((s) => s.items);
  const setOpen = useCart((s) => s.setOpen);
  const pathname = usePathname();
  const router = useRouter();
  const count = mounted ? cartCount(items) : 0;

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);

  const nav = [
    { label: "Shop All", href: "/shop" },
    { label: "Men", href: "/shop?gender=men" },
    { label: "Women", href: "/shop?gender=women" },
    ...categories.slice(0, 3).map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
    { label: "Sale", href: "/shop?sale=1" },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      {announcement && (
        <div className="relative overflow-hidden bg-brand-800 py-2 text-[12px] font-medium tracking-wide text-brand-50">
          <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="flex items-center gap-16">
                {announcement}
                <span className="text-brand-300">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled ? "bg-white/85 shadow-[0_8px_30px_-12px_rgba(15,65,46,0.18)] backdrop-blur-xl" : "bg-white"
        )}
      >
        <div className={cn("container-x flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-20")}>
          <button className="lg:hidden -ml-2 p-2" onClick={() => setMenu(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="group flex items-center gap-2">
            <motion.span
              whileHover={{ rotate: -12, scale: 1.08 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 font-display text-lg font-bold text-white shadow-lg shadow-brand-600/30"
            >
              {storeName.charAt(0)}
            </motion.span>
            <span className="font-display text-2xl font-semibold tracking-tight text-brand-900">{storeName}</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={cn("link-underline text-sm font-medium text-neutral-700 hover:text-brand-700", n.label === "Sale" && "text-brand-600")}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearch((v) => !v)} className="rounded-full p-2.5 transition hover:bg-brand-50" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button onClick={() => setOpen(true)} className="relative rounded-full p-2.5 transition hover:bg-brand-50" aria-label="Open bag">
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {search && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-neutral-100"
            >
              <form onSubmit={submitSearch} className="container-x flex items-center gap-3 py-4">
                <Search className="h-5 w-5 text-brand-600" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search dresses, sneakers, kaftans…"
                  className="flex-1 bg-transparent text-lg placeholder:text-neutral-400"
                />
                <button className="btn-primary !py-2">Search</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menu && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-brand-950/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[85%] max-w-sm flex-col bg-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b p-5">
                <span className="font-display text-2xl font-semibold text-brand-900">{storeName}</span>
                <button onClick={() => setMenu(false)} aria-label="Close menu"><X /></button>
              </div>
              <nav className="flex-1 overflow-y-auto p-5">
                {[...nav, { label: "About", href: "/about" }, { label: "Contact", href: "/contact" }, { label: "FAQs", href: "/faq" }].map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i + 0.1 }}>
                    <Link href={n.href} className="flex items-center justify-between border-b border-neutral-100 py-4 text-lg font-medium">
                      {n.label} <ArrowRight className="h-4 w-4 text-brand-500" />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
