import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import CreatorMarquee from "../../components/CreatorMarquee/CreatorMarquee";
import TrustedBrands from "../../components/TrustedBrands/TrustedBrands";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import Stats from "../../components/Stats/Stats";
import CTA from "../../components/CTA/CTA";
import Footer from "../../components/Footer/Footer";
import { useScrollReveal } from "../../hooks/useScrollReveal";

import "./Home.css";

function Home() {
    useScrollReveal();

    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <CreatorMarquee />
                <TrustedBrands />
                <Features />
                <HowItWorks />
                <Stats />
                <CTA />
            </main>

            <Footer />
        </>
    );
}

export default Home;