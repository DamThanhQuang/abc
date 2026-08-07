export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug?: string;
  model?: string;
  spec?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  // Extended fields for detail page — populated in mock data
  features?: string[];
  technicalSpecs?: { label: string; value: string }[];
};
