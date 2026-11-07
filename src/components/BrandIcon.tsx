import { brands, type BrandName } from '../lib/brands';

// Monochrome brand mark drawn in currentColor so it takes the surrounding text tint.
// Renders nothing when the name is unknown, so a missing icon never breaks a chip.
export default function BrandIcon({ name, size = 16, className }: { name?: string; size?: number; className?: string }) {
  const icon = name ? brands[name as BrandName] : undefined;
  if (!icon) return null;
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}
