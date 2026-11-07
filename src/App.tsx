import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { nav, person } from './content';
import { detectTier, hasWebGL, prefersReducedMotion, type Tier } from './lib/device';
import ScrollProgress from './components/ScrollProgress';
import Hero from './sections/Hero';
import { About, Contact, Experience, Platform, Projects, Skills } from './sections/Sections';

const Scene = lazy(() => import('./scene/Scene'));

export default function App() {
  const [tier, setTier] = useState<Tier | null>(null);
  const webgl = useMemo(() => hasWebGL(), []);
  const reduce = useMemo(() => prefersReducedMotion(), []);

  // Mount the 3D scene after first paint so the hero text is readable immediately.
  useEffect(() => {
    if (!webgl) return;
    const id = window.setTimeout(() => setTier(detectTier()), 50);
    return () => window.clearTimeout(id);
  }, [webgl]);

  return (
    <>
      {webgl && tier ? (
        <Suspense fallback={null}>
          <Scene tier={tier} animate={!reduce} />
        </Suspense>
      ) : (
        <div className="scene scene-fallback" aria-hidden="true" />
      )}
      <div className="veil" aria-hidden="true" />
      <ScrollProgress />

      <nav className="nav" aria-label="Sections">
        <a href="#top" className="nav-name">
          {person.shortName}
        </a>
        <ul>
          {nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`}>{n.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <Hero />
        <About />
        <Platform />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
