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

const Wordmark = ({ size }: { size: number | string }) => {
  return (
    <span className="logo-word" style={{ fontSize: size, position: 'relative', color: '#0F172A' }}>
      BiasSens<span style={{ position: 'relative', display: 'inline-block' }}>
        e
        {/* <span
          style={{
            position: 'absolute',
            top: '-0.1em',
            left: '100%',
            transform: 'scaleX(0.7)',
            transformOrigin: 'left center',
            fontSize: '0.58em',
            lineHeight: 1,
            color: '#0F172A',
            fontWeight: 900,
            letterSpacing: 0,
            whiteSpace: 'nowrap',
            WebkitTextStroke: '1.8px currentColor',
          }}
        >→</span> */}
      </span>
    </span>
  );
};

const Logo = ({ size = 15 }: { size?: number | string }) => {
  return (
    <span className="logo logo-lock" style={{ fontSize: size }}>
      <Wordmark size={size} />
    </span>
  );
};

const LogoLockup = ({ size = 18 }: { size?: number | string }) => {
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

// ===== Profile menu (topbar avatar) =====

const SHORTCUTS = [
  { keys: ['⌘', 'K'],      label: 'Open search'         },
  { keys: ['⌘', 'N'],      label: 'New analysis run'    },
  { keys: ['⌘', '/'],      label: 'Toggle sidebar'      },
  { keys: ['⌘', 'D'],      label: 'Go to Dashboard'     },
  { keys: ['⌘', 'M'],      label: 'Go to Models'        },
  { keys: ['⌘', 'Shift', 'A'], label: 'Go to Analysis' },
  { keys: ['Esc'],         label: 'Close modal / panel' },
];

const MenuSection = ({ label, children }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{
      fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      padding: '10px 14px 4px',
    }}>{label}</div>
    {children}
  </div>
);

const MenuItem = ({ icon, label, desc = '', badge = null, onClick, danger = false }: {
  icon: any; label: string; desc?: string; badge?: React.ReactNode; onClick: () => void; danger?: boolean;
}) => (
  <button
    className="user-menu-item"
    onClick={onClick}
    style={danger ? undefined : undefined}
  >
    <span style={{ color: danger ? 'var(--rose)' : 'var(--text-dim)', display: 'flex' }}>
      <Icon name={icon} size={14} />
    </span>
    <span style={{ flex: 1, minWidth: 0 }}>
      <span style={{ color: danger ? 'var(--rose)' : 'var(--text)', display: 'block', fontWeight: 600 }}>{label}</span>
      {desc && <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 500, display: 'block', marginTop: 1 }}>{desc}</span>}
    </span>
    {badge}
  </button>
);

const ProfileMenu = ({ onNavigate }: { onNavigate: (r: string) => void }) => {
  const user = useCurrentUser();
  const toast = useToast();
  const [open, setOpen]   = React.useState(false);
  const [view, setView]   = React.useState<'main' | 'shortcuts'>('main');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setView('main');
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (route: string) => { setOpen(false); setView('main'); onNavigate(route); };
  const close = () => { setOpen(false); setView('main'); };

  const logout = () => {
    sessionLogout(); close(); onNavigate('/signin');
  };

  const initials = user.initials ?? (user.name ?? 'U').split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      {/* Avatar trigger */}
      <button
        className="avatar"
        onClick={() => { setOpen(o => !o); setView('main'); }}
        title={`${user.name} · ${user.role}`}
        style={{
          cursor: 'pointer',
          outline: open ? '2px solid var(--cream)' : '2px solid transparent',
          outlineOffset: 2,
          transition: 'outline 120ms',
        }}
      >
        {initials}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="profile-pop">
          {view === 'main' ? (
            <>
              {/* ── Profile header ── */}
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'linear-gradient(135deg, #0f766e 0%, #0e7490 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 900, color: '#fff', flexShrink: 0,
                  }}>{initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', lineHeight: 1.2 }}>{user.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2, fontWeight: 500 }}>{user.role}</div>
                  </div>
                </div>
                {/* Email + Plan row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                    dhanunjay.p@dataeqconsulting.com
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999,
                    background: 'var(--cream-soft, rgba(255,206,118,0.15))',
                    border: '1px solid rgba(255,206,118,0.25)',
                    color: 'var(--cream, #FFCE76)', letterSpacing: '0.04em',
                    textTransform: 'uppercase', flexShrink: 0, marginLeft: 8,
                  }}>Pro</span>
                </div>
              </div>

              {/* ── Workspace stats strip ── */}
              <div style={{
                display: 'flex', padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                gap: 0,
              }}>
                {[
                  { label: 'Models',   val: '12' },
                  { label: 'Datasets', val: '8'  },
                  { label: 'Runs',     val: '47' },
                ].map((s, i, arr) => (
                  <div key={s.label} style={{
                    flex: 1, textAlign: 'center',
                    borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    padding: '2px 0',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', letterSpacing: '-0.02em' }}>{s.val}</div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)', marginTop: 1 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── Account section ── */}
              <MenuSection label="Account">
                <MenuItem
                  icon="user-plus"
                  label="My profile"
                  desc="Edit name, avatar, and bio"
                  onClick={() => { close(); toast({ title: 'Profile editor', desc: 'Coming soon in v1.1', icon: 'sparkles' }); }}
                />
                <MenuItem
                  icon="settings"
                  label="Preferences"
                  desc="Theme, density, notifications"
                  onClick={() => { close(); toast({ title: 'Preferences', desc: 'Coming soon in v1.1', icon: 'sparkles' }); }}
                />
              </MenuSection>

              <div className="user-menu-sep" />

              {/* ── Workspace section ── */}
              <MenuSection label="Workspace">
                <MenuItem icon="briefcase"  label="Workspace settings" onClick={() => go('/settings/team')} />
                <MenuItem icon="users"      label="Team members"        onClick={() => go('/settings/team')} />
                <MenuItem icon="audit"      label="Audit log"           onClick={() => go('/audit')} />
              </MenuSection>

              <div className="user-menu-sep" />

              {/* ── Help section ── */}
              <MenuSection label="Help">
                <MenuItem
                  icon="info"
                  label="Keyboard shortcuts"
                  badge={<Icon name="chevron-right" size={12} />}
                  onClick={() => setView('shortcuts')}
                />
                <MenuItem
                  icon="sparkles"
                  label="What's new"
                  badge={
                    <span style={{
                      fontSize: 9.5, fontWeight: 800, padding: '1px 6px', borderRadius: 999,
                      background: 'rgba(20,184,166,0.18)', color: 'var(--mint)',
                      border: '1px solid rgba(20,184,166,0.25)', letterSpacing: '0.03em',
                    }}>NEW</span>
                  }
                  onClick={() => { close(); toast({ title: "What's new in v1.0", desc: 'Analysis page, Datasets view, model health trends', icon: 'sparkles' }); }}
                />
                <MenuItem
                  icon="flag"
                  label="Help & docs"
                  onClick={() => { close(); toast({ title: 'Documentation', desc: 'Opening docs.biassense.io…', icon: 'flag' }); }}
                />
              </MenuSection>

              <div className="user-menu-sep" />

              {/* ── Sign out ── */}
              <div style={{ padding: '6px 6px 8px' }}>
                <button
                  className="user-menu-item danger"
                  onClick={logout}
                  style={{ width: '100%', borderRadius: 8 }}
                >
                  <span style={{ color: 'var(--rose)', display: 'flex' }}><Icon name="logout" size={14} /></span>
                  <span style={{ color: 'var(--rose)', fontWeight: 600 }}>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            /* ── Keyboard shortcuts panel ── */
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px 11px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}>
                <button
                  onClick={() => setView('main')}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 7, width: 26, height: 26, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: 'var(--text-dim)',
                  }}
                >
                  <Icon name="chevron-left" size={13} />
                </button>
                <div style={{ fontWeight: 800, fontSize: 13.5, color: 'var(--text)' }}>Keyboard shortcuts</div>
              </div>
              <div style={{ padding: '8px 0 10px' }}>
                {SHORTCUTS.map(s => (
                  <div key={s.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 16px', gap: 8,
                  }}>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</span>
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {s.keys.map(k => (
                        <kbd key={k} style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          minWidth: 22, height: 20, padding: '0 5px', borderRadius: 5,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          fontSize: 11, fontWeight: 700, color: 'var(--text-dim)',
                          fontFamily: 'inherit',
                        }}>{k}</kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ active, onNavigate, open, onToggle }: { active: string; onNavigate: (r: string) => void; open: boolean; onToggle: () => void }) => {
  const groups = {
    workspace: NAV_ITEMS.filter((n) => n.group === 'workspace'),
    insights: NAV_ITEMS.filter((n) => n.group === 'insights'),
    account: NAV_ITEMS.filter((n) => n.group === 'account')
  };
  return (
    <aside className={`sidebar${open ? '' : ' sidebar-collapsed'}`}>
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

const TopBar = ({ title, breadcrumb, onNavigate, hideActions = false, search = true, sidebarOpen = true, onToggleSidebar }: { title?: string; breadcrumb?: any[]; onNavigate: (r: string) => void; hideActions?: boolean; search?: boolean; sidebarOpen?: boolean; onToggleSidebar?: () => void }) => {
  const [q, setQ] = React.useState('');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Logo size={24} />
            {onToggleSidebar && (
              <button className="sidebar-collapse-btn" onClick={onToggleSidebar} title="Toggle sidebar" style={{ marginLeft: 0 }}>
                <Icon name={sidebarOpen ? 'chevron-left' : 'menu'} size={16} />
              </button>
            )}
          </div>
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
          </div>
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
            <NotifBell />
            <ProfileMenu onNavigate={onNavigate} />
          </div>
        }
      </div>
    </>);

};

let globalSidebarOpen = true;

const AppShell = ({ active, title, breadcrumb, onNavigate, children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(globalSidebarOpen);
  const toggle = () => {
    globalSidebarOpen = !sidebarOpen;
    setSidebarOpen(globalSidebarOpen);
  };
  return (
    <div className={`app-shell${sidebarOpen ? '' : ' sidebar-hidden'}`}>
      <Sidebar active={active} onNavigate={onNavigate} open={sidebarOpen} onToggle={toggle} />
      <div className={`main${sidebarOpen ? '' : ' sidebar-hidden'}`}>
        <TopBar title={title} breadcrumb={breadcrumb} onNavigate={onNavigate} sidebarOpen={sidebarOpen} onToggleSidebar={toggle} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};


export { Logo, LogoLockup, Sidebar, TopBar, AppShell, NAV_ITEMS, ToastProvider, useToast, NotifBell, useCurrentUser };