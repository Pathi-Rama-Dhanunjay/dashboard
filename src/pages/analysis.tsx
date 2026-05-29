import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell } from './shell.tsx';
import { MicroSpark } from '../components/charts.tsx';

// ── Demo data ────────────────────────────────────────────────────────────────

const RUNS = [
  { id: 'run-091', model: 'CreditRisk',     modelId: 'creditrisk',    version: 'v2.4.1', dataset: 'loan-applications-2026',    groups: 4, score: 94, di: 0.91, status: 'passed', trigger: 'scheduled', duration: '4m 12s', finished: '14m ago',   metrics: ['Demographic Parity','Equalized Odds','Calibration'] },
  { id: 'run-090', model: 'LoanApproval',   modelId: 'loanapproval',  version: 'v1.8.0', dataset: 'loan-applications-2026',    groups: 3, score: 91, di: 0.88, status: 'passed', trigger: 'manual',    duration: '2m 48s', finished: '1h ago',     metrics: ['Demographic Parity','Equalized Odds'] },
  { id: 'run-089', model: 'PricingEngine',  modelId: 'pricingengine', version: 'v3.2.0', dataset: 'pricing-events-may',        groups: 5, score: 78, di: 0.74, status: 'review', trigger: 'api',       duration: '6m 01s', finished: '3h ago',     metrics: ['Demographic Parity','Predictive Parity','Error Parity'] },
  { id: 'run-088', model: 'HireFilter',     modelId: 'hirefilter',    version: 'v0.9.2', dataset: 'hiring-records-q1',         groups: 4, score: 62, di: 0.58, status: 'failed', trigger: 'scheduled', duration: '3m 22s', finished: '6h ago',     metrics: ['Demographic Parity','Equalized Odds','Calibration','Error Parity'] },
  { id: 'run-087', model: 'FraudGuard',     modelId: 'fraudguard',    version: 'v4.1.3', dataset: 'fraud-flags-rolling',       groups: 3, score: 89, di: 0.86, status: 'passed', trigger: 'scheduled', duration: '1m 57s', finished: 'Yesterday',  metrics: ['Demographic Parity','Error Parity'] },
  { id: 'run-086', model: 'ChurnPredict',   modelId: 'churnpredict',  version: 'v2.0.4', dataset: 'customer-churn-q2',         groups: 4, score: 49, di: 0.51, status: 'failed', trigger: 'manual',    duration: '5m 14s', finished: 'Yesterday',  metrics: ['Demographic Parity','Equalized Odds','Predictive Parity'] },
  { id: 'run-085', model: 'CreditRisk',     modelId: 'creditrisk',    version: 'v2.4.0', dataset: 'loan-applications-2026',    groups: 4, score: 92, di: 0.89, status: 'passed', trigger: 'scheduled', duration: '4m 08s', finished: '2 days ago', metrics: ['Demographic Parity','Equalized Odds','Calibration'] },
  { id: 'run-084', model: 'LoanApproval',   modelId: 'loanapproval',  version: 'v1.8.0', dataset: 'insurance-claims-2026',     groups: 3, score: 88, di: 0.85, status: 'passed', trigger: 'api',       duration: '3m 31s', finished: '2 days ago', metrics: ['Demographic Parity','Calibration'] },
  { id: 'run-083', model: 'HireFilter',     modelId: 'hirefilter',    version: 'v0.9.1', dataset: 'hiring-records-q1',         groups: 4, score: 64, di: 0.60, status: 'failed', trigger: 'scheduled', duration: '3m 18s', finished: '3 days ago', metrics: ['Demographic Parity','Equalized Odds'] },
  { id: 'run-082', model: 'PricingEngine',  modelId: 'pricingengine', version: 'v3.1.9', dataset: 'pricing-events-may',        groups: 5, score: 81, di: 0.79, status: 'review', trigger: 'manual',    duration: '5m 55s', finished: '3 days ago', metrics: ['Demographic Parity','Predictive Parity'] },
  { id: 'run-081', model: 'FraudGuard',     modelId: 'fraudguard',    version: 'v4.1.2', dataset: 'fraud-flags-rolling',       groups: 3, score: 91, di: 0.88, status: 'passed', trigger: 'scheduled', duration: '2m 04s', finished: '4 days ago', metrics: ['Demographic Parity','Error Parity'] },
  { id: 'run-080', model: 'ChurnPredict',   modelId: 'churnpredict',  version: 'v2.0.3', dataset: 'customer-churn-q2',         groups: 4, score: 52, di: 0.54, status: 'failed', trigger: 'scheduled', duration: '4m 47s', finished: '5 days ago', metrics: ['Demographic Parity','Equalized Odds'] },
  { id: 'run-079', model: 'CreditRisk',     modelId: 'creditrisk',    version: 'v2.3.9', dataset: 'loan-applications-2026',    groups: 4, score: 90, di: 0.87, status: 'passed', trigger: 'scheduled', duration: '4m 22s', finished: '6 days ago', metrics: ['Demographic Parity','Calibration'] },
  { id: 'run-078', model: 'LoanApproval',   modelId: 'loanapproval',  version: 'v1.7.9', dataset: 'loan-applications-2026',    groups: 3, score: 86, di: 0.83, status: 'review', trigger: 'manual',    duration: '2m 56s', finished: '1 week ago', metrics: ['Demographic Parity','Equalized Odds'] },
  { id: 'run-077', model: 'FraudGuard',     modelId: 'fraudguard',    version: 'v4.1.2', dataset: 'fraud-flags-rolling',       groups: 3, score: 93, di: 0.90, status: 'passed', trigger: 'scheduled', duration: '1m 49s', finished: '1 week ago', metrics: ['Demographic Parity'] },
];

const MODEL_SPARKS = [
  { name: 'CreditRisk',    risk: 'low',  score: 94, delta: '+2', spark: [88, 89, 90, 90, 91, 92, 92, 93, 92, 94, 94, 94] },
  { name: 'LoanApproval',  risk: 'low',  score: 91, delta: '+3', spark: [84, 85, 86, 86, 87, 88, 88, 89, 89, 90, 91, 91] },
  { name: 'PricingEngine', risk: 'mod',  score: 78, delta: '-3', spark: [83, 82, 81, 82, 80, 81, 79, 80, 79, 78, 78, 78] },
  { name: 'HireFilter',    risk: 'high', score: 62, delta: '-2', spark: [68, 67, 66, 65, 64, 65, 63, 63, 64, 62, 62, 62] },
  { name: 'FraudGuard',    risk: 'low',  score: 89, delta: '+0', spark: [88, 89, 88, 89, 90, 89, 90, 90, 89, 89, 89, 89] },
  { name: 'ChurnPredict',  risk: 'high', score: 49, delta: '-3', spark: [56, 55, 54, 54, 53, 52, 52, 51, 52, 50, 49, 49] },
];

const ANALYSIS_KPIS = [
  { label: 'Runs this week',  value: 47,   unit: '',    delta: 18,  deltaUnit: '%', spark: [22, 28, 26, 31, 35, 33, 38, 40, 39, 44, 45, 47] },
  { label: 'Pass rate',       value: 61,   unit: '%',   delta: 4,   deltaUnit: '%', spark: [54, 55, 56, 57, 57, 58, 59, 58, 60, 60, 61, 61] },
  { label: 'Avg fairness',    value: 76,   unit: '%',   delta: 1.2, deltaUnit: '%', spark: [72, 73, 73, 74, 74, 75, 74, 75, 75, 76, 76, 76] },
  { label: 'Failed runs',     value: 4,    unit: '',    delta: -20, deltaUnit: '%', spark: [8, 7, 6, 6, 5, 5, 5, 4, 5, 4, 4, 4] },
  { label: 'Median duration', value: '3.4', unit: 'm',  delta: -8,  deltaUnit: '%', spark: [4.2, 4.0, 3.9, 3.8, 3.7, 3.8, 3.6, 3.5, 3.5, 3.4, 3.4, 3.4] },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const statusProps = (s: string) => ({
  passed:  { cls: 'pill-mint',  label: 'Passed'  },
  review:  { cls: 'pill-amber', label: 'Review'  },
  failed:  { cls: 'pill-rose',  label: 'Failed'  },
  running: { cls: 'pill-cream', label: 'Running' },
}[s] ?? { cls: '', label: s });

const triggerIcon = (t: string) => ({
  scheduled: 'clock',
  manual:    'user-plus',
  api:       'cube',
} as const)[t] ?? 'play';

const riskColor = (r: string) => ({
  low:  'var(--mint)',
  mod:  'var(--amber)',
  high: 'var(--rose)',
}[r] ?? 'var(--text-dim)');

// ── Main component ────────────────────────────────────────────────────────────

const AnalysisList = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  const [filter,   setFilter]   = React.useState('all');
  const [query,    setQuery]    = React.useState('');
  const [sortBy,   setSortBy]   = React.useState('finished');
  const [sortDir,  setSortDir]  = React.useState('asc');
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const counts = {
    all:     RUNS.length,
    passed:  RUNS.filter(r => r.status === 'passed').length,
    review:  RUNS.filter(r => r.status === 'review').length,
    failed:  RUNS.filter(r => r.status === 'failed').length,
    running: RUNS.filter(r => r.status === 'running').length,
  };

  const filtered = RUNS.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (query && !r.model.toLowerCase().includes(query.toLowerCase()) &&
        !r.dataset.toLowerCase().includes(query.toLowerCase()) &&
        !r.id.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };
  const sortInd = (col: string) => sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : '⇅';

  return (
    <AppShell active="analysis" onNavigate={onNavigate}>

      {/* ── Header ── */}
      <div className="page-head mount-up">
        <div>
          <div className="dash-page-label" style={{ marginBottom: 12 }}>Analysis</div>
          <h1>Fairness <span className="ital">runs</span>.</h1>
          <p className="sub">
            {RUNS.length} total runs · {counts.passed} passed · {counts.failed} failed · last run 14m ago
          </p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost"><Icon name="download" size={13} />Export</button>
          <button className="btn btn-cream"><Icon name="play" size={12} />New run</button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="kpi-strip" style={{ marginBottom: 24 }}>
        {ANALYSIS_KPIS.map((k, i) => (
          <div key={k.label} className="kpi-tile mount-up" style={{ animationDelay: `${60 + i * 60}ms` }}>
            <div className="kpi-tile-label">{k.label}</div>
            <div className="kpi-tile-value">
              {k.value}{k.unit && <span className="unit">{k.unit}</span>}
            </div>
            <div className={`kpi-tile-delta ${k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat'}`}>
              {k.delta > 0 ? '▲' : k.delta < 0 ? '▼' : '◆'} {Math.abs(k.delta)}{k.deltaUnit}
              <span style={{ fontWeight: 500, color: 'inherit', opacity: 0.7, marginLeft: 2 }}>vs last week</span>
            </div>
            <div className="kpi-tile-spark">
              <MicroSpark values={k.spark} color={k.delta >= 0 ? 'var(--mint)' : 'var(--rose)'} width={120} height={28} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Model health strip ── */}
      <section className="mount-up" style={{ animationDelay: '380ms', marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '-0.01em' }}>
          Model trend — last 12 runs
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {MODEL_SPARKS.map(m => (
            <button
              key={m.name}
              className="card flat-card"
              style={{ padding: '12px 14px', cursor: 'pointer', textAlign: 'left', width: '100%' }}
              onClick={() => onNavigate('/models/' + m.name.toLowerCase())}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>{m.name}</div>
                <span style={{ fontSize: 11, fontWeight: 700, color: m.delta.startsWith('+') ? 'var(--mint)' : m.delta === '+0' ? 'var(--text-muted)' : 'var(--rose)' }}>
                  {m.delta}
                </span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', color: riskColor(m.risk), marginBottom: 4 }}>
                {m.score}<span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 600 }}>%</span>
              </div>
              <MicroSpark values={m.spark} color={riskColor(m.risk)} width={160} height={22} />
            </button>
          ))}
        </div>
      </section>

      {/* ── Filter row ── */}
      <div className="filter-row mount-up" style={{ animationDelay: '440ms' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search runs, models, datasets…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all',     label: 'All'     },
            { id: 'passed',  label: 'Passed'  },
            { id: 'review',  label: 'Review'  },
            { id: 'failed',  label: 'Failed'  },
            { id: 'running', label: 'Running' },
          ].map(f => (
            <button key={f.id} className={`chip ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}<span className="count">{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <button className="chip" style={{ marginLeft: 'auto' }}>
          <Icon name="filter" size={12} />More filters
        </button>
      </div>

      {/* ── Run history table ── */}
      {filtered.length === 0 ? (
        <div className="empty-card mount-up">
          <div className="empty-icn"><Icon name="analysis" size={26} /></div>
          <div className="empty-title">No runs match your <span className="ital">filters</span>.</div>
          <div className="empty-sub">Try clearing the search or selecting a different status filter.</div>
          <button className="btn btn-ghost" onClick={() => { setFilter('all'); setQuery(''); }}>Reset filters</button>
        </div>
      ) : (
        <div className="card tbl-card flat-card mount-up" style={{ animationDelay: '500ms' }}>
          <div className="card-header" style={{ padding: '14px 20px 10px' }}>
            <div>
              <div className="card-title">Run history</div>
              <div className="card-sub">{filtered.length} of {RUNS.length} runs shown</div>
            </div>
            <button className="btn-quiet" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6 }}>
              <Icon name="download" size={12} />CSV
            </button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th className={sortBy === 'id' ? 'sorted' : ''} onClick={() => toggleSort('id')} style={{ width: 90 }}>
                    Run <span className="sort-ind">{sortInd('id')}</span>
                  </th>
                  <th className={sortBy === 'model' ? 'sorted' : ''} onClick={() => toggleSort('model')}>
                    Model <span className="sort-ind">{sortInd('model')}</span>
                  </th>
                  <th>Dataset</th>
                  <th className={sortBy === 'score' ? 'sorted' : ''} onClick={() => toggleSort('score')} style={{ width: 80 }}>
                    Score <span className="sort-ind">{sortInd('score')}</span>
                  </th>
                  <th className={sortBy === 'di' ? 'sorted' : ''} onClick={() => toggleSort('di')} style={{ width: 80 }}>
                    Disp. Impact <span className="sort-ind">{sortInd('di')}</span>
                  </th>
                  <th style={{ width: 70 }}>Groups</th>
                  <th style={{ width: 80 }}>Trigger</th>
                  <th style={{ width: 90 }}>Duration</th>
                  <th style={{ width: 90 }}>Status</th>
                  <th style={{ textAlign: 'right', width: 110 }}>Finished</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sp = statusProps(r.status);
                  const isOpen = expanded === r.id;
                  return (
                    <React.Fragment key={r.id}>
                      <tr
                        style={{ cursor: 'pointer', background: isOpen ? 'rgba(255,255,255,0.03)' : undefined }}
                        onClick={() => setExpanded(isOpen ? null : r.id)}
                      >
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 }}>{r.id}</span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{r.model}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontWeight: 500 }}>{r.version}</div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500 }}>{r.dataset}</td>
                        <td className="num" style={{
                          fontSize: 17, fontWeight: 900, letterSpacing: '-0.02em',
                          color: r.score >= 90 ? 'var(--mint)' : r.score >= 75 ? 'var(--amber)' : 'var(--rose)',
                        }}>
                          {r.score}<span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 1, fontWeight: 700 }}>%</span>
                        </td>
                        <td className="num" style={{ fontWeight: 700 }}>{r.di.toFixed(2)}</td>
                        <td className="num" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{r.groups}</td>
                        <td>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                            <Icon name={triggerIcon(r.trigger) as any} size={12} />
                            {r.trigger}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>{r.duration}</td>
                        <td>
                          <span className={`pill ${sp.cls}`}><span className="dot"></span>{sp.label}</span>
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600, fontSize: 12 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                            {r.finished}
                            <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={12} />
                          </span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <td colSpan={10} style={{ padding: '12px 20px 16px' }}>
                            <RunDetail run={r} onNavigate={onNavigate} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Scheduled runs ── */}
      <div className="mount-up" style={{ animationDelay: '620ms', marginTop: 36 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Scheduled analyses</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Upcoming automated fairness evaluations
            </div>
          </div>
          <button className="btn btn-ghost" style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5 }}>
            <Icon name="plus" size={12} />Add schedule
          </button>
        </div>
        <div className="card tbl-card flat-card">
          <div className="card-body">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Dataset</th>
                  <th>Cadence</th>
                  <th>Metrics</th>
                  <th>Next run</th>
                  <th style={{ textAlign: 'right' }}>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULES.map(s => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{s.model}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, fontWeight: 500 }}>{s.version}</div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500 }}>{s.dataset}</td>
                    <td style={{ fontWeight: 600, fontSize: 12.5 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--text-dim)' }}>
                        <Icon name="clock" size={12} />{s.cadence}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {s.metrics.map(m => (
                          <span key={m} style={{
                            padding: '2px 7px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                            background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}>{m}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 12.5 }}>{s.next}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`pill ${s.enabled ? 'pill-mint' : 'pill-dim'}`} style={{ opacity: s.enabled ? 1 : 0.55 }}>
                        <span className="dot"></span>{s.enabled ? 'Active' : 'Paused'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </AppShell>
  );
};

// ── Inline run detail (expanded row) ─────────────────────────────────────────

const RunDetail = ({ run, onNavigate }: { run: typeof RUNS[0]; onNavigate: (r: string) => void }) => (
  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
    <div style={{ flex: '1 1 260px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
        Metrics evaluated
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {run.metrics.map(m => (
          <span key={m} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: 'rgba(20,184,166,0.1)', color: 'var(--mint)',
            border: '1px solid rgba(20,184,166,0.2)',
          }}>
            <Icon name="check" size={11} />{m}
          </span>
        ))}
      </div>
    </div>
    <div style={{ flex: '1 1 180px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
        Run info
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { label: 'Run ID',     val: run.id },
          { label: 'Triggered',  val: run.trigger },
          { label: 'Protected groups', val: run.groups + ' groups' },
          { label: 'Duration',   val: run.duration },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', gap: 8, fontSize: 12 }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600, minWidth: 110 }}>{row.label}</span>
            <span style={{ color: 'var(--text)', fontWeight: 700 }}>{row.val}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <button
        className="btn btn-ghost"
        style={{ height: 32, fontSize: 12 }}
        onClick={() => onNavigate('/models/' + run.modelId)}
      >
        View model <Icon name="arrow-right" size={12} />
      </button>
      <button className="btn btn-ghost" style={{ height: 32, fontSize: 12 }}>
        <Icon name="download" size={12} />Download report
      </button>
    </div>
  </div>
);

// ── Static data ───────────────────────────────────────────────────────────────

const SCHEDULES = [
  { id: 's1', model: 'CreditRisk',    version: 'v2.4.1', dataset: 'loan-applications-2026', cadence: 'Daily · 02:00 UTC',   metrics: ['Dem. Parity', 'Equalized Odds'], next: 'Today, 02:00',    enabled: true  },
  { id: 's2', model: 'HireFilter',    version: 'v0.9.2', dataset: 'hiring-records-q1',      cadence: 'Daily · 03:30 UTC',   metrics: ['Dem. Parity', 'Error Parity'],   next: 'Today, 03:30',    enabled: true  },
  { id: 's3', model: 'FraudGuard',    version: 'v4.1.3', dataset: 'fraud-flags-rolling',    cadence: 'Every 6h',            metrics: ['Dem. Parity'],                    next: 'In 2h 14m',       enabled: true  },
  { id: 's4', model: 'PricingEngine', version: 'v3.2.0', dataset: 'pricing-events-may',     cadence: 'Weekly · Mon 06:00',  metrics: ['Dem. Parity', 'Pred. Parity'],   next: 'Mon, Jun 2',      enabled: true  },
  { id: 's5', model: 'ChurnPredict',  version: 'v2.0.4', dataset: 'customer-churn-q2',      cadence: 'Weekly · Wed 08:00',  metrics: ['Dem. Parity', 'Eq. Odds'],       next: 'Wed, Jun 4',      enabled: false },
];

export { AnalysisList };
