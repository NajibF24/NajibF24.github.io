import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BUDGET, type Tier } from '../lib/device';

const CYAN = new THREE.Color('#5fe3ff');
const AMBER = new THREE.Color('#ffb347');
const DIM = new THREE.Color('#1f5c6b');

// Four clusters: dev, staging, production, DR. Laid out as a loose arc so the
// camera can orbit through them while the page scrolls.
const CENTERS = [
  new THREE.Vector3(-5.2, 1.2, -1.5),
  new THREE.Vector3(-1.6, -1.4, 1.2),
  new THREE.Vector3(2.4, 1.0, -0.6),
  new THREE.Vector3(5.6, -1.2, 1.6),
];
const RADII = [2.0, 1.8, 2.3, 1.5];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Graph = {
  nodes: THREE.Vector3[];
  edges: [number, number][];
  nodeCluster: number[];
};

function buildGraph(perCluster: number): Graph {
  const rand = mulberry32(20251107);
  const nodes: THREE.Vector3[] = [];
  const nodeCluster: number[] = [];
  CENTERS.forEach((c, ci) => {
    for (let i = 0; i < perCluster; i++) {
      // uniform-ish inside a squashed sphere
      const u = rand() * 2 - 1;
      const phi = rand() * Math.PI * 2;
      const r = Math.cbrt(rand()) * RADII[ci];
      const s = Math.sqrt(1 - u * u);
      nodes.push(new THREE.Vector3(c.x + r * s * Math.cos(phi), c.y + r * u * 0.7, c.z + r * s * Math.sin(phi)));
      nodeCluster.push(ci);
    }
  });
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  const add = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a !== b && !seen.has(k)) {
      seen.add(k);
      edges.push([a, b]);
    }
  };
  // each node links to its 2 nearest neighbours in the same cluster
  for (let i = 0; i < nodes.length; i++) {
    const ci = nodeCluster[i];
    const start = ci * perCluster;
    const cand: { j: number; d: number }[] = [];
    for (let j = start; j < start + perCluster; j++) {
      if (j === i) continue;
      cand.push({ j, d: nodes[i].distanceToSquared(nodes[j]) });
    }
    cand.sort((a, b) => a.d - b.d);
    add(i, cand[0].j);
    add(i, cand[1].j);
  }
  // promotion edges dev -> staging -> prod -> DR
  for (let ci = 0; ci < CENTERS.length - 1; ci++) {
    for (let k = 0; k < 5; k++) {
      const a = ci * perCluster + Math.floor(rand() * perCluster);
      const b = (ci + 1) * perCluster + Math.floor(rand() * perCluster);
      add(a, b);
    }
  }
  return { nodes, edges, nodeCluster };
}

function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export type SceneInput = {
  scroll: React.MutableRefObject<number>; // 0..1 page progress
  mouse: React.MutableRefObject<{ x: number; y: number }>; // -1..1
  animate: boolean;
};

export default function Cluster({ tier, scroll, mouse, animate }: SceneInput & { tier: Tier }) {
  const budget = BUDGET[tier];
  const graph = useMemo(() => buildGraph(budget.nodesPerCluster), [budget.nodesPerCluster]);
  const glow = useMemo(() => makeGlowTexture(), []);
  const { camera } = useThree();

  const group = useRef<THREE.Group>(null);
  const nodeMesh = useRef<THREE.InstancedMesh>(null);
  const packetMesh = useRef<THREE.InstancedMesh>(null);
  const dustRef = useRef<THREE.Points>(null);

  // --- static buffers -------------------------------------------------------
  const edgePositions = useMemo(() => {
    const arr = new Float32Array(graph.edges.length * 6);
    graph.edges.forEach(([a, b], i) => {
      graph.nodes[a].toArray(arr, i * 6);
      graph.nodes[b].toArray(arr, i * 6 + 3);
    });
    return arr;
  }, [graph]);

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(graph.nodes.length * 3);
    graph.nodes.forEach((n, i) => n.toArray(arr, i * 3));
    return arr;
  }, [graph]);

  const dust = useMemo(() => {
    const rand = mulberry32(7);
    const arr = new Float32Array(budget.dust * 3);
    for (let i = 0; i < budget.dust; i++) {
      arr[i * 3] = (rand() - 0.5) * 34;
      arr[i * 3 + 1] = (rand() - 0.5) * 18;
      arr[i * 3 + 2] = (rand() - 0.5) * 20;
    }
    return arr;
  }, [budget.dust]);

  // packets: which edge, progress, speed, direction, colour
  const packets = useMemo(() => {
    const rand = mulberry32(99);
    return Array.from({ length: budget.packets }, () => ({
      edge: Math.floor(rand() * graph.edges.length),
      t: rand(),
      speed: 0.25 + rand() * 0.5,
      dir: rand() > 0.5 ? 1 : -1,
      amber: rand() < 0.18,
    }));
  }, [budget.packets, graph.edges.length]);

  // --- instance setup --------------------------------------------------------
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const setupDone = useRef(false);
  const initInstances = () => {
    if (setupDone.current || !nodeMesh.current || !packetMesh.current) return;
    setupDone.current = true;
    graph.nodes.forEach((n, i) => {
      dummy.position.copy(n);
      const hub = i % 9 === 0;
      dummy.scale.setScalar(hub ? 0.08 : 0.042);
      dummy.updateMatrix();
      nodeMesh.current!.setMatrixAt(i, dummy.matrix);
      nodeMesh.current!.setColorAt(i, hub ? CYAN : DIM);
    });
    nodeMesh.current.instanceMatrix.needsUpdate = true;
    if (nodeMesh.current.instanceColor) nodeMesh.current.instanceColor.needsUpdate = true;
    packets.forEach((p, i) => packetMesh.current!.setColorAt(i, p.amber ? AMBER : CYAN));
    if (packetMesh.current.instanceColor) packetMesh.current.instanceColor.needsUpdate = true;
  };

  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    initInstances();
    const dt = Math.min(delta, 0.05);
    const s = scroll.current;
    const g = group.current;
    if (!g) return;

    // Scene drifts slowly on its own; scroll orbits the camera through the arc
    // of clusters; the mouse adds a small parallax. Everything is lerped so
    // input never snaps.
    const driftT = animate ? performance.now() * 0.00004 : 0;
    const targetRotY = driftT + s * Math.PI * 0.55 + mouse.current.x * 0.12;
    const targetRotX = -0.08 + mouse.current.y * 0.08 + s * 0.18;
    g.rotation.y += (targetRotY - g.rotation.y) * (animate ? 0.06 : 1);
    g.rotation.x += (targetRotX - g.rotation.x) * (animate ? 0.06 : 1);

    // Hero: clusters sit to the right of the name. Later sections: pull back
    // and centre so the text panels read over a quieter field.
    const heroX = window.innerWidth > 900 ? 3.2 : 0;
    camTarget.set(heroX * (1 - Math.min(1, s * 3)), 0.4 - s * 1.2, 12.5 - Math.sin(s * Math.PI) * 1.5 + s * 4);
    camera.position.lerp(camTarget, animate ? 0.05 : 1);
    lookAt.set(camTarget.x * 0.6, 0, 0);
    camera.lookAt(lookAt);

    if (!animate) return;

    // Packets travel along edges
    const pm = packetMesh.current;
    if (pm) {
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        p.t += dt * p.speed * p.dir;
        if (p.t > 1 || p.t < 0) {
          // hop to another edge that shares the node we arrived at
          const [a, b] = graph.edges[p.edge];
          const arrived = p.t > 1 ? b : a;
          let next = p.edge;
          for (let tries = 0; tries < 6; tries++) {
            const cand = Math.floor(Math.random() * graph.edges.length);
            if (graph.edges[cand][0] === arrived || graph.edges[cand][1] === arrived) {
              next = cand;
              break;
            }
          }
          p.edge = next;
          p.dir = graph.edges[next][0] === arrived ? 1 : -1;
          p.t = p.dir === 1 ? 0 : 1;
        }
        const [a, b] = graph.edges[p.edge];
        tmpA.copy(graph.nodes[a]);
        tmpB.copy(graph.nodes[b]);
        dummy.position.lerpVectors(tmpA, tmpB, p.t);
        dummy.scale.setScalar(p.amber ? 0.045 : 0.032);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      }
      pm.instanceMatrix.needsUpdate = true;
    }

    if (dustRef.current) {
      dustRef.current.rotation.y += dt * 0.012;
      dustRef.current.rotation.z += dt * 0.004;
    }
  });

  return (
    <>
      <points ref={dustRef} position={[0, 0, -4]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#6fb4c8" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>

      <group ref={group}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#2a8ca3" transparent opacity={0.28} depthWrite={false} />
        </lineSegments>

        <instancedMesh ref={nodeMesh} args={[undefined, undefined, graph.nodes.length]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>

        {/* additive halos give the glow without a bloom pass */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={glow}
            size={14}
            color="#39c6e6"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation={false}
          />
        </points>

        <instancedMesh ref={packetMesh} args={[undefined, undefined, packets.length]} frustumCulled={false}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </>
  );
}
