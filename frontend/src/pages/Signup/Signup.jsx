import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { registerUser } from "../../services/auth.service";


const NAV_LINKS = ["Features", "For Brands", "Use Cases", "Pricing", "For Creators"];

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1656074166642-c1c22b309d9a?q=80&w=500&h=640&fit=crop&crop=faces&auto=format";

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


const SCENE_BADGES = [
  { icon: "shield", top: 244, right: 40, size: 54, bg: "#A2AE9D" },
  { icon: "heart", top: 400, right: 6, size: 50, bg: "#C75F71" },
  { icon: "tag", top: 606, right: 56, size: 54, bg: "#A9495B" },
];

function BadgeIcon({ type }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "#FFFDFB", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "shield") {
    return (
      <svg {...common}>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="M9 12.5l2 2 4-4.5" />
      </svg>
    );
  }
  if (type === "heart") {
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.5-9.5-9C.8 7.3 2 3.5 5.5 3c2-.3 3.7.7 4.5 2.2C10.8 3.7 12.5 2.7 14.5 3c3.5.5 4.7 4.3 3 8-2.5 4.5-9.5 9-9.5 9Z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 2l9 9-9 9-9-9V4a2 2 0 0 1 2-2h7Z" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="#FFFDFB" stroke="none" />
    </svg>
  );
}



function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.43 3.58v3h3.93c2.3-2.12 3.63-5.24 3.63-8.82z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.93-3c-1.08.72-2.47 1.16-4 1.16-3.08 0-5.68-2.08-6.61-4.87H1.34v3.09C3.31 21.3 7.33 24 12 24z" />
      <path fill="#FBBC05" d="M5.39 14.38c-.24-.72-.38-1.48-.38-2.38s.14-1.66.38-2.38V6.53H1.34C.49 8.2 0 10.05 0 12s.49 3.8 1.34 5.47l4.05-3.09z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.33 0 3.31 2.7 1.34 6.53l4.05 3.09C6.32 6.83 8.92 4.75 12 4.75z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 384 512" fill="#000">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141 0 184.5 0 271.4c0 25.7 4.7 52.3 14.1 79.8 12.5 36.7 57.6 126.7 104.7 125.2 24.7-.6 42.1-17.5 74.3-17.5 31.3 0 47.4 17.5 74.9 17.5 47.5-.7 88.2-82.7 100.1-119.5-63.6-30-64.4-88-49.4-88.2zM255.7 90.7c26.9-32 24.5-61.2 23.7-71.7-23.8 1.4-51.3 16.4-67 34.9-17.3 19.8-27.5 44.3-25.3 71.9 25.9 2 49.5-11.2 68.6-35.1z" />
    </svg>
  );
}

function PasswordField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="field password">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <button
        type="button"
        className="toggle-visibility"
        style={{ opacity: show ? 1 : 0.7 }}
        aria-label={show ? "Hide password" : "Show password"}
        onClick={onToggle}
      >
        <EyeIcon />
      </button>
    </div>
  );
}

export default function OrainoSignup() {
  const [role, setRole] = useState("creator"); // "creator" | "brand"
  const [fullName, setFullName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "error"
  const [error, setError] = useState("");

  const isBrand = role === "brand";

async function handleSubmit(e) {
  e.preventDefault();

  // Clear previous error
  setError("");

  // Password confirmation check
  if (pw1 !== pw2) {
    setStatus("error");
    setError("Passwords don't match — please double-check and try again.");
    return;
  }

  // Prevent empty values
  if (!fullName || !email || !pw1) {
    setStatus("error");
    setError("Please fill in all required fields.");
    return;
  }

  // Brand must have brand name
  if (isBrand && !brandName) {
    setStatus("error");
    setError("Please enter your brand name.");
    return;
  }

  try {
    setStatus("submitting");

    const userData = {
      name: fullName,
      email,
      password: pw1,
      role,
      ...(isBrand && { brandName }),
    };

    console.log("Registering user:", userData);

    const data = await registerUser(userData);

    console.log("Registration successful:", data);

    // Registration successful
    setStatus("idle");

    // Move user to login page
    window.location.href = "/login";
  } catch (error) {
    console.error("Registration error:", error);

    setStatus("error");
    setError(error.message || "Registration failed. Please try again.");
  }
}

  return (
    <div className="oraino-signup-root">
      {/* ---------- NAV ---------- */}
      <nav className="nav">
        <div className="nav-inner">
          <a href="#" className="logo">
            <svg className="logo-mark" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4C10 4 5 9 5 16c0 5 3 8 7 8 3 0 4-2 4-4 0-1.5-1-2-1-3.5C15 14 17 12 19 12c3 0 5 2 5 5 0 6-4 9-8 11 8-1 13-6 13-13 0-6-5-11-13-11Z"
                fill="#C75F71"
              />
              <circle cx="12" cy="17" r="2.4" fill="#A2AE9D" />
            </svg>
            Oraino
          </a>
          <div className="nav-links">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#">{l}</a>
            ))}
          </div>
          <div className="nav-actions">
            <a href="/login" className="btn btn-ghost">Log in</a>
            <a href="/register" className="btn btn-primary">Sign Up</a>
          </div>
        </div>
      </nav>

      <div className="signup-wrap">
        {/* ---------- LEFT VISUAL PANEL ---------- */}
        <div className="visual-panel">
          <div className="blooms" aria-hidden="true">
            <div className="vp-bloom vp-bloom-1">
              <svg viewBox="0 0 400 400">
                <path fill="#F0B8B8" opacity="0.6" d="M200 20c60 0 100 60 130 110s30 110-20 150-120 40-170 0-70-100-40-160S140 20 200 20Z" />
              </svg>
            </div>
            <div className="vp-bloom vp-bloom-2">
              <svg viewBox="0 0 400 400">
                <path fill="#A2AE9D" opacity="0.5" d="M190 30c70-10 130 40 150 100s0 130-60 160-140 10-170-40-20-140 20-180S150 36 190 30Z" />
              </svg>
            </div>
          </div>

          <svg className="vp-path" viewBox="0 0 560 760" preserveAspectRatio="none" aria-hidden="true">
            <path d="M40 60 C 140 160, 60 260, 170 340 S 300 460, 210 560 S 360 660, 300 720" />
          </svg>

          <div className="vp-quote">
            <p className="eyebrow">Influencer marketing, cultivated</p>
            <h2>Where brands and creators <em>grow together.</em></h2>
          </div>

          <div className="vp-photo-hero">
            <img src={HERO_PHOTO} alt="Content creator collaborating with a brand" loading="lazy" />
          </div>

          {PHOTO_NODES.map((n, i) => (
            <div
              key={i}
              className="vp-node"
              style={{ top: n.top, left: n.left, width: n.size, height: n.size }}
            >
              <img src={n.src} alt={n.alt} loading="lazy" />
            </div>
          ))}

          {SCENE_BADGES.map((b, i) => (
            <div
              key={i}
              className="vp-node badge"
              style={{
                top: b.top,
                right: b.right,
                width: b.size,
                height: b.size,
                background: b.bg,
              }}
            >
              <BadgeIcon type={b.icon} />
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
            <p className="switch-instead">
              {isBrand ? "Join as a creator instead? " : "Join as a brand instead? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setRole(isBrand ? "creator" : "brand");
                }}
              >
                Click here
              </a>
            </p>

            <div className="role-toggle" role="tablist" aria-label="Account type">
              <button
                type="button"
                className={`role-btn ${!isBrand ? "active" : ""}`}
                role="tab"
                aria-selected={!isBrand}
                onClick={() => setRole("creator")}
              >
                I am a Creator
              </button>
              <button
                type="button"
                className={`role-btn ${isBrand ? "active" : ""}`}
                role="tab"
                aria-selected={isBrand}
                onClick={() => setRole("brand")}
              >
                I am a Brand
              </button>
            </div>

            <div className="form-heading">
              <h1>Create your account</h1>
              <p>
                {isBrand
                  ? "Join Oraino and start finding the right creators for your brand."
                  : "Join Oraino and start getting discovered by brands."}
              </p>
            </div>

            <button type="button" className="social-btn">
              <GoogleIcon />
              Sign up with Google
            </button>
            <button type="button" className="social-btn">
              <AppleIcon />
              Sign up with Apple
            </button>

            <div className="divider"><span>or</span></div>

            <form onSubmit={handleSubmit} noValidate>
              {status === "error" && <div className="form-error">{error}</div>}

              <div className="field">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className={`field ${isBrand ? "" : "collapsed"}`}>
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required={isBrand}
                />
              </div>

              <div className="field">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <PasswordField
                placeholder="Password"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                show={showPw1}
                onToggle={() => setShowPw1((s) => !s)}
              />

              <PasswordField
                placeholder="Confirm Password"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                show={showPw2}
                onToggle={() => setShowPw2((s) => !s)}
              />

              <button type="submit" className="submit-btn" disabled={status === "submitting"}>
                {status === "submitting" ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <p className="fine-print">
              By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
            </p>
            <p className="login-line">
              Already have an account? <a href="/login">Log in</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}