import Header from "../components/Header";
import Home from "../components/Home";
import Services from "../components/Services";
import About from "../components/About";
import Booking from "../components/Booking";
import Reviews from "../components/Reviews";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function TireShopLandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />

            <main>
                <Home />
                <Services />
                <About />
                <Booking />
                <Reviews />
                <Contact />
            </main>

            <Footer />
        </div>
    );
}