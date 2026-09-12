import "./Stats.css";

function Stats() {
  return (
    <section className="section stats-section">
      <div className="stats reveal">
        <div className="stat">
          <div className="num">42k+</div>
          <div className="lbl">Active creators</div>
        </div>

        <div className="stat">
          <div className="num">6.1k</div>
          <div className="lbl">Campaigns run</div>
        </div>

        <div className="stat">
          <div className="num">$18M</div>
          <div className="lbl">Paid out through escrow</div>
        </div>

        <div className="stat">
          <div className="num">3.2 days</div>
          <div className="lbl">Avg. time to first hire</div>
        </div>
      </div>
    </section>
  );
}

export default Stats;
