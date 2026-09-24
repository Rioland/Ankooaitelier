import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { getCategories, getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [s, cats] = await Promise.all([getSettings(), getCategories().catch(() => [])]);
  const catLinks = cats.map((c) => ({ name: c.name, slug: c.slug }));
  return (
    <>
      <Header storeName={s.storeName} announcement={s.announcement} categories={catLinks} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer s={s} categories={catLinks} />
      <CartDrawer freeShippingThreshold={s.freeShippingThreshold} />
      <WhatsAppButton number={s.whatsappNumber} />
    </>
  );
}
