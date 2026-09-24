"use server";
import { db } from "@/db";
import { messages, orders, products, subscribers, type OrderItem } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { z } from "zod";
import { getSettings } from "@/lib/queries";
import { naira, orderRef } from "@/lib/utils";

type State = { ok?: boolean; error?: string } | null;

export async function subscribe(_: State, fd: FormData): Promise<State> {
  const email = z.string().email().safeParse(fd.get("email"));
  if (!email.success) return { error: "Please enter a valid email." };
  await db.insert(subscribers).values({ email: email.data.toLowerCase() }).onConflictDoNothing();
  return { ok: true };
}

export async function sendMessage(_: State, fd: FormData): Promise<State> {
  const parsed = z
    .object({ name: z.string().min(2), email: z.string().email(), phone: z.string().optional(), message: z.string().min(5) })
    .safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: "Please fill in your name, a valid email and a message." };
  await db.insert(messages).values(parsed.data);
  return { ok: true };
}

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5, "Enter your delivery address"),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Select your state"),
  note: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().int().min(1).max(50),
      size: z.string().optional(),
      color: z.string().optional(),
    })
  ).min(1, "Your bag is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Saves the order (with prices re-read from the DB) and returns a WhatsApp link with the order summary. */
export async function placeOrder(input: CheckoutInput): Promise<{ ok: true; reference: string; whatsappUrl: string } | { ok: false; error: string }> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid details" };
  const d = parsed.data;

  const rows = await db.select().from(products).where(inArray(products.id, d.items.map((i) => i.productId)));
  const items: OrderItem[] = [];
  for (const i of d.items) {
    const p = rows.find((r) => r.id === i.productId);
    if (!p || !p.active) return { ok: false, error: "An item in your bag is no longer available." };
    items.push({ productId: p.id, name: p.name, slug: p.slug, image: p.images[0] ?? "", price: p.price, quantity: i.quantity, size: i.size, color: i.color });
  }

  const s = await getSettings();
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const deliveryFee = s.freeShippingThreshold > 0 && subtotal >= s.freeShippingThreshold ? 0 : s.deliveryFee;
  const total = subtotal + deliveryFee;
  const reference = orderRef();

  await db.insert(orders).values({
    reference, customerName: d.customerName, phone: d.phone, email: d.email ?? "", address: d.address,
    city: d.city, state: d.state, note: d.note ?? "", items, subtotal, deliveryFee, total,
  });

  const lines = [
    `🛍️ *New order — ${s.storeName}*`,
    `Ref: *${reference}*`,
    ``,
    ...items.map((i, k) => `${k + 1}. ${i.name}${i.size ? ` (Size ${i.size})` : ""}${i.color ? ` – ${i.color}` : ""} × ${i.quantity} = ${naira(i.price * i.quantity)}`),
    ``,
    `Subtotal: ${naira(subtotal)}`,
    `Delivery: ${deliveryFee === 0 ? "FREE" : naira(deliveryFee)}`,
    `*Total: ${naira(total)}*`,
    ``,
    `👤 ${d.customerName}`,
    `📞 ${d.phone}`,
    `📍 ${d.address}, ${d.city}, ${d.state}`,
    d.note ? `📝 ${d.note}` : "",
  ].filter((l, idx, arr) => !(l === "" && arr[idx - 1] === ""));

  const whatsappUrl = `https://wa.me/${s.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  return { ok: true, reference, whatsappUrl };
}
