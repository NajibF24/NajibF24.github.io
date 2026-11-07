import { motion, useReducedMotion } from 'framer-motion';
import { EMAIL, person } from '../content';

const lines = person.name.split(' ');

export default function Hero() {
  const reduce = useReducedMotion();
  const anim = (i: number) =>
    reduce
      ? {}
      : {
          initial: { y: '110%', opacity: 0 },
          animate: { y: '0%', opacity: 1 },
          transition: { duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <motion.p className="hero-kicker" {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.05, duration: 0.6 } })}>
          {person.headline}
          <br />
          {person.location}
        </motion.p>
        <h1 className="hero-name" aria-label={person.name}>
          {lines.map((word, i) => (
            <span className="hero-line" key={word} aria-hidden="true">
              <motion.span className="hero-word" {...anim(i)}>
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p className="hero-tagline" {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.7, duration: 0.8 } })}>
          {person.tagline}
        </motion.p>
        <motion.div className="hero-cta" {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.9, duration: 0.8 } })}>
          <a className="btn btn-primary" href="#platform">
            See the platform
          </a>
          <a className="btn" href={`mailto:${EMAIL}`}>
            Email me
          </a>
        </motion.div>
      </div>
      <div className="hero-scroll" aria-hidden="true">
        <span />
        Scroll
      </div>
    </section>
  );
}
