import { SiteHeader } from "@/components/public/layout/SiteHeader";
import { SiteFooter } from "@/components/public/layout/SiteFooter";
import { FloatingContactActions } from "@/components/public/layout/FloatingContactActions";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingContactActions />
    </>
  );
}
