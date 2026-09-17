-- Enable Row Level Security on all tables as defense-in-depth.
--
-- This application accesses the database through Prisma using a specific
-- database user (the postgres role or a dedicated app role). RLS policies
-- here serve as a safety net: if the connection string is ever leaked or
-- a SQL injection bypasses the ORM, these policies limit what can be done
-- via the Supabase anon and authenticated roles.
--
-- The application's own database user (typically postgres or a custom role)
-- is a superuser or has BYPASSRLS, so these policies do not affect normal
-- application operation through Prisma.

-- ─── Enable RLS ──────────────────────────────────────────────────────────────
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TechnicalSpec" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsArticle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactRequest" ENABLE ROW LEVEL SECURITY;

-- ─── Admin table: no access via anon/authenticated ──────────────────────────
-- The Admin table contains password hashes and must never be readable
-- through Supabase client libraries.

-- ─── Category: public read only ──────────────────────────────────────────────
CREATE POLICY "categories_public_read" ON "Category"
  FOR SELECT TO anon, authenticated
  USING (true);

-- ─── Product: public read for published only ─────────────────────────────────
CREATE POLICY "products_public_read" ON "Product"
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- ─── TechnicalSpec: public read via published product ────────────────────────
CREATE POLICY "specs_public_read" ON "TechnicalSpec"
  FOR SELECT TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM "Product" WHERE "Product".id = "TechnicalSpec"."productId" AND "Product".published = true
    )
  );

-- ─── NewsArticle: public read for published only ─────────────────────────────
CREATE POLICY "news_public_read" ON "NewsArticle"
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- ─── ContactRequest: no access via anon/authenticated ────────────────────────
-- Contact requests contain PII and must only be accessed through the
-- admin panel (server-side Prisma with auth guard).
