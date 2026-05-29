import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell } from './shell.tsx';

const FEATURES = [
  { name: 'income_band',      value: 0.34 },
  { name: 'zip_code',         value: 0.28 },
  { name: 'credit_history',   value: 0.19 },
  { name: 'employment_type',  value: 0.11 },
  { name: 'education',        value: 0.09 },
  { name: 'marital_status',   value: 0.06 },
  { name: 'age_proxy',        value: 0.04 },
  { name: 'payment_history',  value: 0.02 },
];

const COHORT_CELLS = [
  { row: 'Male',       col: '18–35', di: 1.01 },
  { row: 'Male',       col: '36–50', di: 1.04 },
  { row: 'Male',       col: '51+',   di: 0.92 },
  { row: 'Female',     col: '18–35', di: 0.56 },
  { row: 'Female',     col: '36–50', di: 0.65 },
  { row: 'Female',     col: '51+',   di: 0.53 },
  { row: 'Non-binary', col: '18–35', di: 0.71 },
  { row: 'Non-binary', col: '36–50', di: 0.74 },
  { row: 'Non-binary', col: '51+',   di: 0.68 },
];

const ROWS = ['Male', 'Female', 'Non-binary'] as const;
const COLS = ['18–35', '36–50', '51+'] as const;

const COUNTERFACTUALS = [
  { id: '#48291', orig: 'Approved (0.81)', attr: 'gender: M→F',        cf: 'Denied (0.43)',   delta: '-0.38', flip: true  },
  { id: '#31047', orig: 'Denied (0.38)',   attr: 'gender: F→M',        cf: 'Approved (0.76)', delta: '+0.38', flip: true  },
  { id: '#62918', orig: 'Approved (0.79)', attr: 'zip_code: 90210→90011', cf: 'Approved (0.71)', delta: '-0.08', flip: false },
  { id: '#19384', orig: 'Denied (0.41)',   attr: 'age: 28→45',         cf: 'Approved (0.62)', delta: '+0.21', flip: true  },
  { id: '#77203', orig: 'Approved (0.88)', attr: 'race: White→Black',  cf: 'Denied (0.49)',   delta: '-0.39', flip: true  },
];

const DIST_COHORTS = [
  { name: 'Male',       buckets: [5, 8, 12, 28, 47], avg: 74 },
  { name: 'Female',     buckets: [18, 24, 31, 19, 8], avg: 43 },
  { name: 'Non-binary', buckets: [12, 18, 28, 28, 14], avg: 52 },
];

const BUCKET_COLORS = [
  'var(--rose)',
  'var(--amber)',
  'rgba(244,241,232,0.25)',
  'rgba(116,194,140,0.45)',
  'var(--mint)',
] as const;

const featureBarColor = (v: number) => {
  if (v <= 0.10) return 'var(--mint)';
  if (v <= 0.20) return 'var(--amber)';
  return 'var(--rose)';
};

const diCellStyle = (di: number): React.CSSProperties => {
  if (di >= 0.80) return {
    background: 'rgba(116,194,140,0.18)',
    border: '1px solid rgba(116,194,140,0.30)',
  };
  if (di >= 0.65) return {
    background: 'rgba(221,160,74,0.15)',
    border: '1px solid rgba(221,160,74,0.28)',
  };
  return {
    background: 'rgba(221,107,82,0.18)',
    border: '1px solid rgba(221,107,82,0.30)',
  };
};

const diTextColor = (di: number) => {
  if (di >= 0.80) return 'var(--mint)';
  if (di >= 0.65) return 'var(--amber)';
  return 'var(--rose)';
};

const SectionHeader = ({
  title,
  sub,
}: {
  title: string;
  sub: string;
}) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>{title}</div>
    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{sub}</div>
  </div>
);

const SELECT_STYLE: React.CSSProperties = {
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  fontWeight: 600,
  padding: '0 30px 0 10px',
  height: 34,
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B70' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

const DeepDive = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  return (
    <AppShell active="deepdive" onNavigate={onNavigate}>

      {/* 1 — Page header */}
      <div className="page-head mount-up">
        <div>
          <div className="dash-page-label" style={{ marginBottom: 12 }}>Deep Dive</div>
          <h1>Explore <span className="ital">bias</span>.</h1>
          <p className="sub">Drill into cohort-level patterns, feature correlations, and counterfactuals</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost">
            <Icon name="download" size={13} />Export report
          </button>
          <button className="btn btn-cream">
            <Icon name="sparkles" size={13} />New exploration
          </button>
        </div>
      </div>

      {/* 2 — Model + Dataset selector row */}
      <div
        className="mount-up"
        style={{
          animationDelay: '60ms',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 28,
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>Exploring:</span>
        <div style={{ position: 'relative' }}>
          <select style={SELECT_STYLE} defaultValue="CreditRisk v2.4.1">
            <option>CreditRisk v2.4.1</option>
            <option>LoanApproval v1.8.0</option>
            <option>HireFilter v0.9.2</option>
            <option>PricingEngine v3.2.0</option>
            <option>FraudGuard v4.1.3</option>
            <option>ChurnPredict v2.0.4</option>
          </select>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>on dataset:</span>
        <div style={{ position: 'relative' }}>
          <select style={SELECT_STYLE} defaultValue="loan-applications-2026">
            <option>loan-applications-2026</option>
            <option>hiring-records-q1</option>
            <option>pricing-events-may</option>
            <option>customer-churn-q2</option>
          </select>
        </div>
        <button className="btn btn-ghost" style={{ height: 34, padding: '0 14px', fontSize: 12.5 }}>
          Refresh
        </button>
        <div style={{ marginLeft: 'auto' }}>
          <span className="pill pill-mint"><span className="dot"></span>94% fairness</span>
        </div>
      </div>

      {/* 3 — Two-column layout */}
      <div className="dash-grid" style={{ marginBottom: 32 }}>

        {/* Left — Feature Contribution */}
        <div className="col-7">
          <div className="card flat-card" style={{ padding: '20px 22px' }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Feature contribution to bias</div>
            <div className="card-sub" style={{ marginBottom: 20 }}>
              Shapley-based attribution — how much each feature drives disparity
            </div>
            <div style={{ position: 'relative' }}>
              {FEATURES.map((f) => (
                <div
                  key={f.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{
                    width: 130,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                    textAlign: 'right',
                  }}>
                    {f.name}
                  </div>
                  <div style={{
                    flex: 1,
                    position: 'relative',
                    height: 18,
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 4,
                    overflow: 'visible',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${(f.value / 0.40) * 100}%`,
                      background: featureBarColor(f.value),
                      borderRadius: 4,
                      opacity: 0.85,
                      transition: 'width 700ms cubic-bezier(0.22,1,0.36,1)',
                    }} />
                    {/* Threshold line at 0.15 */}
                    <div style={{
                      position: 'absolute',
                      left: `${(0.15 / 0.40) * 100}%`,
                      top: -14,
                      bottom: -4,
                      width: 1,
                      background: 'rgba(255,255,255,0.25)',
                      zIndex: 2,
                    }}>
                      <span style={{
                        position: 'absolute',
                        top: -1,
                        left: 4,
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: 'var(--text-dim)',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.02em',
                      }}>Threshold 0.15</span>
                    </div>
                  </div>
                  <div style={{
                    width: 36,
                    fontSize: 12,
                    fontWeight: 700,
                    color: featureBarColor(f.value),
                    textAlign: 'right',
                    flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {f.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Cohort Heatmap */}
        <div className="col-5">
          <div className="card flat-card" style={{ padding: '20px 22px' }}>
            <div className="card-title" style={{ marginBottom: 4 }}>Disparate impact heatmap</div>
            <div className="card-sub" style={{ marginBottom: 20 }}>
              Gender × Age group — 80% rule threshold
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '72px repeat(3, 1fr)', gap: 6, marginBottom: 6 }}>
              <div />
              {COLS.map(c => (
                <div key={c} style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  letterSpacing: '0.03em',
                }}>
                  {c}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {ROWS.map(row => (
              <div key={row} style={{
                display: 'grid',
                gridTemplateColumns: '72px repeat(3, 1fr)',
                gap: 6,
                marginBottom: 6,
              }}>
                <div style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {row}
                </div>
                {COLS.map(col => {
                  const cell = COHORT_CELLS.find(c => c.row === row && c.col === col)!;
                  return (
                    <div
                      key={col}
                      style={{
                        ...diCellStyle(cell.di),
                        borderRadius: 8,
                        padding: '10px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <span style={{
                        fontSize: 16,
                        fontWeight: 900,
                        letterSpacing: '-0.02em',
                        color: diTextColor(cell.di),
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {cell.di.toFixed(2)}
                      </span>
                      <span style={{
                        fontSize: 9.5,
                        fontWeight: 600,
                        color: 'var(--text-dim)',
                        letterSpacing: '0.02em',
                      }}>
                        DI
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div style={{
              display: 'flex',
              gap: 14,
              marginTop: 14,
              paddingTop: 12,
              borderTop: '1px solid var(--border-soft)',
            }}>
              {[
                { bg: 'rgba(116,194,140,0.18)', border: 'rgba(116,194,140,0.30)', label: '≥0.80 Pass' },
                { bg: 'rgba(221,160,74,0.15)',  border: 'rgba(221,160,74,0.28)',  label: '0.65–0.80 Watch' },
                { bg: 'rgba(221,107,82,0.18)',  border: 'rgba(221,107,82,0.30)',  label: '<0.65 Fail' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    background: l.bg,
                    border: `1px solid ${l.border}`,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 — Counterfactual Analysis */}
      <div className="mount-up" style={{ animationDelay: '500ms', marginBottom: 32 }}>
        <SectionHeader
          title="Counterfactual analysis"
          sub="What-if — change one attribute and see how predictions shift"
        />
        <div className="card flat-card" style={{ padding: 0 }}>
          <div style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Original prediction</th>
                  <th>Changed attribute</th>
                  <th>Counterfactual</th>
                  <th style={{ textAlign: 'right' }}>Δ Score</th>
                  <th style={{ textAlign: 'right' }}>Outcome flip</th>
                </tr>
              </thead>
              <tbody>
                {COUNTERFACTUALS.map(row => (
                  <tr key={row.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--text-dim)' }}>
                        {row.id}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-muted)' }}>{row.orig}</td>
                    <td>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: 'var(--text-dim)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '2px 7px',
                        borderRadius: 5,
                        border: '1px solid var(--border)',
                      }}>
                        {row.attr}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--text-muted)' }}>{row.cf}</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: 800,
                      fontSize: 13,
                      fontVariantNumeric: 'tabular-nums',
                      color: row.delta.startsWith('+') ? 'var(--mint)' : 'var(--rose)',
                    }}>
                      {row.delta}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {row.flip
                        ? <span className="pill pill-rose"><span className="dot"></span>Yes</span>
                        : <span className="pill pill-mint"><span className="dot"></span>No</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5 — Distribution Comparison */}
      <div className="mount-up" style={{ animationDelay: '600ms', marginBottom: 32 }}>
        <SectionHeader
          title="Score distribution by group"
          sub="Approval score spread across protected cohorts — 30-day window"
        />
        <div className="card flat-card" style={{ padding: '20px 22px' }}>

          {/* Bucket label header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 60px',
            gap: 8,
            marginBottom: 8,
          }}>
            <div />
            <div style={{
              display: 'flex',
              gap: 0,
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text-dim)',
              letterSpacing: '0.03em',
            }}>
              {['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'].map((lbl, i) => (
                <div
                  key={lbl}
                  style={{
                    flex: DIST_COHORTS[0].buckets[i],
                    textAlign: 'center',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  {lbl}
                </div>
              ))}
            </div>
            <div />
          </div>

          {DIST_COHORTS.map(cohort => (
            <div key={cohort.name} style={{ marginBottom: 14 }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 60px',
                gap: 8,
                alignItems: 'center',
              }}>
                <div style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textAlign: 'right',
                }}>
                  {cohort.name}
                </div>
                <div style={{
                  display: 'flex',
                  borderRadius: 6,
                  overflow: 'hidden',
                  height: 26,
                }}>
                  {cohort.buckets.map((pct, i) => (
                    <div
                      key={i}
                      title={`${['0–20%', '20–40%', '40–60%', '60–80%', '80–100%'][i]}: ${pct}%`}
                      style={{
                        flex: pct,
                        background: BUCKET_COLORS[i],
                        transition: 'flex 700ms cubic-bezier(0.22,1,0.36,1)',
                      }}
                    />
                  ))}
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-dim)',
                  textAlign: 'right',
                }}>
                  Avg: {cohort.avg}%
                </div>
              </div>
            </div>
          ))}

          {/* Bucket legend */}
          <div style={{
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid var(--border-soft)',
          }}>
            {[
              { color: BUCKET_COLORS[0], label: '0–20%' },
              { color: BUCKET_COLORS[1], label: '20–40%' },
              { color: BUCKET_COLORS[2], label: '40–60%' },
              { color: BUCKET_COLORS[3], label: '60–80%' },
              { color: BUCKET_COLORS[4], label: '80–100%' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: l.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </AppShell>
  );
};

export { DeepDive };
