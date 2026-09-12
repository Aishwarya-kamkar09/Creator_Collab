import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="section steps" id="how">

      <div className="wrap">

        <div className="section-head reveal">

          <p className="eyebrow">How it works</p>

          <h2>Three steps to a first collaboration</h2>

          <p>
            Built for brands who want results without the back-and-forth,
            and creators who want to be found for the right reasons.
          </p>

        </div>

        <div className="steps-inner reveal">

          <div className="vine" aria-hidden="true"></div>

          <div className="step">

            <div className="step-num">01</div>

            <div className="step-body">

              <h3>Post a campaign</h3>

              <p>
                Describe your brand, budget, and the kind of creator you're
                picturing. It's live in minutes.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-num">02</div>

            <div className="step-body">

              <h3>Review applications</h3>

              <p>
                Creators apply with rates and portfolios attached — compare
                them side by side and shortlist a few.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-num">03</div>

            <div className="step-body">

              <h3>Approve &amp; pay</h3>

              <p>
                Approve the deliverables you love and release payment from
                escrow — done, no invoices to chase.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;