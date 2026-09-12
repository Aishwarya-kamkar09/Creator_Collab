import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getAllBrands } from "../../services/brand.service";
import "../../styles/profile-shared.css";

export default function BrandsDirectory() {
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      try {
        const res = await getAllBrands({ page, limit: 9, companyName: search || undefined });
        if (cancelled) return;
        setBrands(res.data.brands);
        setPagination(res.data.pagination);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [page, search]);

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">Discover</p>
          <h1>Find brands</h1>
          <p className="lead">Browse brand profiles or search by company name.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container">
          <div className="directory-filters">
            <input
              className="field-input directory-search"
              placeholder="Search by company name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {status === "loading" && (
            <div className="state-block">
              <div className="spinner" />
              <p>Loading brands…</p>
            </div>
          )}

          {status === "ready" && brands.length === 0 && (
            <div className="state-block">
              <h3>No brands found</h3>
              <p>Try a different search term.</p>
            </div>
          )}

          {status === "ready" && brands.length > 0 && (
            <>
              <div className="directory-grid">
                {brands.map((b) => (
                  <Link key={b._id} to={`/discover/brands/${b._id}`} className="card directory-card">
                    <div className="profile-card-avatar">{b.companyName.charAt(0).toUpperCase()}</div>
                    <h3>{b.companyName}</h3>
                    <div className="sub">{b.industry}</div>
                    {b.averageRating > 0 && <div className="review-row-stars">{b.averageRating} ★ ({b.totalReviews})</div>}
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
