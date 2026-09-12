import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import { getDashboard } from "../../services/dashboard.service";
import "./Dashboard.css";

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getDashboard();
        if (!cancelled) {
          setData(res.data);
          setStatus("ready");
        }
      } catch (err) {
        if (cancelled) return;
        if (err.message?.toLowerCase().includes("profile not found")) {
          setNeedsProfile(true);
        }
        setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isBrand = user?.role === "brand";
  const profilePath = isBrand ? "/profile/brand" : "/profile/creator";

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading your dashboard…</p>
            </div>
          )}

          {status === "error" && needsProfile && (
            <div className="state-block">
              <h3>Finish setting up your profile</h3>
              <p>{isBrand ? "Create your brand profile to start launching campaigns." : "Create your creator profile to start applying to campaigns."}</p>
              <Link to={profilePath} className="btn btn-primary">Set up profile</Link>
            </div>
          )}

          {status === "error" && !needsProfile && (
            <div className="state-block">
              <h3>Couldn&apos;t load your dashboard</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && data && (
            <>
              <div className="stats-grid">
                {isBrand ? (
                  <>
                    <StatCard label="Total campaigns" value={data.overview.totalCampaigns} />
                    <StatCard label="Pending applications" value={data.overview.pendingApplications} />
                    <StatCard label="Active collaborations" value={data.overview.activeCollaborations} />
                    <StatCard label="Completed collaborations" value={data.overview.completedCollaborations} />
                  </>
                ) : (
                  <>
                    <StatCard label="Total applications" value={data.overview.totalApplications} />
                    <StatCard label="Pending applications" value={data.overview.pendingApplications} />
                    <StatCard label="Active collaborations" value={data.overview.activeCollaborations} />
                    <StatCard label="Average rating" value={data.overview.averageRating ? `${data.overview.averageRating} ★` : "—"} />
                  </>
                )}
              </div>

              <div className="dashboard-quick-links">
                {isBrand ? (
                  <>
                    <Link to="/campaigns/new" className="btn btn-primary btn-sm">+ Create Campaign</Link>
                    <Link to="/my-campaigns" className="btn btn-ghost btn-sm">My Campaigns</Link>
                    <Link to="/deals" className="btn btn-ghost btn-sm">My Deals</Link>
                    <Link to="/collaborations" className="btn btn-ghost btn-sm">Collaborations</Link>
                    <Link to="/discover/creators" className="btn btn-ghost btn-sm">Discover Creators</Link>
                  </>
                ) : (
                  <>
                    <Link to="/campaigns" className="btn btn-primary btn-sm">Browse Campaigns</Link>
                    <Link to="/applications" className="btn btn-ghost btn-sm">My Applications</Link>
                    <Link to="/deals" className="btn btn-ghost btn-sm">My Deals</Link>
                    <Link to="/collaborations" className="btn btn-ghost btn-sm">Collaborations</Link>
                    <Link to="/discover/brands" className="btn btn-ghost btn-sm">Discover Brands</Link>
                  </>
                )}
              </div>

              <section>
                <h3 className="section-title">Recent collaborations</h3>
                {data.recentCollaborations?.length === 0 && (
                  <div className="state-block" style={{ padding: "40px 24px" }}>
                    <p>No collaborations yet.</p>
                  </div>
                )}
                {data.recentCollaborations?.length > 0 && (
                  <div className="recent-collab-list">
                    {data.recentCollaborations.map((c) => {
                      const other = isBrand ? c.creator?.user?.name : c.brand?.user?.name;
                      return (
                        <Link key={c._id} to={`/collaborations/${c._id}`} className="card recent-collab-row">
                          <div>
                            <div className="recent-collab-title">{c.campaign?.title}</div>
                            <div className="recent-collab-sub">with {other || "—"}</div>
                          </div>
                          <span className={`badge ${c.status === "Completed" ? "badge-completed" : c.status === "Cancelled" ? "badge-cancelled" : "badge-open"}`}>
                            {c.status}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
