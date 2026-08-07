export type ContactRequest = {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  createdAt: string; // ISO date
};
