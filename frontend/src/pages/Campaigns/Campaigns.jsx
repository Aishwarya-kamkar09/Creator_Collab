import { useEffect, useState } from "react";
import AppNav from "../../components/AppNav/AppNav";
import CampaignCard from "../../components/CampaignCard/CampaignCard";
import { getAllCampaigns } from "../../services/campaign.service";
import "./Campaigns.css";

const CATEGORIES = [
  "Technology", "Fashion", "Gaming", "Fitness", "Education",
  "Travel", "Lifestyle", "Food", "Music", "Comedy", "Photography", "Other",
];

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "X", "Facebook", "Blog"];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setStatus("loading");
      try {
        const res = await getAllCampaigns({ page, limit: 9, category, platform, status: "Open" });
        if (cancelled) return;
        setCampaigns(res.data.campaigns);
        setPagination(res.data.pagination);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => { cancelled = true; };
  }, [page, category, platform]);

  const handleFilter = (setter, value) => {
    setter((prev) => (prev === value ? "" : value));
    setPage(1);
  };

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Open campaigns</p>
          <div className="page-hero-row">
            <div>
              <h1>Find your next collaboration</h1>
              <p className="lead">Browse open briefs from brands looking for creators like you, and apply directly.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          <div className="campaigns-filters">
            <div className="filter-group">
              <span className="filter-label">Category</span>
              <div className="chip-select">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${category === c ? "active" : ""}`}
                    onClick={() => handleFilter(setCategory, c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">Platform</span>
              <div className="chip-select">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`chip ${platform === p ? "active" : ""}`}
                    onClick={() => handleFilter(setPlatform, p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading campaigns…</p>
            </div>
          )}

          {status === "error" && (
            <div className="state-block">
              <h3>Couldn&apos;t load campaigns</h3>
              <p>Something went wrong while reaching the server. Please try again shortly.</p>
            </div>
          )}

          {status === "ready" && campaigns.length === 0 && (
            <div className="state-block">
              <h3>No campaigns match those filters</h3>
              <p>Try a different category or platform, or check back soon — new briefs are added regularly.</p>
            </div>
          )}

          {status === "ready" && campaigns.length > 0 && (
            <>
              <div className="campaigns-grid">
                {campaigns.map((c) => (
                  <CampaignCard key={c._id} campaign={c} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
