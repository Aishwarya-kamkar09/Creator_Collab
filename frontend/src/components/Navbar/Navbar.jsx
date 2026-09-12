import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Add shadow/border to navbar when scrolling
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close mobile menu when a link is clicked
    const handleMenuLinkClick = () => {
        setMenuOpen(false);
    };

    // Toggle mobile menu
    const handleBurgerClick = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <nav className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">

            <div className="nav-inner">

                {/* Logo */}
                <a href="/" className="logo">
                    <svg
                        className="logo-mark"
                        viewBox="0 0 32 32"
                        fill="none"
                    >
                        <path
                            d="M16 4C10 4 5 9 5 16c0 5 3 8 7 8 3 0 4-2 4-4 0-1.5-1-2-1-3.5C15 14 17 12 19 12c3 0 5 2 5 5 0 6-4 9-8 11 8-1 13-6 13-13 0-6-5-11-13-11Z"
                            fill="#C75F71"
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

                {/* Desktop Navigation */}
                <div className="nav-links">

                    <a href="#features">
                        Features
                    </a>

                    <a href="#brands">
                        For Brands
                    </a>

                    <a href="#how">
                        How It Works
                    </a>

                    <a href="#pricing">
                        Pricing
                    </a>

                    <a href="#creators">
                        For Creators
                    </a>

                </div>

                {/* Desktop Actions + Mobile Burger */}
                <div className="nav-actions">

                    <a
                        href="/login"
                        className="btn btn-ghost"
                    >
                        Log in
                    </a>

                    <a
                        href="/register"
                        className="btn btn-primary"
                    >
                        Sign Up
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        className="nav-burger"
                        id="navBurger"
                        aria-label={
                            menuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={menuOpen}
                        onClick={handleBurgerClick}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2E2620"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                            <path d="M3 6h18" />
                            <path d="M3 12h18" />
                            <path d="M3 18h18" />
                        </svg>
                    </button>

                </div>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`mobile-menu ${
                    menuOpen ? "open" : ""
                }`}
                id="mobileMenu"
            >

                <a
                    href="#features"
                    onClick={handleMenuLinkClick}
                >
                    Features
                </a>

                <a
                    href="#brands"
                    onClick={handleMenuLinkClick}
                >
                    For Brands
                </a>

                <a
                    href="#how"
                    onClick={handleMenuLinkClick}
                >
                    How It Works
                </a>

                <a
                    href="#pricing"
                    onClick={handleMenuLinkClick}
                >
                    Pricing
                </a>

                <a
                    href="#creators"
                    onClick={handleMenuLinkClick}
                >
                    For Creators
                </a>

                <a
                    href="/login"
                    className="btn btn-ghost"
                    onClick={handleMenuLinkClick}
                >
                    Log in
                </a>

                <a
                    href="/register"
                    className="btn btn-primary"
                    onClick={handleMenuLinkClick}
                >
                    Sign Up
                </a>

            </div>

        </nav>
    );
}

export default Navbar;