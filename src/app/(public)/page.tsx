import { HeroSection }       from "@/components/public/home/HeroSection";
import { AboutUsIntro }      from "@/components/public/home/AboutUsIntro";
import { FeaturedProducts }  from "@/components/public/home/FeaturedProducts";
import { FeaturesGrid }      from "@/components/public/home/FeaturesGrid";
import { getProducts }       from "@/lib/api/products";

export default async function HomePage() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 3);

  return (
    <>
      {/* 1 — Hero */}
      <HeroSection imageSrc="/images/hero-bg.svg" />

      {/* 2 — About Us Intro */}
      <AboutUsIntro />

      {/* 3 — Featured Products */}
      <FeaturedProducts products={products} />

      {/* 4 — Features bento grid */}
      <FeaturesGrid />
    </>
  );
}
