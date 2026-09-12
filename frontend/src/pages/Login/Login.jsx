import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&h=640&fit=crop&crop=faces&auto=format";

const PHOTO_NODES = [
  {
    top: 300,
    left: 44,
    size: 66,
    src: "https://images.unsplash.com/photo-1764162051349-7cc989a1399d?q=80&w=200&h=200&fit=crop&crop=faces&auto=format",
    alt: "Creator filming content",
  },
  {
    top: 560,
    left: 58,
    size: 58,
    src: "https://images.unsplash.com/photo-1635360381874-edd74cbd57f3?q=80&w=200&h=200&fit=crop&crop=faces&auto=format",
    alt: "Creator recording video",
  },
];

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setStatus("error");
      setError("Please enter your email and password.");
      return;
    }

    try {
      setStatus("submitting");
      const user = await login({ email, password });

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      void user;
    } catch (err) {
      setStatus("error");
      setError(err.message || "Login failed. Please try again.");
    }
  }

  return (
    <div className="oraino-login-root">
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <svg className="logo-mark" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4C10 4 5 9 5 16c0 5 3 8 7 8 3 0 4-2 4-4 0-1.5-1-2-1-3.5C15 14 17 12 19 12c3 0 5 2 5 5 0 6-4 9-8 11 8-1 13-6 13-13 0-6-5-11-13-11Z"
                fill="#C75F71"
              />
              <circle cx="12" cy="17" r="2.4" fill="#A2AE9D" />
            </svg>
            Oraino
          </Link>
          <div className="nav-actions">
            <span className="switch-line">New to Oraino? </span>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="login-wrap">
        {/* ---------- LEFT VISUAL PANEL ---------- */}
        <div className="visual-panel">
          <div className="blooms" aria-hidden="true">
            <div className="vp-bloom vp-bloom-1">
              <svg viewBox="0 0 400 400">
                <path fill="#A2AE9D" opacity="0.55" d="M200 20c60 0 100 60 130 110s30 110-20 150-120 40-170 0-70-100-40-160S140 20 200 20Z" />
              </svg>
            </div>
            <div className="vp-bloom vp-bloom-2">
              <svg viewBox="0 0 400 400">
                <path fill="#F0B8B8" opacity="0.5" d="M190 30c70-10 130 40 150 100s0 130-60 160-140 10-170-40-20-140 20-180S150 36 190 30Z" />
              </svg>
            </div>
          </div>

          <svg className="vp-path" viewBox="0 0 560 760" preserveAspectRatio="none" aria-hidden="true">
            <path d="M40 60 C 140 160, 60 260, 170 340 S 300 460, 210 560 S 360 660, 300 720" />
          </svg>

          <div className="vp-quote">
            <p className="eyebrow">Welcome back</p>
            <h2>Pick up right where <em>you left off.</em></h2>
          </div>

          <div className="vp-photo-hero">
            <img src={HERO_PHOTO} alt="Creator working on a collaboration" loading="lazy" />
          </div>

          {PHOTO_NODES.map((n, i) => (
            <div key={i} className="vp-node" style={{ top: n.top, left: n.left, width: n.size, height: n.size }}>
              <img src={n.src} alt={n.alt} loading="lazy" />
            </div>
          ))}

          <div className="vp-stat">
            <div className="big">1.6m+</div>
            <div className="small">brands and creators are growing together on Oraino</div>
          </div>
        </div>

        {/* ---------- RIGHT FORM PANEL ---------- */}
        <div className="form-panel">
          <div className="form-inner">
            <div className="form-heading">
              <h1>Log in to your account</h1>
              <p>Find your next collaboration, or manage the ones already in motion.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {status === "error" && <div className="form-error">{error}</div>}

              <div className="field">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field password">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  style={{ opacity: showPw ? 1 : 0.7 }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  onClick={() => setShowPw((s) => !s)}
                >
                  <EyeIcon />
                </button>
              </div>

              <button type="submit" className="submit-btn" disabled={status === "submitting"}>
                {status === "submitting" ? "Logging in…" : "Log in"}
              </button>
            </form>

            <p className="login-line">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
