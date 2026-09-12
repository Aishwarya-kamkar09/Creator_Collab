import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function LogoMark() {
  return (
    <svg className="app-logo-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 4C10 4 5 9 5 16c0 5 3 8 7 8 3 0 4-2 4-4 0-1.5-1-2-1-3.5C15 14 17 12 19 12c3 0 5 2 5 5 0 6-4 9-8 11 8-1 13-6 13-13 0-6-5-11-13-11Z"
        fill="#C75F71"
      />
      <circle cx="12" cy="17" r="2.4" fill="#A2AE9D" />
    </svg>
  );
}

export default function AppNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCreator = user?.role === "creator";
  const isBrand = user?.role === "brand";

  const links = isBrand
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/my-campaigns", label: "My Campaigns" },
        { to: "/deals", label: "Deals" },
        { to: "/collaborations", label: "Collaborations" },
        { to: "/discover/creators", label: "Discover Creators" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/campaigns", label: "Browse Campaigns" },
        { to: "/applications", label: "Applications" },
        { to: "/deals", label: "Deals" },
        { to: "/collaborations", label: "Collaborations" },
        { to: "/discover/brands", label: "Discover Brands" },
      ];

  const initial = (user?.name || "?").trim().charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <Link to="/" className="app-logo">
          <LogoMark />
          Oraino
        </Link>

        <div className="app-nav-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={location.pathname === l.to ? "active" : ""}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="app-nav-actions">
          {user ? (
            <>
              <Link to={isBrand ? "/profile/brand" : "/profile/creator"} className="app-user-pill">
                <span className="app-user-avatar">{initial}</span>
                {user.name}
                <span className="app-role-tag">{isCreator ? "Creator" : "Brand"}</span>
              </Link>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
