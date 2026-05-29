
import { Icon } from '../components/icons.tsx';
import { AppShell, useToast, useCurrentUser } from './shell.tsx';
import React from 'react';
import { InviteList, ROLE_HELPER, ROLES } from './invite-row.tsx';
// Settings → Team

const INITIAL_MEMBERS = [
  { id: 1, name: 'Sarah Kim',      email: 'sarah.kim@crescentbank.com',     role: 'admin',   status: 'active',  initials: 'SK' },
  { id: 2, name: 'Marcus Chen',    email: 'marcus.chen@crescentbank.com',   role: 'analyst', status: 'active',  initials: 'MC' },
  { id: 3, name: 'Priya Shankar',  email: 'priya.shankar@crescentbank.com', role: 'analyst', status: 'pending', initials: 'PS' },
  { id: 4, name: 'Dana Lefkowitz', email: 'dana.lefkowitz@crescentbank.com', role: 'viewer', status: 'active',  initials: 'DL' },
  { id: 5, name: 'Tom Okafor',     email: 'tom.okafor@crescentbank.com',    role: 'viewer',  status: 'pending', initials: 'TO' },
];

const TeamSettings = ({ onNavigate }) => {
  const toast = useToast();
  const currentUser = useCurrentUser();
  // Derive role: super admin OR admin counts as admin for permissions
  const isAdmin = /admin/i.test(currentUser.role || '');

  // Allow Tweak panel-style switch for the demo — let viewer scope mode be toggled
  const [viewAs, setViewAs] = React.useState(isAdmin ? 'admin' : 'viewer');
  const effectiveAdmin = viewAs === 'admin';

  const [members, setMembers] = React.useState(INITIAL_MEMBERS);
  const [invites, setInvites] = React.useState([
    { email: '', role: 'analyst' },
  ]);

  const updateRole = (id, role) => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.map(mb => mb.id === id ? { ...mb, role } : mb));
    if (m) toast({ title: 'Role updated', desc: `${m.name} is now ${role}`, icon: 'check' });
  };

  const removeMember = (id) => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.filter(x => x.id !== id));
    toast({ title: 'Member removed', desc: m.name + ' no longer has access', icon: 'x', tone: 'amber' });
  };

  const sendInvites = () => {
    const valid = invites.filter(i => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email));
    if (valid.length === 0) {
      toast({ title: 'No valid invitations', desc: 'Add at least one email address', icon: 'alert-triangle', tone: 'amber' });
      return;
    }
    const newMembers = valid.map((inv, i) => ({
      id: Date.now() + i,
      name: inv.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: inv.email,
      role: inv.role,
      status: 'pending',
      initials: inv.email.slice(0, 2).toUpperCase(),
    }));
    setMembers(prev => [...prev, ...newMembers]);
    setInvites([{ email: '', role: 'analyst' }]);
    toast({ title: `${valid.length} invite${valid.length === 1 ? '' : 's'} sent`, desc: 'They\'ll receive an email shortly', icon: 'mail' });
  };

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
  };

  return (
    <AppShell
      active="settings"
      title="Settings"
      onNavigate={onNavigate}
      breadcrumb={[{ label: 'Settings', route: '/settings' }, { label: 'Team' }]}
    >
      <div data-screen-label="07 Settings — Team">
        <div className="page-head mount-up">
          <div>
            <div className="dash-page-label" style={{ marginBottom: 12 }}>Settings</div>
            <h1>Your <span className="ital">Team</span>.</h1>
            <p className="sub">
              {stats.total} members · {stats.active} active · {stats.pending} pending
            </p>
          </div>
          {/* Demo-only: lets you preview the viewer/analyst experience */}
          <div className="page-head-actions">
            <div className="role-banner" style={{ margin: 0, padding: '6px 10px 6px 14px' }}>
              <div className="icn" style={{ width: 22, height: 22 }}><Icon name="eye" size={12} /></div>
              <div className="body" style={{ fontSize: 11.5 }}>
                <div className="t" style={{ fontSize: 11.5 }}>View as</div>
              </div>
              <select value={viewAs} onChange={(e) => setViewAs(e.target.value)}>
                <option value="admin">Admin</option>
                <option value="analyst">Analyst</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sub-nav for settings sections */}
        <div className="tabs mount-up" style={{ animationDelay: '60ms' }}>
          {['General', 'Team', 'Integrations', 'Billing', 'Audit log'].map((t, i) => (
            <button key={t} className={`tab ${t === 'Team' ? 'active' : ''}`}>
              {t}
              {t === 'Team' && <span className="tab-count">{stats.total}</span>}
            </button>
          ))}
        </div>

        {/* Invite panel — admin only */}
        {effectiveAdmin && (
          <div className="card invite-panel mount-up" style={{ animationDelay: '120ms', marginBottom: 20 }}>
            <div className="invite-panel-head">
              <div>
                <div className="t">Invite members</div>
                <div className="d">They'll receive an email invitation and set their own password.</div>
              </div>
              <button className="btn btn-cream" onClick={sendInvites}>
                <Icon name="user-plus" size={13} /> Send invites
              </button>
            </div>
            <InviteList invites={invites} setInvites={setInvites} />
            {ROLE_HELPER}
          </div>
        )}

        {!effectiveAdmin && (
          <div className="role-banner mount-up" style={{ animationDelay: '120ms' }}>
            <div className="icn"><Icon name="lock" size={13} /></div>
            <div className="body">
              <div className="t">Read-only view</div>
              <div className="d">
                {viewAs === 'analyst'
                  ? 'Analysts can review the team roster but cannot invite or change roles.'
                  : 'Viewers can review the team roster but cannot invite or change roles.'}
              </div>
            </div>
          </div>
        )}

        {/* Members table */}
        <div className="card mount-up" style={{ animationDelay: '180ms', overflow: 'hidden' }}>
          <div className="card-header" style={{ paddingBottom: 14 }}>
            <div>
              <div className="card-title">Members</div>
              <div className="card-sub">Everyone with access to {currentUser.role && /admin/i.test(currentUser.role) ? 'this workspace' : 'your workspace'}</div>
            </div>
            <button className="btn-quiet" style={{ fontSize: 12, padding: '6px 10px', borderRadius: 6 }}>
              <Icon name="download" size={12} /> Export CSV
            </button>
          </div>
          <div>
            <div className="team-tbl-row header">
              <div>Member</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div></div>
            </div>
            {members.map(m => (
              <div key={m.id} className="team-tbl-row">
                <div className="team-member">
                  <div className="avatar avatar-sm">{m.initials}</div>
                  <div style={{ minWidth: 0 }}>
                    <div className="name">{m.name}</div>
                  </div>
                </div>
                <div className="team-member">
                  <span className="email">{m.email}</span>
                </div>
                <div>
                  {effectiveAdmin && m.id !== 1 ? (
                    <select
                      className="team-role-select"
                      value={m.role}
                      onChange={(e) => updateRole(m.id, e.target.value)}
                    >
                      {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  ) : (
                    <span className="role-static">
                      {ROLES.find(r => r.id === m.role)?.label || m.role}
                    </span>
                  )}
                </div>
                <div>
                  {m.status === 'active' ? (
                    <span className="pill pill-mint"><span className="dot"></span>Active</span>
                  ) : (
                    <span className="pill pill-amber"><span className="dot"></span>Pending</span>
                  )}
                </div>
                <div>
                  {effectiveAdmin && m.id !== 1 && (
                    <button
                      className="invite-remove"
                      title="Remove from workspace"
                      onClick={() => removeMember(m.id)}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {effectiveAdmin && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-dim)' }} className="mount-up">
            <div>Pending invitations are revocable up to 7 days after sending.</div>
            <a
              href="/invite/inv_demo123456789"
              onClick={(e) => { e.preventDefault(); onNavigate('/invite/inv_demo123456789'); }}
              style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', paddingBottom: 1 }}
            >
              Preview the invitation flow ↗
            </a>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export { TeamSettings };
