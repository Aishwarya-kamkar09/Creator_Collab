import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { useAuth } from "../../context/AuthContext";
import {
  getMyBrandProfile,
  createBrandProfile,
  updateMyBrandProfile,
} from "../../services/brand.service";
import "../../styles/profile-shared.css";

const SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"];

export default function BrandProfile() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("loading");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyBrandProfile();
        const p = res.data;
        setCompanyName(p.companyName || "");
        setIndustry(p.industry || "");
        setDescription(p.description || "");
        setWebsite(p.website || "");
        setLocation(p.location || "");
        setCompanySize(p.companySize || "1-10");
        setLinkedin(p.socialLinks?.linkedin || "");
        setInstagram(p.socialLinks?.instagram || "");
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

    if (!companyName || !industry) {
      setStatus("error");
      setError("Please fill in your company name and industry.");
      return;
    }

    const payload = {
      companyName,
      industry,
      description,
      website,
      location,
      companySize,
      socialLinks: { linkedin, instagram, twitter, website },
    };

    try {
      setStatus("submitting");
      if (mode === "create") {
        await createBrandProfile(payload);
      } else {
        await updateMyBrandProfile(payload);
      }
      await refreshUser();
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
          <h1>{mode === "create" ? "Tell creators about your brand" : "Your brand profile"}</h1>
          <p className="lead">This is what creators see before applying to your campaigns.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container profile-layout">
          <form className="card profile-form" onSubmit={handleSubmit} noValidate>
            {status === "error" && <div className="alert alert-error">{error}</div>}

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Company name</label>
                <input className="field-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
              </div>
              <div className="field-group">
                <label className="field-label">Industry</label>
                <input className="field-input" placeholder="e.g. Skincare" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">About your brand</label>
              <textarea className="field-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Website</label>
                <input className="field-input" placeholder="https://…" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="field-group">
                <label className="field-label">Location</label>
                <input className="field-input" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Company size</label>
              <div className="chip-select">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${companySize === s ? "active" : ""}`}
                    onClick={() => setCompanySize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Social links</label>
              <div className="field-row" style={{ marginBottom: 12 }}>
                <input className="field-input" placeholder="LinkedIn URL" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                <input className="field-input" placeholder="Instagram URL" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
              <input className="field-input" placeholder="X / Twitter URL" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
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
