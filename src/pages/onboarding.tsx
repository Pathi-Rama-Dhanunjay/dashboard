
import React from 'react';
import { Icon } from '../components/icons.tsx';
import { Logo, useToast, useCurrentUser } from './shell.tsx';
import { writeOnboarded } from '../lib/session.ts';
// Onboarding wizard — 2 steps: Workspace + Team
// Step 1 → POST /api/v1/onboarding
// Step 2 → POST /api/v1/users (one per row)

const STEPS = [
  { id: 1, label: 'Workspace' },
  { id: 2, label: 'Team' },
];

const FRAMEWORKS = [
  { id: 'ecoa',          label: 'ECOA — Equal Credit Opportunity Act' },
  { id: 'eeoc',          label: 'EEOC — Equal Employment Opportunity' },
  { id: 'gdpr',          label: 'GDPR — General Data Protection Regulation' },
  { id: 'eu_ai',         label: 'EU AI Act' },
  { id: 'sr11',          label: 'SR 11-7 — Model Risk Management' },
  { id: 'fha',           label: 'Fair Housing Act' },
  { id: 'nyc_ll144',     label: 'NYC Local Law 144' },
  { id: 'ccpa',          label: 'CCPA — California Consumer Privacy Act' },
  { id: 'hipaa',         label: 'HIPAA' },
  { id: 'iso_42001',     label: 'ISO/IEC 42001' },
  { id: 'nist_ai_rmf',   label: 'NIST AI Risk Management Framework' },
  { id: 'other',         label: 'Other / not listed' },
];

const INDUSTRIES = [
  { id: 'financial',  label: 'Financial services' },
  { id: 'insurance',  label: 'Insurance' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'hr',         label: 'HR & talent' },
  { id: 'retail',     label: 'Retail & commerce' },
  { id: 'housing',    label: 'Housing & real estate' },
  { id: 'government', label: 'Government & public sector' },
  { id: 'tech',       label: 'Technology & SaaS' },
  { id: 'other',      label: 'Other' },
];

const PLANS = [
  { id: 'free',       label: 'Free',       sub: 'For solo evaluators' },
  { id: 'pro',        label: 'Pro',        sub: 'For ML teams' },
  { id: 'enterprise', label: 'Enterprise', sub: 'With SSO & SLAs' },
];

const slugify = (s) => (s || '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const Stepper = ({ current }) => (
  <div className="stepper">
    {STEPS.map((s, i) => (
      <React.Fragment key={s.id}>
        <div className={`step ${current === s.id ? 'current' : ''} ${current > s.id ? 'done' : ''}`}>
          <span className="dot">
            {current > s.id ? <Icon name="check" size={11} strokeWidth={2.2} /> : s.id}
          </span>
          <span>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <span className={`step-rail ${current > s.id ? 'done' : ''}`}></span>
        )}
      </React.Fragment>
    ))}
  </div>
);

// ===== Step 1 =====
const Step1Workspace = ({ form, setForm, slugTouched, setSlugTouched }) => {
  const onOrgChange = (v) => {
    setForm(prev => ({
      ...prev,
      org_name: v,
      org_slug: slugTouched ? prev.org_slug : slugify(v),
    }));
  };
  return (
    <>
      <div>
        <h1 className="editorial-headline">
          Set up your <span className="ital">workspace</span>.
        </h1>
        <p className="editorial-sub">
          A few details so we can tailor your dashboards, recommended audits, and
          compliance reports.
        </p>
      </div>
      <div>
        <div className="field">
          <label htmlFor="org-name">Organization name</label>
          <input
            id="org-name"
            type="text"
            value={form.org_name}
            onChange={(e) => onOrgChange(e.target.value)}
            placeholder="Crescent Bank"
          />
        </div>

        <div className="field">
          <label htmlFor="org-slug">Workspace URL</label>
          <div className="slug-field">
            <span className="slug-prefix">biassense.app/</span>
            <input
              id="org-slug"
              type="text"
              value={form.org_slug}
              onChange={(e) => { setSlugTouched(true); setForm(p => ({ ...p, org_slug: slugify(e.target.value) })); }}
              placeholder="crescent-bank"
            />
          </div>
          <div className="hint">Auto-suggested from your organization name.</div>
        </div>

        <div className="field">
          <label htmlFor="full-name">Your full name</label>
          <input
            id="full-name"
            type="text"
            value={form.full_name}
            onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
            placeholder="Jordan Park"
          />
        </div>

        <div className="field">
          <label htmlFor="industry">Industry</label>
          <select
            id="industry"
            value={form.industry}
            onChange={(e) => setForm(p => ({ ...p, industry: e.target.value }))}
          >
            <option value="">Select an industry…</option>
            {INDUSTRIES.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="framework">Primary regulatory framework</label>
          <select
            id="framework"
            value={form.regulatory_framework}
            onChange={(e) => setForm(p => ({ ...p, regulatory_framework: e.target.value }))}
          >
            <option value="">Select a framework…</option>
            {FRAMEWORKS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <div className="hint">You can change this later in Settings.</div>
        </div>

        <div className="field" style={{ marginBottom: 4 }}>
          <label>Plan tier</label>
          <div className="plan-segmented">
            {PLANS.map(p => (
              <button
                key={p.id}
                type="button"
                className={`plan-seg ${form.plan_tier === p.id ? 'active' : ''}`}
                onClick={() => setForm(prev => ({ ...prev, plan_tier: p.id }))}
              >
                <div className="plan-seg-label">{p.label}</div>
                <div className="plan-seg-sub">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// ===== Step 2 =====
const TeamInviteRow = ({ invite, onChange, onRemove, canRemove }) => (
  <div className="invite-row team-onboard-row">
    <div className="invite-input">
      <input
        type="email"
        placeholder="teammate@company.com"
        value={invite.email}
        onChange={(e) => onChange({ ...invite, email: e.target.value })}
      />
      <span className="icn"><Icon name="mail" size={14} /></span>
    </div>
    <div className="invite-input">
      <input
        type="text"
        placeholder="Full name (optional)"
        value={invite.full_name}
        onChange={(e) => onChange({ ...invite, full_name: e.target.value })}
      />
      <span className="icn"><Icon name="users" size={14} /></span>
    </div>
    <button
      className="invite-remove"
      onClick={onRemove}
      disabled={!canRemove}
      title="Remove"
      type="button"
    >
      <Icon name="x" size={14} />
    </button>
  </div>
);

const Step2Team = ({ invites, setInvites }) => {
  const update = (i, next) => setInvites(invites.map((inv, idx) => idx === i ? next : inv));
  const remove = (i) => setInvites(invites.filter((_, idx) => idx !== i));
  const add = () => {
    if (invites.length >= 5) return;
    setInvites([...invites, { email: '', full_name: '' }]);
  };
  return (
    <>
      <div>
        <h1 className="editorial-headline">
          Invite your <span className="ital">team</span>.
        </h1>
        <p className="editorial-sub">
          Bring the people who'll review fairness reports and sign off on model deployments.
        </p>
      </div>
      <div>
        {invites.map((inv, i) => (
          <TeamInviteRow
            key={i}
            invite={inv}
            onChange={(next) => update(i, next)}
            onRemove={() => remove(i)}
            canRemove={invites.length > 1}
          />
        ))}
        {invites.length < 5 ? (
          <button className="invite-add-row" onClick={add} type="button">
            <Icon name="plus" size={13} /> Add another
          </button>
        ) : (
          <div className="invite-add-row" style={{ cursor: 'default', borderStyle: 'solid', borderColor: 'var(--border-soft)' }}>
            Maximum of 5 teammates reached
          </div>
        )}
        <div className="onboard-note">
          Invite up to 5 teammates — everyone gets full workspace access. You can
          adjust permissions later in Settings.
        </div>
      </div>
    </>
  );
};

// ===== Wizard root =====
const Onboarding = ({ onNavigate }) => {
  const toast = useToast();
  const user = useCurrentUser();

  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [slugTouched, setSlugTouched] = React.useState(false);

  const [form, setForm] = React.useState({
    org_name: '',
    org_slug: '',
    full_name: user && user.name && user.name !== 'Admin' ? user.name : '',
    industry: '',
    regulatory_framework: '',
    plan_tier: 'pro',
  });

  const [invites, setInvites] = React.useState([
    { email: '', full_name: '' },
    { email: '', full_name: '' },
  ]);

  const canContinueStep1 =
    form.org_name.trim().length > 0 &&
    form.org_slug.trim().length > 0 &&
    form.full_name.trim().length > 0 &&
    form.industry &&
    form.regulatory_framework &&
    form.plan_tier;

  // Mock POST /api/v1/onboarding
  const submitOnboarding = () => {
    setSubmitting(true);
    setTimeout(() => {
      const organization_id = 'org_' + Math.random().toString(36).slice(2, 10);
      const user_id = 'usr_' + Math.random().toString(36).slice(2, 10);
      try {
        sessionStorage.setItem('biassense.workspace', JSON.stringify({
          ...form,
          organization_id,
          user_id,
        }));
      } catch (_) {}
      setSubmitting(false);
      toast({ title: 'Workspace created', desc: `${form.org_name} · ${form.plan_tier} plan`, icon: 'check' });
      setStep(2);
    }, 700);
  };

  // Mock POST /api/v1/users (one per row)
  const submitInvites = () => {
    const valid = invites.filter(i => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.email));
    return new Promise((resolve) => {
      if (valid.length === 0) { resolve({ sent: 0 }); return; }
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        resolve({ sent: valid.length });
      }, 600);
    });
  };

  const finish = async () => {
    const res = await submitInvites();
    writeOnboarded();
    if (res.sent > 0) {
      toast({ title: `${res.sent} invite${res.sent === 1 ? '' : 's'} sent`, desc: 'Teammates will receive an email shortly', icon: 'mail' });
    } else {
      toast({ title: 'Workspace ready', desc: `Welcome to ${form.org_name || 'BiasSense'}`, icon: 'check' });
    }
    onNavigate('/dashboard');
  };

  const skipFinish = () => {
    writeOnboarded();
    toast({ title: 'Workspace ready', desc: `You can invite teammates anytime from Settings`, icon: 'check' });
    onNavigate('/dashboard');
  };

  return (
    <div className="editorial-wrap onboarding-wrap" data-screen-label="05 Onboarding">
      <div className="editorial-header onboarding-header">
        <Logo size={16} />
        <Stepper current={step} />
        <div style={{ width: 100, display: 'flex', justifyContent: 'flex-end' }}>
          {step === 1 && (
            <button
              className="btn-quiet"
              style={{ fontSize: 12, padding: '6px 10px', borderRadius: 8 }}
              onClick={() => { writeOnboarded(); onNavigate('/dashboard'); }}
            >
              Skip setup
            </button>
          )}
        </div>
      </div>

      <div className="editorial-body onboarding-body">
        <div className="editorial-card onboarding-card mount-up" key={step}>
          {step === 1 && (
            <Step1Workspace
              form={form}
              setForm={setForm}
              slugTouched={slugTouched}
              setSlugTouched={setSlugTouched}
            />
          )}
          {step === 2 && (
            <Step2Team invites={invites} setInvites={setInvites} />
          )}

          <div className="wizard-nav">
            <div>
              {step === 2 && (
                <button
                  className="btn-quiet"
                  style={{ fontSize: 13, padding: '8px 12px', borderRadius: 8 }}
                  onClick={skipFinish}
                  disabled={submitting}
                >
                  Skip for now
                </button>
              )}
            </div>
            <div className="right">
              {step === 1 && (
                <button
                  className="btn btn-cream"
                  onClick={submitOnboarding}
                  disabled={!canContinueStep1 || submitting}
                >
                  {submitting ? 'Creating workspace…' : <>Continue <Icon name="arrow-right" size={12} /></>}
                </button>
              )}
              {step === 2 && (
                <button
                  className="btn btn-cream"
                  onClick={finish}
                  disabled={submitting}
                >
                  {submitting ? 'Sending invites…' : <>Finish <Icon name="arrow-right" size={12} /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="editorial-foot onboarding-foot">
        <span>© 2026 BiasSense, Inc.</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="shield" size={11} /> Protected by SOC 2 Type II controls.
        </span>
      </div>
    </div>
  );
};

export { Onboarding };
