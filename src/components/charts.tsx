
import React from 'react';
// Dashboard charts — gradient line / bars / sparkline variants.
// All three share the same data shape: { labels: string[], values: number[] }.
// Designed to draw in smoothly on mount (600ms cubic ease) and respond to
// hover with a floating pill tooltip.

const useMount = () => {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    const r = requestAnimationFrame(() => setM(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return m;
};

// Catmull-Rom → cubic Bezier path. Produces buttery curves like WebPulse
// uses for its analytics lines. Input pts: [[x,y], ...].
const smoothPath = (pts) => {
  if (pts.length < 2) return '';
  const d = [`M ${pts[0][0]} ${pts[0][1]}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`);
  }
  return d.join(' ');
};

// ===== Gradient area line chart =====
const GradientAreaChart = ({ data, height = 280, accent = '#FD4B23', secondary = '#FFCE76' }) => {
  const uid = React.useId().replace(/:/g, '');
  const mounted = useMount();
  const wrapRef = React.useRef(null);
  const [w, setW] = React.useState(720);
  const [hover, setHover] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const padL = 36, padR = 16, padT = 24, padB = 30;
  const innerW = Math.max(100, w - padL - padR);
  const innerH = height - padT - padB;

  const allVals = [...data.primary.values, ...(data.secondary?.values || [])];
  const minV = Math.min(...allVals) * 0.92;
  const maxV = Math.max(...allVals) * 1.04;
  const range = maxV - minV || 1;

  const xs = data.labels.map((_, i) => padL + (i / Math.max(1, data.labels.length - 1)) * innerW);
  const yOf = (v) => padT + (1 - (v - minV) / range) * innerH;

  const primaryPts = data.primary.values.map((v, i) => [xs[i], yOf(v)]);
  const secondaryPts = (data.secondary?.values || []).map((v, i) => [xs[i], yOf(v)]);

  const primaryD = smoothPath(primaryPts);
  const secondaryD = smoothPath(secondaryPts);

  // Area underneath the primary line
  const areaD = primaryPts.length > 0
    ? `${primaryD} L ${primaryPts[primaryPts.length - 1][0]} ${padT + innerH} L ${primaryPts[0][0]} ${padT + innerH} Z`
    : '';

  // Y-axis ticks — 4 evenly spaced
  const ticks = [0, 0.33, 0.66, 1].map((t) => {
    const v = minV + t * range;
    return { y: padT + (1 - t) * innerH, v: Math.round(v) };
  });

  // Find nearest point to mouse
  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < xs.length; i++) {
      const d = Math.abs(xs[i] - mx);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    setHover(best);
  };

  return (
    <div className="chart-svg-wrap" ref={wrapRef} onMouseLeave={() => setHover(null)} onMouseMove={onMove}>
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${uid}-areaGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor={accent} stopOpacity="0.32" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.12" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-lineGrad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accent} />
            <stop offset="100%" stopColor="#FF7B58" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={t.y} y2={t.y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={padL - 8} y={t.y + 4} textAnchor="end"
                  fill="var(--text-faint)" fontSize="10" fontWeight="700"
                  letterSpacing="0.05em">{t.v}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.labels.map((lbl, i) => (
          (i % Math.max(1, Math.floor(data.labels.length / 7)) === 0 || i === data.labels.length - 1) && (
            <text key={i} x={xs[i]} y={height - 10} textAnchor="middle"
                  fill="var(--text-dim)" fontSize="10.5" fontWeight="600">{lbl}</text>
          )
        ))}

        {/* Secondary line (dashed cream) */}
        {secondaryD && (
          <path
            d={secondaryD}
            fill="none"
            stroke={secondary}
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            opacity="0.7"
            style={{
              strokeDashoffset: mounted ? 0 : 1000,
              transition: 'stroke-dashoffset 1200ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        )}

        {/* Primary area fill */}
        <path d={areaD} fill={`url(#${uid}-areaGrad)`}
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 800ms ease 200ms' }} />

        {/* Primary line */}
        <path
          d={primaryD}
          fill="none"
          stroke={`url(#${uid}-lineGrad)`}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 4000,
            strokeDashoffset: mounted ? 0 : 4000,
            transition: 'stroke-dashoffset 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />

        {/* Hover dot + vertical line */}
        {hover !== null && primaryPts[hover] && (
          <g>
            <line x1={primaryPts[hover][0]} x2={primaryPts[hover][0]}
                  y1={padT} y2={padT + innerH}
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx={primaryPts[hover][0]} cy={primaryPts[hover][1]}
                    r="6" fill={accent} stroke="#0F0E0C" strokeWidth="3" />
          </g>
        )}
      </svg>

      {hover !== null && primaryPts[hover] && (
        <div
          className="chart-tooltip"
          style={{
            left: primaryPts[hover][0],
            top: primaryPts[hover][1],
            opacity: 1,
          }}
        >
          <span className="tip-dot" style={{ background: accent }}></span>
          {data.primary.values[hover]}{data.primary.unit || '%'}
          <span className="tip-sub">{data.labels[hover]}</span>
        </div>
      )}
    </div>
  );
};

// ===== Rounded bar chart =====
const RoundedBarChart = ({ data, height = 280, accent = '#FD4B23' }) => {
  const uid = React.useId().replace(/:/g, '');
  const mounted = useMount();
  const wrapRef = React.useRef(null);
  const [w, setW] = React.useState(720);
  const [hover, setHover] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const padL = 36, padR = 16, padT = 24, padB = 30;
  const innerW = Math.max(100, w - padL - padR);
  const innerH = height - padT - padB;
  const n = data.primary.values.length;

  const minV = 0;
  const maxV = Math.max(...data.primary.values) * 1.10;
  const range = maxV - minV || 1;

  const slot = innerW / n;
  const barW = Math.max(14, Math.min(48, slot * 0.55));

  const ticks = [0, 0.33, 0.66, 1].map((t) => {
    const v = minV + t * range;
    return { y: padT + (1 - t) * innerH, v: Math.round(v) };
  });

  return (
    <div className="chart-svg-wrap" ref={wrapRef} onMouseLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${uid}-barGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF7B58" />
            <stop offset="100%" stopColor={accent} />
          </linearGradient>
          <linearGradient id={`${uid}-barGradDim`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={t.y} y2={t.y}
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <text x={padL - 8} y={t.y + 4} textAnchor="end"
                  fill="var(--text-faint)" fontSize="10" fontWeight="700">{t.v}</text>
          </g>
        ))}

        {data.primary.values.map((v, i) => {
          const cx = padL + slot * i + slot / 2;
          const fullH = (v / range) * innerH;
          const h = mounted ? fullH : 0;
          const y = padT + innerH - h;
          const isHover = hover === i;
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={cx - barW / 2} y={padT}
                    width={barW} height={innerH}
                    fill="transparent" style={{ cursor: 'pointer' }} />
              <rect
                x={cx - barW / 2}
                y={y}
                width={barW}
                height={h}
                rx={Math.min(barW / 2, 8)}
                ry={Math.min(barW / 2, 8)}
                fill={isHover ? `url(#${uid}-barGrad)` : (i === data.primary.values.length - 1 ? `url(#${uid}-barGrad)` : `url(#${uid}-barGradDim)`)}
                style={{ transition: 'height 800ms cubic-bezier(0.22, 1, 0.36, 1), fill 150ms ease' }}
              />
              {(i % Math.max(1, Math.floor(n / 7)) === 0 || i === n - 1) && (
                <text x={cx} y={height - 10} textAnchor="middle"
                      fill="var(--text-dim)" fontSize="10.5" fontWeight="600">{data.labels[i]}</text>
              )}
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="chart-tooltip"
          style={{
            left: padL + slot * hover + slot / 2,
            top: padT + innerH - (data.primary.values[hover] / range) * innerH,
            opacity: 1,
          }}
        >
          <span className="tip-dot" style={{ background: accent }}></span>
          {data.primary.values[hover]}{data.primary.unit || '%'}
          <span className="tip-sub">{data.labels[hover]}</span>
        </div>
      )}
    </div>
  );
};

// ===== Sparkline (minimal) =====
const SparkChart = ({ data, height = 280, accent = '#FD4B23' }) => {
  const uid = React.useId().replace(/:/g, '');
  const mounted = useMount();
  const wrapRef = React.useRef(null);
  const [w, setW] = React.useState(720);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const padL = 24, padR = 24, padT = 60, padB = 50;
  const innerW = Math.max(100, w - padL - padR);
  const innerH = height - padT - padB;

  const vals = data.primary.values;
  const minV = Math.min(...vals);
  const maxV = Math.max(...vals);
  const range = (maxV - minV) || 1;

  const xs = vals.map((_, i) => padL + (i / Math.max(1, vals.length - 1)) * innerW);
  const yOf = (v) => padT + (1 - (v - minV) / range) * innerH;
  const pts = vals.map((v, i) => [xs[i], yOf(v)]);
  const lineD = smoothPath(pts);
  const areaD = `${lineD} L ${pts[pts.length - 1][0]} ${padT + innerH + 12} L ${pts[0][0]} ${padT + innerH + 12} Z`;

  const last = vals[vals.length - 1];
  const first = vals[0];
  const delta = last - first;
  const pctDelta = first !== 0 ? ((delta / first) * 100).toFixed(1) : '0.0';

  return (
    <div className="chart-svg-wrap" ref={wrapRef} style={{ height }}>
      {/* Big number overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        display: 'flex', alignItems: 'baseline', gap: 12, padding: '4px 4px',
      }}>
        <div style={{
          fontSize: 56, fontWeight: 900, letterSpacing: '-0.04em',
          color: 'var(--text)', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        }}>{last}<span style={{ fontSize: 32, color: 'var(--text-muted)' }}>%</span></div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 999,
          background: delta >= 0 ? 'var(--mint-soft)' : 'var(--rose-soft)',
          border: `1px solid ${delta >= 0 ? 'var(--mint-edge)' : 'var(--rose-edge)'}`,
          color: delta >= 0 ? 'var(--mint)' : 'var(--rose)',
          fontSize: 12, fontWeight: 700,
        }}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(parseFloat(pctDelta))}%
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${uid}-sparkGrad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#${uid}-sparkGrad)`}
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 800ms ease 200ms' }} />
        <path
          d={lineD}
          fill="none"
          stroke={accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 4000,
            strokeDashoffset: mounted ? 0 : 4000,
            transition: 'stroke-dashoffset 1400ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
        <circle
          cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]}
          r="6" fill={accent} stroke="var(--bg)" strokeWidth="3"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity 400ms ease 1400ms' }}
        />
      </svg>
    </div>
  );
};

// ===== Tiny inline sparkline for KPI tiles =====
const MicroSpark = ({ values, color = 'var(--text-muted)', width = 80, height = 24 }) => {
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = (maxV - minV) || 1;
  const pts = values.map((v, i) => [
    (i / (values.length - 1)) * width,
    height - ((v - minV) / range) * height,
  ]);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: 'block' }}>
      <path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { GradientAreaChart, RoundedBarChart, SparkChart, MicroSpark, smoothPath, useMount };
