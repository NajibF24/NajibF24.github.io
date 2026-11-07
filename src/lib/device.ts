export type Tier = 'high' | 'mid' | 'low';

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Scene budget by device class. Integrated GPUs and phones get fewer particles,
// which keeps the loop near 60 fps instead of looking impressive at 20 fps.
export function detectTier(): Tier {
  const cores = navigator.hardwareConcurrency || 4;
  const mobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent) || window.innerWidth < 720;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (mobile || cores <= 4 || (memory !== undefined && memory <= 4)) return 'low';
  if (cores <= 8) return 'mid';
  return 'high';
}

export const BUDGET: Record<Tier, { nodesPerCluster: number; packets: number; dust: number; dpr: number }> = {
  high: { nodesPerCluster: 44, packets: 110, dust: 5500, dpr: 1.5 },
  mid: { nodesPerCluster: 36, packets: 80, dust: 4000, dpr: 1.25 },
  low: { nodesPerCluster: 24, packets: 40, dust: 2500, dpr: 1 },
};
