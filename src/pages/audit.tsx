import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell } from './shell.tsx';

const FRAMEWORKS = [
  {
    id: 'eeoc',
    name: 'EEOC 80% Rule',
    status: 'Partial',
    tone: 'pill-amber' as const,
    icon: 'alert-triangle' as const,
    details: '4 of 6 models pass · HireFilter & ChurnPredict fail',
    reviewed: 'Apr 15, 2026',
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    status: 'Partial',
    tone: 'pill-amber' as const,
    icon: 'alert-triangle' as const,
    details: 'Annex III applies · Documentation incomplete',
    reviewed: 'Mar 28, 2026',
  },
  {
    id: 'nyc-ll144',
    name: 'NYC Local Law 144',
    status: 'Compliant',
    tone: 'pill-mint' as const,
    icon: 'shield-check' as const,
    details: 'Annual audit filed May 2026',
    reviewed: 'May 1, 2026',
  },
  {
    id: 'gdpr',
    name: 'GDPR Art. 22',
    status: 'Compliant',
    tone: 'pill-mint' as const,
    icon: 'shield-check' as const,
    details: 'All automated decisions logged',
    reviewed: 'May 10, 2026',
  },
];

const AUDIT_KPIS = [
  { label: 'Total events',   value: '1,284', delta: 12,  deltaUnit: '%', spark: [] },
  { label: 'Models audited', value: 6,       delta: 0,   deltaUnit: '%', spark: [] },
  { label: 'Policy changes', value: 3,       delta: -25, deltaUnit: '%', spark: [] },
  { label: 'Failed checks',  value: 2,       delta: -33, deltaUnit: '%', spark: [] },
  { label: 'Open findings',  value: 5,       delta: -28, deltaUnit: '%', spark: [] },
];

type SeverityKey = 'critical' | 'warning' | 'info';
type CategoryKey = 'Analysis' | 'Alert' | 'Policy' | 'Dataset' | 'Model' | 'Team' | 'Report' | 'Compliance';

interface AuditEvent {
  ts: string;
  actor: string;
  action: string;
  entity: string;
  category: CategoryKey;
  severity: SeverityKey;
  details: string;
}

const EVENTS: AuditEvent[] = [
  { ts: 'May 29 2026  09:41', actor: 'Sarah Kim',  action: 'Analysis run completed',   entity: 'CreditRisk v2.4.1',        category: 'Analysis',   severity: 'info',     details: 'Score 94% · 4 groups' },
  { ts: 'May 29 2026  08:12', actor: 'System',     action: 'Scheduled analysis',        entity: 'HireFilter v0.9.2',         category: 'Analysis',   severity: 'info',     details: 'Daily schedule triggered' },
  { ts: 'May 29 2026  07:55', actor: 'Sarah Kim',  action: 'Bias threshold breached',   entity: 'HireFilter v0.9.2',         category: 'Alert',      severity: 'critical', details: 'Female DI = 0.62 < 0.80' },
  { ts: 'May 29 2026  06:30', actor: 'System',     action: 'Dataset profiling',          entity: 'pricing-events-may',        category: 'Dataset',    severity: 'info',     details: '612K rows · 61 cols' },
  { ts: 'May 28 2026  16:44', actor: 'Raj Patel',  action: 'Model registered',           entity: 'ChurnPredict v2.0.4',       category: 'Model',      severity: 'info',     details: 'New model added' },
  { ts: 'May 28 2026  15:20', actor: 'Sarah Kim',  action: 'Mitigation applied',         entity: 'PricingEngine v3.2.0',      category: 'Policy',     severity: 'warning',  details: 'Reweighting plan activated' },
  { ts: 'May 28 2026  14:05', actor: 'System',     action: 'Analysis run completed',    entity: 'LoanApproval v1.8.0',       category: 'Analysis',   severity: 'info',     details: 'Score 91% · 3 groups' },
  { ts: 'May 28 2026  11:30', actor: 'Admin',      action: 'Policy threshold updated',  entity: 'Workspace fairness policy', category: 'Policy',     severity: 'warning',  details: 'DI threshold 0.75 → 0.80' },
  { ts: 'May 28 2026  10:15', actor: 'Priya Nair', action: 'Dataset uploaded',           entity: 'hiring-records-q1',         category: 'Dataset',    severity: 'info',     details: '128K rows · CSV' },
  { ts: 'May 28 2026  09:00', actor: 'System',     action: 'Scheduled analysis',         entity: 'CreditRisk v2.4.1',         category: 'Analysis',   severity: 'info',     details: 'Daily schedule triggered' },
  { ts: 'May 27 2026  17:22', actor: 'Raj Patel',  action: 'Team member invited',        entity: 'alex.chen@company.com',     category: 'Team',       severity: 'info',     details: 'Role: Analyst' },
  { ts: 'May 27 2026  14:10', actor: 'Sarah Kim',  action: 'Analysis run completed',    entity: 'FraudGuard v4.1.3',         category: 'Analysis',   severity: 'info',     details: 'Score 89% · 3 groups' },
  { ts: 'May 27 2026  11:45', actor: 'System',     action: 'Bias threshold breached',   entity: 'ChurnPredict v2.0.4',       category: 'Alert',      severity: 'critical', details: 'Female DI = 0.51 < 0.80' },
  { ts: 'May 27 2026  09:30', actor: 'Admin',      action: 'Model blocked',              entity: 'ChurnPredict v2.0.4',       category: 'Policy',     severity: 'critical', details: 'Fairness score 49 < 60 threshold' },
  { ts: 'May 26 2026  16:55', actor: 'Priya Nair', action: 'Analysis run completed',    entity: 'PricingEngine v3.2.0',      category: 'Analysis',   severity: 'info',     details: 'Score 78% · 5 groups' },
  { ts: 'May 26 2026  14:00', actor: 'Sarah Kim',  action: 'Export generated',           entity: 'Workspace audit report',    category: 'Report',     severity: 'info',     details: 'PDF · 24 pages' },
  { ts: 'May 26 2026  11:20', actor: 'System',     action: 'Dataset profiling',          entity: 'fraud-flags-rolling',       category: 'Dataset',    severity: 'info',     details: '94K rows · profiling complete' },
  { ts: 'May 25 2026  15:40', actor: 'Raj Patel',  action: 'Model version updated',     entity: 'CreditRisk v2.4.1',         category: 'Model',      severity: 'info',     details: 'v2.4.0 → v2.4.1' },
  { ts: 'May 25 2026  12:00', actor: 'Admin',      action: 'User role changed',          entity: 'priya.nair@company.com',    category: 'Team',       severity: 'warning',  details: 'Analyst → Reviewer' },
  { ts: 'May 24 2026  09:15', actor: 'System',     action: 'Compliance check',           entity: 'NYC Local Law 144',         category: 'Compliance', severity: 'info',     details: 'Annual audit auto-filed' },
];

type FindingSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

interface Finding {
  severity: FindingSeverity;
  title: string;
  desc: string;
  assigned: string;
  due: string;
}

const FINDINGS: Finding[] = [
  {
    severity: 'CRITICAL',
    title: 'HireFilter v0.9.2',
    desc: 'Female cohort DI = 0.62 (threshold 0.80) — EEOC 80% Rule violation',
    assigned: 'Sarah Kim',
    due: 'Jun 5, 2026',
  },
  {
    severity: 'CRITICAL',
    title: 'ChurnPredict v2.0.4',
    desc: 'Female DI = 0.51 · Male DI = 1.0 — Disparate impact failure',
    assigned: 'Raj Patel',
    due: 'Jun 5, 2026',
  },
  {
    severity: 'WARNING',
    title: 'PricingEngine v3.2.0',
    desc: 'zip_code proxy detected — Potential indirect discrimination',
    assigned: 'Priya Nair',
    due: 'Jun 15, 2026',
  },
  {
    severity: 'WARNING',
    title: 'EU AI Act documentation',
    desc: 'Technical documentation incomplete for 2 high-risk models',
    assigned: 'Admin',
    due: 'Jul 1, 2026',
  },
  {
    severity: 'INFO',
    title: 'LoanApproval v1.8.0',
    desc: 'Quarterly bias audit overdue by 4 days — Schedule review',
    assigned: 'Sarah Kim',
    due: 'Jun 1, 2026',
  },
];

const FILTER_CHIPS = [
  { id: 'all',     label: 'All',            count: EVENTS.length },
  { id: 'Analysis', label: 'Model Events',  count: EVENTS.filter(e => e.category === 'Analysis' || e.category === 'Model').length },
  { id: 'AnalysisRun', label: 'Analysis Runs', count: EVENTS.filter(e => e.category === 'Analysis').length },
  { id: 'Policy',  label: 'Policy Changes', count: EVENTS.filter(e => e.category === 'Policy').length },
  { id: 'Team',    label: 'Team Changes',   count: EVENTS.filter(e => e.category === 'Team').length },
];

const severityPill = (s: SeverityKey) => {
  if (s === 'critical') return 'pill-rose';
  if (s === 'warning')  return 'pill-amber';
  return 'pill-mint';
};

const categoryBadgeStyle = (c: CategoryKey): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: 5,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  };
  switch (c) {
    case 'Alert':      return { ...base, background: 'var(--rose-soft)',   color: 'var(--rose)',  border: '1px solid var(--rose-edge)' };
    case 'Policy':     return { ...base, background: 'var(--amber-soft)',  color: 'var(--amber)', border: '1px solid var(--amber-edge)' };
    case 'Dataset':    return { ...base, background: 'var(--mint-soft)',   color: 'var(--mint)',  border: '1px solid var(--mint-edge)' };
    case 'Model':      return { ...base, background: 'var(--cream-soft)',  color: 'var(--cream)', border: '1px solid var(--cream-edge)' };
    case 'Compliance': return { ...base, background: 'var(--mint-soft)',   color: 'var(--mint)',  border: '1px solid var(--mint-edge)' };
    default:           return { ...base, background: 'rgba(255,255,255,0.04)', color: 'var(--text-dim)', border: '1px solid rgba(255,255,255,0.07)' };
  }
};

const findingBorderColor = (s: FindingSeverity) => {
  if (s === 'CRITICAL') return 'var(--rose)';
  if (s === 'WARNING')  return 'var(--amber)';
  return 'var(--mint)';
};

const findingPillClass = (s: FindingSeverity) => {
  if (s === 'CRITICAL') return 'pill-rose';
  if (s === 'WARNING')  return 'pill-amber';
  return 'pill-mint';
};

const ActorCell = ({ actor }: { actor: string }) => {
  if (actor === 'System') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--surface-3)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--text-dim)',
        }}>
          <Icon name="cube" size={12} />
        </span>
        <span style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: 12.5 }}>System</span>
      </span>
    );
  }
  const initials = actor.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: 'var(--surface-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)',
        letterSpacing: '0.03em',
      }}>
        {initials}
      </span>
      <span style={{ fontWeight: 500, fontSize: 12.5, color: 'var(--text-muted)' }}>{actor}</span>
    </span>
  );
};

const AssigneeAvatar = ({ name }: { name: string }) => {
  const initials = name === 'Admin'
    ? 'AD'
    : name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--surface-3)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: 8.5, fontWeight: 700, color: 'var(--text-muted)',
        letterSpacing: '0.03em',
      }}>
        {initials}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{name}</span>
    </span>
  );
};

const AuditLog = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = EVENTS.filter(e => {
    if (filter !== 'all') {
      if (filter === 'Analysis' && e.category !== 'Analysis' && e.category !== 'Model') return false;
      if (filter === 'AnalysisRun' && e.category !== 'Analysis') return false;
      if (filter === 'Policy' && e.category !== 'Policy') return false;
      if (filter === 'Team' && e.category !== 'Team') return false;
    }
    if (query) {
      const q = query.toLowerCase();
      if (
        !e.actor.toLowerCase().includes(q) &&
        !e.action.toLowerCase().includes(q) &&
        !e.entity.toLowerCase().includes(q) &&
        !e.details.toLowerCase().includes(q) &&
        !e.category.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  return (
    <AppShell active="audit" onNavigate={onNavigate}>

      {/* 1 — Page header */}
      <div className="page-head mount-up" style={{ animationDelay: '0ms' }}>
        <div>
          <div className="dash-page-label">Audit</div>
          <h1>Compliance <span className="ital">Trail</span>.</h1>
          <p className="sub">Full audit log · regulatory compliance status · 4 frameworks monitored</p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost">
            <Icon name="download" size={13} />
            Download report
          </button>
          <button className="btn btn-cream">
            <Icon name="clock" size={13} />
            Schedule audit
          </button>
        </div>
      </div>

      {/* 2 — Compliance framework cards */}
      <div
        className="mount-up"
        style={{
          animationDelay: '80ms',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {FRAMEWORKS.map(fw => (
          <div key={fw.id} className="card flat-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Icon
                name={fw.icon}
                size={15}
                style={{ color: fw.status === 'Compliant' ? 'var(--mint)' : 'var(--amber)', flexShrink: 0 }}
              />
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', flex: 1, minWidth: 0 }}>{fw.name}</span>
              <span className={`pill ${fw.tone}`}>
                <span className="dot"></span>{fw.status}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.5 }}>{fw.details}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Last reviewed: {fw.reviewed}</span>
              <button className="btn-quiet" style={{ fontSize: 11.5, height: 24, padding: '0 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View details <Icon name="arrow-right" size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3 — KPI strip */}
      <div className="kpi-strip mount-up" style={{ animationDelay: '160ms', marginBottom: 24 }}>
        {AUDIT_KPIS.map((k, i) => (
          <div key={k.label} className="kpi-tile" style={{ animationDelay: `${200 + i * 60}ms` }}>
            <div className="kpi-tile-label">{k.label}</div>
            <div className="kpi-tile-value">{k.value}</div>
            <div className={`kpi-tile-delta ${k.delta > 0 ? 'up' : k.delta < 0 ? 'down' : 'flat'}`}>
              {k.delta > 0 ? '▲' : k.delta < 0 ? '▼' : '◆'} {Math.abs(k.delta)}{k.deltaUnit}
              <span style={{ fontWeight: 500, color: 'inherit', opacity: 0.7, marginLeft: 2 }}>vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4 — Filter row */}
      <div className="filter-row mount-up" style={{ animationDelay: '340ms' }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search audit events…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTER_CHIPS.map(f => (
            <button
              key={f.id}
              className={`chip ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}<span className="count">{f.count}</span>
            </button>
          ))}
        </div>
        <button className="chip" style={{ marginLeft: 'auto' }}>
          <Icon name="filter" size={12} />More filters
        </button>
      </div>

      {/* 5 — Audit trail table */}
      <div className="card tbl-card flat-card mount-up" style={{ animationDelay: '420ms', marginBottom: 36 }}>
        <div className="card-header" style={{ padding: '14px 20px 10px' }}>
          <div>
            <div className="card-title">Audit trail</div>
            <div className="card-sub">Chronological record of all workspace events</div>
          </div>
          <button className="btn-quiet" style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Icon name="download" size={12} />CSV
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 150 }}>Timestamp</th>
                <th style={{ width: 140 }}>Actor</th>
                <th>Action</th>
                <th>Entity</th>
                <th style={{ width: 100 }}>Category</th>
                <th style={{ width: 90 }}>Severity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev, i) => (
                <tr key={i}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: 'var(--text-dim)', fontWeight: 600 }}>
                      {ev.ts}
                    </span>
                  </td>
                  <td>
                    <ActorCell actor={ev.actor} />
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{ev.action}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500 }}>{ev.entity}</td>
                  <td>
                    <span style={categoryBadgeStyle(ev.category)}>{ev.category}</span>
                  </td>
                  <td>
                    <span
                      className={`pill ${severityPill(ev.severity)}`}
                      style={ev.severity === 'info' ? { opacity: 0.7 } : undefined}
                    >
                      <span className="dot"></span>{ev.severity}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{ev.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 — Open findings */}
      <section className="mount-up" style={{ animationDelay: '520ms' }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Open findings</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Items requiring action before next compliance review
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FINDINGS.map((f, i) => (
            <div
              key={i}
              className="card flat-card"
              style={{
                padding: '14px 16px',
                borderLeft: `4px solid ${findingBorderColor(f.severity)}`,
                borderRadius: '0 12px 12px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className={`pill ${findingPillClass(f.severity)}`}>
                  <span className="dot"></span>{f.severity}
                </span>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{f.title}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.5 }}>
                {f.desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <AssigneeAvatar name={f.assigned} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-dim)', fontWeight: 600 }}>
                  <Icon name="clock" size={12} />Due {f.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </AppShell>
  );
};

export { AuditLog };
