
import React from 'react';
import { Icon } from '../components/icons.tsx';
import { Logo, useToast } from './shell.tsx';
import { writeUser, writeOnboarded } from '../lib/session.ts';
// Accept Invitation — landing page for invited teammates

const AcceptInvite = ({ token, onNavigate }) => {
  const toast = useToast();
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Mocked invitation context — in production this would be decoded from the token
  const invite = {
    workspace: 'Crescent Bank',
    inviter: 'Sarah Kim',
    role: 'Analyst',
    email: 'priya.shankar@crescentbank.com',
  };

  const rules = {
    length: password.length >= 8,
    case:   /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    match:  password.length > 0 && password === confirm,
  };
  const canSubmit = rules.length && rules.case && rules.number && rules.match && !loading;

  const submit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      writeUser({ name: 'Priya Shankar', role: invite.role, initials: 'PS' });
      writeOnboarded();
      toast({ title: `Welcome to ${invite.workspace}`, desc: `Joined as ${invite.role}`, icon: 'check' });
      onNavigate('/dashboard');
    }, 600);
  };

  return (
    <div className="editorial-wrap" data-screen-label="06 Accept Invitation">
      <div className="editorial-header">
        <Logo size={16} />
        <div style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>
          <span style={{ fontFamily: 'Geist Mono, monospace' }}>{token ? token.slice(0, 12) : 'inv_xxxxxxxxxx'}…</span>
        </div>
      </div>

      <div className="editorial-body">
        <div className="editorial-card mount-up">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>
              <Icon name="mail" size={12} />
              You're invited
            </div>
            <h1 className="editorial-headline">
              Join <span className="ital">{invite.workspace}</span> on BiasSense.
            </h1>
            <p className="editorial-sub">
              <span style={{ color: 'var(--text)' }}>{invite.inviter}</span> invited you as
              {' '}an <span style={{ color: 'var(--cream)' }}>{invite.role}</span>.
              {' '}Set a password to activate your account.
            </p>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Email</label>
              <div className="field-with-icon">
                <input type="email" value={invite.email} readOnly style={{ paddingLeft: 38, color: 'var(--text-muted)', background: 'var(--bg-2)', cursor: 'not-allowed' }} />
                <span className="field-icon"><Icon name="mail" size={14} /></span>
              </div>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="pw">Set password</label>
              <div className="field-with-icon">
                <input
                  id="pw"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{ paddingLeft: 38 }}
                />
                <span className="field-icon"><Icon name="lock" size={14} /></span>
              </div>
              <div className="password-hint">
                <div className={`password-hint-item ${rules.length ? 'ok' : ''}`}><span className="dot"></span>At least 8 characters</div>
                <div className={`password-hint-item ${rules.case ? 'ok' : ''}`}><span className="dot"></span>Mix of upper and lowercase letters</div>
                <div className={`password-hint-item ${rules.number ? 'ok' : ''}`}><span className="dot"></span>At least one number</div>
              </div>
            </div>

            <div className="field" style={{ margin: 0 }}>
              <label htmlFor="pw2">Confirm password</label>
              <div className="field-with-icon">
                <input
                  id="pw2"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  style={{ paddingLeft: 38 }}
                />
                <span className="field-icon"><Icon name="lock" size={14} /></span>
              </div>
              {confirm.length > 0 && !rules.match && (
                <div className="err">
                  <Icon name="alert-triangle" size={12} />
                  Passwords don't match
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-cream"
              style={{ width: '100%', height: 44, marginTop: 4, fontSize: 14 }}
              disabled={!canSubmit}
            >
              {loading ? 'Joining…' : (
                <>Join workspace <Icon name="arrow-right" size={13} /></>
              )}
            </button>
          </form>

          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 7, paddingTop: 4, borderTop: '1px solid var(--border-soft)', marginTop: 4 }}>
            <Icon name="shield" size={12} />
            Protected by SOC 2 Type II controls.
          </div>
        </div>
      </div>

      <div className="editorial-foot">
        <span>© 2026 BiasSense, Inc.</span>
        <span>This invitation expires in 7 days.</span>
      </div>
    </div>
  );
};

export { AcceptInvite };
