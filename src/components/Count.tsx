import { animate, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Counts the leading number of a metric ("487", "45+", "1 MR") up from zero the
// first time it scrolls into view. Values without a leading number render as-is.
export default function Count({ value }: { value: string }) {
  const m = /^(\d+)(.*)$/.exec(value);
  const target = m ? Number(m[1]) : NaN;
  const rest = m ? m[2] : '';
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return;
    if (reduce) {
      setN(target);
      return;
    }
    const ctrl = animate(0, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => ctrl.stop();
  }, [inView, target, reduce]);

  if (Number.isNaN(target)) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {n}
      {rest}
    </span>
  );
}
