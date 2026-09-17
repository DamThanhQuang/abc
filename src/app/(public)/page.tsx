import { HeroSection }       from "@/components/public/home/HeroSection";
import { ProductLineup }     from "@/components/public/home/ProductLineup";
import { FeaturedProducts }  from "@/components/public/home/FeaturedProducts";
import { FeaturesGrid }      from "@/components/public/home/FeaturesGrid";
import { getProducts }       from "@/lib/api/products";

export default async function HomePage() {
  const allProducts = await getProducts();
  const products = allProducts.slice(0, 3);

  return (
    <>
      {/* 1 — Hero */}
      <HeroSection />

      {/* 2 — Product lineup */}
      <ProductLineup />

      {/* 3 — Featured Products */}
      <FeaturedProducts products={products} />

      {/* 4 — Features bento grid */}
      <FeaturesGrid />
    </>
  );
}
