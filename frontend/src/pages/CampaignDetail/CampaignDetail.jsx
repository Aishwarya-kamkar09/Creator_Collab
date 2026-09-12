import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import { findCampaignById } from "../../services/campaign.service";
import { applyToCampaign, getMyApplications } from "../../services/application.service";
import "./CampaignDetail.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function CampaignDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [campaign, setCampaign] = useState(location.state?.campaign || null);
  const [loadStatus, setLoadStatus] = useState(location.state?.campaign ? "ready" : "loading");
  const [existingApplication, setExistingApplication] = useState(null);

  const [proposal, setProposal] = useState("");
  const [expectedPrice, setExpectedPrice] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [applyStatus, setApplyStatus] = useState("idle"); // idle | submitting | success | error
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!campaign) {
        try {
          const found = await findCampaignById(id);
          if (!cancelled) {
            setCampaign(found);
            setLoadStatus("ready");
          }
        } catch {
          if (!cancelled) setLoadStatus("error");
        }
      }

      if (user?.role === "creator") {
        try {
          const res = await getMyApplications();
          const mine = res.data.find((a) => a.campaign?._id === id);
          if (!cancelled && mine) setExistingApplication(mine);
        } catch {
          // not fatal — just skip the "already applied" hint
        }
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.role]);

  async function handleApply(e) {
    e.preventDefault();
    setApplyError("");

    if (!proposal || !expectedPrice || !estimatedDelivery) {
      setApplyStatus("error");
      setApplyError("Please fill in your proposal, price, and delivery estimate.");
      return;
    }

    try {
      setApplyStatus("submitting");
      const res = await applyToCampaign(id, {
        proposal,
        expectedPrice: Number(expectedPrice),
        estimatedDelivery: Number(estimatedDelivery),
      });
      setExistingApplication(res.data);
      setApplyStatus("success");
    } catch (err) {
      setApplyStatus("error");
      setApplyError(err.message || "Couldn't submit your application. Please try again.");
    }
  }

  if (loadStatus === "loading") {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <div className="spinner" />
          <p>Loading campaign…</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "error" || !campaign) {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <h3>Campaign not found</h3>
          <p>This campaign may have been closed or removed.</p>
          <Link to="/campaigns" className="btn btn-primary">Back to campaigns</Link>
        </div>
      </div>
    );
  }

  const brandName = campaign.brand?.user?.name || campaign.brand?.companyName || "This brand";
  const initials = brandName.trim().charAt(0).toUpperCase();
  const isOwner = user?.role === "brand"; // brand-side viewers manage from My Campaigns
  const isCreator = user?.role === "creator";
  const isOpen = campaign.status === "Open";

  return (
    <div className="app-shell">
      <AppNav />

      <main className="page-body">
        <div className="app-container detail-layout">
          <div className="detail-main">
            <Link to="/campaigns" className="back-link">← Back to campaigns</Link>

            <div className="detail-top">
              <span className={`badge ${isOpen ? "badge-open" : "badge-closed"}`}>{campaign.status}</span>
              <span className="detail-category">{campaign.category}</span>
            </div>

            <h1 className="detail-title">{campaign.title}</h1>

            <div className="detail-brand-row">
              <span className="detail-avatar">{initials}</span>
              <div>
                <div className="detail-brand-name">{brandName}</div>
                <div className="detail-brand-sub">{campaign.location || "Remote"}</div>
              </div>
            </div>

            <section className="detail-section">
              <h3>About this campaign</h3>
              <p className="detail-desc">{campaign.description}</p>
            </section>

            {campaign.requirements?.length > 0 && (
              <section className="detail-section">
                <h3>Requirements</h3>
                <ul className="detail-list">
                  {campaign.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </section>
            )}

            {campaign.deliverables?.length > 0 && (
              <section className="detail-section">
                <h3>Deliverables</h3>
                <ul className="detail-list">
                  {campaign.deliverables.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </section>
            )}

            <section className="detail-section">
              <h3>Platforms</h3>
              <div className="campaign-card-platforms">
                {(campaign.platforms || []).map((p) => (
                  <span key={p} className="badge badge-neutral">{p}</span>
                ))}
              </div>
            </section>
          </div>

          <aside className="detail-side">
            <div className="card detail-summary">
              <div className="summary-row">
                <span>Budget</span>
                <strong>${campaign.budget?.min?.toLocaleString()} – ${campaign.budget?.max?.toLocaleString()}</strong>
              </div>
              <div className="summary-row">
                <span>Deadline</span>
                <strong>{formatDate(campaign.deadline)}</strong>
              </div>
              <div className="summary-row">
                <span>Applicants</span>
                <strong>{campaign.applicantsCount || 0}</strong>
              </div>
            </div>

            {isOwner && (
              <div className="card apply-card">
                <h3>This is a brand campaign listing</h3>
                <p className="field-hint" style={{ marginBottom: 16 }}>
                  Manage applicants for your own campaigns from My Campaigns.
                </p>
                <Link to="/my-campaigns" className="btn btn-primary btn-block">Go to My Campaigns</Link>
              </div>
            )}

            {isCreator && (
              <div className="card apply-card">
                {existingApplication ? (
                  <>
                    <h3>You&apos;ve applied</h3>
                    <p className="field-hint" style={{ marginBottom: 12 }}>
                      Status: <strong>{existingApplication.status}</strong>
                    </p>
                    <p className="field-hint">
                      Proposed ${existingApplication.expectedPrice} · {existingApplication.estimatedDelivery} day delivery
                    </p>
                  </>
                ) : !isOpen ? (
                  <>
                    <h3>Applications closed</h3>
                    <p className="field-hint">This campaign is no longer accepting applications.</p>
                  </>
                ) : (
                  <>
                    <h3>Apply to this campaign</h3>

                    {applyStatus === "success" ? (
                      <div className="alert alert-success">Your application was submitted successfully.</div>
                    ) : (
                      <form onSubmit={handleApply} noValidate>
                        {applyStatus === "error" && <div className="alert alert-error">{applyError}</div>}

                        <div className="field-group">
                          <label className="field-label">Your proposal</label>
                          <textarea
                            className="field-textarea"
                            placeholder="Tell the brand why you're a great fit…"
                            value={proposal}
                            onChange={(e) => setProposal(e.target.value)}
                            required
                          />
                        </div>

                        <div className="field-row">
                          <div className="field-group">
                            <label className="field-label">Your price ($)</label>
                            <input
                              type="number"
                              min="0"
                              className="field-input"
                              placeholder="e.g. 250"
                              value={expectedPrice}
                              onChange={(e) => setExpectedPrice(e.target.value)}
                              required
                            />
                          </div>
                          <div className="field-group">
                            <label className="field-label">Delivery (days)</label>
                            <input
                              type="number"
                              min="1"
                              className="field-input"
                              placeholder="e.g. 7"
                              value={estimatedDelivery}
                              onChange={(e) => setEstimatedDelivery(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <button type="submit" className="btn btn-rose btn-block" disabled={applyStatus === "submitting"}>
                          {applyStatus === "submitting" ? "Submitting…" : "Submit application"}
                        </button>
                      </form>
                    )}
                  </>
                )}
              </div>
            )}

            {!user && (
              <div className="card apply-card">
                <h3>Want to apply?</h3>
                <p className="field-hint" style={{ marginBottom: 16 }}>Log in as a creator to send a proposal for this campaign.</p>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => navigate("/login", { state: { from: location } })}
                >
                  Log in to apply
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
