import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getBrandById } from "../../services/brand.service";
import { getUserReviews } from "../../services/review.service";
import "../../styles/profile-shared.css";
import "../CampaignDetail/CampaignDetail.css";

export default function BrandPublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getBrandById(id);
        if (cancelled) return;
        setProfile(res.data);
        setStatus("ready");
        try {
          const reviewsRes = await getUserReviews(res.data.user._id);
          if (!cancelled) setReviews(reviewsRes.data);
        } catch {
          // reviews are optional
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}><div className="spinner" /><p>Loading profile…</p></div>
      </div>
    );
  }

  if (status === "error" || !profile) {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <h3>Brand not found</h3>
          <Link to="/discover/brands" className="btn btn-primary">Browse brands</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav />
      <main className="page-body" style={{ paddingTop: 40 }}>
        <div className="app-container public-profile-layout">
          <div className="card profile-card">
            <div className="profile-card-avatar">{profile.companyName.charAt(0).toUpperCase()}</div>
            <h2>{profile.companyName}</h2>
            <div className="handle">{profile.industry}</div>
            {profile.averageRating > 0 && (
              <div className="rating">{profile.averageRating} ★ ({profile.totalReviews} reviews)</div>
            )}
            <div className="summary-row"><span>Location</span><strong>{profile.location || "—"}</strong></div>
            <div className="summary-row"><span>Company size</span><strong>{profile.companySize}</strong></div>

            {(profile.socialLinks?.linkedin || profile.socialLinks?.instagram || profile.socialLinks?.twitter || profile.website) && (
              <div className="profile-card-links">
                {profile.website && <a href={profile.website} target="_blank" rel="noreferrer">Website</a>}
                {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {profile.socialLinks?.instagram && <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">X / Twitter</a>}
              </div>
            )}
          </div>

          <div>
            <section className="profile-main-section">
              <h3>About</h3>
              <p>{profile.description || "This brand hasn't added a description yet."}</p>
            </section>

            <section className="profile-main-section">
              <h3>Reviews</h3>
              {reviews.length === 0 && <p>No reviews yet.</p>}
              {reviews.map((r) => (
                <div key={r._id} className="review-row">
                  <div className="review-row-top">
                    <span className="review-row-name">{r.reviewer?.name || "Anonymous"}</span>
                    <span className="review-row-stars">{r.rating} ★</span>
                  </div>
                  <p>{r.comment}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
