import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import { getMyCollaborations } from "../../services/collaboration.service";
import "../MyDeals/MyDeals.css";

function statusClass(status) {
  if (status === "Completed") return "badge-completed";
  if (status === "Cancelled") return "badge-rejected";
  if (status === "Revision Requested") return "badge-pending";
  return "badge-open";
}

export default function MyCollaborations() {
  const { user } = useAuth();
  const [collaborations, setCollaborations] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyCollaborations();
        if (!cancelled) {
          setCollaborations(res.data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isBrand = user?.role === "brand";

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Collaborations</p>
          <h1>Active projects</h1>
          <p className="lead">Track deliverables, revisions, and progress for every collaboration.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading your collaborations…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load your collaborations</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && collaborations.length === 0 && (
            <div className="state-block">
              <h3>No collaborations yet</h3>
              <p>Once a deal is confirmed, the project workspace will appear here.</p>
            </div>
          )}

          {status === "ready" && collaborations.length > 0 && (
            <div className="my-deals-list">
              {collaborations.map((c) => {
                const other = isBrand ? c.creator?.user?.name : c.brand?.user?.name;
                return (
                  <Link key={c._id} to={`/collaborations/${c._id}`} className="card deal-row">
                    <div>
                      <div className="deal-row-top">
                        <span className={`badge ${statusClass(c.status)}`}>{c.currentStage}</span>
                      </div>
                      <div className="deal-row-title">{c.campaign?.title}</div>
                      <div className="deal-row-sub">with {other || "—"} · {c.progress?.percentage || 0}% complete</div>
                    </div>
                    <div className="deal-row-amount">${c.agreement?.finalAmount?.toLocaleString()}</div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
