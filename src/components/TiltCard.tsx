import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent, ReactNode } from 'react';

// 3D tilt that follows the pointer; the glare follows the same point so the
// card reads as a lit surface rather than a flat box rotating.
export default function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 180, damping: 22 });
  const sy = useSpring(py, { stiffness: 180, damping: 22 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const glareOpacity = useMotionValue(0);
  const glare = useTransform([sx, sy], ([x, y]) => `radial-gradient(circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(95,227,255,0.16), transparent 55%)`);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    glareOpacity.set(1);
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    glareOpacity.set(0);
    px.set(0.5);
    py.set(0.5);
  };

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div className="tilt-glare" style={{ background: glare, opacity: glareOpacity }} aria-hidden="true" />
      {children}
    </motion.div>
  );
}
