import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
try {
  const t = await sql`select table_name from information_schema.tables where table_schema='public' order by table_name`;
  console.log('TABLES:', t.map(r => r.table_name).join(', ') || '(none)');
  try {
    const p = await sql`select count(*)::int as n from products`;
    const c = await sql`select count(*)::int as n from categories`;
    const s = await sql`select count(*)::int as n from settings`;
    const h = await sql`select count(*)::int as n from hero_slides`;
    console.log('products:', p[0].n, '| categories:', c[0].n, '| settings:', s[0].n, '| hero_slides:', h[0].n);
  } catch(e){ console.log('COUNT ERROR:', e.message); }
} catch(e){ console.log('CONNECT/QUERY ERROR:', e.message); }
