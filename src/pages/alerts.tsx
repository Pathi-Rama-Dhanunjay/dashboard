import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell, useToast } from './shell.tsx';
import { MicroSpark } from '../components/charts.tsx';

const ALERT_KPIS = [
  {
    label: 'Active alerts',
    value: 5, unit: '', delta: -37, deltaUnit: '%',
    spark: [14, 12, 11, 10, 9, 8, 8, 7, 7, 6, 5, 5],
  },
  {
    label: 'Critical',
    value: 2, unit: '', delta: -50, deltaUnit: '%',
    spark: [5, 4, 4, 3, 3, 3, 2, 3, 2, 2, 2, 2],
  },
  {
    label: 'Warning',
    value: 3, unit: '', delta: -25, deltaUnit: '%',
    spark: [9, 8, 7, 7, 6, 5, 6, 4, 5, 4, 3, 3],
  },
  {
    label: 'Resolved today',
    value: 4, unit: '', delta: 33, deltaUnit: '%',
    spark: [1, 2, 2, 3, 2, 3, 3, 3, 4, 3, 4, 4],
  },
  {
    label: 'Avg resolve time',
    value: '1.8', unit: 'h', delta: -12, deltaUnit: '%',
    spark: [3.2, 2.9, 2.8, 2.6, 2.5, 2.4, 2.2, 2.1, 2.0, 1.9, 1.8, 1.8],
  },
];

const INITIAL_ALERTS = [
  {
    id: 'a1',
    severity: 'critical' as const,
    model: 'HireFilter v0.9.2',
    time: '12m ago',
    desc: 'Female cohort disparate impact dropped to 0.62 — below the 0.80 regulatory threshold',
    dataset: 'hiring-records-q1',
    metric: 'Disparate Impact',
    threshold: '< 0.80 (EEOC)',
  },
  {
    id: 'a2',
    severity: 'critical' as const,
    model: 'ChurnPredict v2.0.4',
    time: '2h ago',
    desc: 'Female approval rate is 51% of male rate — severe intersectional bias detected',
    dataset: 'customer-churn-q2',
    metric: 'Demographic Parity',
    threshold: '< 0.80 (internal)',
  },
  {
    id: 'a3',
    severity: 'warning' as const,
    model: 'PricingEngine v3.2.0',
    time: '3h ago',
    desc: 'zip_code feature identified as proxy for race — indirect discrimination risk',
    dataset: 'pricing-events-may',
    metric: 'Feature Proxy Risk',
    threshold: 'High confidence',
  },
  {
    id: 'a4',
    severity: 'warning' as const,
    model: 'LoanApproval v1.8.0',
    time: 'Yesterday',
    desc: 'zip_code distribution shifted 18% from training baseline — potential drift',
    dataset: 'loan-applications-2026',
    metric: 'Feature Drift',
    threshold: '> 15% shift',
  },
  {
    id: 'a5',
    severity: 'warning' as const,
    model: 'PricingEngine v3.2.0',
    time: '2 days ago',
    desc: 'Equalized odds gap between income bands widened beyond monitoring threshold',
    dataset: 'pricing-events-may',
    metric: 'Equalized Odds',
    threshold: 'Gap > 0.12',
  },
];

const ALERT_RULES = [
  { name: 'DI below threshold',   model: 'All models',  metric: 'Disparate Impact',    condition: '< 0.80',              severity: 'critical' as const, notify: ['Email', 'Slack'],          enabled: true  },
  { name: 'Fairness score drop',  model: 'All models',  metric: 'Fairness score',       condition: 'Drops > 5pts',        severity: 'warning' as const,  notify: ['Email'],                    enabled: true  },
  { name: 'Feature drift alert',  model: 'LoanApproval',metric: 'zip_code drift',        condition: '> 15% shift',         severity: 'warning' as const,  notify: ['Slack'],                    enabled: true  },
  { name: 'High-risk score',      model: 'HireFilter',  metric: 'Fairness score',       condition: '< 65',                severity: 'critical' as const, notify: ['Email', 'PagerDuty'],       enabled: true  },
  { name: 'Parity gap',           model: 'All models',  metric: 'Demographic Parity',   condition: 'Gap > 0.15',          severity: 'warning' as const,  notify: ['Email'],                    enabled: true  },
  { name: 'Error parity',         model: 'CreditRisk',  metric: 'False Positive Rate',  condition: 'Ratio > 1.5×',        severity: 'warning' as const,  notify: ['Email'],                    enabled: true  },
  { name: 'No analysis run',      model: 'All models',  metric: 'Analysis cadence',     condition: '> 48h without run',   severity: 'info' as const,     notify: ['Email'],                    enabled: false },
  { name: 'New model unaudited',  model: '—',           metric: 'Model registration',   condition: 'New model, no audit', severity: 'info' as const,     notify: ['Slack'],                    enabled: true  },
];

const HISTORY = [
  { alert: 'DI below threshold',  model: 'HireFilter v0.9.1',     resolver: 'Sarah Kim',     resolvedAt: 'May 28, 14:22', ttr: '3h 14m' },
  { alert: 'Fairness score drop', model: 'ChurnPredict v2.0.3',   resolver: 'System (auto)', resolvedAt: 'May 27, 09:10', ttr: '1h 05m' },
  { alert: 'Feature drift alert', model: 'LoanApproval v1.7.9',   resolver: 'Raj Patel',     resolvedAt: 'May 26, 16:40', ttr: '2h 30m' },
  { alert: 'DI below threshold',  model: 'PricingEngine v3.1.9',  resolver: 'Sarah Kim',     resolvedAt: 'May 26, 11:20', ttr: '4h 48m' },
  { alert: 'High-risk score',     model: 'HireFilter v0.9.1',     resolver: 'Priya Nair',    resolvedAt: 'May 25, 15:00', ttr: '6h 22m' },
  { alert: 'Parity gap',          model: 'CreditRisk v2.3.9',     resolver: 'System (auto)', resolvedAt: 'May 24, 09:30', ttr: '0h 45m' },
  { alert: 'Error parity',        model: 'LoanApproval v1.7.8',   resolver: 'Raj Patel',     resolvedAt: 'May 23, 13:15', ttr: '1h 58m' },
  { alert: 'Fairness score drop', model: 'PricingEngine v3.1.8',  resolver: 'Sarah Kim',     resolvedAt: 'May 22, 17:45', ttr: '3h 20m' },
];

const severityBorder = (s: 'critical' | 'warning' | 'info') =>
  s === 'critical' ? 'var(--rose)' : s === 'warning' ? 'var(--amber)' : 'var(--mint)';

const severityPill = (s: 'critical' | 'warning' | 'info') =>
  s === 'critical' ? 'pill-rose' : s === 'warning' ? 'pill-amber' : 'pill-mint';

const severityLabel = (s: 'critical' | 'warning' | 'info') =>
  s === 'critical' ? 'Critical' : s === 'warning' ? 'Warning' : 'Info';

const ruleSeverityPill = (s: 'critical' | 'warning' | 'info') =>
  s === 'critical' ? 'pill-rose' : s === 'warning' ? 'pill-amber' : 'pill-cream';

const NotifyChip = ({ label }: { label: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 7px', borderRadius: 5,
    fontSize: 11, fontWeight: 600,
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text-dim)',
    border: '1px solid rgba(255,255,255,0.08)',
    whiteSpace: 'nowrap',
  }}>{label}</span>
);

const AlertsPage = ({ onNavigate }) => {
  const toast = useToast();
  const [acknowledged, setAcknowledged] = React.useState<Set<string>>(new Set());

  const visibleAlerts = INITIAL_ALERTS.filter(a => !acknowledged.has(a.id));

  const acknowledgeAlert = (id: string, model: string) => {
    setAcknowledged(prev => new Set([...prev, id]));
    toast({ title: 'Alert acknowledged', desc: `${model} · Moving to resolved`, icon: 'check' as const });
  };

  const acknowledgeAll = () => {
    const ids = visibleAlerts.map(a => a.id);
    setAcknowledged(prev => new Set([...prev, ...ids]));
    toast({ title: 'All alerts acknowledged', desc: `${ids.length} alert${ids.length !== 1 ? 's' : ''} moved to resolved`, icon: 'check' as const });
  };

  return (
    <AppShell active="alerts" onNavigate={onNavigate}>

      {/* 1 — Page header */}
      <div className="page-head mount-up">
        <div>
          <div className="dash-page-label" style={{ marginBottom: 12 }}>Alerts</div>
          <h1>Active <span className="ital">alerts</span>.</h1>
          <p className="sub">
            2 critical · 3 warning · 0 info · last triggered 12 min ago
          </p>
        </div>
        <div className="page-head-actions">
          <button className="btn btn-ghost" onClick={acknowledgeAll}>
            <Icon name={'check' as const} size={13} />
            Acknowledge all
          </button>
          <button className="btn btn-ghost">
            <Icon name={'filter' as const} size={13} />
            Alert rules
          </button>
          <button className="btn btn-ghost">
            <Icon name={'bell' as const} size={13} />
            Mute all
          </button>
        </div>
      </div>

      {/* 2 — KPI strip */}
      <div className="kpi-strip">
        {ALERT_KPIS.map((k, i) => (
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
              <MicroSpark
                values={k.spark}
                color={k.delta >= 0 ? 'var(--mint)' : 'var(--rose)'}
                width={120}
                height={28}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3 — Active alerts */}
      <section className="mount-up" style={{ animationDelay: '360ms', marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Active alerts</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Requires immediate attention
            </div>
          </div>
          <button className="btn btn-ghost" style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5 }} onClick={acknowledgeAll}>
            <Icon name={'check' as const} size={12} />Acknowledge all
          </button>
        </div>

        {visibleAlerts.length === 0 ? (
          <div className="card flat-card" style={{
            padding: '40px 24px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--mint-soft)', border: '1px solid var(--mint-edge)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--mint)',
            }}>
              <Icon name={'shield-check' as const} size={22} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>All clear</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              No active alerts — all acknowledged.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visibleAlerts.map(alert => (
              <div
                key={alert.id}
                className="card flat-card"
                style={{
                  padding: '16px 18px',
                  borderLeft: `4px solid ${severityBorder(alert.severity)}`,
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className={`pill ${severityPill(alert.severity)}`}>
                    <span className="dot"></span>
                    {severityLabel(alert.severity)}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', flex: 1 }}>
                    {alert.model}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, flexShrink: 0 }}>
                    {alert.time}
                  </span>
                </div>

                {/* Description */}
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5, fontWeight: 500 }}>
                  {alert.desc}
                </div>

                {/* Details row */}
                <div style={{
                  display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap',
                  fontSize: 12, color: 'var(--text-dim)', fontWeight: 600,
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={'database' as const} size={11} />
                    {alert.dataset}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={'trending' as const} size={11} />
                    {alert.metric}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <Icon name={'alert-triangle' as const} size={11} />
                    {alert.threshold}
                  </span>
                </div>

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ height: 28, padding: '0 12px', fontSize: 12, borderRadius: 8 }}
                  >
                    <Icon name={'user-plus' as const} size={11} />
                    Assign
                  </button>
                  <button
                    className="btn-quiet"
                    style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
                    onClick={() => onNavigate('/models')}
                  >
                    View model <Icon name={'arrow-right' as const} size={11} />
                  </button>
                  <button
                    className="btn btn-ghost"
                    style={{ height: 28, padding: '0 12px', fontSize: 12, borderRadius: 8, marginLeft: 'auto' }}
                    onClick={() => acknowledgeAlert(alert.id, alert.model)}
                  >
                    <Icon name={'check' as const} size={11} />
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4 — Alert rules table */}
      <section className="mount-up" style={{ animationDelay: '540ms', marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Alert rules</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Configured thresholds — triggers automatic alerts
            </div>
          </div>
          <button className="btn btn-ghost" style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5 }}>
            <Icon name={'plus' as const} size={12} />Add rule
          </button>
        </div>
        <div className="card tbl-card flat-card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Rule name</th>
                  <th>Model</th>
                  <th>Metric</th>
                  <th>Condition</th>
                  <th>Severity</th>
                  <th>Notify</th>
                  <th style={{ textAlign: 'right' }}>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {ALERT_RULES.map((rule, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{rule.name}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500 }}>{rule.model}</td>
                    <td style={{ color: 'var(--text-dim)', fontSize: 12.5, fontWeight: 600 }}>{rule.metric}</td>
                    <td style={{ fontWeight: 700, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>{rule.condition}</td>
                    <td>
                      <span className={`pill ${ruleSeverityPill(rule.severity)}`}>
                        <span className="dot"></span>
                        {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {rule.notify.map(n => <NotifyChip key={n} label={n} />)}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`pill ${rule.enabled ? 'pill-mint' : 'pill-amber'}`}>
                        <span className="dot"></span>
                        {rule.enabled ? 'Active' : 'Paused'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5 — Alert history */}
      <section className="mount-up" style={{ animationDelay: '660ms', marginBottom: 32 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 16, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em' }}>Resolved alerts</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
              Last 7 days — 18 total resolved
            </div>
          </div>
          <button
            className="btn-quiet"
            style={{ height: 32, padding: '0 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700 }}
          >
            Full history <Icon name={'arrow-right' as const} size={11} />
          </button>
        </div>
        <div className="card tbl-card flat-card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Model</th>
                  <th>Resolved by</th>
                  <th>Resolved at</th>
                  <th style={{ textAlign: 'right' }}>Time to resolve</th>
                </tr>
              </thead>
              <tbody>
                {HISTORY.map((h, i) => (
                  <tr key={i}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>{h.alert}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 500 }}>{h.model}</td>
                    <td>
                      {h.resolver === 'System (auto)' ? (
                        <span style={{ color: 'var(--text-dim)', fontSize: 12.5, fontWeight: 500, fontStyle: 'italic' }}>
                          {h.resolver}
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600 }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: 999,
                            background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 10, fontWeight: 900, color: '#fff', flexShrink: 0,
                          }}>
                            {h.resolver.split(' ').map(p => p[0]).join('').slice(0, 2)}
                          </span>
                          {h.resolver}
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5, fontWeight: 600 }}>{h.resolvedAt}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'monospace', fontSize: 12.5, fontWeight: 700,
                        color: 'var(--text-dim)', letterSpacing: '0.01em',
                      }}>{h.ttr}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </AppShell>
  );
};

export { AlertsPage };
