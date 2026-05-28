
import React from 'react';
import { Icon } from '../components/icons.tsx';
import { LogoLockup } from './shell.tsx';
import { writeUser } from '../lib/session.ts';

const SignInBg = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w = 0, h = 0, dpr = 1, raf = 0, running = true;

    let dotR = 233, dotG = 226, dotB = 207;
    const readAccent = () => {
      try {
        const c = window.getComputedStyle(document.documentElement).getPropertyValue('--cream').trim();
        if (c && c.startsWith('#')) {
          const hex = c.slice(1);
          dotR = parseInt(hex.slice(0, 2), 16);
          dotG = parseInt(hex.slice(2, 4), 16);
          dotB = parseInt(hex.slice(4, 6), 16);
        }
      } catch (_) {}
    };
    readAccent();
    window.addEventListener('biassense:tweaked', readAccent);

    const COUNT = 175;
    const MAX_DIST = 140;
    const REPEL_R = 110;
    const REPEL_F = 0.18;
    let dots = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const seed = () => {
      dots = new Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        let x, y;
        if (Math.random() < 0.42) {
          x = Math.random() < 0.5 ? Math.random() * w * 0.34 : w - Math.random() * w * 0.34;
          y = Math.random() < 0.5 ? Math.random() * h * 0.34 : h - Math.random() * h * 0.34;
        } else {
          x = Math.random() * w;
          y = Math.random() * h;
        }
        const tvx = (Math.random() - 0.5) * 0.3;
        const tvy = (Math.random() - 0.5) * 0.3;
        dots[i] = {
          x, y,
          vx: tvx, vy: tvy,
          tvx, tvy,
          r: 1.5 + Math.random() * 0.8,
          op: 0.50 + Math.random() * 0.32,
        };
      }
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      const firstSize = w === 0;
      w = newW; h = newH;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (firstSize) seed();
    };

    const step = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      const VMAX = 1.4, VMAX2 = VMAX * VMAX, REPEL_R2 = REPEL_R * REPEL_R;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (mouse.active) {
          const mdx = d.x - mouse.x, mdy = d.y - mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < REPEL_R2 && md2 > 0.5) {
            const md = Math.sqrt(md2);
            const force = (1 - md / REPEL_R) * REPEL_F;
            d.vx += mdx / md * force;
            d.vy += mdy / md * force;
          }
        }
        const v2 = d.vx * d.vx + d.vy * d.vy;
        if (v2 > VMAX2) { const vl = Math.sqrt(v2); d.vx = d.vx / vl * VMAX; d.vy = d.vy / vl * VMAX; }
        d.vx = d.vx * 0.94 + d.tvx * 0.06;
        d.vy = d.vy * 0.94 + d.tvy * 0.06;
        d.x += d.vx; d.y += d.vy;
        if (d.x < -10) d.x = w + 10; else if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10; else if (d.y > h + 10) d.y = -10;
      }

      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < MAX_DIST * MAX_DIST) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / MAX_DIST;
            const alpha = 0.22 * t * t;
            ctx.strokeStyle = `rgba(${dotR},${dotG},${dotB},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.fillStyle = `rgba(${dotR},${dotG},${dotB},${d.op})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    onResize();
    window.addEventListener('resize', onResize);
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onLeave = () => { mouse.active = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('blur', onLeave);
    raf = requestAnimationFrame(step);

    const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(step); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('biassense:tweaked', readAccent);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('blur', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);
  return <canvas ref={ref} className="signin-bg-canvas" aria-hidden="true" />;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.253 17.64 11.945 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const SignIn = ({ onNavigate }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [authErr, setAuthErr] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    setAuthErr('');
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      const ok = email.trim().toLowerCase() === 'admin' && password === 'admin';
      if (!ok) { setLoading(false); setAuthErr('Invalid credentials.'); return; }
      writeUser({ name: 'Admin', role: 'Super Admin', initials: 'AD' });
      setLoading(false);
      onNavigate('/dashboard');
    }, 500);
  };

  return (
    <div className="signin-quiet" data-screen-label="01 Sign In">
      <SignInBg />

      <div className="signin-split">
        {/* ── Left: ML Observability intro ── */}
        <div className="signin-split-left">
          <div className="signin-split-left-inner">

            {/* TOP: logo */}
            <div className="signin-split-logo">
              <LogoLockup size={42} />
            </div>

            {/* MIDDLE: hero + cards */}
            <div className="signin-split-mid">
              <div className="signin-split-eyebrow">
                <span className="signin-split-eyebrow-dot" />
                ML Observability
              </div>
              <h1 className="signin-split-headline">
                Catch bias and drift<br />before regulators do.
              </h1>
              <p className="signin-split-sub">
                The observability platform for ML bias, drift, and compliance. Audit-grade evidence on your own data — defensible to engineering, legal, and risk.
              </p>

              <div className="signin-split-cards">
                <div className="signin-split-card">
                  <span className="signin-split-card-title">Bias</span>
                  <span className="signin-split-card-sub">Disparate Impact · SPD · Accuracy Parity</span>
                </div>
                <div className="signin-split-card">
                  <span className="signin-split-card-title">Drift</span>
                  <span className="signin-split-card-sub">Production vs. training baseline</span>
                </div>
                <div className="signin-split-card">
                  <span className="signin-split-card-title">Compliance</span>
                  <span className="signin-split-card-sub">Regulator-ready PDF reports</span>
                </div>
              </div>
            </div>

            {/* BOTTOM: compliance standards */}
            <div className="signin-split-bottom">
              <div className="signin-split-comply-label">Reporting aligned to</div>
              <div className="signin-split-comply-tags">
                <span>EEOC 4/5ths Rule</span>
                <span>EU AI Act</span>
                <span>SR 11-7</span>
                <span>+ NIST · ISO 42001</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── Right: sign-in form ── */}
        <div className="signin-split-right">
          <div className="signin-quiet-card">
            <div className="signin-mobile-logo">
              <LogoLockup size={32} />
            </div>

            <div>
              <h2 className="signin-quiet-title">Authenticate</h2>
              <p className="signin-subtle" style={{ marginTop: 8 }}>Welcome back. Use your workspace credentials.</p>
            </div>

            <form className="signin-quiet-form" onSubmit={submit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setAuthErr(''); }}
                  onBlur={() => setTouched(true)}
                  placeholder="you@company.com"
                  autoComplete="username"
                  autoFocus />
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setAuthErr(''); }}
                    placeholder=""
                    autoComplete="current-password" />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    title={showPw ? 'Hide password' : 'Show password'}>
                    <Icon name={showPw ? 'eye-off' : 'eye'} size={15} />
                  </button>
                </div>
                {authErr &&
                  <div className="err">
                    <Icon name="alert-triangle" size={12} />
                    {authErr}
                  </div>
                }
              </div>

              <button
                type="submit"
                className="btn btn-cream"
                style={{ width: '100%', height: 42, marginTop: 4, fontSize: 13.5 }}
                disabled={loading}>
                {loading ? 'Authenticating…' : 'Authenticate'}
              </button>

              <div className="signin-quiet-row">
                <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Use SSO</a>
              </div>

              <div className="signin-or-divider"><span>or</span></div>

              <button type="button" className="signin-google-btn" onClick={() => {}}>
                <GoogleIcon />
                Continue with Google
              </button>
            </form>
          </div>

          <div className="signin-quiet-footer">
            Don't have access? Contact your workspace admin.{' '}
            <a href="#" onClick={(e) => e.preventDefault()}>Request access</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SignIn };
