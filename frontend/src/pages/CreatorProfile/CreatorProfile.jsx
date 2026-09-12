import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import {
  getMyCreatorProfile,
  createCreatorProfile,
  updateMyCreatorProfile,
} from "../../services/creator.service";
import "../../styles/profile-shared.css";

const CATEGORIES = [
  "Technology", "Fashion", "Gaming", "Fitness", "Education",
  "Travel", "Lifestyle", "Food", "Music", "Comedy", "Photography", "Other",
];

function TagEditor({ items, setItems, placeholder }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    setItems([...items, v]);
    setDraft("");
  };
  return (
    <div>
      <div className="list-row-input">
        <input
          className="field-input"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
        />
        <button type="button" className="icon-btn" onClick={add}>+</button>
      </div>
      {items.length > 0 && (
        <div className="chip-select" style={{ marginTop: 4 }}>
          {items.map((item, i) => (
            <span key={i} className="chip active" style={{ cursor: "default" }}>
              {item}
              <button
                type="button"
                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                style={{ marginLeft: 8, color: "var(--paper)" }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreatorProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("loading"); // loading | create | edit
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("Other");
  const [location, setLocation] = useState("");
  const [pricing, setPricing] = useState("");
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyCreatorProfile();
        const p = res.data;
        setUsername(p.username || "");
        setBio(p.bio || "");
        setCategory(p.category || "Other");
        setLocation(p.location || "");
        setPricing(p.pricing || "");
        setLanguages(p.languages || []);
        setSkills(p.skills || []);
        setInstagram(p.socialLinks?.instagram || "");
        setYoutube(p.socialLinks?.youtube || "");
        setLinkedin(p.socialLinks?.linkedin || "");
        setTwitter(p.socialLinks?.twitter || "");
        setMode("edit");
      } catch {
        setMode("create");
      }
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username) {
      setStatus("error");
      setError("Please choose a username.");
      return;
    }

    const payload = {
      username,
      bio,
      category,
      location,
      pricing: pricing ? Number(pricing) : 0,
      languages,
      skills,
      socialLinks: { instagram, youtube, linkedin, twitter },
    };

    try {
      setStatus("submitting");
      if (mode === "create") {
        await createCreatorProfile(payload);
      } else {
        await updateMyCreatorProfile(payload);
      }
      await refreshUser();
      setStatus("success");
      navigate("/dashboard");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't save your profile. Please try again.");
    }
  }

  if (mode === "loading") {
    return (
      <div className="app-shell">
        <AppNav />
        <div className="state-block" style={{ minHeight: "60vh" }}>
          <div className="spinner" />
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">{mode === "create" ? "Set up your profile" : "Edit your profile"}</p>
          <h1>{mode === "create" ? "Tell brands who you are" : "Your creator profile"}</h1>
          <p className="lead">This is what brands see when you apply to a campaign or they discover you.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container profile-layout">
          <form className="card profile-form" onSubmit={handleSubmit} noValidate>
            {status === "error" && <div className="alert alert-error">{error}</div>}

            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                className="field-input"
                placeholder="e.g. jane_creates"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="field-hint">Your public profile will live at /creators/{username || "your-username"}</p>
            </div>

            <div className="field-group">
              <label className="field-label">Bio</label>
              <textarea
                className="field-textarea"
                placeholder="Tell brands about your content and audience…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={500}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Category</label>
              <div className="chip-select">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${category === c ? "active" : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" placeholder="e.g. Bengaluru, IN" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Starting price ($/post)</label>
                <input type="number" min="0" className="field-input" placeholder="e.g. 150" value={pricing} onChange={(e) => setPricing(e.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Languages</label>
              <TagEditor items={languages} setItems={setLanguages} placeholder="e.g. English" />
            </div>

            <div className="field-group">
              <label className="field-label">Skills</label>
              <TagEditor items={skills} setItems={setSkills} placeholder="e.g. Video editing" />
            </div>

            <div className="field-group">
              <label className="field-label">Social links</label>
              <div className="field-row" style={{ marginBottom: 12 }}>
                <input className="field-input" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                <input className="field-input" placeholder="YouTube URL" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
              </div>
              <div className="field-row">
                <input className="field-input" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                <input className="field-input" placeholder="X / Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-rose btn-block" disabled={status === "submitting"}>
              {status === "submitting" ? "Saving…" : mode === "create" ? "Create profile" : "Save changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
