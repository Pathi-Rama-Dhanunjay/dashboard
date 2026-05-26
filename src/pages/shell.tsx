import React from 'react';
import { Icon } from '../components/icons.tsx';
import { readUser, logout as sessionLogout } from '../lib/session.ts';
// Shared shell — Sidebar, TopBar, Logo, Toast system

// ===== Logo — three Tweak-driven variants =====
//
// variant === 'square' (default) — solid orange rounded-square mark with a
//   bold white "B". Reads confidently in nav and on the sign-in card.
// variant === 'ring'              — concentric orange ring with an orange
//   dot orbiting the threshold line. Evokes observability / signal.
// variant === 'dot'               — pure wordmark, with the dot on the
//   second "i" of "BiasSense" replaced by a glowing orange disc.
//
// The active variant is read from `document.documentElement.dataset.logo`
// — set by app.jsx via Tweaks.

const Wordmark = ({ size }: { size: number }) => {
  return (
    <span className="logo-word" style={{ fontSize: size, position: 'relative' }}>
      BiasSens<span style={{ position: 'relative', display: 'inline-block' }}>
        e
        <span
          style={{
            position: 'absolute',
            top: '-0.1em',
            left: '85%',
            transform: 'translateX(0)',
            fontSize: '0.52em',
            lineHeight: 1,
            color: 'var(--text)',
            fontWeight: 700,
            letterSpacing: 0,
            whiteSpace: 'nowrap',
          }}
        >→</span>
      </span>
    </span>
  );
};

const Logo = ({ size = 15 }) => {
  return (
    <span className="logo logo-lock" style={{ fontSize: size }}>
      <Wordmark size={size} />
    </span>
  );
};

const LogoLockup = ({ size = 18 }) => {
  return (
    <span className="logo-lockup" style={{ fontSize: size }}>
      <Wordmark size={size} />
    </span>
  );
};


// ===== Toast context =====
const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);
  const timersRef = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  React.useEffect(() => {
    return () => {
      timersRef.current.forEach((tid) => clearTimeout(tid));
      timersRef.current.clear();
    };
  }, []);

  const push = React.useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    const tid = setTimeout(() => {
      timersRef.current.delete(id);
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, t.duration || 4200);
    timersRef.current.set(id, tid);
  }, []);
  const dismiss = (id) => {
    const tid = timersRef.current.get(id);
    if (tid) { clearTimeout(tid); timersRef.current.delete(id); }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) =>
        <div key={t.id} className={`toast ${t.tone || ''}`}>
            <div className="icn">
              <Icon name={t.icon || 'check'} size={14} />
            </div>
            <div className="body">
              <div className="t">{t.title}</div>
              {t.desc && <div className="d">{t.desc}</div>}
            </div>
            <button className="x" onClick={() => dismiss(t.id)}>
              <Icon name="x" size={14} />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>);

};

const useToast = () => React.useContext(ToastContext);

// ===== Nav config =====
const NAV_ITEMS = [
{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard', group: 'workspace' },
{ id: 'datasets', label: 'Datasets', icon: 'datasets', route: '/datasets', group: 'workspace', count: 8, tone: 'mint' },
{ id: 'models', label: 'Models', icon: 'models', route: '/models', group: 'workspace', count: 12, tone: 'cream' },
{ id: 'analysis', label: 'Analysis', icon: 'analysis', route: '/analysis', group: 'workspace' },
{ id: 'deepdive', label: 'Deep Dive', icon: 'deepdive', route: '/deep-dive', group: 'insights' },
{ id: 'audit', label: 'Audit', icon: 'audit', route: '/audit', group: 'insights' },
{ id: 'alerts', label: 'Alerts', icon: 'alerts', route: '/alerts', group: 'insights', alertCount: 2 },
{ id: 'settings', label: 'Settings', icon: 'settings', route: '/settings/team', group: 'account' }];


const DEFAULT_USER = { name: 'Sarah Kim', role: 'ML Platform · Lead', initials: 'SK' };

const useCurrentUser = () => {
  const [user, setUser] = React.useState(() => readUser() ?? DEFAULT_USER);
  React.useEffect(() => {
    const sync = () => setUser(readUser() ?? DEFAULT_USER);
    window.addEventListener('storage', sync);
    window.addEventListener('biassense:user', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('biassense:user', sync);
    };
  }, []);
  return user;
};

const UserCard = ({ onNavigate }) => {
  const user = useCurrentUser();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const logout = () => {
    sessionLogout();
    setOpen(false);
    onNavigate('/signin');
  };

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div className="user-card" onClick={() => setOpen(o => !o)}>
        <div className="avatar avatar-sm">{user.initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: 6 }}>
            {user.name}
            {user.role && user.role.toLowerCase().includes('admin') && (
              <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 999, background: 'var(--cream-soft)', border: '1px solid var(--cream-edge)', color: 'var(--cream)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Admin</span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.role}
          </div>
        </div>
        <Icon name="chevron-right" size={14} className="text-dim" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 150ms' }} />
      </div>
      {open && (
        <div className="user-menu">
          <button className="user-menu-item" onClick={() => { setOpen(false); onNavigate('/settings/team'); }}>
            <Icon name="settings" size={14} />
            <span>Workspace settings</span>
          </button>
          <button className="user-menu-item" onClick={() => { setOpen(false); onNavigate('/audit'); }}>
            <Icon name="audit" size={14} />
            <span>Audit log</span>
          </button>
          <div className="user-menu-sep"></div>
          <button className="user-menu-item danger" onClick={logout}>
            <Icon name="logout" size={14} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ active, onNavigate }) => {
  const groups = {
    workspace: NAV_ITEMS.filter((n) => n.group === 'workspace'),
    insights: NAV_ITEMS.filter((n) => n.group === 'insights'),
    account: NAV_ITEMS.filter((n) => n.group === 'account')
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Logo size={16} />
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Workspace</div>
        {groups.workspace.map((item) =>
        <NavBtn key={item.id} item={item} active={active} onNavigate={onNavigate} />
        )}
        <div className="sidebar-section">Insights</div>
        {groups.insights.map((item) =>
        <NavBtn key={item.id} item={item} active={active} onNavigate={onNavigate} />
        )}
        <div className="sidebar-section">Account</div>
        {groups.account.map((item) =>
        <NavBtn key={item.id} item={item} active={active} onNavigate={onNavigate} />
        )}
      </nav>
      <UserCard onNavigate={onNavigate} />
    </aside>);

};

const NavBtn = ({ item, active, onNavigate }) =>
<button
  className={`nav-item ${active === item.id ? 'active' : ''}`}
  onClick={() => onNavigate(item.route)}>
  
    <Icon name={item.icon} className="nav-icon" size={15} />
    <span>{item.label}</span>
    {item.alertCount > 0 && <span className="nav-count alert">{item.alertCount}</span>}
    {item.count > 0 && !item.alertCount && <span className={`nav-count ${item.tone || ''}`}>{item.count}</span>}
  </button>;


// ===== Notifications dropdown =====
const NOTIFICATIONS = [
{ tone: 'rose', icon: 'alert-triangle', title: 'HireFilter exceeded bias threshold', desc: 'Female cohort disparate impact dropped to 0.62', time: '12 min ago' },
{ tone: 'amber', icon: 'flag', title: 'LoanApproval feature drift detected', desc: '`zip_code` distribution shifted 18%', time: '1h ago' },
{ tone: 'cream', icon: 'sparkles', title: 'Mitigation suggestion ready', desc: 'Reweighting for CreditRisk v2.4 — review now', time: '3h ago' },
{ tone: 'mint', icon: 'shield-check', title: 'PricingEngine audit passed', desc: 'All fairness checks within tolerance', time: 'Yesterday' }];


const NotifBell = () => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onClick = (e) => {if (ref.current && !ref.current.contains(e.target)) setOpen(false);};
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button className="btn-icon" onClick={() => setOpen((o) => !o)} title="Notifications">
        <Icon name="bell" size={15} />
        {!open && NOTIFICATIONS.length > 0 && <span className="badge-dot"></span>}
      </button>
      {open &&
      <div className="notif-pop">
          <div className="notif-pop-head">
            <h4>Notifications</h4>
            <button className="btn-quiet" style={{ height: 24, padding: '0 8px', fontSize: 11.5, borderRadius: 6 }}>
              Mark all read
            </button>
          </div>
          <div className="notif-pop-list">
            {NOTIFICATIONS.map((a, i) =>
          <div key={i} className="alert-row">
                <div className={`alert-icon ${a.tone}`}><Icon name={a.icon} size={14} /></div>
                <div className="alert-body">
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-desc">{a.desc}</div>
                </div>
                <div className="alert-time">{a.time}</div>
              </div>
          )}
          </div>
        </div>
      }
    </div>);

};

// ===== Run Analysis modal =====
const RunAnalysisModal = ({ open, onClose }) => {
  const toast = useToast();
  const [model, setModel] = React.useState('CreditRisk v2.4.1');
  const [running, setRunning] = React.useState(false);
  const timeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      timeoutsRef.current.forEach((tid) => clearTimeout(tid));
      timeoutsRef.current = [];
    };
  }, []);

  if (!open) return null;

  const run = () => {
    setRunning(true);
    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setRunning(false);
      onClose();
      toast({
        title: 'Analysis started',
        desc: `${model} · ETA ~2 minutes`,
        icon: 'play',
        tone: ''
      });
      const t2 = setTimeout(() => {
        if (!isMountedRef.current) return;
        toast({
          title: 'Analysis complete',
          desc: `${model} · Fairness score 76 (+4)`,
          icon: 'check',
          tone: ''
        });
      }, 3200);
      if (isMountedRef.current) timeoutsRef.current.push(t2);
    }, 700);
    timeoutsRef.current.push(t1);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <h3>Run analysis</h3>
            <div className="sub">Evaluate fairness across protected groups and runtime metrics.</div>
          </div>
          <button className="btn-quiet" style={{ width: 28, height: 28, borderRadius: 7 }} onClick={onClose}>
            <Icon name="x" size={14} />
          </button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {['CreditRisk v2.4.1', 'LoanApproval v1.8.0', 'HireFilter v0.9.2', 'PricingEngine v3.2.0', 'FraudGuard v4.1.3'].map((m) =>
              <option key={m}>{m}</option>
              )}
            </select>
          </div>
          <div className="field">
            <label>Evaluation dataset</label>
            <select defaultValue="prod-eval-may26">
              <option value="prod-eval-may26">production-eval · May 2026 (24,318 rows)</option>
              <option>holdout-test · Apr 2026 (8,200 rows)</option>
              <option>synthetic-aug · May 2026 (50,000 rows)</option>
            </select>
          </div>
          <div className="field">
            <label>Metrics</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Demographic Parity', 'Equalized Odds', 'Predictive Parity', 'Calibration', 'Error Parity'].map((m, i) =>
              <span key={m} className={`chip ${i < 3 ? 'active' : ''}`} style={{ pointerEvents: 'none' }}>
                  <Icon name={i < 3 ? 'check' : 'plus'} size={11} />{m}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-cream" onClick={run} disabled={running}>
            {running ?
            <>Starting…</> :

            <><Icon name="play" size={12} />Start analysis</>
            }
          </button>
        </div>
      </div>
    </div>);

};

const TopBar = ({ title, breadcrumb, onNavigate, hideActions = false, search = true }) => {
  const [runOpen, setRunOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const user = useCurrentUser();
  const searchRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          {breadcrumb && breadcrumb.length > 0 &&
          <div className="crumbs">
              {breadcrumb.map((b, i) =>
            <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: 'var(--text-faint)' }}>/</span>}
                  {b.route ?
              <button onClick={() => onNavigate(b.route)}>{b.label}</button> :

              <span>{b.label}</span>
              }
                </React.Fragment>
            )}
            </div>
          }
          <div className="topbar-title">{title}</div>
        </div>
        {search && !hideActions &&
          <div className="topbar-search">
            <svg className="topbar-search-icn" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search models, datasets, runs…"
            />
            <kbd className="topbar-search-kbd">⌘K</kbd>
          </div>
        }
        {!hideActions &&
        <div className="topbar-actions">
            <button className="btn btn-cream" onClick={() => setRunOpen(true)}>
              <Icon name="play" size={12} />
              Run Analysis
            </button>
            <div style={{ width: 1, height: 22, background: 'var(--border-soft)', margin: '0 4px' }}></div>
            <NotifBell />
            <button className="avatar" title={user.name + ' — ' + user.role} style={{ cursor: 'pointer' }}>{user.initials}</button>
          </div>
        }
      </div>
      <RunAnalysisModal open={runOpen} onClose={() => setRunOpen(false)} />
    </>);

};

const AppShell = ({ active, title, breadcrumb, onNavigate, children }) =>
<div className="app-shell">
    <Sidebar active={active} onNavigate={onNavigate} />
    <div className="main">
      <TopBar title={title} breadcrumb={breadcrumb} onNavigate={onNavigate} />
      <div className="content">{children}</div>
    </div>
  </div>;


export { Logo, LogoLockup, Sidebar, TopBar, AppShell, NAV_ITEMS, ToastProvider, useToast, NotifBell, useCurrentUser };