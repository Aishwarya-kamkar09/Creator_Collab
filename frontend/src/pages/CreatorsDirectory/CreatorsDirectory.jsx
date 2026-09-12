import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getAllCreators } from "../../services/creator.service";
import "../../styles/profile-shared.css";

const CATEGORIES = [
  "Technology", "Fashion", "Gaming", "Fitness", "Education",
  "Travel", "Lifestyle", "Food", "Music", "Comedy", "Photography", "Other",
];

export default function CreatorsDirectory() {
  const [creators, setCreators] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const res = await getAllCreators({ page, limit: 9, category, username: search || undefined });
        if (cancelled) return;
        setCreators(res.data.creators);
        setPagination(res.data.pagination);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [page, category, search]);

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Discover</p>
          <h1>Find creators</h1>
          <p className="lead">Browse creator profiles by category or search by username.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          <div className="directory-filters">
            <input
              className="field-input directory-search"
              placeholder="Search by username…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="chip-select" style={{ marginBottom: 30 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${category === c ? "active" : ""}`}
                onClick={() => { setCategory(category === c ? "" : c); setPage(1); }}
              >
                {c}
              </button>
            ))}
          </div>

          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading creators…</p>
            </div>
          )}

          {status === "ready" && creators.length === 0 && (
            <div className="state-block">
              <h3>No creators found</h3>
              <p>Try a different category or search term.</p>
            </div>
          )}

          {status === "ready" && creators.length > 0 && (
            <>
              <div className="directory-grid">
                {creators.map((c) => (
                  <Link key={c._id} to={`/discover/creators/${c.username}`} className="card directory-card">
                    <div className="profile-card-avatar">{(c.user?.name || c.username).charAt(0).toUpperCase()}</div>
                    <h3>{c.user?.name || c.username}</h3>
                    <div className="sub">@{c.username} · {c.category}</div>
                    {c.averageRating > 0 && <div className="review-row-stars">{c.averageRating} ★ ({c.totalReviews})</div>}
                  </Link>
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="pagination">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={pagination.page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
                  <span>Page {pagination.page} of {pagination.pages}</span>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={pagination.page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
