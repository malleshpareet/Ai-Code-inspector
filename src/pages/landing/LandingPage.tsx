import Navbar from "./Navbar";
import Hero from "./Hero";
import TrustedBy from "./TrustedBy";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import Footer from "./Footer";

interface LandingPageProps {
    onSignUpClick: () => void;
    onLoginClick: () => void;
    isLoggedIn: boolean;
    onLogout: () => void;
    onNavigateToBilling: () => void;
    onNavigateToDashboard: () => void;
}

export default function LandingPage({
    onSignUpClick,
    onLoginClick,
    isLoggedIn,
    onLogout,
    onNavigateToBilling,
    onNavigateToDashboard
}: LandingPageProps) {
    return (
        <div className="min-h-screen bg-[#0b1120] text-white font-sans selection:bg-blue-500/30">
            <Navbar
                onSignUpClick={onSignUpClick}
                onLoginClick={onLoginClick}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
                onDashboardClick={onNavigateToDashboard}
            />
            <Hero onSignUpClick={onSignUpClick} />
            <TrustedBy />
            <Features />
            <Testimonials />
            <Pricing onExplorePlansClick={onNavigateToBilling} />
            <Footer />
        </div>
    );
}
