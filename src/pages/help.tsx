import React from 'react';
import { Icon } from '../components/icons.tsx';
import { AppShell, useToast } from './shell.tsx';

const QUICK_START = [
  {
    step: '01',
    title: 'Connect a dataset',
    desc: 'Upload a CSV or connect a data warehouse. BiasSense profiles your data automatically — detecting sensitive attributes, class distributions, and potential proxy variables.',
    action: '/datasets',
    actionLabel: 'Go to Datasets',
    icon: 'datasets' as const,
  },
  {
    step: '02',
    title: 'Register a model',
    desc: 'Point BiasSense at your model endpoint or upload a prediction file. We support scikit-learn, XGBoost, TensorFlow, PyTorch, and any REST API that returns scores or labels.',
    action: '/models',
    actionLabel: 'Go to Models',
    icon: 'models' as const,
  },
  {
    step: '03',
    title: 'Run a fairness analysis',
    desc: 'Select a model + dataset pair and choose the protected attributes to evaluate. BiasSense computes all major fairness metrics and flags violations in seconds.',
    action: '/analysis',
    actionLabel: 'Run Analysis',
    icon: 'analysis' as const,
  },
  {
    step: '04',
    title: 'Set up alerts',
    desc: 'Define thresholds for any metric. Get notified via email, Slack, or PagerDuty the moment a deployed model drifts outside acceptable bounds.',
    action: '/alerts',
    actionLabel: 'Configure Alerts',
    icon: 'alerts' as const,
  },
];

const FEATURE_GUIDES = [
  {
    icon: 'analysis' as const,
    title: 'Fairness Analysis',
    desc: 'Run point-in-time or scheduled audits across any protected attribute combination. Results include group fairness, intersectional fairness, and error parity breakdowns.',
    tags: ['Group fairness', 'Intersectional', 'Error parity', 'Scheduled runs'],
  },
  {
    icon: 'deepdive' as const,
    title: 'Deep Dive',
    desc: 'Drill into individual cohorts, explore feature importance by subgroup, and generate counterfactual explanations to understand why a cohort is being treated differently.',
    tags: ['Cohort matrix', 'Feature SHAP', 'Counterfactuals', 'Distribution plots'],
  },
  {
    icon: 'alerts' as const,
    title: 'Alert Rules',
    desc: 'Set metric thresholds at the model or portfolio level. Rules fire automatically on each new analysis run and can route notifications to any channel.',
    tags: ['Critical / Warning / Info', 'Email · Slack · PagerDuty', 'Per-model or global'],
  },
  {
    icon: 'audit' as const,
    title: 'Audit Log',
    desc: 'Immutable, timestamped record of every model registration, analysis run, alert acknowledgement, and settings change — exportable for regulatory submissions.',
    tags: ['Immutable log', 'CSV/JSON export', 'SOC 2 ready'],
  },
  {
    icon: 'datasets' as const,
    title: 'Dataset Profiling',
    desc: 'Automatic detection of sensitive attributes, proxy variables, class imbalance, and data drift. Profile runs are versioned so you can track dataset changes over time.',
    tags: ['Auto attribute detection', 'Proxy risk scoring', 'Drift tracking'],
  },
  {
    icon: 'settings' as const,
    title: 'Team & Access',
    desc: 'Invite team members with role-based access: Admin, Analyst, or Viewer. SSO via SAML 2.0 and SCIM provisioning are available on Enterprise plans.',
    tags: ['Role-based access', 'SAML SSO', 'SCIM provisioning'],
  },
];

const METRICS = [
  {
    name: 'Disparate Impact',
    abbr: 'DI',
    formula: 'P(Ŷ=1 | A=minority) / P(Ŷ=1 | A=majority)',
    threshold: '≥ 0.80 (EEOC 4/5ths rule)',
    tone: 'rose' as const,
    desc: 'Ratio of positive outcome rates between the protected and reference group. A value below 0.80 is considered adverse impact under US employment law.',
  },
  {
    name: 'Demographic Parity',
    abbr: 'DP',
    formula: 'P(Ŷ=1 | A=a) = P(Ŷ=1 | A=b) ∀ a,b',
    threshold: 'Gap < 0.10 (internal default)',
    tone: 'amber' as const,
    desc: 'Requires equal positive prediction rates across all groups. Appropriate when base rates are similar and outcome equality is the goal.',
  },
  {
    name: 'Equalized Odds',
    abbr: 'EO',
    formula: 'TPR and FPR equal across groups',
    threshold: 'Max gap < 0.12',
    tone: 'amber' as const,
    desc: 'Both true positive rates and false positive rates must be equal across groups. Stronger than demographic parity — controls for actual outcome distributions.',
  },
  {
    name: 'Equal Opportunity',
    abbr: 'EOppy',
    formula: 'P(Ŷ=1 | Y=1, A=a) = P(Ŷ=1 | Y=1, A=b)',
    threshold: 'Max gap < 0.10',
    tone: 'mint' as const,
    desc: 'True positive rates must match across groups. Focuses on qualified individuals — ensures equally qualified candidates are treated equally.',
  },
  {
    name: 'Predictive Parity',
    abbr: 'PP',
    formula: 'P(Y=1 | Ŷ=1, A=a) = P(Y=1 | Ŷ=1, A=b)',
    threshold: 'Max gap < 0.10',
    tone: 'mint' as const,
    desc: 'Precision (positive predictive value) must be equal across groups. When a model predicts a positive outcome, it should be equally reliable for all groups.',
  },
  {
    name: 'Calibration',
    abbr: 'CAL',
    formula: 'P(Y=1 | score=s, A=a) = s ∀ a',
    threshold: 'Brier score gap < 0.05',
    tone: 'mint' as const,
    desc: 'Model confidence scores should be equally accurate across groups. A score of 0.7 should mean a 70% actual positive rate for every group.',
  },
];

const FAQS = [
  {
    q: 'Which fairness metric should I use?',
    a: "There is no single correct metric. Disparate Impact (DI) is required for US employment compliance. Equalized Odds is appropriate when false positives and false negatives carry different costs. Demographic Parity works when base rates are similar. BiasSense shows all metrics and flags the ones most relevant to your use case.",
  },
  {
    q: 'How do I interpret a fairness score?',
    a: 'BiasSense computes a composite Fairness Score from 0–100 by weighting violations across all active metrics. Scores above 85 are considered low risk; 65–84 moderate; below 65 high risk. You can customise the weighting in Settings → Scoring.',
  },
  {
    q: 'What data does BiasSense need to run an analysis?',
    a: 'You need: (1) model predictions (scores or labels), (2) ground truth labels, and (3) values for at least one protected attribute. BiasSense can infer proxy attributes automatically if you enable feature proxy detection in analysis settings.',
  },
  {
    q: 'Can I monitor a live model endpoint?',
    a: 'Yes. Register your model with a REST endpoint and enable scheduled analysis. BiasSense will call your endpoint with stratified samples at the interval you configure (hourly, daily, or weekly) and alert you when metrics drift.',
  },
  {
    q: 'How does intersectional analysis work?',
    a: 'Intersectional analysis evaluates all combinations of protected attributes simultaneously (e.g. Black women, not just Black people and women separately). This surfaces compounding disadvantages that group-level metrics can miss. Enable it in analysis settings — note it requires larger sample sizes per cohort.',
  },
  {
    q: 'What does "proxy variable" mean?',
    a: 'A proxy variable is a feature that is statistically correlated with a protected attribute even though it does not directly encode it — for example, zip code correlating with race. BiasSense flags high-confidence proxies in the dataset profiler and estimates their indirect contribution to bias.',
  },
  {
    q: 'How do I export results for a regulatory submission?',
    a: 'From any analysis detail page, click Download → PDF Report or Download → JSON to export a machine-readable record. The Audit Log page provides a full immutable history export. Enterprise customers can also access the API to pull results programmatically.',
  },
  {
    q: 'Is my data stored by BiasSense?',
    a: 'By default, only statistical summaries (distributions, metric values, cohort sizes) are stored — not raw individual records. If you use the file upload feature, data is encrypted at rest, processed, and deleted after the analysis run completes unless you opt into retention in your privacy settings.',
  },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/v1/analyses', desc: 'Trigger a new fairness analysis run' },
  { method: 'GET',  path: '/v1/analyses/:id', desc: 'Fetch analysis results and metrics' },
  { method: 'GET',  path: '/v1/models', desc: 'List all registered models' },
  { method: 'POST', path: '/v1/models', desc: 'Register a new model' },
  { method: 'GET',  path: '/v1/datasets', desc: 'List all connected datasets' },
  { method: 'POST', path: '/v1/datasets/upload', desc: 'Upload a CSV dataset' },
  { method: 'GET',  path: '/v1/alerts', desc: 'List active and historical alerts' },
  { method: 'POST', path: '/v1/alert-rules', desc: 'Create or update an alert rule' },
];

const METHOD_COLORS = {
  GET:  { bg: 'var(--mint-soft)',  border: 'var(--mint-edge)',  text: 'var(--mint)'  },
  POST: { bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.2)', text: '#818cf8' },
};

const MetricTone = ({ tone }: { tone: 'rose' | 'amber' | 'mint' }) => {
  const map = {
    rose:  'pill-rose',
    amber: 'pill-amber',
    mint:  'pill-mint',
  };
  return <span className={`pill ${map[tone]}`}><span className="dot" /></span>;
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '16px 20px',
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}
      >
        <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{q}</span>
        <span style={{
          color: 'var(--text-dim)', flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 200ms ease',
        }}>
          <Icon name="chevron-down" size={15} />
        </span>
      </button>
      {open && (
        <div style={{
          padding: '0 20px 16px',
          fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 500,
        }}>
          {a}
        </div>
      )}
    </div>
  );
};

const HelpPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = React.useState<'guides' | 'metrics' | 'api' | 'faq'>('guides');

  const copyEndpoint = (path: string) => {
    navigator.clipboard.writeText(`https://api.biassense.io${path}`).catch(() => {});
    toast({ title: 'Copied', desc: path, icon: 'check' as const });
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'guides', label: 'Guides' },
    { id: 'metrics', label: 'Metrics glossary' },
    { id: 'api',    label: 'API reference' },
    { id: 'faq',    label: 'FAQ' },
  ];

  return (
    <AppShell active="help" onNavigate={onNavigate}>

      {/* Page header */}
      <div className="page-head mount-up">
        <div>
          <div className="dash-page-label" style={{ marginBottom: 12 }}>Help &amp; Docs</div>
          <h1>Documentation <span className="ital">&amp; Guides</span>.</h1>
          <p className="sub">
            Everything you need to get started, understand fairness metrics, and integrate with the BiasSense API.
          </p>
        </div>
        <div className="page-head-actions">
          <button
            className="btn btn-ghost"
            onClick={() => toast({ title: 'Opening changelog', desc: 'v2.4.0 · May 2026', icon: 'sparkles' as const })}
          >
            <Icon name="sparkles" size={13} />
            Changelog
          </button>
          <button
            className="btn btn-cream"
            onClick={() => toast({ title: 'Support', desc: 'Opening support chat…', icon: 'bell' as const })}
          >
            <Icon name="help" size={13} />
            Contact support
          </button>
        </div>
      </div>

      {/* Quick start strip */}
      <section className="mount-up" style={{ animationDelay: '120ms', marginBottom: 36 }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 4 }}>Quick start</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 500 }}>
          Get your first fairness report in 4 steps
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
          {QUICK_START.map((s, i) => (
            <div
              key={s.step}
              className="card flat-card"
              style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10, animationDelay: `${i * 60}ms` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--mint)', flexShrink: 0,
                }}>
                  <Icon name={s.icon} size={16} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 900, letterSpacing: '0.08em',
                  color: 'var(--text-dim)', textTransform: 'uppercase',
                }}>
                  Step {s.step}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500, flex: 1 }}>{s.desc}</div>
              <button
                className="btn-quiet"
                style={{ height: 28, padding: '0 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, alignSelf: 'flex-start' }}
                onClick={() => onNavigate(s.action)}
              >
                {s.actionLabel} <Icon name="arrow-right" size={11} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tab bar */}
      <div className="mount-up" style={{
        animationDelay: '300ms',
        display: 'flex', gap: 4, marginBottom: 24,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 0,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 14px', borderRadius: '8px 8px 0 0',
              fontSize: 13, fontWeight: activeTab === tab.id ? 800 : 600,
              color: activeTab === tab.id ? 'var(--text)' : 'var(--text-dim)',
              borderBottom: activeTab === tab.id ? '2px solid var(--mint)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 150ms',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Guides */}
      {activeTab === 'guides' && (
        <section className="mount-up" style={{ animationDelay: '360ms', marginBottom: 36 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {FEATURE_GUIDES.map((g, i) => (
              <div
                key={g.title}
                className="card flat-card"
                style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, animationDelay: `${i * 50}ms` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--mint)', flexShrink: 0,
                  }}>
                    <Icon name={g.icon} size={18} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{g.title}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 500, margin: 0 }}>{g.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {g.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: 'var(--text-dim)',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: Metrics glossary */}
      {activeTab === 'metrics' && (
        <section className="mount-up" style={{ animationDelay: '360ms', marginBottom: 36 }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 20, lineHeight: 1.6, maxWidth: 680 }}>
            BiasSense computes the following fairness metrics on every analysis run. Each metric operationalises a different definition of fairness — no single metric is universally correct. Consult the relevant legal, ethical, or domain framework for your use case.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {METRICS.map((m, i) => (
              <div
                key={m.name}
                className="card flat-card"
                style={{
                  padding: '18px 20px',
                  borderLeft: `3px solid var(--${m.tone})`,
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>{m.name}</span>
                      <span style={{
                        fontSize: 10.5, fontWeight: 900, padding: '2px 7px', borderRadius: 5,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                        color: 'var(--text-dim)', letterSpacing: '0.06em',
                      }}>{m.abbr}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, fontWeight: 500, margin: 0, marginBottom: 10 }}>{m.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="alert-triangle" size={11} style={{ color: 'var(--text-dim)' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)' }}>Threshold: </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{m.threshold}</span>
                    </div>
                  </div>
                  <div style={{
                    flexShrink: 0, minWidth: 260,
                    background: 'rgba(0,0,0,0.25)', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.07)',
                    padding: '10px 14px',
                    fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)',
                    lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                  }}>
                    {m.formula}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab: API reference */}
      {activeTab === 'api' && (
        <section className="mount-up" style={{ animationDelay: '360ms', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.025em', marginBottom: 6 }}>REST API</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, fontWeight: 500, margin: 0 }}>
                All BiasSense functionality is available via a versioned REST API. Authenticate with a bearer token from Settings → API keys. The base URL is <code style={{ fontFamily: 'monospace', fontSize: 12, background: 'rgba(255,255,255,0.07)', padding: '1px 6px', borderRadius: 4 }}>https://api.biassense.io</code>.
              </p>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.3)', borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '14px 18px', minWidth: 260,
              fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7,
            }}>
              <div style={{ color: 'var(--text-dim)', fontWeight: 700, marginBottom: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Authentication</div>
              <span style={{ color: '#818cf8' }}>Authorization</span>{': Bearer <token>'}
            </div>
          </div>

          <div className="card tbl-card flat-card">
            <div className="card-body" style={{ padding: 0 }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 64 }}>Method</th>
                    <th>Endpoint</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right', width: 80 }}>Copy</th>
                  </tr>
                </thead>
                <tbody>
                  {API_ENDPOINTS.map((ep, i) => {
                    const c = METHOD_COLORS[ep.method] ?? METHOD_COLORS.GET;
                    return (
                      <tr key={i}>
                        <td>
                          <span style={{
                            fontSize: 11, fontWeight: 900, padding: '3px 8px', borderRadius: 6,
                            background: c.bg, border: `1px solid ${c.border}`, color: c.text,
                            letterSpacing: '0.05em',
                          }}>{ep.method}</span>
                        </td>
                        <td>
                          <code style={{ fontFamily: 'monospace', fontSize: 12.5, color: 'var(--text)', fontWeight: 600 }}>{ep.path}</code>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{ep.desc}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-ghost"
                            style={{ height: 26, padding: '0 10px', borderRadius: 7, fontSize: 11 }}
                            onClick={() => copyEndpoint(ep.path)}
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost"
              onClick={() => toast({ title: 'SDK', desc: 'Opening Python SDK docs…', icon: 'download' as const })}
            >
              <Icon name="download" size={13} />
              Python SDK
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => toast({ title: 'SDK', desc: 'Opening Node SDK docs…', icon: 'download' as const })}
            >
              <Icon name="download" size={13} />
              Node SDK
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => toast({ title: 'OpenAPI', desc: 'Downloading openapi.yaml…', icon: 'download' as const })}
            >
              <Icon name="download" size={13} />
              OpenAPI spec
            </button>
          </div>
        </section>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'faq' && (
        <section className="mount-up" style={{ animationDelay: '360ms', marginBottom: 36 }}>
          <div className="card flat-card" style={{ padding: 0, overflow: 'hidden' }}>
            {FAQS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </section>
      )}

      {/* Footer contact strip */}
      <div className="mount-up" style={{
        animationDelay: '480ms',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
        marginBottom: 40,
      }}>
        {[
          {
            icon: 'mail' as const,
            title: 'Email support',
            desc: 'support@biassense.io',
            action: () => toast({ title: 'Support', desc: 'Opening email client…', icon: 'mail' as const }),
          },
          {
            icon: 'briefcase' as const,
            title: 'Enterprise plan',
            desc: 'Dedicated SLA, SSO, custom integrations',
            action: () => toast({ title: 'Enterprise', desc: 'Routing to sales team…', icon: 'briefcase' as const }),
          },
          {
            icon: 'users' as const,
            title: 'Community forum',
            desc: 'Ask questions, share best practices',
            action: () => toast({ title: 'Community', desc: 'Opening community.biassense.io…', icon: 'users' as const }),
          },
          {
            icon: 'sparkles' as const,
            title: 'Feature requests',
            desc: 'Vote on the public roadmap',
            action: () => toast({ title: 'Roadmap', desc: 'Opening roadmap.biassense.io…', icon: 'sparkles' as const }),
          },
        ].map((card) => (
          <button
            key={card.title}
            className="card flat-card"
            onClick={card.action}
            style={{
              padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12,
              background: 'none', border: undefined, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-dim)',
            }}>
              <Icon name={card.icon} size={17} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{card.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{card.desc}</div>
            </div>
          </button>
        ))}
      </div>

    </AppShell>
  );
};

export { HelpPage };
