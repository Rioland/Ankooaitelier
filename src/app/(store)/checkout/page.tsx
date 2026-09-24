import type { Metadata } from "next";
import CheckoutForm from "@/components/store/CheckoutForm";
import { getSettings } from "@/lib/queries";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const s = await getSettings();
  return (
    <div className="container-x py-12">
      <h1 className="mb-2 font-display text-5xl font-medium tracking-tight">Checkout</h1>
      <p className="mb-10 text-neutral-600">Fill in your details — your order will be sent to us on WhatsApp for confirmation.</p>
      <CheckoutForm deliveryFee={s.deliveryFee} freeShippingThreshold={s.freeShippingThreshold} />
    </div>
  );
}
