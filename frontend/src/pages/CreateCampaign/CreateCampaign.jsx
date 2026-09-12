import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../../components/AppNav/AppNav";
import { createCampaign } from "../../services/campaign.service";
import "./CreateCampaign.css";

const CATEGORIES = [
  "Technology", "Fashion", "Gaming", "Fitness", "Education",
  "Travel", "Lifestyle", "Food", "Music", "Comedy", "Photography", "Other",
];

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "X", "Facebook", "Blog"];

function ListEditor({ label, placeholder, items, setItems }) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    setItems([...items, value]);
    setDraft("");
  };

  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <div className="list-row-input">
        <input
          className="field-input"
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="icon-btn" onClick={add} aria-label={`Add ${label}`}>+</button>
      </div>
      {items.length > 0 && (
        <ul className="editable-list">
          {items.map((item, i) => (
            <li key={i}>
              <span>{item}</span>
              <button type="button" onClick={() => remove(i)} aria-label="Remove">×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [location, setLocation] = useState("Remote");
  const [deadline, setDeadline] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [deliverables, setDeliverables] = useState([]);

  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [error, setError] = useState("");

  const togglePlatform = (p) => {
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title || !description || !category || !budgetMin || !budgetMax || !deadline) {
      setStatus("error");
      setError("Please fill in title, description, category, budget, and deadline.");
      return;
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      setStatus("error");
      setError("Minimum budget can't be greater than the maximum.");
      return;
    }

    try {
      setStatus("submitting");
      const res = await createCampaign({
        title,
        description,
        category,
        platforms,
        budget: { min: Number(budgetMin), max: Number(budgetMax) },
        location,
        deadline,
        requirements,
        deliverables,
      });
      navigate(`/campaigns/${res.data._id}/applications`);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Couldn't create the campaign. Please try again.");
    }
  }

  return (
    <div className="app-shell">
      <AppNav />

      <header className="page-hero">
        <div className="app-container">
          <p className="eyebrow">New campaign</p>
          <h1>Create a campaign</h1>
          <p className="lead">Describe the collaboration you're looking for and start receiving applications from creators.</p>
        </div>
      </header>

      <main className="page-body">
        <div className="app-container create-campaign-layout">
          <form className="card create-campaign-form" onSubmit={handleSubmit} noValidate>
            {status === "error" && <div className="alert alert-error">{error}</div>}

            <div className="field-group">
              <label className="field-label">Campaign title</label>
              <input
                className="field-input"
                placeholder="e.g. Summer skincare launch on Instagram"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Description</label>
              <textarea
                className="field-textarea"
                placeholder="What are you looking for? Share tone, goals, and any brand guidelines."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
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

            <div className="field-group">
              <label className="field-label">Platforms</label>
              <div className="chip-select">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`chip ${platforms.includes(p) ? "active" : ""}`}
                    onClick={() => togglePlatform(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Minimum budget ($)</label>
                <input
                  type="number"
                  min="0"
                  className="field-input"
                  placeholder="e.g. 200"
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label className="field-label">Maximum budget ($)</label>
                <input
                  type="number"
                  min="0"
                  className="field-input"
                  placeholder="e.g. 600"
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label">Location</label>
                <input
                  className="field-input"
                  placeholder="Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="field-group">
                <label className="field-label">Application deadline</label>
                <input
                  type="date"
                  className="field-input"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>

            <ListEditor
              label="Requirements"
              placeholder="e.g. 10k+ followers, US-based"
              items={requirements}
              setItems={setRequirements}
            />

            <ListEditor
              label="Deliverables"
              placeholder="e.g. 1 Reel, 3 Stories"
              items={deliverables}
              setItems={setDeliverables}
            />

            <button type="submit" className="btn btn-rose btn-block" disabled={status === "submitting"}>
              {status === "submitting" ? "Publishing…" : "Publish campaign"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
