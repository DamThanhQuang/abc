import { contactPhones } from "@/config/site";
import { FloatingContactMenu } from "./FloatingContactMenu";

export function FloatingContactActions() {
  return (
    <aside
      aria-label="Liên hệ nhanh"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      <FloatingContactMenu channel="zalo" numbers={contactPhones} />
      <FloatingContactMenu channel="phone" numbers={contactPhones} />
    </aside>
  );
}
