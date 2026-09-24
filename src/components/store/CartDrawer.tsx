"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart, cartSubtotal } from "@/lib/cart";
import { naira } from "@/lib/utils";
import SafeImage from "../SafeImage";
import { useEffect } from "react";

export default function CartDrawer({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const { items, open, setOpen, update, remove } = useCart();
  const subtotal = cartSubtotal(items);
  const progress = freeShippingThreshold > 0 ? Math.min(100, (subtotal / freeShippingThreshold) * 100) : 100;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-brand-950/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h2 className="font-display text-2xl font-semibold">Your bag</h2>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-neutral-100" aria-label="Close bag"><X className="h-5 w-5" /></button>
            </div>

            {freeShippingThreshold > 0 && items.length > 0 && (
              <div className="border-b bg-brand-50/60 px-6 py-4 text-sm">
                {subtotal >= freeShippingThreshold ? (
                  <p className="font-medium text-brand-700">🎉 You've unlocked free delivery!</p>
                ) : (
                  <p className="text-neutral-600">Add <b className="text-brand-700">{naira(freeShippingThreshold - subtotal)}</b> more for free delivery</p>
                )}
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-brand-100">
                  <motion.div className="h-full rounded-full bg-brand-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 animate-float">
                    <ShoppingBag className="h-9 w-9 text-brand-500" />
                  </motion.div>
                  <p className="mt-5 font-display text-xl">Your bag is empty</p>
                  <p className="mt-1 text-sm text-neutral-500">Discover pieces you'll love.</p>
                  <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-6">Start shopping</Link>
                </div>
              ) : (
                <ul className="divide-y">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li key={i.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60, height: 0 }} className="flex gap-4 py-5">
                        <Link href={`/product/${i.slug}`} onClick={() => setOpen(false)} className="relative h-28 w-22 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                          <SafeImage src={i.image} alt={i.name} fill sizes="88px" className="object-cover" />
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="font-medium leading-snug">{i.name}</p>
                            <button onClick={() => remove(i.key)} className="text-neutral-400 transition hover:text-red-500" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                          </div>
                          <p className="mt-1 text-xs text-neutral-500">{[i.size && `Size ${i.size}`, i.color].filter(Boolean).join(" · ")}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border">
                              <button onClick={() => update(i.key, i.quantity - 1)} className="p-2" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                              <span className="w-6 text-center text-sm font-semibold">{i.quantity}</span>
                              <button onClick={() => update(i.key, i.quantity + 1)} className="p-2" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                            </div>
                            <p className="font-semibold text-brand-800">{naira(i.price * i.quantity)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t px-6 py-5">
                <div className="flex justify-between text-base">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">{naira(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">Delivery calculated at checkout.</p>
                <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full !py-4">Checkout via WhatsApp</Link>
                <button onClick={() => setOpen(false)} className="mt-2 w-full py-2 text-sm font-medium text-neutral-600 hover:text-brand-700">Continue shopping</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
