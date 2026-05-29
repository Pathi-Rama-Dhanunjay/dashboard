import { GradientAreaChart, RoundedBarChart, SparkChart, MicroSpark, useMount } from '../components/charts.tsx';
import { Icon } from '../components/icons.tsx';
import { AppShell, useCurrentUser, useToast } from './shell.tsx';
import { MODELS } from './models.tsx';
import React from 'react';

const KPIS = [
  { label: 'Models monitored', value: 12,  unit: '',   delta: 25,  deltaUnit: '%',
    icon: 'models' as const,
    iconBg: 'rgba(17,94,89,0.10)',    iconColor: '#115E59',  iconGlow: 'rgba(17,94,89,0.18)',
    accentColor: '#115E59', accentLight: 'rgba(17,94,89,0.07)',
    progressPct: 80, progressLabel: 'Target: 15',
    spark: [7,8,8,9,10,10,11,12,12,12,12,12] },
  { label: 'Avg fairness',     value: 92,  unit: '%',  delta: 2.1, deltaUnit: '%',
    icon: 'shield-check' as const,
    iconBg: 'rgba(116,194,140,0.12)', iconColor: '#4caf72',  iconGlow: 'rgba(116,194,140,0.22)',
    accentColor: '#4caf72', accentLight: 'rgba(116,194,140,0.07)',
    progressPct: 92, progressLabel: 'Target: 95%',
    spark: [88,87,89,88,90,89,91,90,91,92,92,92] },
  { label: 'Active datasets',  value: 8,   unit: '',   delta: 14,  deltaUnit: '%',
    icon: 'datasets' as const,
    iconBg: 'rgba(221,160,74,0.12)',  iconColor: '#c4872a',  iconGlow: 'rgba(221,160,74,0.22)',
    accentColor: '#c4872a', accentLight: 'rgba(221,160,74,0.07)',
    progressPct: 80, progressLabel: 'Target: 10',
    spark: [5,5,6,6,7,7,7,8,8,8,8,8] },
  { label: 'Open alerts',      value: 2,   unit: '',   delta: -60, deltaUnit: '%',
    icon: 'alerts' as const,
    iconBg: 'rgba(221,107,82,0.12)',  iconColor: '#c84f35',  iconGlow: 'rgba(221,107,82,0.22)',
    accentColor: '#c84f35', accentLight: 'rgba(221,107,82,0.07)',
    progressPct: 20, progressLabel: '2 unresolved',
    spark: [8,7,6,5,4,4,3,3,3,2,2,2] },
  { label: 'Runs this week',   value: 47,  unit: '',   delta: 18,  deltaUnit: '%',
    icon: 'analysis' as const,
    iconBg: 'rgba(107,138,255,0.12)', iconColor: '#4a6de5',  iconGlow: 'rgba(107,138,255,0.22)',
    accentColor: '#4a6de5', accentLight: 'rgba(107,138,255,0.07)',
    progressPct: 94, progressLabel: 'Target: 50',
    spark: [22,28,26,31,35,33,38,40,39,44,45,47] },
];

const MODELS_FEATURED = [
  { id: 'creditrisk-v2-4',    name: 'CreditRisk',    version: 'v2.4.1', lastRun: '14m ago',   risk: 'low',  score: 94, di: '0.91', groups: 4 },
  { id: 'loanapproval-v1-8',  name: 'LoanApproval',  version: 'v1.8.0', lastRun: '1h ago',    risk: 'low',  score: 91, di: '0.88', groups: 3 },
  { id: 'pricingengine-v3-2', name: 'PricingEngine', version: 'v3.2.0', lastRun: '3h ago',    risk: 'mod',  score: 78, di: '0.74', groups: 5 },
  { id: 'hirefilter-v0-9',    name: 'HireFilter',    version: 'v0.9.2', lastRun: '6h ago',    risk: 'high', score: 62, di: '0.58', groups: 4 },
  { id: 'fraudguard-v4-1',    name: 'FraudGuard',    version: 'v4.1.3', lastRun: 'Yesterday', risk: 'low',  score: 89, di: '0.86', groups: 3 },
  { id: 'churnpredict-v2-0',  name: 'ChurnPredict',  version: 'v2.0.4', lastRun: 'Yesterday', risk: 'high', score: 49, di: '0.51', groups: 4 },
];

const DATASETS = [
  { name: 'loan-applications-2026', rows: '482K', size: '1.2 GB',  updated: '2h ago',    status: 'Ready',     statusTone: 'pill-mint',  icon: 'datasets' as const },
  { name: 'hiring-records-q1',      rows: '128K', size: '341 MB',  updated: 'Yesterday', status: 'Ready',     statusTone: 'pill-mint',  icon: 'datasets' as const },
  { name: 'pricing-events-may',     rows: '612K', size: '1.8 GB',  updated: '14m ago',   status: 'Profiling', statusTone: 'pill-cream', icon: 'datasets' as const },
  { name: 'fraud-flags-rolling',    rows: '94K',  size: '218 MB',  updated: '3 days',    status: 'Setup',     statusTone: 'pill-amber', icon: 'datasets' as const },
];

const RECENT_ANALYSES = [
  { id: 'a1', model: 'CreditRisk',    version: 'v2.4.1', modelId: 'creditrisk-v2-4',    score: 94, di: '0.91', risk: 'low',  finished: '14m ago' },
  { id: 'a2', model: 'LoanApproval',  version: 'v1.8.0', modelId: 'loanapproval-v1-8',  score: 91, di: '0.88', risk: 'low',  finished: '1h ago' },
  { id: 'a3', model: 'PricingEngine', version: 'v3.2.0', modelId: 'pricingengine-v3-2', score: 78, di: '0.74', risk: 'mod',  finished: '3h ago' },
  { id: 'a4', model: 'HireFilter',    version: 'v0.9.2', modelId: 'hirefilter-v0-9',    score: 62, di: '0.58', risk: 'high', finished: '6h ago' },
  { id: 'a5', model: 'FraudGuard',    version: 'v4.1.3', modelId: 'fraudguard-v4-1',    score: 89, di: '0.86', risk: 'low',  finished: 'Yesterday' },
];

const riskColor = (r: string) =>
  ({ low: 'var(--mint)', mod: 'var(--amber)', high: 'var(--rose)' }[r] ?? 'var(--text-dim)');
const riskLabel = (r: string) =>
  ({ low: 'Healthy', mod: 'Watch', high: 'Action' }[r] ?? r);
const riskPill  = (r: string) =>
  ({ low: 'pill-mint', mod: 'pill-amber', high: 'pill-rose' }[r] ?? '');

// ─── Main component ───────────────────────────────────────────────────────────

const Dashboard = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  const user      = useCurrentUser();
  const toast     = useToast();
  const mounted   = useMount();
  const firstName = ((user.name || 'there').split(' ')[0]).replace(/\w+/, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const [chartStyle, setChartStyle] = React.useState(
    () => (typeof document !== 'undefined' && document.documentElement.dataset.chart) || 'gradient'
  );
  React.useEffect(() => {
    const onChange = () => setChartStyle(document.documentElement.dataset.chart || 'gradient');
    window.addEventListener('biassense:tweaked', onChange);
    return () => window.removeEventListener('biassense:tweaked', onChange);
  }, []);

  const [range, setRange] = React.useState('30d');
  const TREND_DATA = React.useMemo(() => buildTrendData(range), [range]);
  const COMP_DATA  = React.useMemo(() => buildCompositionData(range), [range]);

  const today    = new Date();
  const dateLine = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <AppShell active="dashboard" onNavigate={onNavigate}>

      {/* ── 1. Compact greeting ── */}
      <header className="mount-up" style={{
        animationDelay: '0ms',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em',
            margin: 0, color: 'var(--text)', lineHeight: 1.2,
          }}>
            {greeting},&nbsp; <span style={{ color: '#115E59' }}>{firstName}</span>.
          </h1>
          <div style={{
            fontSize: 12, color: 'var(--text-muted)', marginTop: 5,
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span className="live-dot" />{dateLine}
            </span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span style={{ color: 'var(--mint)', fontWeight: 700 }}>▲ 92% avg fairness</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span style={{ fontWeight: 600 }}>{MODELS.length} models monitored</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span style={{ color: 'var(--rose)', fontWeight: 700 }}>2 open alerts</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-ghost dash-glossy dash-glossy-bg"
            style={{ height: 34, fontSize: 12.5, padding: '0 14px' }}
            onClick={() => onNavigate('/datasets')}>
            <Icon name="download" size={12} />Import
          </button>
          <button className="btn btn-ghost dash-glossy dash-glossy-bg"
            style={{ height: 34, fontSize: 12.5, padding: '0 14px' }}
            onClick={() => onNavigate('/analysis')}>
            <Icon name="analysis" size={12} />History
          </button>
          <button className="btn btn-cream"
            style={{ height: 34, fontSize: 12.5, padding: '0 16px' }}
            onClick={() => toast({ title: 'Analysis started', desc: 'CreditRisk v2.4.1 · ETA ~2 minutes', icon: 'play' })}>
            <Icon name="play" size={12} />Run analysis
          </button>
        </div>
      </header>

      {/* ── 2. KPI strip ── */}
      <div className="kpi-strip" style={{ marginBottom: 16 }}>
        {KPIS.map((k, i) => (
          <div key={k.label} className="kpi-tile kpi-tile-rich mount-up"
            style={{ animationDelay: `${60 + i * 40}ms`, padding: 0, overflow: 'hidden' }}>

            {/* Thin accent bar */}
            <div style={{
              height: 3,
              background: `linear-gradient(90deg, ${k.accentColor}44 0%, ${k.accentColor} 50%, ${k.accentColor}44 100%)`,
            }} />

            <div style={{ padding: '10px 12px 10px' }}>
              {/* Icon + delta row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div className="dash-glossy" style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: k.iconBg, color: k.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon name={k.icon} size={13} />
                </div>
                <div className={`kpi-tile-delta dash-glossy ${k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat'}`}
                  style={{ marginTop: 0, fontSize: 10, padding: '2px 7px' }}>
                  {k.delta > 0 ? '▲' : k.delta < 0 ? '▼' : '◆'}&nbsp;{Math.abs(k.delta)}{k.deltaUnit}
                </div>
              </div>

              {/* Value */}
              <div className="kpi-tile-value" style={{ fontSize: 24, marginTop: 0, lineHeight: 1, marginBottom: 2 }}>
                {k.value}{k.unit && <span className="unit" style={{ fontSize: 12 }}>{k.unit}</span>}
              </div>

              {/* Label */}
              <div className="kpi-tile-label" style={{ fontSize: 10.5, marginBottom: 8 }}>{k.label}</div>

              {/* Progress bar */}
              <div style={{ marginBottom: 7 }}>
                <div style={{ height: 3, background: 'rgba(15,30,54,0.07)', borderRadius: 999, overflow: 'hidden', marginBottom: 3 }}>
                  <div style={{
                    height: '100%',
                    width: mounted ? `${k.progressPct}%` : '0%',
                    background: `linear-gradient(90deg, ${k.accentColor}bb, ${k.accentColor})`,
                    borderRadius: 999,
                    transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${300 + i * 80}ms`,
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 9.5, color: 'var(--text-dim)', fontWeight: 500 }}>{k.progressLabel}</span>
                  <span style={{ fontSize: 9.5, color: k.accentColor, fontWeight: 700 }}>{k.progressPct}%</span>
                </div>
              </div>

              {/* Sparkline */}
              <MicroSpark values={k.spark} color={k.delta >= 0 ? k.accentColor : '#c84f35'} width={110} height={18} />
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Merged Fairness Overview ── */}
      <div className="dash-grid" style={{ marginBottom: 16 }}>
        <div className="col-12 mount-up" style={{ animationDelay: '280ms' }}>
          <div className="card flat-card" style={{ borderRadius: 20 }}>

            {/* Shared header */}
            <div className="card-header" style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(15,30,54,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="card-title">Fairness overview</div>
                <div className="card-sub">Workspace-wide trend & model composition · 12 models</div>
              </div>
              <div className="chart-toolbar">
                <div className="time-toggle dash-glossy dash-glossy-bg" style={{ padding: 3, borderRadius: 999 }}>
                  {(['7d', '30d', '90d'] as const).map(r => (
                    <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>
                      {r === '7d' ? 'Week' : r === '30d' ? 'Month' : 'Quarter'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card-body" style={{ padding: '16px 20px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>

                {/* ── Left: trend chart ── */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: 28 }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em',
                    textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10,
                  }}>
                    Fairness Trend
                  </div>
                  {chartStyle === 'bars'  && <RoundedBarChart data={TREND_DATA} />}
                  {chartStyle === 'spark' && <SparkChart data={TREND_DATA} />}
                  {!['bars', 'spark'].includes(chartStyle) && <GradientAreaChart data={TREND_DATA} />}
                  <div style={{ display: 'flex', gap: 18, paddingTop: 10, marginTop: 6, borderTop: '1px solid rgba(15,30,54,0.06)' }}>
                    <ChartLegend
                      swatch={<span style={{ width: 14, height: 3, borderRadius: 2, background: 'linear-gradient(90deg, #115E59 0%, #0F766E 100%)' }} />}
                      label="Avg fairness score" value={TREND_DATA.summary.avgFairness} delta={TREND_DATA.summary.fairnessDelta}
                    />
                    {!['bars', 'spark'].includes(chartStyle) && (
                      <ChartLegend
                        swatch={<span style={{ width: 14, height: 3, borderRadius: 2, background: 'transparent', borderTop: '2px dashed #FFCE76' }} />}
                        label="Demographic parity" value={TREND_DATA.summary.dpValue} delta={TREND_DATA.summary.dpDelta}
                      />
                    )}
                  </div>
                </div>

                {/* Vertical divider */}
                <div style={{ width: 1, background: 'rgba(15,30,54,0.07)', flexShrink: 0, alignSelf: 'stretch' }} />

                {/* ── Right: donut composition ── */}
                <div style={{ width: 248, flexShrink: 0, paddingLeft: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, letterSpacing: '0.09em',
                    textTransform: 'uppercase', color: 'var(--text-dim)', alignSelf: 'flex-start',
                  }}>
                    Composition
                  </div>
                  <FairnessDonut segs={COMP_DATA.segs} centerValue={COMP_DATA.avgFairness} />
                  <div className="fair-legend" style={{ width: '100%' }}>
                    {COMP_DATA.legend.map(row => (
                      <FairLegendRow key={row.label} color={row.color} label={row.label} val={row.val} pct={row.pct} bg={row.bg} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Model cards (compact) ── */}
      <section className="mount-up" style={{ animationDelay: '440ms', marginBottom: 16 }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text)' }}>
              Models monitored
            </span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>
              6 models · sorted by latest run
            </span>
          </div>
          <button className="btn-quiet dash-glossy dash-glossy-bg" onClick={() => onNavigate('/models')}
            style={{ height: 28, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            See all <Icon name="arrow-right" size={10} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {MODELS_FEATURED.map((m, i) => (
            <button
              key={m.id}
              className="glossy-card"
              onClick={() => onNavigate(`/models/${m.id}`)}
              style={{
                textAlign: 'left', cursor: 'pointer',
                borderRadius: 14, padding: '14px 16px',
                animation: `mountUp 380ms cubic-bezier(0.22,1,0.36,1) ${440 + i * 40}ms both`,
              }}
            >
              {/* Row 1: name + pill */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{m.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--text-dim)', marginTop: 2 }}>
                    {m.version} · {m.lastRun}
                  </div>
                </div>
                <span className={`pill ${riskPill(m.risk)} dash-glossy`}
                  style={{ height: 20, fontSize: 10, padding: '0 8px', flexShrink: 0 }}>
                  <span className="dot" />{riskLabel(m.risk)}
                </span>
              </div>

              {/* Row 2: progress bar + score inline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    width: mounted ? `${m.score}%` : '0%',
                    background: riskColor(m.risk),
                    transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
                    opacity: 0.85,
                  }} />
                </div>
                <span style={{
                  fontSize: 20, fontWeight: 900, letterSpacing: '-0.035em',
                  fontVariantNumeric: 'tabular-nums', color: riskColor(m.risk),
                  lineHeight: 1, minWidth: 44, textAlign: 'right' as const,
                }}>
                  {m.score}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, marginLeft: 1 }}>%</span>
                </span>
              </div>

              {/* Row 3: DI + arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10.5, color: 'var(--text-dim)', fontWeight: 600 }}>
                  DI {m.di} · {m.groups} groups
                </span>
                <span style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>
                  <Icon name="arrow-right" size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 5. Datasets + Recent analyses ── */}
      <div className="dash-grid">
        <div className="col-4 mount-up" style={{ animationDelay: '580ms' }}>
          <div className="card flat-card">
            <div className="card-header" style={{ padding: '18px 20px 12px' }}>
              <div>
                <div className="card-title">Datasets</div>
                <div className="card-sub">8 active · 1.9M rows total</div>
              </div>
              <button className="btn-quiet dash-glossy dash-glossy-bg" onClick={() => onNavigate('/datasets')}
                style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}>
                View all <Icon name="arrow-right" size={11} />
              </button>
            </div>
            <div className="card-body" style={{ padding: '0 20px 16px' }}>
              {DATASETS.map(d => (
                <div key={d.name} className="dataset-row dash-glossy dash-glossy-bg" onClick={() => onNavigate('/datasets')}
                  style={{ padding: '9px 12px', marginBottom: 8, borderRadius: 12, borderBottom: 'none' }}>
                  <div className="dataset-icn dash-glossy dash-glossy-bg" style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0 }}>
                    <Icon name={d.icon} size={14} />
                  </div>
                  <div className="dataset-body">
                    <div className="dataset-name" style={{ fontSize: 12.5 }}>{d.name}</div>
                    <div className="dataset-meta" style={{ fontSize: 11 }}>{d.rows} rows · {d.size} · {d.updated}</div>
                  </div>
                  <span className={`pill ${d.statusTone} dash-glossy`} style={{ height: 20, fontSize: 10, padding: '0 8px', flexShrink: 0 }}>
                    <span className="dot" />{d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-8 mount-up" style={{ animationDelay: '660ms' }}>
          <div className="card tbl-card flat-card">
            <div className="card-header" style={{ padding: '18px 20px 12px' }}>
              <div>
                <div className="card-title">Last analyses</div>
                <div className="card-sub">Most recent fairness evaluations across the workspace</div>
              </div>
              <button className="btn-quiet dash-glossy dash-glossy-bg" onClick={() => onNavigate('/analysis')}
                style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}>
                Full history <Icon name="arrow-right" size={11} />
              </button>
            </div>
            <div className="card-body" style={{ padding: 0, paddingBottom: 4 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ padding: '8px 20px' }}>Model</th>
                    <th style={{ padding: '8px 20px' }}>Score</th>
                    <th style={{ padding: '8px 20px' }}>Disparate impact</th>
                    <th style={{ padding: '8px 20px' }}>Status</th>
                    <th style={{ padding: '8px 20px', textAlign: 'right' }}>Finished</th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_ANALYSES.map(r => (
                    <tr key={r.id} onClick={() => onNavigate(`/models/${r.modelId}`)}>
                      <td style={{ padding: '11px 20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{r.model}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 1, fontWeight: 500 }}>{r.version}</div>
                      </td>
                      <td className="num" style={{
                        padding: '11px 20px',
                        color: r.risk === 'low' ? 'var(--mint)' : r.risk === 'mod' ? 'var(--amber)' : 'var(--rose)',
                        fontSize: 16, fontWeight: 900, letterSpacing: '-0.02em',
                      }}>
                        {r.score}<span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 2, fontWeight: 700 }}>%</span>
                      </td>
                      <td className="num" style={{ padding: '11px 20px', fontWeight: 700 }}>{r.di}</td>
                      <td style={{ padding: '11px 20px' }}>
                        <span className={`pill ${r.risk === 'low' ? 'pill-mint' : r.risk === 'mod' ? 'pill-amber' : 'pill-rose'} dash-glossy`}
                          style={{ height: 20, fontSize: 10, padding: '0 8px' }}>
                          <span className="dot" />
                          {r.risk === 'low' ? 'Passed' : r.risk === 'mod' ? 'Review' : 'Failed'}
                        </span>
                      </td>
                      <td style={{ padding: '11px 20px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>
                        {r.finished}
                      </td>
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChartLegend = ({ swatch, label, value, delta }: {
  swatch: React.ReactNode; label: string; value: string; delta?: string;
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
    {swatch}
    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ color: 'var(--text)', fontWeight: 900, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    {delta && (
      <span style={{ fontSize: 11, fontWeight: 700, color: delta.startsWith('+') ? 'var(--mint)' : 'var(--rose)' }}>
        {delta}
      </span>
    )}
  </div>
);

const FairLegendRow = ({ color, label, val, pct, bg }: { color: string; label: string; val: number; pct: number; bg: string }) => (
  <div className="fair-legend-item dash-glossy" style={{ padding: '6px 8px', borderRadius: 8, marginBottom: 6, background: bg }}>
    <span className="sw" style={{ background: color }} />
    <span className="lbl">{label}</span>
    <span className="val">{val}</span>
    <span className="pct">{pct}%</span>
  </div>
);

const FairnessDonut = ({ segs, centerValue }: {
  segs: { v: number; color: string }[];
  centerValue: number;
}) => {
  const mounted = useMount();
  const R = 80;
  const C = 2 * Math.PI * R;
  const gap = 6;
  let offset = 0;
  return (
    <div className="fair-donut">
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(15,30,54,0.07)" strokeWidth="22" />
        {segs.map((s, i) => {
          const len = (s.v / 100) * C - gap;
          const dasharray = `${mounted ? len : 0} ${C}`;
          const dashoffset = -offset;
          offset += (s.v / 100) * C;
          return (
            <circle key={i} cx="100" cy="100" r={R} fill="none"
              stroke={s.color} strokeWidth="22" strokeLinecap="round"
              strokeDasharray={dasharray} strokeDashoffset={dashoffset}
              style={{ transition: `stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms` }}
            />
          );
        })}
      </svg>
      <div className="fair-donut-center">
        <div className="fair-donut-value">{centerValue}<span style={{ fontSize: 22, color: 'var(--text-muted)' }}>%</span></div>
        <div className="fair-donut-label">Avg fairness</div>
      </div>
    </div>
  );
};

// ─── Composition data (per range) ────────────────────────────────────────────

function buildCompositionData(range: string) {
  if (range === '7d') return {
    avgFairness: 90, // matches buildTrendData 7d summary
    segs: [
      { v: 67, color: 'var(--mint)'  },
      { v: 17, color: 'var(--amber)' },
      { v: 17, color: 'var(--rose)'  },
    ],
    legend: [
      { color: 'var(--mint)',  label: 'Low risk',  val: 8, pct: 67, bg: 'rgba(116,194,140,0.10)' },
      { color: 'var(--amber)', label: 'Moderate',  val: 2, pct: 17, bg: 'rgba(221,160,74,0.10)'  },
      { color: 'var(--rose)',  label: 'High risk', val: 2, pct: 17, bg: 'rgba(221,107,82,0.10)'  },
    ],
  };
  if (range === '90d') return {
    avgFairness: 88, // matches buildTrendData 90d summary
    segs: [
      { v: 58, color: 'var(--mint)'  },
      { v: 25, color: 'var(--amber)' },
      { v: 17, color: 'var(--rose)'  },
    ],
    legend: [
      { color: 'var(--mint)',  label: 'Low risk',  val: 7, pct: 58, bg: 'rgba(116,194,140,0.10)' },
      { color: 'var(--amber)', label: 'Moderate',  val: 3, pct: 25, bg: 'rgba(221,160,74,0.10)'  },
      { color: 'var(--rose)',  label: 'High risk', val: 2, pct: 17, bg: 'rgba(221,107,82,0.10)'  },
    ],
  };
  return {
    avgFairness: 92,
    segs: [
      { v: 75, color: 'var(--mint)'  },
      { v: 17, color: 'var(--amber)' },
      { v:  8, color: 'var(--rose)'  },
    ],
    legend: [
      { color: 'var(--mint)',  label: 'Low risk',  val: 9, pct: 75, bg: 'rgba(116,194,140,0.10)' },
      { color: 'var(--amber)', label: 'Moderate',  val: 2, pct: 17, bg: 'rgba(221,160,74,0.10)'  },
      { color: 'var(--rose)',  label: 'High risk', val: 1, pct:  8, bg: 'rgba(221,107,82,0.10)'  },
    ],
  };
}

// ─── Trend data ───────────────────────────────────────────────────────────────

function buildTrendData(range: string) {
  if (range === '7d') return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    primary:   { unit: '%', values: [89, 90, 88, 91, 92, 92, 92] },
    secondary: { values: [82, 84, 83, 85, 86, 86, 86] },
    summary: { avgFairness: '90.0%', fairnessDelta: '+1.4', dpValue: '0.84', dpDelta: '+0.02' },
  };
  if (range === '90d') return {
    labels: Array.from({ length: 12 }, (_, i) => `W${i + 1}`),
    primary:   { unit: '%', values: [84, 85, 86, 85, 87, 88, 89, 88, 90, 91, 91, 92] },
    secondary: { values: [78, 79, 80, 80, 81, 82, 83, 83, 84, 85, 85, 86] },
    summary: { avgFairness: '88.3%', fairnessDelta: '+4.2', dpValue: '0.82', dpDelta: '+0.06' },
  };
  return {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    primary:   { unit: '%', values: [87,88,87,89,88,88,90,89,91,90,91,89,92,91,90,92,93,91,92,93,92,91,93,94,92,93,92,91,92,92] },
    secondary: { values: [80,81,81,82,81,82,83,83,84,84,85,84,85,85,84,86,86,85,86,86,85,86,86,87,86,86,85,85,86,86] },
    summary: { avgFairness: '92.4%', fairnessDelta: '+2.1', dpValue: '0.86', dpDelta: '+0.04' },
  };
}

export { Dashboard };
