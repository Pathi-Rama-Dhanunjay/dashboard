
import { Icon } from '../components/icons.tsx';
import { AppShell, Logo, LogoLockup, ToastProvider, useToast, useCurrentUser, NAV_ITEMS } from './shell.tsx';

import React from 'react';
// Models list

const MODELS = [
  { id: 'creditrisk',    name: 'CreditRisk',     version: 'v2.4.1', icon: 'shield',         status: 'approved', risk: 'low',      riskLabel: 'Low risk',     accuracy: 92.4, fairness: 87, predictions: '4.2M', updated: 'May 21, 2026', tag: 'finance' },
  { id: 'loanapproval',  name: 'LoanApproval',   version: 'v1.8.0', icon: 'database',       status: 'approved', risk: 'medium',   riskLabel: 'Medium risk',  accuracy: 89.1, fairness: 72, predictions: '1.8M', updated: 'May 19, 2026', tag: 'finance' },
  { id: 'hirefilter',    name: 'HireFilter',     version: 'v0.9.2', icon: 'alert-triangle', status: 'blocked',  risk: 'high',     riskLabel: 'High risk',    accuracy: 84.7, fairness: 54, predictions: '320K', updated: 'May 22, 2026', tag: 'hr' },
  { id: 'pricingengine', name: 'PricingEngine',  version: 'v3.2.0', icon: 'trending',       status: 'approved', risk: 'medium',   riskLabel: 'Medium risk',  accuracy: 91.8, fairness: 68, predictions: '12M',  updated: 'May 18, 2026', tag: 'commerce' },
  { id: 'fraudguard',    name: 'FraudGuard',     version: 'v4.1.3', icon: 'shield-check',   status: 'approved', risk: 'low',      riskLabel: 'Low risk',     accuracy: 96.2, fairness: 91, predictions: '8.4M', updated: 'May 23, 2026', tag: 'security' },
  { id: 'churnpredict',  name: 'ChurnPredict',   version: 'v2.0.4', icon: 'cube',           status: 'blocked',  risk: 'high',     riskLabel: 'High risk',    accuracy: 78.5, fairness: 49, predictions: '640K', updated: 'May 15, 2026', tag: 'commerce' },
];

const riskPillClass = (risk) => ({ low: 'pill-mint', medium: 'pill-amber', high: 'pill-rose' }[risk] || '');

const statusPill = (s) => s === 'approved'
  ? <span className="pill pill-mint"><span className="dot"></span>Approved</span>
  : <span className="pill pill-rose"><span className="dot"></span>Blocked</span>;

const ModelsList = ({ onNavigate }) => {
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');

  const filtered = MODELS.filter(m => {
    if (filter === 'approved' && m.status !== 'approved') return false;
    if (filter === 'blocked'  && m.status !== 'blocked')  return false;
    if (filter === 'high'     && m.risk !== 'high')       return false;
    if (query && !m.name.toLowerCase().includes(query.toLowerCase()) && !m.tag.includes(query.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: MODELS.length,
    approved: MODELS.filter(m => m.status === 'approved').length,
    blocked:  MODELS.filter(m => m.status === 'blocked').length,
    high:     MODELS.filter(m => m.risk === 'high').length,
  };

  return (
    <AppShell active="models" title="Models" onNavigate={onNavigate}>
      <div data-screen-label="03 Models">
        <div className="page-head mount-up">
          <div>
            <h1>All <span className="ital">models</span>.</h1>
            <p className="sub">24 monitored · {filtered.length} shown · Last sync 2 minutes ago</p>
          </div>
          <div className="page-head-actions">
            <button className="btn btn-ghost"><Icon name="download" size={13} />Export</button>
            <button className="btn btn-cream"><Icon name="plus" size={13} />Register model</button>
          </div>
        </div>

        <div className="filter-row mount-up" style={{ animationDelay: '80ms' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search models…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'approved', label: 'Approved' },
              { id: 'blocked', label: 'Blocked' },
              { id: 'high', label: 'High risk' },
            ].map(f => (
              <button key={f.id} className={`chip ${filter === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
                {f.label}
                <span className="count">{counts[f.id]}</span>
              </button>
            ))}
          </div>
          <button className="chip" style={{ marginLeft: 'auto' }}>
            <Icon name="filter" size={12} />More filters
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-card mount-up">
            <div className="empty-icn"><Icon name="models" size={26} /></div>
            <div className="empty-title">No models match your <span className="ital">filters</span>.</div>
            <div className="empty-sub">Try clearing the search or switching to a different filter chip.</div>
            <button className="btn btn-ghost" onClick={() => { setFilter('all'); setQuery(''); }}>Reset filters</button>
          </div>
        ) : (
          <div className="models-grid">
            {filtered.map((m, i) => (
              <div
                key={m.id}
                className="card model-card mount-up"
                style={{ animationDelay: `${80 + i * 50}ms` }}
                onClick={() => onNavigate('/models/' + m.id)}
              >
                <div className="model-card-head">
                  <div className="model-icon"><Icon name={m.icon} size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="model-name">{m.name}</div>
                    <div className="model-version">
                      <span>{m.version}</span>
                      <span style={{ color: 'var(--text-faint)' }}>·</span>
                      <span>{m.updated}</span>
                    </div>
                  </div>
                  <button className="btn-quiet" style={{ width: 28, height: 28, borderRadius: 7 }} onClick={(e) => e.stopPropagation()}>
                    <Icon name="more-h" size={14} />
                  </button>
                </div>
                <div className="model-meta-row">
                  {statusPill(m.status)}
                  <span className={`pill ${riskPillClass(m.risk)}`}>
                    <span className="dot"></span>{m.riskLabel}
                  </span>
                </div>
                <div className="model-stats">
                  <div>
                    <div className="model-stat-lbl">Accuracy</div>
                    <div className="model-stat-val">{m.accuracy.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="model-stat-lbl">Fairness</div>
                    <div className="model-stat-val">{m.fairness}<span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 400 }}>/100</span></div>
                  </div>
                  <div>
                    <div className="model-stat-lbl">Predictions</div>
                    <div className="model-stat-val">{m.predictions}</div>
                  </div>
                </div>
                <div className="model-card-foot">
                  <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); onNavigate('/models/' + m.id); }}>
                    View details
                    <Icon name="arrow-right" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

export { ModelsList };
export { MODELS };
export { riskPillClass };
export { statusPill };
