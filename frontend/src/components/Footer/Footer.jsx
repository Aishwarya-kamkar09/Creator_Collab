import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <a href="#" className="logo">
              <svg
                className="logo-mark"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M16 4C10 4 5 9 5 16c0 5 3 8 7 8 3 0 4-2 4-4 0-1.5-1-2-1-3.5C15 14 17 12 19 12c3 0 5 2 5 5 0 6-4 9-8 11 8-1 13-6 13-13 0-6-5-11-13-11Z"
                  fill="#F0B8B8"
                />
                <circle
                  cx="12"
                  cy="17"
                  r="2.4"
                  fill="#A2AE9D"
                />
              </svg>

              Oraino
            </a>

            <p>
              The one place to find creators, run campaigns, and pay securely —
              from first search to final payment.
            </p>
          </div>

          {/* Creators */}
          <div className="footer-col">
            <h4>For Creators</h4>

            <a href="#">Browse campaigns</a>
            <a href="#">Applications</a>
            <a href="#">Wallet &amp; payouts</a>
            <a href="#">Build your profile</a>
          </div>

          {/* Brands */}
          <div className="footer-col">
            <h4>For Brands</h4>

            <a href="#">Find creators</a>
            <a href="#">Create a campaign</a>
            <a href="#">Escrow &amp; payments</a>
            <a href="#">Campaign analytics</a>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h4>Company</h4>

            <a href="#">About us</a>
            <a href="#">Pricing</a>
            <a href="#">Contact us</a>
            <a href="#">Log in</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <span>© 2026 Oraino. All rights reserved.</span>

          <div className="socials">
            {/* Instagram */}
            <a
              href="#"
              className="social-btn"
              aria-label="Instagram"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBF6F0"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>

            {/* X */}
            <a
              href="#"
              className="social-btn"
              aria-label="X"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBF6F0"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M4 4l16 16" />
                <path d="M20 4L4 20" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              className="social-btn"
              aria-label="LinkedIn"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FBF6F0"
                strokeWidth="2"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="3"
                />
                <path d="M8 11v5" />
                <path d="M8 8v.01" />
                <path d="M12 16v-3a2 2 0 0 1 4 0v3" />
                <path d="M12 13v3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
