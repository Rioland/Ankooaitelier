# Ankooaitelier — E-commerce storefront

Next.js 15 (App Router) · Tailwind CSS v4 · Framer Motion · Drizzle ORM · Neon Postgres

Animated hero slider, shop by category / size, product filters and search, product gallery with size and colour selection, cart drawer, checkout that saves the order and opens WhatsApp with the full order summary, plus About / Contact / FAQ pages and a newsletter signup.

The admin panel is a separate project (`ankoo-admin`) that is deployed on its own and uses the same database. This project owns the database schema and sample data.

---

## Deploy on Vercel with Neon

1. **Push this folder to GitHub**, then in Vercel choose **Add New → Project** and import the repo.
2. **Connect Neon:** go to Project → **Storage** → **Create Database** → **Neon** → connect it to the project. This adds `DATABASE_URL` for you.
3. **Create a Blob store** (Storage → Create → Blob). The storefront doesn't use it directly; connect it to the **admin** project so product images uploaded there get public URLs.
4. **Add environment variables** (Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://ankoo.vercel.app`
5. **Create the tables and sample data** (run once from your computer):
   ```bash
   npm install
   npx vercel env pull .env      # or paste DATABASE_URL into .env yourself
   npm run db:push               # creates tables in Neon
   npm run db:seed               # optional: sample categories, products and hero slides
   ```
6. **Redeploy**, then deploy the admin project, sign in there and go to **Settings** to put in your real **WhatsApp number** (e.g. `2348012345678`).

## Local development

```bash
cp .env.example .env   # fill in DATABASE_URL (Neon or any Postgres)
npm install
npm run db:push && npm run db:seed
npm run dev            # http://localhost:3000
```
If the URL isn't a Neon URL, the app uses a normal Postgres driver, so a local Postgres works too.

## Where things live
- `src/db/schema.ts`: database tables. The admin project has a copy; if you change the schema, change it in both.
- `src/app/(store)`: storefront pages
- `src/components`: UI
- `scripts/seed.ts`: sample data. The seeded images are Unsplash placeholders; swap them for your own product photos in the admin.
