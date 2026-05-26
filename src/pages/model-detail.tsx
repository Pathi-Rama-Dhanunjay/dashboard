import { useMount } from '../components/charts.tsx';

import { Icon } from '../components/icons.tsx';
import { AppShell, useToast } from './shell.tsx';
import { MODELS, riskPillClass, statusPill } from './models.tsx';
import React from 'react';
// Model detail — interactive tabs, sortable group table, AI risk summary

const TABS = [
  { id: 'group',  label: 'Group Fairness' },
  { id: 'inter',  label: 'Intersectional' },
  { id: 'error',  label: 'Error Parity' },
];

// Group fairness rows
const GROUP_DATA = [
  { name: 'Male',       rate: 0.78, di: 1.00, n: 11240, status: 'pass' },
  { name: 'Female',     rate: 0.49, di: 0.62, n: 10870, status: 'fail' },
  { name: 'Age 18-35',  rate: 0.71, di: 0.91, n: 8420,  status: 'pass' },
  { name: 'Age 36-50',  rate: 0.74, di: 0.95, n: 9120,  status: 'pass' },
  { name: 'Age 51+',    rate: 0.58, di: 0.74, n: 6778,  status: 'warn' },
];

const INTER_DATA = [
  { name: 'Female · 18-35', rate: 0.44, di: 0.56, n: 3920, status: 'fail' },
  { name: 'Female · 36-50', rate: 0.51, di: 0.65, n: 4140, status: 'fail' },
  { name: 'Female · 51+',   rate: 0.41, di: 0.53, n: 2810, status: 'fail' },
  { name: 'Male · 18-35',   rate: 0.79, di: 1.01, n: 4500, status: 'pass' },
  { name: 'Male · 36-50',   rate: 0.81, di: 1.04, n: 4980, status: 'pass' },
  { name: 'Male · 51+',     rate: 0.72, di: 0.92, n: 1760, status: 'pass' },
];

const ERROR_DATA = [
  { name: 'Male',      rate: 0.04, di: 1.00, n: 11240, status: 'pass', metric: 'FPR' },
  { name: 'Female',    rate: 0.09, di: 2.25, n: 10870, status: 'fail', metric: 'FPR' },
  { name: 'Age 18-35', rate: 0.05, di: 1.25, n: 8420,  status: 'warn', metric: 'FPR' },
  { name: 'Age 36-50', rate: 0.05, di: 1.20, n: 9120,  status: 'pass', metric: 'FPR' },
  { name: 'Age 51+',   rate: 0.08, di: 2.00, n: 6778,  status: 'fail', metric: 'FPR' },
];

const TAB_META = {
  group: { rateLabel: 'Approval rate', diLabel: 'Disparate Impact', diUnit: '',  threshold: 0.80, max: 1.30, chartTitle: 'Disparate impact by group',         chartSub: 'Approval rate ratio vs. reference group (Male) — 80% rule threshold' },
  inter: { rateLabel: 'Approval rate', diLabel: 'Disparate Impact', diUnit: '',  threshold: 0.80, max: 1.30, chartTitle: 'Intersectional disparate impact',   chartSub: 'Crossed gender × age cohorts vs. reference group (Male · 36-50)' },
  error: { rateLabel: 'False-positive rate', diLabel: 'FPR ratio',  diUnit: '',  threshold: 1.25, max: 2.50, chartTitle: 'False-positive parity',             chartSub: 'FPR ratio vs. reference group — flag above 1.25× threshold' },
};

const ModelDetail = ({ modelId, onNavigate }) => {
  const toast = useToast();
  const model = MODELS.find(m => m.id === modelId) ?? MODELS[0];
  if (!model) return null;
  const [tab, setTab] = React.useState('group');
  const [sortBy, setSortBy] = React.useState('di');
  const [sortDir, setSortDir] = React.useState('asc');
  const [highlight, setHighlight] = React.useState(null);
  const mounted = useMount();

  const meta = TAB_META[tab];
  const raw = { group: GROUP_DATA, inter: INTER_DATA, error: ERROR_DATA }[tab];

  // Reset mount animation on tab change
  const [tabKey, setTabKey] = React.useState(0);
  React.useEffect(() => { setTabKey(k => k + 1); }, [tab]);

  const sorted = React.useMemo(() => {
    const arr = [...raw];
    arr.sort((a, b) => {
      let av = a[sortBy], bv = b[sortBy];
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });
    return arr;
  }, [raw, sortBy, sortDir]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };
  const sortInd = (col) => {
    if (sortBy !== col) return '⇅';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  const fillClass = (di) => {
    if (tab === 'error') {
      if (di >= 1.50) return 'bad';
      if (di >= 1.25) return 'warn';
      return 'ok';
    }
    if (di < 0.80) return 'bad';
    if (di < 0.90) return 'warn';
    return 'ok';
  };

  const statusFor = (s) => {
    if (s === 'pass') return <span className="pill pill-mint"><span className="dot"></span>Pass</span>;
    if (s === 'warn') return <span className="pill pill-amber"><span className="dot"></span>Watch</span>;
    return <span className="pill pill-rose"><span className="dot"></span>Fail</span>;
  };

  const thresholdPct = (meta.threshold / meta.max) * 100;
  const ticks = tab === 'error' ? [0, 0.5, 1.0, 1.5, 2.0, 2.5] : [0, 0.25, 0.5, 0.75, 1.0, 1.25];

  return (
    <AppShell
      active="models"
      title={model.name}
      onNavigate={onNavigate}
      breadcrumb={[
        { label: 'Models', route: '/models' },
        { label: model.name },
      ]}
    >
      <div data-screen-label="04 Model Detail" className="mount-up">
        <div className="detail-head">
          <div className="model-icon"><Icon name={model.icon} size={22} /></div>
          <div style={{ flex: 1 }}>
            <div className="detail-title">
              {model.name}
              <span className="ver">{model.version}</span>
            </div>
            <div className="detail-sub">
              <span>Owner · ML Platform</span>
              <span className="sep">·</span>
              <span>Updated {model.updated}</span>
              <span className="sep">·</span>
              <span>{model.predictions} predictions</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {statusPill(model.status)}
            <span className={`pill ${riskPillClass(model.risk)}`}><span className="dot"></span>{model.riskLabel}</span>
            <button className="btn btn-ghost" onClick={() => toast({ title: 'Comparison opened', desc: `${model.name} vs. ${model.name} v${(parseFloat(model.version.replace('v','')) - 0.1).toFixed(1)}`, icon: 'sparkles' })}>
              <Icon name="sparkles" size={13} />Compare versions
            </button>
          </div>
        </div>

        <div className="tabs">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === 'group' && <span className="tab-count">5</span>}
              {t.id === 'inter' && <span className="tab-count">6</span>}
              {t.id === 'error' && <span className="tab-count">5</span>}
            </button>
          ))}
        </div>

        <div className="detail-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} key={tabKey}>
            {/* Bar chart card */}
            <div className="card fade-in">
              <div className="card-header">
                <div>
                  <div className="card-title">{meta.chartTitle}</div>
                  <div className="card-sub">{meta.chartSub}</div>
                </div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 11.5, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--mint)' }}></span>Pass
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--amber)' }}></span>Watch
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--rose)' }}></span>Fail
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="di-chart">
                  <div className="di-axis">
                    <div></div>
                    <div className="di-axis-track">
                      {ticks.map(t => (
                        <span key={t} style={{ left: `${(t / meta.max) * 100}%` }}>{t.toFixed(2)}</span>
                      ))}
                    </div>
                    <div></div>
                  </div>
                  {raw.map((g, i) => (
                    <div
                      key={g.name}
                      className="di-row"
                      onMouseEnter={() => setHighlight(g.name)}
                      onMouseLeave={() => setHighlight(null)}
                      style={{ opacity: highlight && highlight !== g.name ? 0.45 : 1, transition: 'opacity 150ms' }}
                    >
                      <div className="di-label">{g.name}</div>
                      <div className="di-track">
                        <div
                          className={`di-fill ${fillClass(g.di)}`}
                          style={{ width: mounted ? `${Math.min(100, (g.di / meta.max) * 100)}%` : '0%', transitionDelay: `${i * 60}ms` }}
                        ></div>
                        <div className="threshold" style={{ left: `${thresholdPct}%` }}>
                          {i === 0 && (
                            <div className="threshold-flag">Threshold {meta.threshold.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                      <div className="di-value tnum">{g.di.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Group table */}
            <div className="card fade-in">
              <div className="card-header">
                <div>
                  <div className="card-title">Group breakdown</div>
                  <div className="card-sub">Sample size n = {raw.reduce((a, r) => a + r.n, 0).toLocaleString()} · 30-day window</div>
                </div>
                <button className="btn-quiet" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
                  <Icon name="download" size={12} />CSV
                </button>
              </div>
              <table className="tbl">
                <thead>
                  <tr>
                    <th className={sortBy === 'name' ? 'sorted' : ''} onClick={() => toggleSort('name')}>
                      Group <span className="sort-ind">{sortInd('name')}</span>
                    </th>
                    <th className={sortBy === 'n' ? 'sorted' : ''} onClick={() => toggleSort('n')}>
                      Sample <span className="sort-ind">{sortInd('n')}</span>
                    </th>
                    <th className={sortBy === 'rate' ? 'sorted' : ''} onClick={() => toggleSort('rate')}>
                      {meta.rateLabel} <span className="sort-ind">{sortInd('rate')}</span>
                    </th>
                    <th className={sortBy === 'di' ? 'sorted' : ''} onClick={() => toggleSort('di')}>
                      {meta.diLabel} <span className="sort-ind">{sortInd('di')}</span>
                    </th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(g => (
                    <tr key={g.name}>
                      <td><span style={{ fontWeight: 500 }}>{g.name}</span></td>
                      <td className="num text-muted">{g.n.toLocaleString()}</td>
                      <td className="num">{(g.rate * 100).toFixed(1)}%</td>
                      <td className="num">{g.di.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }}>{statusFor(g.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right sidebar: AI Risk Summary */}
          <div>
            <div className="card risk-card">
              <div className="card-header">
                <div>
                  <div className="risk-eyebrow">
                    <Icon name="sparkles" size={11} />
                    AI risk summary
                  </div>
                  <div className="card-title" style={{ marginTop: 6 }}>Auto-generated assessment</div>
                  <div className="card-sub">Updated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · Refreshes hourly</div>
                </div>
              </div>
              <div className="card-body">
                <div className="risk-level">
                  <div className="icn"><Icon name="alert-triangle" size={16} /></div>
                  <div>
                    <div className="lvl">{model.riskLabel}</div>
                    <div className="lvl-sub">Fairness {model.fairness}/100 · Action recommended</div>
                  </div>
                </div>

                <div className="risk-section">
                  <h4>Assessment</h4>
                  <p>
                    The <strong>Female</strong> cohort shows a disparate impact of <strong>0.62</strong>,
                    falling below the regulatory 80% rule. This indicates a significant approval-rate gap
                    relative to the reference group that warrants mitigation.
                  </p>
                </div>

                <div className="risk-section">
                  <h4>Regulatory concerns</h4>
                  <ul className="risk-list danger">
                    <li><span className="bullet"><Icon name="alert-triangle" size={9} /></span><span><strong>EEOC 80% rule</strong> — likely non-compliant for Female group</span></li>
                    <li><span className="bullet"><Icon name="alert-triangle" size={9} /></span><span><strong>EU AI Act, Annex III</strong> — high-risk classification applies</span></li>
                    <li><span className="bullet"><Icon name="info" size={9} /></span><span><strong>NYC Local Law 144</strong> — annual bias audit required</span></li>
                  </ul>
                </div>

                <div className="risk-section">
                  <h4>Recommended actions</h4>
                  <ul className="risk-list ok">
                    <li><span className="bullet"><Icon name="check" size={9} /></span><span>Apply <strong>reweighting</strong> to balance Female training samples</span></li>
                    <li><span className="bullet"><Icon name="check" size={9} /></span><span>Re-evaluate <strong>feature importance</strong> on proxy variables</span></li>
                    <li><span className="bullet"><Icon name="check" size={9} /></span><span>Schedule <strong>quarterly audit</strong> with compliance team</span></li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
                  <button
                    className="btn btn-cream"
                    style={{ flex: 1 }}
                    onClick={() => toast({ title: 'Mitigation queued', desc: 'Reweighting plan for ' + model.name, icon: 'sparkles' })}
                  >
                    Apply mitigation
                  </button>
                  <button className="btn btn-ghost"><Icon name="download" size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export { ModelDetail };
