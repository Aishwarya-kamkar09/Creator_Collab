import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import {
  findDealById,
  updateDeal,
  confirmDeal,
  acceptDeal,
  declineDeal,
} from "../../services/deal.service";
import { getMyCollaborations } from "../../services/collaboration.service";
import "./DealDetail.css";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export default function DealDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deal, setDeal] = useState(location.state?.deal || null);
  const [loadStatus, setLoadStatus] = useState(location.state?.deal ? "ready" : "loading");
  const [collaborationId, setCollaborationId] = useState(null);

  const [finalAmount, setFinalAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [freeRevisions, setFreeRevisions] = useState(1);
  const [deliverables, setDeliverables] = useState([]);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftQty, setDraftQty] = useState(1);

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let d = deal;
      if (!d) {
        try {
          d = await findDealById(id);
          if (!cancelled) setDeal(d);
        } catch {
          if (!cancelled) setLoadStatus("error");
          return;
        }
      }
      if (!cancelled) {
        setFinalAmount(d.finalAmount || "");
        setDeadline(formatDate(d.deadline));
        setFreeRevisions(d.freeRevisions ?? 1);
        setDeliverables(d.deliverables || []);
        setLoadStatus("ready");
      }

      if (d.status === "Confirmed") {
        try {
          const collabRes = await getMyCollaborations();
          const match = collabRes.data.find((c) => c.application?._id === d.application || c.application === d.application);
          if (!cancelled && match) setCollaborationId(match._id);
        } catch {
          // non-fatal
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const addDeliverable = () => {
    if (!draftTitle.trim()) return;
    setDeliverables([...deliverables, { title: draftTitle.trim(), quantity: Number(draftQty) || 1 }]);
    setDraftTitle("");
    setDraftQty(1);
  };

  const removeDeliverable = (i) => setDeliverables(deliverables.filter((_, idx) => idx !== i));

  async function handleSave(andSend) {
    setError("");
    if (!finalAmount || !deadline) {
      setStatus("error");
      setError("Please fill in the amount and deadline.");
      return;
    }
    if (andSend && deliverables.length === 0) {
      setStatus("error");
      setError("Add at least one deliverable before sending the offer.");
      return;
    }

    try {
      setStatus("submitting");
      const res = await updateDeal(deal._id, {
        finalAmount: Number(finalAmount),
        deadline,
        freeRevisions: Number(freeRevisions),
        deliverables,
      });
      let updated = res.data;
      if (andSend) {
        const confirmRes = await confirmDeal(deal._id);
        updated = confirmRes.data;
      }
      setDeal(updated);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't save this deal.");
    }
  }

  async function handleAccept() {
    setError("");
    try {
      setStatus("submitting");
      const res = await acceptDeal(deal._id);
      setDeal(res.data.deal);
      setCollaborationId(res.data.collaboration._id);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't accept this deal.");
    }
  }

  async function handleDecline() {
    setError("");
    try {
      setStatus("submitting");
      const res = await declineDeal(deal._id);
      setDeal(res.data);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't decline this deal.");
    }
  }

  if (loadStatus === "loading") {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <div className="spinner" />
          <p>Loading deal…</p>
        </div>
      </div>
    );
  }

  if (loadStatus === "error" || !deal) {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <h3>Deal not found</h3>
          <Link to="/deals" className="btn btn-primary">Back to deals</Link>
        </div>
      </div>
    );
  }

  const isBrand = user?.role === "brand";
  const isCreator = user?.role === "creator";
  const otherName = isBrand ? deal.creator?.user?.name : deal.brand?.user?.name;
  const isEditable = isBrand && !deal.brandAccepted && deal.status === "Negotiation";
  const isWaitingOnCreator = isBrand && deal.brandAccepted && deal.status === "Negotiation";
  const canRespond = isCreator && deal.brandAccepted && !deal.creatorAccepted && deal.status !== "Cancelled";

  return (
    <div className="app-shell">
      <AppNav />

      <main className="page-body">
        <div className="app-container deal-detail-layout">
          <Link to="/deals" className="back-link">← Back to deals</Link>

          <div className="card deal-detail-card">
            <div className="deal-detail-header">
              <div>
                <h1>{deal.campaign?.title || "Campaign deal"}</h1>
                <p className="field-hint">with {otherName || "—"}</p>
              </div>
              <span className={`badge ${deal.status === "Cancelled" ? "badge-rejected" : deal.status === "Confirmed" ? "badge-accepted" : "badge-pending"}`}>
                {deal.status === "Cancelled" ? "Declined" : deal.status}
              </span>
            </div>

            {status === "error" && <div className="alert alert-error">{error}</div>}

            {deal.status === "Confirmed" && (
              <div className="alert alert-success">
                This deal is confirmed. {collaborationId
                  ? <Link to={`/collaborations/${collaborationId}`}>Go to the collaboration workspace →</Link>
                  : "The collaboration workspace has been created."}
              </div>
            )}

            {deal.status === "Cancelled" && (
              <div className="alert alert-error">The creator declined this offer.</div>
            )}

            {isEditable ? (
              <>
                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Final amount ($)</label>
                    <input type="number" min="0" className="field-input" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Deadline</label>
                    <input type="date" className="field-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Free revisions</label>
                  <input type="number" min="0" className="field-input" style={{ maxWidth: 140 }} value={freeRevisions} onChange={(e) => setFreeRevisions(e.target.value)} />
                </div>

                <div className="field-group">
                  <label className="field-label">Deliverables</label>
                  <div className="list-row-input">
                    <input className="field-input" placeholder="e.g. Instagram Reel" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} style={{ flex: 2 }} />
                    <input type="number" min="1" className="field-input" value={draftQty} onChange={(e) => setDraftQty(e.target.value)} style={{ flex: 1 }} />
                    <button type="button" className="icon-btn" onClick={addDeliverable}>+</button>
                  </div>
                  {deliverables.length > 0 && (
                    <ul className="editable-list">
                      {deliverables.map((d, i) => (
                        <li key={i}>
                          <span>{d.title} × {d.quantity}</span>
                          <button type="button" onClick={() => removeDeliverable(i)}>×</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="deal-detail-actions">
                  <button type="button" className="btn btn-ghost" disabled={status === "submitting"} onClick={() => handleSave(false)}>
                    {status === "submitting" ? "Saving…" : "Save changes"}
                  </button>
                  <button type="button" className="btn btn-rose" disabled={status === "submitting"} onClick={() => handleSave(true)}>
                    {status === "submitting" ? "Sending…" : "Send offer to creator"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="deal-summary-grid">
                  <div><span>Amount</span><strong>${deal.finalAmount?.toLocaleString()}</strong></div>
                  <div><span>Deadline</span><strong>{formatDate(deal.deadline)}</strong></div>
                  <div><span>Free revisions</span><strong>{deal.freeRevisions}</strong></div>
                </div>

                {deal.deliverables?.length > 0 && (
                  <div className="field-group">
                    <label className="field-label">Deliverables</label>
                    <ul className="detail-list">
                      {deal.deliverables.map((d, i) => (
                        <li key={i}>{d.title} × {d.quantity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {isWaitingOnCreator && (
                  <div className="alert alert-success" style={{ marginTop: 20 }}>Offer sent — waiting for the creator to respond.</div>
                )}

                {canRespond && (
                  <div className="deal-detail-actions">
                    <button type="button" className="btn btn-rose" disabled={status === "submitting"} onClick={handleAccept}>
                      {status === "submitting" ? "Working…" : "Accept offer"}
                    </button>
                    <button type="button" className="btn btn-danger" disabled={status === "submitting"} onClick={handleDecline}>
                      Decline
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
