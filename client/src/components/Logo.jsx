// Decorative emblem: the visible text next to it already names the site, so it is hidden from assistive technology.
export default function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="12" fill="#d4a937" />
      <path d="M12 22h40v26a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4z" fill="#0b2545" />
      <path d="m12 24 20 14 20-14" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
