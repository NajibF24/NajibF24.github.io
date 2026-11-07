import { motion, useScroll, useSpring } from 'framer-motion';

// One-pixel reading-position line along the top edge.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}
