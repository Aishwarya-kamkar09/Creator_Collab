import "./Features.css";

function Features() {
  return (
    <section className="section features" id="features">
      <div className="wrap">

        <div className="section-head reveal">
          <p className="eyebrow">The workflow</p>

          <h2>
            Everything in one workflow
          </h2>

          <p>
            From discovery to deliverables, Oraino keeps every step
            of a collaboration in one calm, connected place.
          </p>
        </div>

        <div className="feature-grid reveal">

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </div>

            <h3>Discover creators</h3>

            <p>
              Search by niche, platform, or budget to find creators
              whose audience actually fits your brand.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M3 9h18" />
                <path d="M8 3v4" />
                <path d="M16 3v4" />
              </svg>
            </div>

            <h3>Launch campaigns</h3>

            <p>
              Set your brief, budget, and timeline once — then review
              applications as they come in.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-4a8.4 8.4 0 0 1-1-4A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
              </svg>
            </div>

            <h3>Message &amp; negotiate</h3>

            <p>
              Talk terms directly with creators or brands, right
              inside the deal — no email back-and-forth.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>

            <h3>Track deliverables</h3>

            <p>
              See every collaboration's timeline, revisions, and
              status without digging through old threads.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <rect x="2" y="6" width="20" height="13" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h4" />
              </svg>
            </div>

            <h3>Pay securely</h3>

            <p>
              Funds sit in escrow until deliverables are approved,
              so both sides collaborate with confidence.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#54463A"
                strokeWidth="2"
              >
                <path d="M3 3v18h18" />
                <path d="M7 15l4-6 4 3 5-8" />
              </svg>
            </div>

            <h3>Analyze performance</h3>

            <p>
              Compare campaign results side by side and reinvest
              in the partnerships that grow fastest.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Features;
