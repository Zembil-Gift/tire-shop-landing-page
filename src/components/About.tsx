import { Clock, MapPin, ShieldCheck, Star } from "lucide-react";

export default function About() {
    const features = [
        {
            icon: <Clock className="text-red-600" />,
            title: "Quick Turnaround",
            text: "Many services are completed the same day.",
        },
        {
            icon: <ShieldCheck className="text-red-600" />,
            title: "Trusted Technicians",
            text: "Experienced team focused on safety and quality.",
        },
        {
            icon: <MapPin className="text-red-600" />,
            title: "Local Shop",
            text: "Easy to find, easy to call, and easy to book.",
        },
        {
            icon: <Star className="text-red-600" />,
            title: "Fair Pricing",
            text: "Clear prices before we start the work.",
        },
    ];

    return (
        <section id="about" className="bg-white py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                    <p className="font-semibold text-red-600">About Us</p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Fast service, honest prices, and quality work
                    </h2>

                    <p className="mt-5 text-slate-600">
                        Our goal is to get you back on the road safely. We explain the
                        problem clearly, recommend the right solution, and complete the work
                        quickly.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"
                        >
                            {feature.icon}

                            <h3 className="mt-4 font-bold">{feature.title}</h3>

                            <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}