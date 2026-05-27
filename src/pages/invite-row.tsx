
import React from 'react';
import { Icon } from '../components/icons.tsx';
// InviteRow — reusable invite input + role select + remove button
// Used by onboarding step 2 and Settings > Team

type RoleId = 'admin' | 'analyst' | 'viewer';

interface Role {
  id: RoleId;
  label: string;
}

const ROLES: ReadonlyArray<Role> = [
  { id: 'admin',   label: 'Admin'   },
  { id: 'analyst', label: 'Analyst' },
  { id: 'viewer',  label: 'Viewer'  },
];

const ROLE_HELPER = (
  <div className="role-helper">
    <div className="icn"><Icon name="info" size={12} /></div>
    <div className="body">
      <strong>Admins</strong> manage workspace settings and billing.{' '}
      <strong>Analysts</strong> run analyses, register models, and configure alerts.{' '}
      <strong>Viewers</strong> have read-only access to dashboards and audit logs.
    </div>
  </div>
);

export interface Invite {
  id: string;
  email: string;
  role: string;
}

interface InviteRowProps {
  invite: Invite;
  onChange: (invite: Invite) => void;
  onRemove: () => void;
  canRemove?: boolean;
  autoFocus?: boolean;
}

const InviteRow: React.FC<InviteRowProps> = ({ invite, onChange, onRemove, canRemove = true, autoFocus = false }) => {
  return (
    <div className="invite-row">
      <div className="invite-input">
        <input
          type="email"
          placeholder="teammate@company.com"
          value={invite.email}
          onChange={(e) => onChange({ ...invite, email: e.target.value })}
          autoFocus={autoFocus}
        />
        <span className="icn"><Icon name="mail" size={14} /></span>
      </div>
      <select
        className="invite-role"
        value={invite.role}
        onChange={(e) => onChange({ ...invite, role: e.target.value })}
      >
        {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
      </select>
      <button
        className="invite-remove"
        onClick={onRemove}
        disabled={!canRemove}
        title="Remove"
      >
        <Icon name="x" size={14} />
      </button>
    </div>
  );
};

interface InviteListProps {
  invites: Invite[];
  setInvites: React.Dispatch<React.SetStateAction<Invite[]>>;
}

const InviteList: React.FC<InviteListProps> = ({ invites, setInvites }) => {
  const update = (i: number, next: Invite) => {
    setInvites(invites.map((inv, idx) => idx === i ? next : inv));
  };
  const remove = (i: number) => {
    setInvites(invites.filter((_, idx) => idx !== i));
  };
  const add = () => {
    setInvites([...invites, { id: Math.random().toString(36).slice(2), email: '', role: 'analyst' }]);
  };
  return (
    <div>
      {invites.map((inv, i) => (
        <InviteRow
          key={inv.id}
          invite={inv}
          onChange={(next) => update(i, next)}
          onRemove={() => remove(i)}
          canRemove={invites.length > 1}
        />
      ))}
      <button className="invite-add-row" onClick={add}>
        <Icon name="plus" size={13} /> Add another
      </button>
    </div>
  );
};

export { InviteRow, InviteList, ROLES, ROLE_HELPER };
