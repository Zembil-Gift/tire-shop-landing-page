import { CheckCircle } from "lucide-react";
import { services } from "../data/siteData";

export default function Services() {
    return (
        <section id="services" className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <p className="font-semibold text-red-600">Our Services</p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything your tires need in one place
                    </h2>

                    <p className="mt-4 text-slate-600">
                        From emergency flat repair to new tire installation, we make the
                        process simple and fast.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service}
                            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <CheckCircle size={24} />
                            </div>

                            <h3 className="text-xl font-bold">{service}</h3>

                            <p className="mt-3 text-slate-600">
                                Professional, affordable, and completed with care by experienced
                                technicians.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
