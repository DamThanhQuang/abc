// Dùng chung giữa nút Zalo (server component) và nút gọi điện (client component).
export const floatingButtonClass =
  "group relative isolate flex size-13 items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(0,53,95,0.28)] ring-4 transition-colors duration-200 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:size-14";

export const floatingTooltipClass =
  "pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-content-heading px-3 py-2 font-sans text-[12px] font-medium leading-4 text-white opacity-0 shadow-lg motion-safe:translate-x-2 motion-safe:transition-[opacity,transform] group-hover:opacity-100 motion-safe:group-hover:translate-x-0 group-focus-visible:opacity-100 motion-safe:group-focus-visible:translate-x-0 sm:block";
