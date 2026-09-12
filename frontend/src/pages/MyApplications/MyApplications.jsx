import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getMyApplications, withdrawApplication } from "../../services/application.service";
import "./MyApplications.css";

function statusClass(status) {
  if (["Accepted", "Deal Created"].includes(status)) return "badge-accepted";
  if (["Rejected", "Withdrawn"].includes(status)) return "badge-rejected";
  return "badge-pending";
}

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("loading");
  const [actioningId, setActioningId] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => { load(); }, []);

  async function handleWithdraw(id) {
    setActionError("");
    setActioningId(id);
    try {
      await withdrawApplication(id);
      await load();
    } catch (err) {
      setActionError(err.message || "Couldn't withdraw this application.");
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Your applications</p>
          <h1>Applications you've sent</h1>
          <p className="lead">Track the status of every campaign you've applied to.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {actionError && <div className="alert alert-error" style={{ marginBottom: 20 }}>{actionError}</div>}

          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading your applications…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load your applications</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && applications.length === 0 && (
            <div className="state-block">
              <h3>No applications yet</h3>
              <p>Browse open campaigns and send your first proposal.</p>
              <Link to="/campaigns" className="btn btn-primary">Browse campaigns</Link>
            </div>
          )}

          {status === "ready" && applications.length > 0 && (
            <div className="my-applications-list">
              {applications.map((app) => {
                const brandName = app.campaign?.brand?.user?.name || "A brand";
                const isPending = app.status === "Pending";
                const isBusy = actioningId === app._id;
                return (
                  <div key={app._id} className="card application-list-row">
                    <div>
                      <div className="application-list-top">
                        <span className={`badge ${statusClass(app.status)}`}>{app.status}</span>
                      </div>
                      <Link to={`/campaigns/${app.campaign?._id}`} className="application-list-title">
                        {app.campaign?.title || "Campaign"}
                      </Link>
                      <div className="application-list-sub">with {brandName}</div>
                      <div className="application-meta">
                        <span>${app.expectedPrice?.toLocaleString()}</span>
                        <span>·</span>
                        <span>{app.estimatedDelivery} day delivery</span>
                      </div>
                    </div>
                    {isPending && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={isBusy}
                        onClick={() => handleWithdraw(app._id)}
                      >
                        {isBusy ? "Working…" : "Withdraw"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
