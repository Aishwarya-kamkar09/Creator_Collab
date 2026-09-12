import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getMyCampaigns } from "../../services/campaign.service";
import "./MyCampaigns.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function statusClass(status) {
  if (status === "Open") return "badge-open";
  if (status === "Completed") return "badge-completed";
  return "badge-closed";
}

export default function MyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyCampaigns();
        if (!cancelled) {
          setCampaigns(res.data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container page-hero-row">
          <div>
            <p className="eyebrow">Your campaigns</p>
            <h1>Manage your campaigns</h1>
            <p className="lead">Track applicants and keep your open briefs up to date.</p>
          </div>
          <Link to="/campaigns/new" className="btn btn-primary">+ Create Campaign</Link>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading your campaigns…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load your campaigns</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && campaigns.length === 0 && (
            <div className="state-block">
              <h3>No campaigns yet</h3>
              <p>Create your first campaign to start receiving applications from creators.</p>
              <Link to="/campaigns/new" className="btn btn-primary">Create your first campaign</Link>
            </div>
          )}

          {status === "ready" && campaigns.length > 0 && (
            <div className="my-campaigns-list">
              {campaigns.map((c) => (
                <div key={c._id} className="card my-campaign-row">
                  <div className="my-campaign-info">
                    <div className="my-campaign-top">
                      <span className={`badge ${statusClass(c.status)}`}>{c.status}</span>
                      <span className="my-campaign-cat">{c.category}</span>
                    </div>
                    <h3>{c.title}</h3>
                    <div className="my-campaign-meta">
                      <span>${c.budget?.min?.toLocaleString()} – ${c.budget?.max?.toLocaleString()}</span>
                      <span>·</span>
                      <span>Due {formatDate(c.deadline)}</span>
                      <span>·</span>
                      <span>{c.applicantsCount || 0} applicant{c.applicantsCount === 1 ? "" : "s"}</span>
                    </div>
                  </div>
                  <div className="my-campaign-actions">
                    <Link to={`/campaigns/${c._id}/applications`} className="btn btn-primary btn-sm">
                      View Applications
                    </Link>
                    <Link to={`/campaigns/${c._id}`} state={{ campaign: c }} className="btn btn-ghost btn-sm">
                      Public page
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
