
import React from 'react';
import { Icon } from '../components/icons.tsx';
import { LogoLockup } from './shell.tsx';
import { writeUser } from '../lib/session.ts';
// Sign In — quiet enterprise minimal

// Full-page constellation field: slow drifting dots that connect to neighbors.
// Cream-on-dark, subtle. No rotation, no spinner.
const SignInBg = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  return <canvas ref={ref} className="signin-bg-canvas" aria-hidden="true" />;
};

const SignIn = ({ onNavigate }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [touched, setTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [authErr, setAuthErr] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);

  const isAdmin = email.trim().toLowerCase() === 'admin';
  const emailValid = isAdmin || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailErr = touched && email && !emailValid;
  const canSubmit = emailValid && password.length >= 8 && !loading;

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    setAuthErr('');
    if (!canSubmit) return;
    setLoading(true);
    setTimeout(() => {
      const ok = isAdmin && password === 'admin' || emailValid && !isAdmin;
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
    <div className="signin-quiet" data-screen-label="01 Sign In">
      <SignInBg />
      <div className="signin-quiet-inner">
        <div className="signin-quiet-card" style={{ gap: "24px" }}>
          <div className="signin-quiet-logo">
            <LogoLockup size={26} />
          </div>

          <div>
            <h1 className="signin-quiet-title">Sign in</h1>
            <p className="signin-subtle" style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 400 }}>
              Welcome back. Use your workspace credentials.
            </p>
          </div>

          <form className="signin-quiet-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {setEmail(e.target.value);setAuthErr('');}}
                onBlur={() => setTouched(true)}
                placeholder="you@company.com"
                autoComplete="username"
                autoFocus />

              {showEmailErr &&
              <div className="err">
                  <Icon name="alert-triangle" size={12} />
                  Enter a valid email
                </div>
              }
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {setPassword(e.target.value);setAuthErr('');}}
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

              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            <div className="signin-quiet-row">
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Use SSO</a>
            </div>
          </form>
        </div>
      </div>

      <div className="signin-quiet-footer">
        Don't have access? Contact your workspace admin. <a href="#" onClick={(e) => e.preventDefault()}>Request access</a>
      </div>
    </div>
  );
};

export { SignIn };
