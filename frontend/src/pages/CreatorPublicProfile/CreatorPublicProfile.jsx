import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { getCreatorByUsername } from "../../services/creator.service";
import { getUserReviews } from "../../services/review.service";
import "../../styles/profile-shared.css";
import "../CampaignDetail/CampaignDetail.css";

export default function CreatorPublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCreatorByUsername(username);
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
  }, [username]);

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
          <h3>Creator not found</h3>
          <Link to="/discover/creators" className="btn btn-primary">Browse creators</Link>
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
            <div className="profile-card-avatar">{(profile.user?.name || profile.username).charAt(0).toUpperCase()}</div>
            <h2>{profile.user?.name || profile.username}</h2>
            <div className="handle">@{profile.username} · {profile.category}</div>
            {profile.averageRating > 0 && (
              <div className="rating">{profile.averageRating} ★ ({profile.totalReviews} reviews)</div>
            )}
            <div className="summary-row"><span>Location</span><strong>{profile.location || "—"}</strong></div>
            <div className="summary-row"><span>Starting price</span><strong>{profile.pricing ? `$${profile.pricing}` : "—"}</strong></div>
            <div className="summary-row"><span>Followers</span><strong>{profile.followers?.toLocaleString() || 0}</strong></div>

            {(profile.socialLinks?.instagram || profile.socialLinks?.youtube || profile.socialLinks?.linkedin || profile.socialLinks?.twitter) && (
              <div className="profile-card-links">
                {profile.socialLinks.instagram && <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                {profile.socialLinks.youtube && <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer">YouTube</a>}
                {profile.socialLinks.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
                {profile.socialLinks.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer">X / Twitter</a>}
              </div>
            )}
          </div>

          <div>
            <section className="profile-main-section">
              <h3>About</h3>
              <p>{profile.bio || "This creator hasn't added a bio yet."}</p>
            </section>

            {profile.skills?.length > 0 && (
              <section className="profile-main-section">
                <h3>Skills</h3>
                <div className="campaign-card-platforms">
                  {profile.skills.map((s) => <span key={s} className="badge badge-neutral">{s}</span>)}
                </div>
              </section>
            )}

            {profile.languages?.length > 0 && (
              <section className="profile-main-section">
                <h3>Languages</h3>
                <div className="campaign-card-platforms">
                  {profile.languages.map((l) => <span key={l} className="badge badge-neutral">{l}</span>)}
                </div>
              </section>
            )}

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
