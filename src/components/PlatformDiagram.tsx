import { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { platform } from '../content';
import { brandFor, brands, type BrandName } from '../lib/brands';
import BrandIcon from './BrandIcon';

// Row 1: delivery pipeline. Row 2: what provisions and operates it.
const BOX_W = 140;
const BOX_H = 70;
const BOX_Y = 60;
const STEP = 200;
const X0 = 20;
const MID = BOX_Y + BOX_H / 2;
const CLUSTER_X = 1040;
const CLUSTER_Y = [40, 108, 176, 244];
const FEED_END_Y = 240; // where upward connectors meet the stage column
const LAYER_STEP = 196;
const LAYER_Y = 320;
const bulletY = (boxY: number, i: number) => boxY + BOX_H + 26 + i * 22;

type Item = { id: string; name: string; icon: string; summary: string; list: string[]; tools?: string; isLayer: boolean };
const items: Item[] = [
  ...platform.stages.map((s) => ({ id: s.id, name: s.name, icon: s.icon, summary: s.summary, list: s.gates, tools: s.tools, isLayer: false })),
  ...platform.layer.items.map((l) => ({ id: l.id, name: l.name, icon: l.icon, summary: l.summary, list: l.points, isLayer: true })),
];
const stageCenter = (id: string) => X0 + platform.stages.findIndex((s) => s.id === id) * STEP + BOX_W / 2;

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

function StageBox({ x, y, icon, name, active, onSelect, small = false }: { x: number; y: number; icon: string; name: string; active: boolean; onSelect: () => void; small?: boolean }) {
  const brand = brands[icon as BrandName];
  return (
    <g
      className={active ? 'dg-stage dg-stage-active' : 'dg-stage'}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      aria-label={name}
    >
      <rect x={x} y={y} width={BOX_W} height={BOX_H} rx={4} className="dg-box" />
      {brand && <path d={brand.path} className="dg-icon" transform={`translate(${x + 14}, ${y + 14}) scale(0.8)`} />}
      <text x={x + 14} y={y + 56} className={small ? 'dg-name dg-name-sm' : 'dg-name'}>
        {name}
      </text>
    </g>
  );
}

export default function PlatformDiagram() {
  const [active, setActive] = useState(platform.stages[1].id);
  const reduce = useReducedMotion();
  const current = items.find((s) => s.id === active)!;
  const lastRight = X0 + 4 * STEP + BOX_W;

  return (
    <div className="diagram">
      <svg
        viewBox="0 0 1180 478"
        className="diagram-svg"
        role="img"
        aria-label="Pipeline from GitLab through CI scanning, Harbor, ArgoCD to Kubernetes clusters, provisioned by Terraform and operated with Rancher, OpenBao, observability, backups and secdash"
      >
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

        {/* upward connectors: layer item to the stages it provisions or serves */}
        {platform.layer.items.map((l, i) => {
          const cx = X0 + i * LAYER_STEP + BOX_W / 2;
          const busY = 258 + i * 8;
          return (
            <g key={l.id} className={l.id === active ? 'dg-feed dg-feed-active' : 'dg-feed'}>
              {l.feeds.map((target) => {
                const tx = stageCenter(target);
                return (
                  <g key={target}>
                    <path d={`M${cx},${LAYER_Y} V${busY} H${tx} V${FEED_END_Y}`} className="dg-feed-line" />
                    <circle cx={tx} cy={FEED_END_Y} r={2.6} className="dg-feed-dot" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* pipeline stages */}
        {platform.stages.map((s, i) => {
          const x = X0 + i * STEP;
          const lines = s.tools ? [s.tools, ...s.gates] : s.gates;
          return (
            <g key={s.id}>
              <StageBox x={x} y={BOX_Y} icon={s.icon} name={s.name} active={s.id === active} onSelect={() => setActive(s.id)} />
              {lines.map((line, li) => (
                <g key={line}>
                  <circle cx={x + 6} cy={bulletY(BOX_Y, li) - 4} r={2.6} className={s.tools && li === 0 ? 'dg-tool-dot' : 'dg-gate-dot'} />
                  <text x={x + 16} y={bulletY(BOX_Y, li)} className="dg-small">
                    {line}
                  </text>
                </g>
              ))}
            </g>
          );
        })}

        {/* provisioning and operations layer */}
        <text x={X0} y={LAYER_Y - 12} className="dg-small dg-layer-title">
          {platform.layer.title}
        </text>
        {platform.layer.items.map((l, i) => {
          const x = X0 + i * LAYER_STEP;
          return (
            <g key={l.id}>
              <StageBox x={x} y={LAYER_Y} icon={l.icon} name={l.name} active={l.id === active} onSelect={() => setActive(l.id)} small />
              {l.points.map((pt, pi) => (
                <g key={pt}>
                  <circle cx={x + 6} cy={bulletY(LAYER_Y, pi) - 4} r={2.6} className="dg-tool-dot" />
                  <text x={x + 16} y={bulletY(LAYER_Y, pi)} className="dg-small">
                    {pt}
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
            {s.tools && <em>{s.tools}</em>}
            <span>{s.gates.join(', ')}</span>
          </li>
        ))}
        <li>
          <strong>Clusters</strong>
          <span>{platform.clusters.map((c) => `${c.name} (${c.apps} apps)`).join(', ')}</span>
        </li>
        <li className="diagram-list-title">{platform.layer.title}</li>
        {platform.layer.items.map((l) => (
          <li key={l.id}>
            <strong>
              <BrandIcon name={l.icon} size={16} />
              {l.name}
            </strong>
            <span>{l.points.join(', ')}</span>
          </li>
        ))}
      </ol>

      <div className="diagram-detail" aria-live="polite">
        <div>
          <h3>
            <BrandIcon name={current.icon} size={20} />
            {current.name}
          </h3>
          {current.tools && <p className="diagram-detail-tools">{current.tools}</p>}
        </div>
        <p>{current.summary}</p>
        <ul className={current.isLayer ? 'dg-facts' : undefined}>
          {current.list.map((g) => (
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
