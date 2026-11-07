import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { platform } from '../content';
import { brandFor, brands, type BrandName } from '../lib/brands';
import BrandIcon from './BrandIcon';

const BOX_W = 140;
const BOX_H = 70;
const BOX_Y = 60;
const STEP = 200;
const X0 = 20;
const MID = BOX_Y + BOX_H / 2;
const CLUSTER_X = 1040;
const CLUSTER_Y = [40, 108, 176, 244];

function Packets({ d, count, dur, amber = false }: { d: string; count: number; dur: number; amber?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} r={amber ? 4 : 3.2} className={amber ? 'pk pk-amber' : 'pk'}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${(-dur * i) / count}s`} path={d} />
        </circle>
      ))}
    </>
  );
}

export default function PlatformDiagram() {
  const [active, setActive] = useState(platform.stages[1].id);
  const reduce = useReducedMotion();
  const current = platform.stages.find((s) => s.id === active)!;
  const lastRight = X0 + 4 * STEP + BOX_W;

  return (
    <div className="diagram">
      <svg viewBox="0 0 1180 300" className="diagram-svg" role="img" aria-label="Pipeline from GitLab through CI scanning, Harbor, ArgoCD to Kubernetes clusters">
        {/* connectors between stages, each with a gate marker in the middle */}
        {platform.stages.slice(0, -1).map((s, i) => {
          const x1 = X0 + i * STEP + BOX_W;
          const x2 = X0 + (i + 1) * STEP;
          const d = `M${x1},${MID} L${x2},${MID}`;
          const gx = (x1 + x2) / 2;
          return (
            <g key={s.id}>
              <path d={d} className="dg-link" />
              <path d={`M${gx},${MID - 9} L${gx + 7},${MID} L${gx},${MID + 9} L${gx - 7},${MID} Z`} className="dg-gate" />
              {!reduce && <Packets d={d} count={3} dur={2.6} />}
            </g>
          );
        })}

        {/* fan-out from Kubernetes to the four clusters */}
        {platform.clusters.map((c, i) => {
          const y = CLUSTER_Y[i];
          const d = `M${lastRight},${MID} C${lastRight + 40},${MID} ${CLUSTER_X - 50},${y} ${CLUSTER_X - 8},${y}`;
          return (
            <g key={c.name}>
              <path d={d} className="dg-link" />
              {!reduce && <Packets d={d} count={2} dur={3.2} amber={i === 2} />}
              <circle cx={CLUSTER_X} cy={y} r={6} className={i === 3 ? 'dg-cluster dg-cluster-dr' : 'dg-cluster'} />
              <text x={CLUSTER_X + 16} y={y + 5} className="dg-cluster-name">
                {c.name}
              </text>
              <text x={CLUSTER_X + 16} y={y + 22} className="dg-small">
                {c.apps} apps
              </text>
            </g>
          );
        })}

        {/* stages */}
        {platform.stages.map((s, i) => {
          const x = X0 + i * STEP;
          const isActive = s.id === active;
          return (
            <g
              key={s.id}
              className={isActive ? 'dg-stage dg-stage-active' : 'dg-stage'}
              onClick={() => setActive(s.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(s.id)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              aria-label={s.name}
            >
              <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={4} className="dg-box" />
              {brands[s.icon as BrandName] && (
                <path d={brands[s.icon as BrandName].path} className="dg-icon" transform={`translate(${x + 14}, ${BOX_Y + 14}) scale(0.8)`} />
              )}
              <text x={x + 14} y={BOX_Y + 56} className="dg-name">
                {s.name}
              </text>
              {s.gates.map((g, gi) => (
                <g key={g}>
                  <circle cx={x + 6} cy={BOX_Y + BOX_H + 26 + gi * 22} r={2.6} className="dg-gate-dot" />
                  <text x={x + 16} y={BOX_Y + BOX_H + 30 + gi * 22} className="dg-small">
                    {g}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* stacked version for narrow screens */}
      <ol className="diagram-list">
        {platform.stages.map((s) => (
          <li key={s.id}>
            <strong>
              <BrandIcon name={s.icon} size={16} />
              {s.name}
            </strong>
            <span>{s.gates.join(', ')}</span>
          </li>
        ))}
        <li>
          <strong>Clusters</strong>
          <span>{platform.clusters.map((c) => `${c.name} (${c.apps} apps)`).join(', ')}</span>
        </li>
      </ol>

      <div className="diagram-detail" aria-live="polite">
        <h3>
          <BrandIcon name={current.icon} size={20} />
          {current.name}
        </h3>
        <p>{current.summary}</p>
        <ul>
          {current.gates.map((g) => (
            <li key={g}>
              <BrandIcon name={brandFor(g)} size={14} />
              {g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
