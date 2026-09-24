# Ankoo — E-commerce store + admin

Next.js 15 (App Router) · Tailwind CSS v4 · Framer Motion · Drizzle ORM · Neon Postgres · Vercel Blob

**Storefront:** animated hero slider, shop by category / size, product filters and search, product gallery with size and colour selection, cart drawer, checkout that saves the order and opens WhatsApp with the full order summary, plus About / Contact / FAQ pages and a newsletter signup.

**Admin (`/admin`):** dashboard with revenue and a 14-day sales chart, orders (status tracking, WhatsApp the customer), products (create/edit, drag-to-reorder image upload, stock, featured/visible toggles), categories, hero slides, messages and subscribers, and store settings (WhatsApp number, delivery fee, free-delivery threshold, socials, announcement bar).

---

## Deploy on Vercel with Neon

1. **Push this folder to GitHub**, then in Vercel choose **Add New → Project** and import the repo.
2. **Connect Neon:** go to Project → **Storage** → **Create Database** → **Neon** → connect it to the project. This adds `DATABASE_URL` for you.
3. **Connect Blob (for image uploads):** go to **Storage** → **Create** → **Blob** → connect it. This adds `BLOB_READ_WRITE_TOKEN`.
4. **Add environment variables** (Settings → Environment Variables):
   - `ADMIN_EMAIL`: your admin login email
   - `ADMIN_PASSWORD`: a strong password (a bcrypt hash also works)
   - `AUTH_SECRET`: a long random string (`openssl rand -base64 32`)
   - `NEXT_PUBLIC_SITE_URL`: e.g. `https://ankoo.vercel.app`
5. **Create the tables and sample data** (run once from your computer):
   ```bash
   npm install
   npx vercel env pull .env      # or paste DATABASE_URL into .env yourself
   npm run db:push               # creates tables in Neon
   npm run db:seed               # optional: sample categories, products and hero slides
   ```
6. **Redeploy**, open `/admin/login`, then go to **Settings** and put in your real **WhatsApp number** (e.g. `2348012345678`).

## Local development

```bash
cp .env.example .env   # fill in DATABASE_URL (Neon or any Postgres)
npm install
npm run db:push && npm run db:seed
npm run dev            # http://localhost:3000  ·  admin at /admin
```
If the URL isn't a Neon URL, the app uses a normal Postgres driver, so a local Postgres works too. Without a Blob token, uploads made in dev are saved to `public/uploads`.

## Where things live
- `src/db/schema.ts`: database tables
- `src/app/(store)`: storefront pages
- `src/app/admin`: admin pages and server actions
- `src/components`: UI (store and admin)
- `scripts/seed.ts`: sample data. The seeded images are Unsplash placeholders; swap them for your own product photos in the admin.
