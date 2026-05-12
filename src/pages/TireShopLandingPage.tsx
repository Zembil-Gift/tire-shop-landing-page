import Home from "../components/Home";
import Services from "../components/Services";
import About from "../components/About";
import Booking from "../components/Booking";
import Reviews from "../components/Reviews";
import Contact from "../components/Contact";
import FeatureExplainer from "../components/FeatureExplainer";

export default function TireShopLandingPage() {
    return (
        <div className="bg-slate-50 text-slate-900">
            <Home />
            <Services />
            <section className="py-20">
                <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
                    <FeatureExplainer feature="quote" />
                    <FeatureExplainer feature="track-status" />
                </div>
            </section>
            <Booking />
            <Reviews />
            <About />
            <Contact />
        </div>
    );
}
