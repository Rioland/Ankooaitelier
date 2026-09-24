import "dotenv/config";
import { db } from "../src/db";
import { categories, products, heroSlides, settings } from "../src/db/schema";
import { DEFAULT_SETTINGS } from "../src/lib/defaults";
import { slugify } from "../src/lib/utils";

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

async function main() {
  console.log("Seeding Ankoo…");

  await db.insert(settings).values({ id: 1, data: DEFAULT_SETTINGS }).onConflictDoNothing();

  const cats = [
    { name: "Dresses", description: "Everyday to occasion-ready silhouettes.", image: u("photo-1595777457583-95e059d581b8", 800) },
    { name: "Shirts & Tops", description: "Crisp shirts, tees and blouses.", image: u("photo-1596755094514-f87e34085b2c", 800) },
    { name: "Trousers & Jeans", description: "Tailored fits and easy denim.", image: u("photo-1624378439575-d8705ad7ae80", 800) },
    { name: "Native Wear", description: "Contemporary takes on classic Nigerian styles.", image: u("photo-1509631179647-0177331693ae", 800) },
    { name: "Shoes & Sneakers", description: "Step out in comfort and style.", image: u("photo-1542291026-7eec264c27ff", 800) },
    { name: "Bags & Accessories", description: "Finishing touches that complete a look.", image: u("photo-1584917865442-de89df76afd3", 800) },
  ];
  const insertedCats = await db
    .insert(categories)
    .values(cats.map((c, i) => ({ ...c, slug: slugify(c.name), sortOrder: i })))
    .onConflictDoNothing()
    .returning();
  const catId = (name: string) => insertedCats.find((c) => c.name === name)?.id ?? null;

  const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const shoeSizes = ["38", "39", "40", "41", "42", "43", "44", "45"];

  const items: Array<Omit<typeof products.$inferInsert, "slug">> = [
    { name: "Linen Wrap Midi Dress", price: 38500, compareAtPrice: 45000, categoryId: catId("Dresses"), gender: "women", images: [u("photo-1595777457583-95e059d581b8"), u("photo-1572804013309-59a88b7e92f1")], sizes: clothingSizes, colors: ["Sage", "Ivory"], stock: 24, featured: true },
    { name: "Pleated Satin Evening Dress", price: 52000, categoryId: catId("Dresses"), gender: "women", images: [u("photo-1539109136881-3be0616acf4b"), u("photo-1515886657613-9f3515b0c78f")], sizes: clothingSizes, colors: ["Emerald", "Black"], stock: 12, featured: true },
    { name: "Floral Sundress", price: 27000, compareAtPrice: 32000, categoryId: catId("Dresses"), gender: "women", images: [u("photo-1572804013309-59a88b7e92f1")], sizes: clothingSizes, colors: ["Floral"], stock: 30 },
    { name: "Oxford Cotton Shirt", price: 19500, categoryId: catId("Shirts & Tops"), gender: "men", images: [u("photo-1596755094514-f87e34085b2c"), u("photo-1602810318383-e386cc2a3ccf")], sizes: clothingSizes, colors: ["White", "Sky Blue"], stock: 40, featured: true },
    { name: "Essential Crew Tee", price: 9500, categoryId: catId("Shirts & Tops"), gender: "unisex", images: [u("photo-1521572163474-6864f9cf17ab"), u("photo-1618354691373-d851c5c3a990")], sizes: clothingSizes, colors: ["White", "Black", "Olive"], stock: 80 },
    { name: "Relaxed Knit Polo", price: 16500, compareAtPrice: 21000, categoryId: catId("Shirts & Tops"), gender: "men", images: [u("photo-1576566588028-4147f3842f27")], sizes: clothingSizes, colors: ["Forest", "Cream"], stock: 22 },
    { name: "Tailored Chino Trousers", price: 24000, categoryId: catId("Trousers & Jeans"), gender: "men", images: [u("photo-1624378439575-d8705ad7ae80")], sizes: ["30", "32", "34", "36", "38"], colors: ["Khaki", "Navy"], stock: 35, featured: true },
    { name: "High-Rise Straight Jeans", price: 26500, categoryId: catId("Trousers & Jeans"), gender: "women", images: [u("photo-1541099649105-f69ad21f3246")], sizes: ["26", "28", "30", "32"], colors: ["Mid Wash"], stock: 28 },
    { name: "Ankara Print Two-Piece", price: 45000, categoryId: catId("Native Wear"), gender: "women", images: [u("photo-1509631179647-0177331693ae")], sizes: clothingSizes, colors: ["Green Print"], stock: 10, featured: true },
    { name: "Classic Kaftan Set", price: 48000, compareAtPrice: 55000, categoryId: catId("Native Wear"), gender: "men", images: [u("photo-1617137968427-85924c800a22")], sizes: clothingSizes, colors: ["Emerald", "White"], stock: 14 },
    { name: "Everyday Runner Sneakers", price: 42000, categoryId: catId("Shoes & Sneakers"), gender: "unisex", images: [u("photo-1542291026-7eec264c27ff"), u("photo-1549298916-b41d501d3772")], sizes: shoeSizes, colors: ["Red", "White"], stock: 20, featured: true },
    { name: "Leather Penny Loafers", price: 58000, categoryId: catId("Shoes & Sneakers"), gender: "men", images: [u("photo-1614252235316-8c857d38b5f4")], sizes: shoeSizes, colors: ["Brown", "Black"], stock: 16 },
    { name: "Strappy Block Heels", price: 34000, compareAtPrice: 39000, categoryId: catId("Shoes & Sneakers"), gender: "women", images: [u("photo-1543163521-1bf539c55dd2")], sizes: ["36", "37", "38", "39", "40", "41"], colors: ["Nude", "Black"], stock: 18 },
    { name: "Structured Leather Tote", price: 49500, categoryId: catId("Bags & Accessories"), gender: "women", images: [u("photo-1584917865442-de89df76afd3"), u("photo-1548036328-c9fa89d128fa")], sizes: [], colors: ["Tan", "Black"], stock: 9, featured: true },
    { name: "Minimal Steel Watch", price: 65000, categoryId: catId("Bags & Accessories"), gender: "unisex", images: [u("photo-1524592094714-0f0654e20314")], sizes: [], colors: ["Silver"], stock: 7 },
    { name: "Round Sunglasses", price: 14500, compareAtPrice: 18000, categoryId: catId("Bags & Accessories"), gender: "unisex", images: [u("photo-1511499767150-a48a237f0083")], sizes: [], colors: ["Tortoise", "Black"], stock: 50 },
  ];

  await db
    .insert(products)
    .values(
      items.map((p) => ({
        ...p,
        slug: slugify(p.name),
        description:
          `The ${p.name} is designed for comfort and made to last. Carefully selected fabric, a considered fit and clean finishing make it an easy piece to style from day to night.\n\n• Premium, breathable materials\n• True to size — check the size guide if unsure\n• Care: gentle wash or wipe clean as appropriate`,
      }))
    )
    .onConflictDoNothing();

  const existingSlides = await db.select().from(heroSlides).limit(1);
  if (existingSlides.length === 0) {
    await db.insert(heroSlides).values([
      { eyebrow: "New Season", title: "Wear the moment.", subtitle: "Fresh arrivals for him and her — styled for Lagos heat and nights out.", image: u("photo-1483985988355-763728e1935b", 1920), ctaLabel: "Shop new in", ctaHref: "/shop?sort=new", sortOrder: 0 },
      { eyebrow: "Native Edit", title: "Heritage, reimagined.", subtitle: "Contemporary native wear for weddings, owambe and everything between.", image: u("photo-1509631179647-0177331693ae", 1920), ctaLabel: "Explore native wear", ctaHref: "/shop?category=native-wear", sortOrder: 1 },
      { eyebrow: "Order on WhatsApp", title: "Checkout in one message.", subtitle: "Add to bag, tap checkout, and we'll confirm your order on WhatsApp.", image: u("photo-1441986300917-64674bd600d8", 1920), ctaLabel: "Start shopping", ctaHref: "/shop", sortOrder: 2 },
    ]);
  }

  console.log("Done ✔");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
