import "./Hero.css";

function Hero() {
    return (
        <section className="hero">

            {/* Decorative background blooms */}
            <div className="blooms" aria-hidden="true">

                <div className="bloom bloom-1">
                    <svg viewBox="0 0 400 400">
                        <path
                            fill="#F0B8B8"
                            d="M200 20c60 0 100 60 130 110s30 110-20 150-120 40-170 0-70-100-40-160S140 20 200 20Z"
                            opacity="0.55"
                        />
                    </svg>
                </div>

                <div className="bloom bloom-2">
                    <svg viewBox="0 0 400 400">
                        <path
                            fill="#A2AE9D"
                            d="M190 30c70-10 130 40 150 100s0 130-60 160-140 10-170-40-20-140 20-180S150 36 190 30Z"
                            opacity="0.5"
                        />
                    </svg>
                </div>

                <div className="bloom bloom-3">
                    <svg viewBox="0 0 400 400">
                        <circle
                            cx="200"
                            cy="200"
                            r="180"
                            fill="#C75F71"
                            opacity="0.3"
                        />
                    </svg>
                </div>

            </div>


            <div className="hero-inner">

                {/* Hero Content */}
                <div className="hero-copy">

                    <p className="eyebrow">
                        Influencer marketing, cultivated
                    </p>

                    <h1>
                        Grow real partnerships, from first message to{" "}
                        <span className="display-italic">
                            final payment.
                        </span>
                    </h1>

                    <p className="lede">
                        Oraino is the one place to find creators, plant a
                        campaign, and watch the collaboration bloom — with
                        secure escrow payments built in from the start.
                    </p>


                    {/* Search */}
                    <div className="search-panel">

                        <div className="search-select">

                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#54463A"
                                strokeWidth="2"
                            >
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="5"
                                />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                />

                                <circle
                                    cx="17.5"
                                    cy="6.5"
                                    r="1"
                                />
                            </svg>

                            Instagram

                        </div>


                        <input
                            className="search-input"
                            type="text"
                            placeholder="Search creators by niche, topic, or keyword..."
                        />


                        <button className="search-btn">

                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#fff"
                                strokeWidth="2.4"
                            >
                                <circle
                                    cx="11"
                                    cy="11"
                                    r="7"
                                />

                                <path d="M21 21l-4.3-4.3" />
                            </svg>

                            Search

                        </button>

                    </div>


                    {/* Search filters */}
                    <div className="chips">

                        <span className="chip">
                            🌱 Rising Stars
                        </span>

                        <span className="chip">
                            📈 Most Viewed
                        </span>

                        <span className="chip">
                            💐 Under $250
                        </span>

                        <span className="chip">
                            Fashion
                        </span>

                        <span className="chip">
                            Beauty
                        </span>

                        <span className="chip">
                            Health &amp; Fitness
                        </span>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;

