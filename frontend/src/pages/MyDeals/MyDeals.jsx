import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import { getMyDeals } from "../../services/deal.service";
import "./MyDeals.css";

function statusInfo(deal) {
  if (deal.status === "Cancelled") return { label: "Declined", cls: "badge-rejected" };
  if (deal.status === "Confirmed") return { label: "Confirmed", cls: "badge-accepted" };
  if (deal.brandAccepted) return { label: "Awaiting creator", cls: "badge-pending" };
  return { label: "Negotiating", cls: "badge-neutral" };
}

export default function MyDeals() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyDeals();
        if (!cancelled) {
          setDeals(res.data);
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
          <p className="eyebrow">Deals</p>
          <h1>Your deals</h1>
          <p className="lead">{isBrand ? "Finalize terms and send offers to accepted creators." : "Review and respond to offers from brands."}</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading your deals…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load your deals</h3>
              <p>Please refresh the page to try again.</p>
            </div>
          )}

          {status === "ready" && deals.length === 0 && (
            <div className="state-block">
              <h3>No deals yet</h3>
              <p>{isBrand ? "Accept an application and create a deal to see it here." : "Once a brand sends you an offer, it'll show up here."}</p>
            </div>
          )}

          {status === "ready" && deals.length > 0 && (
            <div className="my-deals-list">
              {deals.map((deal) => {
                const other = isBrand ? deal.creator?.user?.name : deal.brand?.user?.name;
                const info = statusInfo(deal);
                return (
                  <Link key={deal._id} to={`/deals/${deal._id}`} state={{ deal }} className="card deal-row">
                    <div>
                      <div className="deal-row-top">
                        <span className={`badge ${info.cls}`}>{info.label}</span>
                      </div>
                      <div className="deal-row-title">{deal.campaign?.title || "Campaign"}</div>
                      <div className="deal-row-sub">with {other || "—"}</div>
                    </div>
                    <div className="deal-row-amount">${deal.finalAmount?.toLocaleString()}</div>
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
