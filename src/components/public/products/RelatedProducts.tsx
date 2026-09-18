import { ProductCard } from "./ProductCard";
import { getRelatedProducts } from "@/lib/api/products";

type RelatedProductsProps = {
  productId: string;
  categoryId: string;
};

export async function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const related = await getRelatedProducts(productId, categoryId);
  if (related.length === 0) return null;

  return (
    <section className="mt-12 lg:mt-20 border-t border-border-ui pt-10 lg:pt-14">
      <h2 className="mb-6 lg:mb-8 font-heading font-semibold text-[20px] lg:text-[24px] leading-8 text-content-heading">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} variant="catalog" />
        ))}
      </div>
    </section>
  );
}
