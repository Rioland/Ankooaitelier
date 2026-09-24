import "server-only";
import { db } from "@/db";
import { categories, products, heroSlides, settings, type StoreSettings } from "@/db/schema";
import { and, asc, desc, eq, gte, ilike, lte, or, sql, arrayContains, type SQL } from "drizzle-orm";
import { DEFAULT_SETTINGS } from "./defaults";
import { cache } from "react";

export const getSettings = cache(async (): Promise<StoreSettings> => {
  try {
    const row = await db.query.settings.findFirst({ where: eq(settings.id, 1) });
    return { ...DEFAULT_SETTINGS, ...(row?.data ?? {}) };
  } catch (e) {
    console.error("getSettings failed", e);
    return DEFAULT_SETTINGS;
  }
});

export const getCategories = cache(async () =>
  db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name))
);

export const getHeroSlides = async () =>
  db.select().from(heroSlides).where(eq(heroSlides.active, true)).orderBy(asc(heroSlides.sortOrder));

export type ShopFilters = {
  q?: string;
  category?: string;
  gender?: string;
  size?: string;
  min?: string;
  max?: string;
  sort?: string;
  sale?: string;
};

export async function getProducts(f: ShopFilters = {}, limit = 60) {
  const where: SQL[] = [eq(products.active, true)];
  if (f.q) {
    const term = `%${f.q}%`;
    where.push(or(ilike(products.name, term), ilike(products.description, term))!);
  }
  if (f.category) {
    const cat = await db.query.categories.findFirst({ where: eq(categories.slug, f.category) });
    if (cat) where.push(eq(products.categoryId, cat.id));
  }
  if (f.gender === "men" || f.gender === "women") {
    where.push(or(eq(products.gender, f.gender), eq(products.gender, "unisex"))!);
  }
  if (f.size) where.push(arrayContains(products.sizes, [f.size]));
  if (f.min) where.push(gte(products.price, Number(f.min)));
  if (f.max) where.push(lte(products.price, Number(f.max)));
  if (f.sale) where.push(sql`${products.compareAtPrice} > ${products.price}`);

  const order =
    f.sort === "price-asc" ? asc(products.price)
    : f.sort === "price-desc" ? desc(products.price)
    : f.sort === "name" ? asc(products.name)
    : desc(products.createdAt);

  return db.query.products.findMany({
    where: and(...where),
    orderBy: order,
    limit,
    with: { category: true },
  });
}

export const getFeaturedProducts = (limit = 8) =>
  db.query.products.findMany({
    where: and(eq(products.active, true), eq(products.featured, true)),
    orderBy: desc(products.createdAt),
    limit,
    with: { category: true },
  });

export const getNewArrivals = (limit = 8) =>
  db.query.products.findMany({
    where: and(eq(products.active, true), eq(products.isNew, true)),
    orderBy: desc(products.createdAt),
    limit,
    with: { category: true },
  });

export const getProductBySlug = (slug: string) =>
  db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.active, true)),
    with: { category: true },
  });

export const getRelated = (categoryId: number | null, excludeId: number) =>
  db.query.products.findMany({
    where: and(
      eq(products.active, true),
      categoryId ? eq(products.categoryId, categoryId) : undefined,
      sql`${products.id} <> ${excludeId}`
    ),
    limit: 4,
    orderBy: desc(products.createdAt),
    with: { category: true },
  });

export type ProductWithCategory = Awaited<ReturnType<typeof getProducts>>[number];
