import { CalendarDays, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { business } from "../data/siteData";
import tireBanner from "../assets/tire-banner.png";

export default function Home() {
    return (
        <section id="home" className="relative min-h-[90vh] overflow-hidden text-white">
            {/* Banner Image */}
            <img
                src={tireBanner}
                alt="Putnam Tire Auto and Repair shop banner"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Content */}
            <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="mb-4 inline-flex rounded-full bg-red-600/90 px-4 py-2 text-sm font-semibold text-white">
                        Fast local tire repair and replacement
                    </p>

                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
                        Putnam Tire Auto & Repair
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-100 sm:text-xl">
                        New tires, tire rotation, flat repair, wheel alignment, and reliable
                        auto repair service.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <a
                            href={`tel:${business.phone}`}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-4 font-semibold text-white shadow-lg hover:bg-red-700"
                        >
                            <Phone size={20} />
                            Call Now
                        </a>

                        <Link
                            to="/schedule"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-slate-950 shadow-lg hover:bg-slate-100"
                        >
                            <CalendarDays size={20} />
                            Schedule Appointment
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
