import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// One reveal treatment for the whole site: a short clip-wipe on headings and a
// plain fade on bodies. Disabled entirely when the visitor prefers reduced motion.
//
// The wipe is applied to an inner element: a clip-path on the observed element
// itself shrinks its intersection rect to zero, so IntersectionObserver would
// never report it as visible.
export function Wipe({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -10% 0px' }}>
      <motion.div
        variants={{
          hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
          show: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transitionEnd: { clipPath: 'none' } },
        }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Fade({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}
