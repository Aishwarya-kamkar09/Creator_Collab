import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import {
  getCampaignApplications,
  acceptApplication,
  rejectApplication,
} from "../../services/application.service";
import { createDeal } from "../../services/deal.service";
import "./CampaignApplications.css";

function statusClass(status) {
  if (status === "Accepted" || status === "Deal Created") return "badge-accepted";
  if (status === "Rejected" || status === "Withdrawn") return "badge-rejected";
  return "badge-pending";
}

export default function CampaignApplications() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("loading");
  const [actioningId, setActioningId] = useState(null);
  const [actionError, setActionError] = useState("");

  const load = async () => {
    try {
      const res = await getCampaignApplications(id);
      setApplications(res.data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAccept(appId) {
    setActionError("");
    setActioningId(appId);
    try {
      await acceptApplication(appId);
      await load();
    } catch (err) {
      setActionError(err.message || "Couldn't accept this application.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(appId) {
    setActionError("");
    setActioningId(appId);
    try {
      await rejectApplication(appId);
      await load();
    } catch (err) {
      setActionError(err.message || "Couldn't reject this application.");
    } finally {
      setActioningId(null);
    }
  }

  async function handleCreateDeal(appId) {
    setActionError("");
    setActioningId(appId);
    try {
      const res = await createDeal(appId);
      navigate(`/deals/${res.data._id}`, { state: { deal: res.data } });
    } catch (err) {
      setActionError(err.message || "Couldn't start a deal for this application.");
      setActioningId(null);
    }
  }

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <Link to="/my-campaigns" className="back-link">← Back to my campaigns</Link>
          <p className="eyebrow">Applicants</p>
          <h1>Review applications</h1>
          <p className="lead">Accepting a creator closes the campaign and declines every other pending application.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {actionError && <div className="alert alert-error" style={{ marginBottom: 20 }}>{actionError}</div>}

          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading applications…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load applications</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && applications.length === 0 && (
            <div className="state-block">
              <h3>No applications yet</h3>
              <p>Once creators apply to this campaign, they&apos;ll show up here.</p>
            </div>
          )}

          {status === "ready" && applications.length > 0 && (
            <div className="applications-list">
              {applications.map((app) => {
                const creatorName = app.creator?.user?.name || "A creator";
                const initials = creatorName.trim().charAt(0).toUpperCase();
                const isPending = app.status === "Pending";
                const isBusy = actioningId === app._id;

                return (
                  <div key={app._id} className="card application-row">
                    <div className="application-header">
                      <div className="application-creator">
                        <span className="detail-avatar">{initials}</span>
                        <div>
                          <div className="application-name">{creatorName}</div>
                          <div className="application-sub">{app.creator?.user?.email}</div>
                        </div>
                      </div>
                      <span className={`badge ${statusClass(app.status)}`}>{app.status}</span>
                    </div>

                    <p className="application-proposal">{app.proposal}</p>

                    <div className="application-meta">
                      <span>${app.expectedPrice?.toLocaleString()}</span>
                      <span>·</span>
                      <span>{app.estimatedDelivery} day delivery</span>
                    </div>

                    {isPending && (
                      <div className="application-actions">
                        <button
                          type="button"
                          className="btn btn-rose btn-sm"
                          disabled={isBusy}
                          onClick={() => handleAccept(app._id)}
                        >
                          {isBusy ? "Working…" : "Accept"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={isBusy}
                          onClick={() => handleReject(app._id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {app.status === "Accepted" && (
                      <div className="application-actions">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          disabled={isBusy}
                          onClick={() => handleCreateDeal(app._id)}
                        >
                          {isBusy ? "Working…" : "Create Deal →"}
                        </button>
                      </div>
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
