import React from 'react';
import { SignIn } from './pages/signin.tsx';
import { Onboarding } from './pages/onboarding.tsx';
import { AcceptInvite } from './pages/invite.tsx';
import { TeamSettings } from './pages/settings-team.tsx';
import { Dashboard } from './pages/dashboard.tsx';
import { ModelsList } from './pages/models.tsx';
import { ModelDetail } from './pages/model-detail.tsx';
import { AppShell, ToastProvider, NAV_ITEMS } from './pages/shell.tsx';
import { Icon } from './components/icons.tsx';
import { TweaksPanel, TweakSection, TweakRadio, useTweaks } from './components/tweaks-panel.tsx';

// Hash router + app root + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "logo": "square",
  "chart": "gradient",
  "density": "regular"
}/*EDITMODE-END*/;

const applyTweaks = (t) => {
  const root = document.documentElement;
  root.dataset.logo    = t.logo;
  root.dataset.chart   = t.chart;
  root.dataset.density = t.density;
  // Let listeners (logo, dashboard chart) re-read on every tweak change
  window.dispatchEvent(new Event('biassense:tweaked'));
};

const usePathRoute = () => {
  const [route, setRoute] = React.useState(window.location.pathname === '/' ? '/signin' : window.location.pathname);
  React.useEffect(() => {
    const onChange = () => setRoute(window.location.pathname === '/' ? '/signin' : window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return route;
};

const ComingSoon = ({ active, title, onNavigate }) => (
  <AppShell active={active} title={title} onNavigate={onNavigate}>
    <div className="empty-card mount-up">
      <div className="empty-icn"><Icon name="sparkles" size={24} /></div>
      <div className="empty-title">{title} <span className="ital">coming soon</span></div>
      <div className="empty-sub">
        This surface is part of the BiasSense roadmap. The Dashboard, Models list and Model
        detail are wired up in this prototype — explore those for the full interactive flow.
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="btn btn-ghost" onClick={() => onNavigate('/dashboard')}>Back to Dashboard</button>
        <button className="btn btn-cream" onClick={() => onNavigate('/models')}>
          Browse models <Icon name="arrow-right" size={12} />
        </button>
      </div>
    </div>
  </AppShell>
);

const App = () => {
  const route = usePathRoute();
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t.logo, t.chart, t.density]);

  const onNavigate = (target) => {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const path = route;

  let view;
  if (path === '/signin' || path === '/' || path === '') {
    view = <SignIn onNavigate={onNavigate} />;
  } else if (path === '/onboarding') {
    view = <Onboarding onNavigate={onNavigate} />;
  } else if (path.startsWith('/invite/')) {
    const token = path.split('/')[2];
    if (token) {
      view = <AcceptInvite token={token} onNavigate={onNavigate} />;
    } else {
      onNavigate('/signin');
      view = <SignIn onNavigate={onNavigate} />;
    }
  } else if (path === '/settings/team') {
    view = <TeamSettings onNavigate={onNavigate} />;
  } else if (path === '/dashboard') {
    view = <Dashboard onNavigate={onNavigate} />;
  } else if (path === '/models') {
    view = <ModelsList onNavigate={onNavigate} />;
  } else if (path.startsWith('/models/')) {
    const id = path.split('/')[2];
    if (id) {
      view = <ModelDetail modelId={id} onNavigate={onNavigate} />;
    } else {
      onNavigate('/models');
      view = <ModelsList onNavigate={onNavigate} />;
    }
  } else if (path === '/settings') {
    view = <TeamSettings onNavigate={onNavigate} />;
  } else {
    const matched = NAV_ITEMS.find(n => path.startsWith(n.route.replace('#', '')));
    view = <ComingSoon active={matched ? matched.id : ''} title={matched ? matched.label : 'Not found'} onNavigate={onNavigate} />;
  }

  return (
    <ToastProvider>
      {view}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Logo mark" />
        <TweakRadio
          label="Variant"
          value={t.logo}
          options={['square', 'ring', 'dot']}
          onChange={(v) => setTweak('logo', v)}
        />
        <div style={{ fontSize: 10.5, opacity: 0.6, marginTop: -4, marginBottom: 2 }}>
          Square mark · Concentric ring · Wordmark + glowing dot
        </div>

        <TweakSection label="Trend chart" />
        <TweakRadio
          label="Style"
          value={t.chart}
          options={['gradient', 'bars', 'spark']}
          onChange={(v) => setTweak('chart', v)}
        />
        <div style={{ fontSize: 10.5, opacity: 0.6, marginTop: -4, marginBottom: 2 }}>
          Gradient area · Rounded bars · Headline sparkline
        </div>

        <TweakSection label="Density" />
        <TweakRadio
          label="Information density"
          value={t.density}
          options={['cozy', 'regular', 'spacious']}
          onChange={(v) => setTweak('density', v)}
        />
      </TweaksPanel>
    </ToastProvider>
  );
};

export default App;
