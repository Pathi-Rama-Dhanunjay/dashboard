import { GradientAreaChart, RoundedBarChart, SparkChart, MicroSpark, useMount } from '../components/charts.tsx';

import { Icon } from '../components/icons.tsx';
import { AppShell, useCurrentUser } from './shell.tsx';
import { MODELS } from './models.tsx';
import React from 'react';
// Dashboard — BiasSense, WebPulse-inspired editorial layout.
// Sections, top-to-bottom:
//   1. Greeting header     — big "Good morning, {name}" + Export / Run analysis
//   2. KPI strip           — 5 stat tiles, each with a micro sparkline + delta
//   3. Trend + Donut row   — fairness trend (gradient line / bars / spark) + composition donut
//   4. Model score row     — 4 model mini-cards, risk-colored
//   5. Last analyses table — recent runs

const Dashboard = ({ onNavigate }) => {
  const user = useCurrentUser();
  const firstName = (user.name || 'there').split(' ')[0];

  // ---- chart-style tweak — read from the html data attr (set by app.jsx) ----
  const [chartStyle, setChartStyle] = React.useState(
    () => (typeof document !== 'undefined' && document.documentElement.dataset.chart) || 'gradient'
  );
  React.useEffect(() => {
    const onChange = () => setChartStyle(document.documentElement.dataset.chart || 'gradient');
    window.addEventListener('biassense:tweaked', onChange);
    return () => window.removeEventListener('biassense:tweaked', onChange);
  }, []);

  // ---- time toggle for the trend chart ----
  const [range, setRange] = React.useState('30d');
  const TREND_DATA = React.useMemo(() => buildTrendData(range), [range]);

  const today = new Date();
  const dateLine = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <AppShell active="dashboard" onNavigate={onNavigate}>
      {/* 1 — Greeting header */}
      <header className="dash-greeting mount-up" style={{ animationDelay: '0ms' }}>
        <div>
          <div className="dash-page-label">Dashboard</div>
          <h1 className="dash-greeting-title">Good morning, {firstName}.</h1>
          <div className="dash-greeting-sub">
            <span className="live-dot" style={{ background: 'var(--mint)' }}></span>
            {' '}{dateLine} · {MODELS.length} models monitored · workspace healthy
          </div>
        </div>
        <div className="dash-greeting-actions">
          <button className="btn btn-ghost">
            <Icon name="download" size={13} />
            Import
          </button>
          <button className="btn btn-ghost">
            <Icon name="upload" size={13} />
            Export
          </button>
          <button className="btn btn-cream">
            <Icon name="play" size={12} />
            Run analysis
          </button>
        </div>
      </header>

      {/* 2 — KPI strip */}
      <div className="kpi-strip">
        {KPIS.map((k, i) => (
          <div key={k.label} className="kpi-tile mount-up" style={{ animationDelay: `${60 + i * 60}ms` }}>
            <div className="kpi-tile-label">{k.label}</div>
            <div className="kpi-tile-value">
              {k.value}{k.unit && <span className="unit">{k.unit}</span>}
            </div>
            <div className={`kpi-tile-delta ${k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat'}`}>
              {k.delta > 0 ? '▲' : k.delta < 0 ? '▼' : '◆'} {Math.abs(k.delta)}{k.deltaUnit || '%'}
              <span style={{ fontWeight: 500, color: 'inherit', opacity: 0.7, marginLeft: 2 }}>vs last week</span>
            </div>
            <div className="kpi-tile-spark">
              <MicroSpark values={k.spark} color={k.delta >= 0 ? 'var(--mint)' : 'var(--rose)'} width={120} height={28} />
            </div>
          </div>
        ))}
      </div>

      {/* 3 — Trend chart + Composition donut */}
      <div className="dash-grid" style={{ marginBottom: 20 }}>
        <div className="col-8 mount-up" style={{ animationDelay: '420ms' }}>
          <div className="card chart-card flat-card">
            <div className="card-header" style={{ paddingBottom: 6 }}>
              <div>
                <div className="card-title">Fairness trend</div>
                <div className="card-sub">Workspace-wide disparate impact, demographic parity (dashed)</div>
              </div>
              <div className="chart-toolbar">
                <div className="time-toggle">
                  {['7d', '30d', '90d'].map((r) => (
                    <button
                      key={r}
                      className={range === r ? 'active' : ''}
                      onClick={() => setRange(r)}
                    >{r === '7d' ? 'Week' : r === '30d' ? 'Month' : 'Quarter'}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body" style={{ paddingTop: 0 }}>
              {chartStyle === 'bars' && <RoundedBarChart data={TREND_DATA} />}
              {chartStyle === 'spark' && <SparkChart data={TREND_DATA} />}
              {(chartStyle === 'gradient' || !['bars', 'spark'].includes(chartStyle)) &&
                <GradientAreaChart data={TREND_DATA} />}
              <div style={{
                display: 'flex', gap: 18, paddingTop: 14, marginTop: 8,
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}>
                <Legend swatch={<span style={{
                  width: 14, height: 3, borderRadius: 2,
                  background: 'linear-gradient(90deg, #115E59 0%, #0F766E 100%)',
                }} />} label="Avg fairness score" value="92.4%" delta="+2.1" />
                {chartStyle !== 'bars' && chartStyle !== 'spark' && (
                  <Legend swatch={<span style={{
                    width: 14, height: 3, borderRadius: 2, background: 'transparent',
                    borderTop: '2px dashed #FFCE76',
                  }} />} label="Demographic parity" value="0.86" delta="+0.04" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-4 mount-up" style={{ animationDelay: '500ms' }}>
          <div className="card donut-card flat-card">
            <div className="card-header">
              <div>
                <div className="card-title">Fairness composition</div>
                <div className="card-sub">12 models · last 30 days</div>
              </div>
              <button className="btn-quiet" style={{ height: 28, padding: '0 8px', borderRadius: 8, fontSize: 11.5 }}>
                <Icon name="more-horizontal" size={14} />
              </button>
            </div>
            <div className="card-body">
              <FairnessDonut />
              <div className="fair-legend">
                <FairLegendRow color="var(--mint)"  label="Low risk"     val={9} pct={75} />
                <FairLegendRow color="var(--amber)" label="Moderate"     val={2} pct={17} />
                <FairLegendRow color="var(--rose)"  label="High risk"    val={1} pct={8}  />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 — Model score cards row */}
      <section className="mount-up" style={{ animationDelay: '600ms', marginBottom: 20 }}>
        <SectionHeader
          title="Models monitored"
          sub="4 of 12 — sorted by latest analysis"
          actionLabel="See all"
          onAction={() => onNavigate('/models')}
        />
        <div className="model-cards">
          {MODELS_FEATURED.map((m) => (
            <button
              key={m.id}
              className={`model-mini risk-${m.risk}`}
              onClick={() => onNavigate(`/models/${m.id}`)}
            >
              <div className="model-mini-head">
                <div>
                  <div className="model-mini-name">{m.name}</div>
                  <div className="model-mini-ver">{m.version} · {m.lastRun}</div>
                </div>
                <span className={`pill ${m.risk === 'low' ? 'pill-mint' : m.risk === 'mod' ? 'pill-amber' : 'pill-rose'}`}>
                  <span className="dot"></span>{m.risk === 'low' ? 'Healthy' : m.risk === 'mod' ? 'Watch' : 'Action'}
                </span>
              </div>
              <div className={`model-mini-score ${m.risk}`}>
                {m.score}<span className="pct">%</span>
              </div>
              <div className="model-mini-bar">
                <div className={m.risk} style={{ width: `${m.score}%` }}></div>
              </div>
              <div className="model-mini-foot">
                <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
                  DI · {m.di} · {m.groups} groups
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>
                  <Icon name="arrow-right" size={13} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5 — Datasets + Last analyses */}
      <div className="dash-grid">
        <div className="col-5 mount-up" style={{ animationDelay: '720ms' }}>
          <div className="card flat-card">
            <div className="card-header">
              <div>
                <div className="card-title">Datasets</div>
                <div className="card-sub">8 active · 1.4M rows total</div>
              </div>
              <button
                className="btn-quiet"
                onClick={() => onNavigate('/datasets')}
                style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}
              >View all <Icon name="arrow-right" size={11} /></button>
            </div>
            <div className="card-body">
              {DATASETS.map((d) => (
                <div key={d.name} className="dataset-row">
                  <div className="dataset-icn"><Icon name={d.icon || 'datasets'} size={16} /></div>
                  <div className="dataset-body">
                    <div className="dataset-name">{d.name}</div>
                    <div className="dataset-meta">{d.rows} rows · {d.size} · {d.updated}</div>
                  </div>
                  <span className={`pill ${d.statusTone}`}>
                    <span className="dot"></span>{d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-7 mount-up" style={{ animationDelay: '800ms' }}>
          <div className="card tbl-card flat-card">
            <div className="card-header">
              <div>
                <div className="card-title">Last analyses</div>
                <div className="card-sub">Most recent fairness evaluations across the workspace</div>
              </div>
              <button
                className="btn-quiet"
                onClick={() => onNavigate('/analysis')}
                style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}
              >Full history <Icon name="arrow-right" size={11} /></button>
            </div>
            <div className="card-body">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>Score</th>
                    <th>Disparate impact</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Finished</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ANALYSES.map((r) => (
                    <tr key={r.id} onClick={() => onNavigate(`/models/${r.modelId}`)}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text)' }}>{r.model}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontWeight: 500 }}>
                          {r.version}
                        </div>
                      </td>
                      <td className="num" style={{
                        color: r.risk === 'low' ? 'var(--mint)' : r.risk === 'mod' ? 'var(--amber)' : 'var(--rose)',
                        fontSize: 17, fontWeight: 900, letterSpacing: '-0.02em',
                      }}>{r.score}<span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 2, fontWeight: 700 }}>%</span></td>
                      <td className="num" style={{ fontWeight: 700 }}>{r.di}</td>
                      <td>
                        <span className={`pill ${r.risk === 'low' ? 'pill-mint' : r.risk === 'mod' ? 'pill-amber' : 'pill-rose'}`}>
                          <span className="dot"></span>{r.risk === 'low' ? 'Passed' : r.risk === 'mod' ? 'Review' : 'Failed'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>{r.finished}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

// ============================================================
// Subcomponents
// ============================================================

const Legend = ({ swatch, label, value, delta }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
    {swatch}
    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ color: 'var(--text)', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    {delta && (
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: delta.startsWith('+') ? 'var(--mint)' : 'var(--rose)',
      }}>{delta}</span>
    )}
  </div>
);

const SectionHeader = ({ title, sub, actionLabel, onAction }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    marginBottom: 16, gap: 16, flexWrap: 'wrap',
  }}>
    <div>
      <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>{title}</div>
      {sub && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{sub}</div>}
    </div>
    {actionLabel && (
      <button
        className="btn-quiet"
        onClick={onAction}
        style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}
      >{actionLabel} <Icon name="arrow-right" size={11} /></button>
    )}
  </div>
);

const FairLegendRow = ({ color, label, val, pct }) => (
  <div className="fair-legend-item">
    <span className="sw" style={{ background: color }}></span>
    <span className="lbl">{label}</span>
    <span className="val">{val}</span>
    <span className="pct">{pct}%</span>
  </div>
);

// ============================================================
// Donut SVG — rounded segments with gap (WebPulse-style)
// ============================================================

const FairnessDonut = () => {
  const mounted = useMount();
  const segs = [
    { v: 75, color: 'var(--mint)' },
    { v: 17, color: 'var(--amber)' },
    { v: 8,  color: 'var(--rose)' },
  ];
  const R = 80;
  const C = 2 * Math.PI * R;
  const gap = 6; // visual gap between segments (in arc length)

  let offset = 0;
  return (
    <div className="fair-donut">
      <svg viewBox="0 0 200 200">
        {/* track */}
        <circle cx="100" cy="100" r={R}
                fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="22" />
        {segs.map((s, i) => {
          const len = (s.v / 100) * C - gap;
          const dasharray = `${mounted ? len : 0} ${C}`;
          const dashoffset = -offset;
          offset += (s.v / 100) * C;
          return (
            <circle
              key={i}
              cx="100" cy="100" r={R}
              fill="none"
              stroke={s.color}
              strokeWidth="22"
              strokeLinecap="round"
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              style={{
                transition: `stroke-dasharray 1000ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms`,
              }}
            />
          );
        })}
      </svg>
      <div className="fair-donut-center">
        <div className="fair-donut-value">92<span style={{ fontSize: 22, color: 'var(--text-muted)' }}>%</span></div>
        <div className="fair-donut-label">Avg fairness</div>
      </div>
    </div>
  );
};

// ============================================================
// Static demo data — hero numbers per the brief (mostly healthy)
// ============================================================

const KPIS = [
  {
    label: 'Models monitored',  value: 12,   unit: '',   delta: 25,   deltaUnit: '%',
    spark: [7, 8, 8, 9, 10, 10, 11, 12, 12, 12, 12, 12],
  },
  {
    label: 'Avg fairness',      value: 92,   unit: '%',  delta: 2.1,  deltaUnit: '%',
    spark: [88, 87, 89, 88, 90, 89, 91, 90, 91, 92, 92, 92],
  },
  {
    label: 'Active datasets',   value: 8,    unit: '',   delta: 14,   deltaUnit: '%',
    spark: [5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 8, 8],
  },
  {
    label: 'Open alerts',       value: 2,    unit: '',   delta: -60,  deltaUnit: '%',
    spark: [8, 7, 6, 5, 4, 4, 3, 3, 3, 2, 2, 2],
  },
  {
    label: 'Analyses this week',value: 47,   unit: '',   delta: 18,   deltaUnit: '%',
    spark: [22, 28, 26, 31, 35, 33, 38, 40, 39, 44, 45, 47],
  },
];

const MODELS_FEATURED = [
  {
    id: 'creditrisk-v2-4', name: 'CreditRisk', version: 'v2.4.1', lastRun: '14m ago',
    risk: 'low', score: 94, di: '0.91', groups: 4,
  },
  {
    id: 'loanapproval-v1-8', name: 'LoanApproval', version: 'v1.8.0', lastRun: '1h ago',
    risk: 'low', score: 91, di: '0.88', groups: 3,
  },
  {
    id: 'pricingengine-v3-2', name: 'PricingEngine', version: 'v3.2.0', lastRun: '3h ago',
    risk: 'mod', score: 78, di: '0.74', groups: 5,
  },
  {
    id: 'hirefilter-v0-9', name: 'HireFilter', version: 'v0.9.2', lastRun: '6h ago',
    risk: 'high', score: 62, di: '0.58', groups: 4,
  },
];

const DATASETS = [
  { name: 'loan-applications-2026', rows: '482K', size: '1.2 GB',  updated: '2h ago',    status: 'Ready',     statusTone: 'pill-mint',  icon: 'datasets' },
  { name: 'hiring-records-q1',      rows: '128K', size: '341 MB',  updated: 'Yesterday', status: 'Ready',     statusTone: 'pill-mint',  icon: 'datasets' },
  { name: 'pricing-events-may',     rows: '612K', size: '1.8 GB',  updated: '14m ago',   status: 'Profiling', statusTone: 'pill-cream', icon: 'datasets' },
  { name: 'fraud-flags-rolling',    rows: '94K',  size: '218 MB',  updated: '3 days',    status: 'Setup',     statusTone: 'pill-amber', icon: 'datasets' },
];

const RECENT_ANALYSES = [
  { id: 'a1', model: 'CreditRisk',    version: 'v2.4.1', modelId: 'creditrisk-v2-4',   score: 94, di: '0.91', risk: 'low',  finished: '14m ago' },
  { id: 'a2', model: 'LoanApproval',  version: 'v1.8.0', modelId: 'loanapproval-v1-8', score: 91, di: '0.88', risk: 'low',  finished: '1h ago' },
  { id: 'a3', model: 'PricingEngine', version: 'v3.2.0', modelId: 'pricingengine-v3-2',score: 78, di: '0.74', risk: 'mod',  finished: '3h ago' },
  { id: 'a4', model: 'HireFilter',    version: 'v0.9.2', modelId: 'hirefilter-v0-9',   score: 62, di: '0.58', risk: 'high', finished: '6h ago' },
  { id: 'a5', model: 'FraudGuard',    version: 'v4.1.3', modelId: 'fraudguard-v4-1',   score: 89, di: '0.86', risk: 'low',  finished: 'Yesterday' },
];

// Synthesize trend curves for the three time ranges
function buildTrendData(range) {
  if (range === '7d') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      primary:   { unit: '%', values: [89, 90, 88, 91, 92, 92, 92] },
      secondary: { values: [82, 84, 83, 85, 86, 86, 86] },
    };
  }
  if (range === '90d') {
    return {
      labels: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
      primary:   { unit: '%', values: [84, 85, 86, 85, 87, 88, 89, 88, 90, 91, 91, 92] },
      secondary: { values: [78, 79, 80, 80, 81, 82, 83, 83, 84, 85, 85, 86] },
    };
  }
  // 30d default — 30 daily points
  return {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    primary: {
      unit: '%',
      values: [87, 88, 87, 89, 88, 88, 90, 89, 91, 90, 91, 89, 92, 91, 90, 92, 93, 91, 92, 93, 92, 91, 93, 94, 92, 93, 92, 91, 92, 92],
    },
    secondary: {
      values: [80, 81, 81, 82, 81, 82, 83, 83, 84, 84, 85, 84, 85, 85, 84, 86, 86, 85, 86, 86, 85, 86, 86, 87, 86, 86, 85, 85, 86, 86],
    },
  };
}

export { Dashboard };
