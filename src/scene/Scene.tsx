import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Cluster from './Cluster';
import { BUDGET, type Tier } from '../lib/device';

type Props = { tier: Tier; animate: boolean };

// Fixed full-screen canvas behind the page. The render loop stops when the
// tab is hidden and renders a single frame when the visitor prefers reduced motion.
export default function Scene({ tier, animate }: Props) {
  const scroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(document.visibilityState === 'visible');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onVis = () => setVisible(document.visibilityState === 'visible');
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const frameloop = !visible ? 'never' : animate ? 'always' : 'demand';

  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, BUDGET[tier].dpr]}
        camera={{ fov: 42, near: 0.1, far: 80, position: [3.2, 0.4, 12.5] }}
        gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: true, stencil: false }}
      >
        <Cluster tier={tier} scroll={scroll} mouse={mouse} animate={animate} />
      </Canvas>
    </div>
  );
}
