import { Clock, MapPin, Phone } from "lucide-react";
import { business } from "../data/siteData";

export default function Contact() {
    return (
        <section id="contact" className="py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                    <p className="font-semibold text-red-600">Contact Us</p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Visit our shop or call today
                    </h2>

                    <div className="mt-8 space-y-4 text-slate-700">
                        <p className="flex items-center gap-3">
                            <Phone className="text-red-600" />
                            {business.displayPhone}
                        </p>

                        <p className="flex items-center gap-3">
                            <MapPin className="text-red-600" />
                            {business.address}
                        </p>

                        <p className="flex items-center gap-3">
                            <Clock className="text-red-600" />
                            {business.hours}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <a
                            href="tel:+16013661886"
                            className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            Call Now
                        </a>
                        <a
                            href={business.googleBusinessProfile}
                            className="font-semibold text-red-600 hover:text-red-700"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Google Business Profile
                        </a>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl bg-slate-200 shadow-sm ring-1 ring-slate-200">
                    <iframe
                        title="Shop location map"
                        className="h-80 w-full border-0"
                        loading="lazy"
                        src="https://www.google.com/maps?q=4879%20N%20State%20St%2C%20Jackson%2C%20MS%2039206&output=embed"
                    />
                </div>
            </div>
        </section>
    );
}
