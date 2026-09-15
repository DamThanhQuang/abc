export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  category: { id: string; slug: string; name: string };
  model?: string;
  spec?: string;
  description?: string;
  image: string;
  images: string[];
  imageAlt?: string;
  features?: string[];
  technicalSpecs?: { label: string; value: string }[];
  published: boolean;
};
