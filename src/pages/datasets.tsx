import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell } from './shell.tsx';

const DATASETS = [
  {
    id: 'loan-applications-2026',
    name: 'loan-applications-2026',
    format: 'Parquet',
    rows: '482K', rowsRaw: 482000,
    size: '1.2 GB', columns: 47,
    protectedAttrs: ['age', 'gender', 'race', 'zip_code'],
    models: 3, status: 'ready', statusLabel: 'Ready', quality: 97,
    lastProfiled: '2h ago', updated: 'May 29, 2026',
    source: 'S3 · us-east-1', icon: 'datasets' as const, tag: 'finance',
  },
  {
    id: 'hiring-records-q1',
    name: 'hiring-records-q1',
    format: 'CSV',
    rows: '128K', rowsRaw: 128000,
    size: '341 MB', columns: 32,
    protectedAttrs: ['gender', 'age', 'ethnicity'],
    models: 1, status: 'ready', statusLabel: 'Ready', quality: 94,
    lastProfiled: 'Yesterday', updated: 'May 28, 2026',
    source: 'GCS · eu-west-1', icon: 'datasets' as const, tag: 'hr',
  },
  {
    id: 'pricing-events-may',
    name: 'pricing-events-may',
    format: 'Parquet',
    rows: '612K', rowsRaw: 612000,
    size: '1.8 GB', columns: 61,
    protectedAttrs: ['zip_code', 'income_band'],
    models: 2, status: 'profiling', statusLabel: 'Profiling', quality: null,
    lastProfiled: 'In progress', updated: 'May 29, 2026',
    source: 'Snowflake · prod', icon: 'database' as const, tag: 'commerce',
  },
  {
    id: 'fraud-flags-rolling',
    name: 'fraud-flags-rolling',
    format: 'JSON',
    rows: '94K', rowsRaw: 94000,
    size: '218 MB', columns: 28,
    protectedAttrs: ['age', 'country'],
    models: 1, status: 'setup', statusLabel: 'Setup', quality: null,
    lastProfiled: 'Not profiled', updated: 'May 26, 2026',
    source: 'Kafka stream', icon: 'database' as const, tag: 'security',
  },
  {
    id: 'customer-churn-q2',
    name: 'customer-churn-q2',
    format: 'CSV',
    rows: '218K', rowsRaw: 218000,
    size: '524 MB', columns: 39,
    protectedAttrs: ['age', 'gender', 'location'],
    models: 2, status: 'ready', statusLabel: 'Ready', quality: 91,
    lastProfiled: '3 days ago', updated: 'May 25, 2026',
    source: 'BigQuery · prod', icon: 'datasets' as const, tag: 'commerce',
  },
  {
    id: 'insurance-claims-2026',
    name: 'insurance-claims-2026',
    format: 'Parquet',
    rows: '344K', rowsRaw: 344000,
    size: '892 MB', columns: 54,
    protectedAttrs: ['age', 'gender', 'marital_status', 'zip_code'],
    models: 2, status: 'ready', statusLabel: 'Ready', quality: 88,
    lastProfiled: '1 week ago', updated: 'May 22, 2026',
    source: 'S3 · us-west-2', icon: 'datasets' as const, tag: 'finance',
  },
  {
    id: 'synthetic-aug-demographics',
    name: 'synthetic-aug-demographics',
    format: 'CSV',
    rows: '50K', rowsRaw: 50000,
    size: '124 MB', columns: 22,
    protectedAttrs: ['age', 'gender', 'race', 'income'],
    models: 1, status: 'ready', statusLabel: 'Ready', quality: 99,
    lastProfiled: '4 days ago', updated: 'May 24, 2026',
    source: 'Synthetic · generated', icon: 'cube' as const, tag: 'research',
  },
  {
    id: 'vendor-contracts-q1',
    name: 'vendor-contracts-q1',
    format: 'JSON',
    rows: '27K', rowsRaw: 27000,
    size: '68 MB', columns: 19,
    protectedAttrs: ['country', 'company_size'],
    models: 0, status: 'setup', statusLabel: 'Setup', quality: null,
    lastProfiled: 'Not profiled', updated: 'May 20, 2026',
    source: 'REST API · v2', icon: 'folder' as const, tag: 'finance',
  },
];

const RECENT_RUNS = [
  { id: 'r1', dataset: 'loan-applications-2026',    cols: 47, issues: 2,    completeness: 98.4, duration: '4m 12s', finished: '2h ago',     status: 'passed'  },
  { id: 'r2', dataset: 'hiring-records-q1',          cols: 32, issues: 0,    completeness: 99.7, duration: '1m 48s', finished: 'Yesterday',  status: 'passed'  },
  { id: 'r3', dataset: 'pricing-events-may',         cols: 61, issues: null, completeness: null, duration: null,     finished: 'In progress', status: 'running' },
  { id: 'r4', dataset: 'customer-churn-q2',          cols: 39, issues: 5,    completeness: 94.1, duration: '2m 33s', finished: '3 days ago', status: 'warning' },
  { id: 'r5', dataset: 'insurance-claims-2026',      cols: 54, issues: 8,    completeness: 91.2, duration: '6m 04s', finished: '1 week ago', status: 'warning' },
  { id: 'r6', dataset: 'synthetic-aug-demographics', cols: 22, issues: 0,    completeness: 100,  duration: '0m 52s', finished: '4 days ago', status: 'passed'  },
];

const DATASET_KPIS = [
  { label: 'Total datasets',     value: 8,    unit: '',    delta: 14,  deltaUnit: '%' },
  { label: 'Total rows',         value: '1.9', unit: 'M',  delta: 8,   deltaUnit: '%' },
  { label: 'Storage used',       value: '5.2', unit: 'GB', delta: 22,  deltaUnit: '%' },
  { label: 'Avg quality score',  value: 94,   unit: '%',   delta: 1.4, deltaUnit: '%' },
  { label: 'Profiled this week', value: 3,    unit: '',    delta: -25, deltaUnit: '%' },
];

const statusTone = (s: string) =>
  ({ ready: 'pill-mint', profiling: 'pill-cream', setup: 'pill-amber' }[s] || '');

const fmtBadge = (fmt: string) =>
  ({
    Parquet: { bg: 'rgba(20,184,166,0.15)', color: '#0f766e' },
    CSV:     { bg: 'rgba(255,206,118,0.18)', color: '#b97d10' },
    JSON:    { bg: 'rgba(139,92,246,0.15)',  color: '#a78bfa' },
  }[fmt] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-dim)' });

const AttrChip = ({ label }: { label: string }) => (
  <span style={{
    display: 'inline-block', padding: '2px 7px', borderRadius: 5,
    fontSize: 11, fontWeight: 600,
    background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)',
    border: '1px solid rgba(255,255,255,0.08)',
  }}>{label}</span>
);

const DatasetsList = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  const [filter, setFilter] = React.useState('all');
  const [query,  setQuery]  = React.useState('');

  const filtered = DATASETS.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false;
    if (query && !d.name.toLowerCase().includes(query.toLowerCase()) && !d.tag.includes(query.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all:      DATASETS.length,
    ready:    DATASETS.filter(d => d.status === 'ready').length,
    profiling:DATASETS.filter(d => d.status === 'profiling').length,
    setup:    DATASETS.filter(d => d.status === 'setup').length,
  };

  const totalRows = DATASETS.reduce((s, d) => s + d.rowsRaw, 0);

  return (
    <AppShell active="datasets" onNavigate={onNavigate}>

      {/* ── Header ── */}
      <div className="page-head mount-up">
        <div>
          <div className="dash-page-label" style={{ marginBottom: 12 }}>Datasets</div>
          <h1>All <span className="ital">Datasets</span>.</h1>
          <p className="sub">
            {DATASETS.length} registered · {filtered.length} shown · {totalRows.toLocaleString()} rows total
          </p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost"><Icon name="download" size={13} />Export</button>
          <button className="btn btn-cream"><Icon name="upload" size={13} />Upload dataset</button>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div className="kpi-strip" style={{ marginBottom: 24 }}>
        {DATASET_KPIS.map((k, i) => (
          <div key={k.label} className="kpi-tile mount-up" style={{ animationDelay: `${60 + i * 60}ms` }}>
            <div className="kpi-tile-label">{k.label}</div>
            <div className="kpi-tile-value">
              {k.value}{k.unit && <span className="unit">{k.unit}</span>}
            </div>
            <div className={`kpi-tile-delta ${k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat'}`}>
              {k.delta > 0 ? '▲' : k.delta < 0 ? '▼' : '◆'} {Math.abs(k.delta)}{k.deltaUnit}
              <span style={{ fontWeight: 500, color: 'inherit', opacity: 0.7, marginLeft: 2 }}>vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter row ── */}
      <div className="filter-row mount-up" style={{ animationDelay: '80ms' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search datasets…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all',      label: 'All'      },
            { id: 'ready',    label: 'Ready'    },
            { id: 'profiling',label: 'Profiling'},
            { id: 'setup',    label: 'Setup'    },
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

      {/* ── Dataset grid ── */}
      {filtered.length === 0 ? (
        <div className="empty-card mount-up">
          <div className="empty-icn"><Icon name="datasets" size={26} /></div>
          <div className="empty-title">No datasets match your <span className="ital">filters</span>.</div>
          <div className="empty-sub">Try clearing the search or switching to a different filter chip.</div>
          <button className="btn btn-ghost" onClick={() => { setFilter('all'); setQuery(''); }}>Reset filters</button>
        </div>
      ) : (
        <div className="models-grid">
          {filtered.map((d, i) => {
            const fmt = fmtBadge(d.format);
            return (
              <div key={d.id} className="card model-card mount-up" style={{ animationDelay: `${80 + i * 50}ms` }}>

                {/* Head */}
                <div className="model-card-head">
                  <div className="model-icon"><Icon name={d.icon} size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="model-name" style={{ fontSize: 13.5 }}>{d.name}</div>
                    <div className="model-version">
                      <span>{d.source}</span>
                      <span style={{ color: 'var(--text-faint)' }}>·</span>
                      <span>{d.updated}</span>
                    </div>
                  </div>
                  <button className="btn-quiet" style={{ width: 28, height: 28, borderRadius: 7 }}>
                    <Icon name="more-h" size={14} />
                  </button>
                </div>

                {/* Status + format badges */}
                <div className="model-meta-row" style={{ gap: 6 }}>
                  <span className={`pill ${statusTone(d.status)}`}>
                    <span className="dot"></span>{d.statusLabel}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: fmt.bg, color: fmt.color,
                  }}>{d.format}</span>
                </div>

                {/* Stats */}
                <div className="model-stats">
                  <div>
                    <div className="model-stat-lbl">Rows</div>
                    <div className="model-stat-val">{d.rows}</div>
                  </div>
                  <div>
                    <div className="model-stat-lbl">Size</div>
                    <div className="model-stat-val">{d.size}</div>
                  </div>
                  <div>
                    <div className="model-stat-lbl">Cols</div>
                    <div className="model-stat-val">{d.columns}</div>
                  </div>
                  {d.quality != null && (
                    <div>
                      <div className="model-stat-lbl">Quality</div>
                      <div className="model-stat-val" style={{
                        color: d.quality >= 95 ? 'var(--mint)' : d.quality >= 85 ? 'var(--amber)' : 'var(--rose)',
                      }}>
                        {d.quality}<span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400 }}>/100</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Protected attributes */}
                <div style={{ marginTop: 14 }}>
                  <div style={{
                    fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7,
                  }}>Protected attributes</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {d.protectedAttrs.map(a => <AttrChip key={a} label={a} />)}
                  </div>
                </div>

                {/* Footer */}
                <div className="model-card-foot" style={{ justifyContent: 'space-between', marginTop: 16 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon name="models" size={12} />
                    {d.models} {d.models === 1 ? 'model' : 'models'} · {d.lastProfiled}
                  </span>
                  <button className="btn btn-ghost" style={{ height: 30, padding: '0 12px', fontSize: 12 }}>
                    View details <Icon name="arrow-right" size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Recent profiling runs ── */}
      <div className="mount-up" style={{ animationDelay: '700ms', marginTop: 36 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Recent profiling runs</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Latest data quality and schema scans across all datasets
            </div>
          </div>
          <button className="btn btn-ghost" style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5 }}>
            <Icon name="play" size={12} />Run profiler
          </button>
        </div>
        <div className="card tbl-card flat-card">
          <div className="card-body">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Dataset</th>
                  <th>Columns</th>
                  <th>Completeness</th>
                  <th>Issues</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Finished</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_RUNS.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{r.dataset}</div>
                    </td>
                    <td className="num" style={{ fontWeight: 600 }}>{r.cols}</td>
                    <td className="num" style={{
                      fontWeight: 700,
                      color: r.completeness == null ? 'var(--text-dim)' : r.completeness >= 97 ? 'var(--mint)' : r.completeness >= 92 ? 'var(--amber)' : 'var(--rose)',
                    }}>
                      {r.completeness != null ? `${r.completeness}%` : '—'}
                    </td>
                    <td className="num" style={{
                      fontWeight: 700,
                      color: r.issues == null ? 'var(--text-dim)' : r.issues === 0 ? 'var(--mint)' : r.issues <= 3 ? 'var(--amber)' : 'var(--rose)',
                    }}>
                      {r.issues != null ? r.issues : '—'}
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontWeight: 600, fontSize: 12 }}>{r.duration ?? '—'}</td>
                    <td>
                      <span className={`pill ${r.status === 'passed' ? 'pill-mint' : r.status === 'running' ? 'pill-cream' : 'pill-amber'}`}>
                        <span className="dot"></span>
                        {r.status === 'passed' ? 'Passed' : r.status === 'running' ? 'Running' : 'Warning'}
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

    </AppShell>
  );
};

export { DatasetsList };
export { DATASETS };
