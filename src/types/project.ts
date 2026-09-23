export type Project = {
  id: string;
  slug: string;
  name: string;
  location?: string;
  client?: string;
  year?: number;
  summary?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  scope: string[];
  published: boolean;
};
