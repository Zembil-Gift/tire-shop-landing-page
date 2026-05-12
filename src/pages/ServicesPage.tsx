import { useState } from "react";
import Booking from "../components/Booking";
import Services from "../components/Services";

export default function ServicesPage() {
    const [showBooking, setShowBooking] = useState(false);

    return (
        <div>
            <Services />
            <section className="pb-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        onClick={() => setShowBooking(true)}
                        className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        Schedule Appointment
                    </button>
                </div>
            </section>
            {showBooking && <Booking />}
        </div>
    );
}
