
import React from 'react';
import { Icon } from '../components/icons.tsx';
import { LogoLockup } from './shell.tsx';
import { writeUser } from '../lib/session.ts';
// Sign In — quiet enterprise minimal

const DEMO_USER = 'admin';
const DEMO_PASS = 'admin';

// Full-page constellation field: slow drifting dots that connect to neighbors.
// Cream-on-dark, subtle. No rotation, no spinner.
const SignInBg = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0,h = 0,dpr = 1,raf = 0,running = true;

    // Accent color, sampled from CSS so it tracks Tweaks
    let dotR = 233,dotG = 226,dotB = 207;
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
    const REPEL_R = 110; // cursor repel radius
    const REPEL_F = 0.18; // peak push per frame
    let dots = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const seed = () => {
      dots = new Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        // ~40% of dots are biased toward the outer band of the canvas
        // so corners feel populated instead of empty.
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
          tvx, tvy, // natural drift (recovers to this)
          r: 1.5 + Math.random() * 0.6,
          op: 0.30 + Math.random() * 0.22 // dimmer than before
        };
      }
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      const firstSize = w === 0;
      w = newW;
      h = newH;
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

      const VMAX = 1.4;
      const VMAX2 = VMAX * VMAX;
      const REPEL_R2 = REPEL_R * REPEL_R;

      // Move, repel from cursor, ease back to natural drift, wrap
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        if (mouse.active) {
          const mdx = d.x - mouse.x;
          const mdy = d.y - mouse.y;
          const md2 = mdx * mdx + mdy * mdy;
          if (md2 < REPEL_R2 && md2 > 0.5) {
            const md = Math.sqrt(md2);
            const force = (1 - md / REPEL_R) * REPEL_F;
            d.vx += mdx / md * force;
            d.vy += mdy / md * force;
          }
        }

        // Cap velocity so it never feels chaotic
        const v2 = d.vx * d.vx + d.vy * d.vy;
        if (v2 > VMAX2) {
          const vl = Math.sqrt(v2);
          d.vx = d.vx / vl * VMAX;
          d.vy = d.vy / vl * VMAX;
        }

        // Ease back toward each dot's natural drift
        d.vx = d.vx * 0.94 + d.tvx * 0.06;
        d.vy = d.vy * 0.94 + d.tvy * 0.06;

        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -10) d.x = w + 10;else if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;else if (d.y > h + 10) d.y = -10;
      }

      // Lines first (under dots)
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < MAX_DIST * MAX_DIST) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / MAX_DIST; // 0..1
            const alpha = 0.14 * t * t; // ease out, dimmer
            ctx.strokeStyle = `rgba(${dotR}, ${dotG}, ${dotB}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        ctx.fillStyle = `rgba(${dotR}, ${dotG}, ${dotB}, ${d.op})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.283);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    onResize();
    window.addEventListener('resize', onResize);
    const onMove = (e) => {mouse.x = e.clientX;mouse.y = e.clientY;mouse.active = true;};
    const onLeave = () => {mouse.active = false;};
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('blur', onLeave);
    raf = requestAnimationFrame(step);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(step);
    };
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
  return <canvas ref={ref} className="signin-split-canvas" aria-hidden="true" />;
};

const SignIn = ({ onNavigate }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [authErr, setAuthErr] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const isAdmin = email.trim().toLowerCase() === DEMO_USER;
  const emailValid = isAdmin || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailErr = touched && email && !emailValid;
  const canSubmit = emailValid && password.length >= 4 && !loading;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    setAuthErr('');
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      const ok = isAdmin && password === DEMO_PASS || emailValid && !isAdmin;
      if (!ok) {
        setLoading(false);
        setAuthErr('Invalid credentials.');
        return;
      }
      writeUser({
        name: isAdmin ? 'Admin' : 'Sarah Kim',
        role: isAdmin ? 'Super Admin' : 'ML Platform · Lead',
        initials: isAdmin ? 'AD' : 'SK',
      });
      setLoading(false);
      onNavigate('/dashboard');
    }, 500);
  };

  return (
    <div className="signin-split" data-screen-label="01 Sign In">
      {/* LEFT — observability hero */}
      <aside className="signin-split-left">
        <SignInBg />

        {/* TOP — parent brand ribbon + big BiasSense wordmark */}
        <div className="signin-split-top">
          <span className="signin-split-parent">
            <span className="pmark">D</span>
            <span className="pname">A <b>DataEQ Consulting</b> product</span>
          </span>
          <span className="signin-split-brand-big">
            BiasSense<span className="arr">→</span>
          </span>
        </div>

        {/* MIDDLE — live status + headline + observability tiles */}
        <div className="signin-split-mid">
          <span className="signin-split-status">
            <span className="pulse" />
            <span className="ml-tag">ML Observability</span>
            <span className="sep">·</span>
            <span>Live</span>
          </span>

          <h2 className="signin-split-headline">
            Catch <span className="accent">bias</span> and <span className="accent">drift</span><br />
            before regulators do.
          </h2>

          <p className="signin-split-sub">
            ML observability for bias, drift, and compliance. Built for the teams who already
            run Datadog and Sentry — now with an audit trail your legal team can hand directly
            to any regulator.
          </p>

          {/* Live monitor tiles — mini observability widgets */}
          <div className="signin-split-tiles">
            <div className="signin-tile bias">
              <div className="signin-tile-head">
                <span>Bias</span>
                <span className="status-pill pass"><span className="d" />PASS</span>
              </div>
              <div className="signin-tile-val">0.87<span className="u">DI</span></div>
              <div className="signin-tile-sub">Disparate Impact · 4/5ths rule</div>
              <svg className="signin-tile-spark" viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="2,16 14,13 26,15 38,11 50,12 62,9 74,10 86,7 98,8"
                  fill="none" stroke="#7FD19A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="signin-tile drift">
              <div className="signin-tile-head">
                <span>Drift</span>
                <span className="status-pill watch"><span className="d" />WATCH</span>
              </div>
              <div className="signin-tile-val">2.4<span className="u">σ</span></div>
              <div className="signin-tile-sub">7-day baseline · prod data</div>
              <svg className="signin-tile-spark" viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="2,17 14,15 26,14 38,12 50,10 62,11 74,8 86,6 98,4"
                  fill="none" stroke="#F0C674" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="signin-tile comp">
              <div className="signin-tile-head">
                <span>Compliance</span>
                <span className="status-pill live"><span className="d" />LIVE</span>
              </div>
              <div className="signin-tile-val">4<span className="u">/ 4 frameworks</span></div>
              <div className="signin-tile-sub">EEOC · EU AI Act · SR 11-7 · GDPR</div>
              <svg className="signin-tile-spark" viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="2,12 14,12 26,11 38,11 50,10 62,10 74,9 86,9 98,8"
                  fill="none" stroke="#6B8AFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* BOTTOM — DataEQ parent + frameworks row */}
        <div className="signin-split-bottom-l">
          <div className="signin-split-by">
            <div className="pmark-lg">D</div>
            <div className="ptext">
              <span className="ptiny">A product of</span>
              <span className="pname-l"><b>DataEQ</b> Consulting</span>
            </div>
          </div>
          <div className="signin-split-frameworks">
            <span className="fw">EEOC</span>
            <span className="fw">EU AI Act</span>
            <span className="fw">SR 11-7</span>
            <span className="fw">GDPR</span>
            <span className="fw">NYC LL144</span>
          </div>
        </div>
      </aside>

      {/* RIGHT — form */}
      <main className="signin-split-right">
        <span className="signin-split-op">
          <span className="d" />
          <span>eu-west-1</span>
          <span className="sep">·</span>
          <span>Operational</span>
        </span>

        <div className="signin-split-form-wrap">
          <div>
            <h1 className="signin-split-h1">Sign in</h1>
            <p className="signin-split-sub-r">Welcome back. Use your workspace credentials.</p>
          </div>

          <form className="signin-split-form" onSubmit={submit}>
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
                autoFocus
              />
              {showEmailErr && (
                <div className="err">
                  <Icon name="alert-triangle" size={12} /> Enter a valid email
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setAuthErr(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={15} />
                </button>
              </div>
              {authErr && (
                <div className="err">
                  <Icon name="alert-triangle" size={12} /> {authErr}
                </div>
              )}
            </div>

            <button type="submit" className="signin-split-cta" disabled={loading}>
              <Icon name="lock" size={13} />
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="signin-split-row">
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              <a className="sso" href="#" onClick={(e) => e.preventDefault()}>Use SSO</a>
            </div>

            <div className="signin-split-or">or</div>

            <button
              type="button"
              className="signin-split-google"
              onClick={() => {/* mock */}}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#EA4335" d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"/>
                <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"/>
                <path fill="#FBBC05" d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <div className="signin-split-bottom">
            No access yet? Contact your workspace admin.
            <a href="#" onClick={(e) => e.preventDefault()}>Request access</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export { SignIn };