import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import {
  getCollaborationById,
  submitDeliverable,
  approveDeliverable,
  requestRevision,
  resolveRevision,
  cancelCollaboration,
  completeCollaboration,
} from "../../services/collaboration.service";
import { getTimeline } from "../../services/timeline.service";
import { createReview } from "../../services/review.service";
import "../CampaignDetail/CampaignDetail.css";
import "./CollaborationWorkspace.css";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function deliverableBadgeClass(status) {
  if (status === "Approved") return "badge-completed";
  if (status === "Revision Requested") return "badge-pending";
  if (status === "Submitted") return "badge-accepted";
  return "badge-neutral";
}

function SubmitForm({ onSubmit, busy, label = "Submit work" }) {
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState("Instagram");

  return (
    <div className="inline-form">
      <div className="field-row">
        <input className="field-input" placeholder="Link to your work" value={url} onChange={(e) => setUrl(e.target.value)} />
        <select className="field-select" value={fileType} onChange={(e) => setFileType(e.target.value)}>
          {["Image", "Video", "PDF", "Drive", "Instagram", "YouTube", "Other"].map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-rose btn-sm"
        disabled={busy || !url}
        onClick={() => onSubmit(url, fileType)}
      >
        {busy ? "Submitting…" : label}
      </button>
    </div>
  );
}

export default function CollaborationWorkspace() {
  const { id } = useParams();
  const { user } = useAuth();

  const [collaboration, setCollaboration] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [busyKey, setBusyKey] = useState(null);
  const [actionError, setActionError] = useState("");
  const [revisionDraft, setRevisionDraft] = useState({}); // deliverableId -> comment
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStatus, setReviewStatus] = useState("idle");

  const load = async () => {
    try {
      const [collabRes, timelineRes] = await Promise.all([
        getCollaborationById(id),
        getTimeline(id).catch(() => ({ data: [] })),
      ]);
      setCollaboration(collabRes.data);
      setTimeline(timelineRes.data);
      setLoadStatus("ready");
    } catch {
      setLoadStatus("error");
    }
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isBrand = user?.role === "brand";
  const isCreator = user?.role === "creator";

  async function run(key, fn, successMessage) {
    setActionError("");
    setBusyKey(key);
    try {
      await fn();
      await load();
    } catch (err) {
      setActionError(err.message || "That action couldn't be completed.");
    } finally {
      setBusyKey(null);
    }
    void successMessage;
  }

  if (loadStatus === "loading") {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <div className="spinner" />
          <p>Loading collaboration…</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "error" || !collaboration) {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <h3>Couldn&apos;t load this collaboration</h3>
          <Link to="/collaborations" className="btn btn-primary">Back to collaborations</Link>
        </div>
      </div>
    );
  }

  const c = collaboration;
  const otherName = isBrand ? c.creator?.user?.name : c.brand?.user?.name;
  const isClosed = c.status === "Completed" || c.status === "Cancelled";
  const openRevisionsByDeliverable = {};
  (c.revision?.requests || []).forEach((r) => {
    if (r.status === "Pending") openRevisionsByDeliverable[r.deliverableId] = r;
  });

  const alreadyReviewed = isBrand ? c.review?.brandReviewed : c.review?.creatorReviewed;

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewStatus("submitting");
    try {
      await createReview(id, { rating: Number(reviewRating), comment: reviewComment });
      setReviewStatus("success");
      await load();
    } catch (err) {
      setReviewStatus("error");
      setActionError(err.message || "Couldn't submit your review.");
    }
  }

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <Link to="/collaborations" className="back-link">← Back to collaborations</Link>
          <div className="page-hero-row">
            <div>
              <p className="eyebrow">Collaboration</p>
              <h1>{c.campaign?.title}</h1>
              <p className="lead">with {otherName}</p>
            </div>
            <div className="workspace-badges">
              <span className={`badge ${deliverableBadgeClass(c.currentStage === "Completed" ? "Approved" : "")} badge-neutral`}>{c.currentStage}</span>
              <span className={`badge ${c.status === "Completed" ? "badge-completed" : c.status === "Cancelled" ? "badge-rejected" : "badge-open"}`}>{c.status}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container workspace-layout">
          <div className="workspace-main">
            {actionError && <div className="alert alert-error">{actionError}</div>}

            <div className="card workspace-progress-card">
              <div className="progress-top">
                <span>{c.progress?.completedDeliverables || 0} of {c.progress?.totalDeliverables || 0} deliverables approved</span>
                <strong>{c.progress?.percentage || 0}%</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${c.progress?.percentage || 0}%` }} />
              </div>
            </div>

            <section className="detail-section">
              <h3>Deliverables</h3>
              <div className="deliverables-list">
                {c.agreement?.deliverables?.map((d) => {
                  const openRevision = openRevisionsByDeliverable[d._id];
                  return (
                    <div key={d._id} className="card deliverable-card">
                      <div className="deliverable-top">
                        <div>
                          <div className="deliverable-title">{d.title} × {d.quantity}</div>
                          {d.description && <div className="field-hint">{d.description}</div>}
                        </div>
                        <span className={`badge ${deliverableBadgeClass(d.status)}`}>{d.status}</span>
                      </div>

                      {d.submittedLinks?.length > 0 && (
                        <ul className="submitted-links">
                          {d.submittedLinks.map((l, i) => (
                            <li key={i}>
                              <a href={l.url} target="_blank" rel="noreferrer">{l.fileType || "Link"}: {l.url}</a>
                            </li>
                          ))}
                        </ul>
                      )}

                      {d.feedback?.comment && (
                        <div className="deliverable-feedback">Feedback: {d.feedback.comment}</div>
                      )}

                      {isCreator && !isClosed && d.status === "Pending" && (
                        <SubmitForm
                          busy={busyKey === `submit-${d._id}`}
                          onSubmit={(url, fileType) =>
                            run(`submit-${d._id}`, () => submitDeliverable(id, d._id, { url, fileType }))
                          }
                        />
                      )}

                      {isCreator && !isClosed && openRevision && (
                        <div className="inline-form">
                          <p className="field-hint" style={{ marginBottom: 8 }}>
                            Revision requested — submit an updated link below.
                          </p>
                          <SubmitForm
                            label="Submit revision"
                            busy={busyKey === `resolve-${openRevision._id}`}
                            onSubmit={(url, fileType) =>
                              run(`resolve-${openRevision._id}`, () =>
                                resolveRevision(id, openRevision._id, [{ url, fileType }])
                              )
                            }
                          />
                        </div>
                      )}

                      {isBrand && !isClosed && d.status === "Submitted" && (
                        <div className="inline-form">
                          <div className="deliverable-actions">
                            <button
                              type="button"
                              className="btn btn-rose btn-sm"
                              disabled={busyKey === `approve-${d._id}`}
                              onClick={() => run(`approve-${d._id}`, () => approveDeliverable(id, d._id))}
                            >
                              {busyKey === `approve-${d._id}` ? "Working…" : "Approve"}
                            </button>
                          </div>
                          <div className="field-row" style={{ marginTop: 10 }}>
                            <input
                              className="field-input"
                              placeholder="Revision notes for the creator"
                              value={revisionDraft[d._id] || ""}
                              onChange={(e) => setRevisionDraft({ ...revisionDraft, [d._id]: e.target.value })}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              disabled={busyKey === `revision-${d._id}`}
                              onClick={() =>
                                run(`revision-${d._id}`, () => requestRevision(id, d._id, revisionDraft[d._id] || ""))
                              }
                            >
                              Request revision
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="detail-section">
              <h3>Activity</h3>
              <div className="timeline-list">
                {timeline.length === 0 && <p className="field-hint">No activity yet.</p>}
                {timeline.map((t) => (
                  <div key={t._id} className="timeline-row">
                    <div className="timeline-dot" />
                    <div>
                      <div className="timeline-title">{t.title}</div>
                      <div className="timeline-desc">{t.description}</div>
                      <div className="timeline-date">{formatDate(t.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {c.status === "Completed" && !alreadyReviewed && (
              <section className="detail-section">
                <h3>Leave a review</h3>
                <div className="card" style={{ padding: 22 }}>
                  {reviewStatus === "success" ? (
                    <div className="alert alert-success">Thanks — your review was submitted.</div>
                  ) : (
                    <form onSubmit={handleReviewSubmit}>
                      <div className="field-group">
                        <label className="field-label">Rating</label>
                        <div className="chip-select">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              className={`chip ${Number(reviewRating) === n ? "active" : ""}`}
                              onClick={() => setReviewRating(n)}
                            >
                              {n} ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="field-group">
                        <label className="field-label">Comment</label>
                        <textarea className="field-textarea" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn-rose" disabled={reviewStatus === "submitting"}>
                        {reviewStatus === "submitting" ? "Submitting…" : "Submit review"}
                      </button>
                    </form>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="detail-side">
            <div className="card detail-summary">
              <div className="summary-row"><span>Amount</span><strong>${c.agreement?.finalAmount?.toLocaleString()}</strong></div>
              <div className="summary-row"><span>Deadline</span><strong>{formatDate(c.agreement?.deadline)}</strong></div>
              <div className="summary-row"><span>Revisions used</span><strong>{c.revision?.used || 0} / {c.revision?.freeAllowed || 0}</strong></div>
            </div>

            {!isClosed && (
              <div className="card apply-card">
                <h3>Manage project</h3>
                <div className="workspace-manage-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-block"
                    disabled={busyKey === "complete"}
                    onClick={() => run("complete", () => completeCollaboration(id))}
                  >
                    Mark as completed
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm btn-block"
                    disabled={busyKey === "cancel"}
                    onClick={() => {
                      if (window.confirm("Cancel this collaboration? This can't be undone.")) {
                        run("cancel", () => cancelCollaboration(id));
                      }
                    }}
                  >
                    Cancel collaboration
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
