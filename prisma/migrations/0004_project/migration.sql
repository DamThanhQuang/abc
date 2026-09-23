-- AddProject
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "client" TEXT,
    "year" INTEGER,
    "summary" TEXT,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT,
    "scope" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- Bảng mới phải bật RLS như các bảng trong 0003_enable_rls, nếu không nó sẽ là
-- bảng duy nhất đọc được tự do qua Supabase anon key.
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read" ON "Project"
  FOR SELECT TO anon, authenticated
  USING (published = true);
