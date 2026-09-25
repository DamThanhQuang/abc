-- AddHeroSlide
CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "blurDataUrl" TEXT,
    "focus" TEXT NOT NULL DEFAULT 'right',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HeroSlide_published_sortOrder_idx" ON "HeroSlide"("published", "sortOrder");

-- Bật RLS như các bảng khác (xem 0003_enable_rls).
ALTER TABLE "HeroSlide" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hero_slides_public_read" ON "HeroSlide"
  FOR SELECT TO anon, authenticated
  USING (published = true);

-- Chuyển 4 ảnh banner đang viết cứng trong HeroSection vào bảng, để trang chủ
-- không đổi sau khi triển khai và admin quản lý được cả các ảnh này.
INSERT INTO "HeroSlide" ("id", "image", "imageAlt", "blurDataUrl", "focus", "sortOrder", "published", "updatedAt") VALUES
  ('cmheroslide0default00001', '/images/hero-fuel-station-clean.png', 'Trạm xăng dầu được trang bị thiết bị của Ánh Sáng Toàn Cầu', 'data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAABQBACdASoYAA4ALplotFoiqCgoCACYS2AE6ZQjuALPiiqBU9bt15T4GW8AAP3wfwC0qOgpJkfztyKQBm5WBPyuj1TmNc3R0yJaNK1E8EdWXXpX5x/SHxD7f9MuQfYDBxUYITo5m0pNuZCFXcKXNFR8PNarznuPAORusEotiVoTjmh6rqwla6XrHFE4wpbpgNOm2Ps4DjsXbKxwYZ/kSewbdDAAAA==', 'right', 0, true, CURRENT_TIMESTAMP),
  ('cmheroslide0default00002', '/images/home/astc-fuel-station.png', 'Cột bơm và thiết bị đo tại trạm xăng dầu', 'data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAADQBACdASoYAA0APtFUo0uoJKMhsAgBABoJbACdMoRwAdCJAk8Kq7cZiZeYpUalMADgLuMof3lmv3HK2ckOPdoP455KS3Etuxv9cNqSIZodo8YWrsqyt4fSG7joYFkGhDXhrtx+ETleHkV4ge9amDmRFjrcQbn1IIsi/uJBths3Tew2j6jO0L8X8FIjMhiZH+And9MPpOz9KsLTOhOA08rkS0LphgG7MNFbXfgTUPwP898NyDsWgxTAdyKjB03PuzRwURq7mAt0pvhgAAA=', 'right', 1, true, CURRENT_TIMESTAMP),
  ('cmheroslide0default00003', '/images/home/astc-smart-tank.png', 'Hệ thống đo bồn tự động', 'data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADQAwCdASoYAA0APtFUo0uoJKMhsAgBABoJQBOgBFK/gDPvCKUcVcAA/u41lrIPquevSCWgOePQxFkaBA5WciIvK1blU4Q1Aozqa1YMwO9aSQveSWB5Zhcvs5RQeC6d1AD9PH4OIJXm0I7WtQkAAA==', 'right', 2, true, CURRENT_TIMESTAMP),
  ('cmheroslide0default00004', '/images/home/astc-installation-technician.png', 'Kỹ thuật viên lắp đặt thiết bị tại trạm', 'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAADQBACdASoYAAoAPtFUo0uoJKMhsAgBABoJYgCdMoR3AdCg88ybH5+sikM2T7v2AAD+tCmK9J/K+s9qxD2v5EVcn4sdK4DApvEsWW17jLWYzeUhFe9qvM1Os274r58+fVLf1kWwCazz5HkIQK/IZeL5W9SQnvQgipo9ob6grUgw4jNT8HODGU5v1n0T5cmheaOQAA==', 'right', 3, true, CURRENT_TIMESTAMP);
