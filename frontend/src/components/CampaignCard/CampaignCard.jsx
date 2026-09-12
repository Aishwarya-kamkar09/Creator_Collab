import { Link } from "react-router-dom";
import "./CampaignCard.css";

function formatBudget(budget) {
  if (!budget) return "—";
  return `$${budget.min?.toLocaleString()} – $${budget.max?.toLocaleString()}`;
}

function daysLeft(deadline) {
  const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Deadline passed";
  if (diff === 0) return "Due today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}

export default function CampaignCard({ campaign }) {
  const brandName = campaign.brand?.user?.name || campaign.brand?.companyName || "A brand";
  const initials = brandName.trim().charAt(0).toUpperCase();
  const statusClass =
    campaign.status === "Open" ? "badge-open" :
    campaign.status === "Completed" ? "badge-completed" : "badge-closed";

  return (
    <Link to={`/campaigns/${campaign._id}`} state={{ campaign }} className="campaign-card">
      <div className="campaign-card-top">
        <span className={`badge ${statusClass}`}>{campaign.status}</span>
        <span className="campaign-card-deadline">{daysLeft(campaign.deadline)}</span>
      </div>

      <h3 className="campaign-card-title">{campaign.title}</h3>

      <p className="campaign-card-desc">{campaign.description}</p>

      <div className="campaign-card-platforms">
        {(campaign.platforms || []).slice(0, 4).map((p) => (
          <span key={p} className="badge badge-neutral">{p}</span>
        ))}
      </div>

      <div className="campaign-card-footer">
        <div className="campaign-card-brand">
          <span className="campaign-card-avatar">{initials}</span>
          <span>{brandName}</span>
        </div>
        <div className="campaign-card-budget">{formatBudget(campaign.budget)}</div>
      </div>

      <div className="campaign-card-meta">
        <span>{campaign.category}</span>
        <span>·</span>
        <span>{campaign.applicantsCount || 0} applicant{campaign.applicantsCount === 1 ? "" : "s"}</span>
      </div>
    </Link>
  );
}
