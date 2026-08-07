/**
 * Crosshair precision logo mark — used in SiteHeader and SiteFooter.
 * Accepts size prop to scale (default 21px, matches Figma).
 */
export function LogoMark({ size = 21 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="9.5" stroke="#0f4c81" strokeWidth="2" />
      <circle cx="10.5" cy="10.5" r="4" fill="#0f4c81" />
      <line x1="10.5" y1="1"  x2="10.5" y2="5"  stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10.5" y1="16" x2="10.5" y2="20" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1"    y1="10.5" x2="5"  y2="10.5" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16"   y1="10.5" x2="20" y2="10.5" stroke="#0f4c81" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
