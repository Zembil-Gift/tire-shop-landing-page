import { Star } from "lucide-react";
import { reviews } from "../data/siteData";

export default function Reviews() {
    return (
        <section id="reviews" className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-red-600">Customer Reviews</p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Drivers trust our service
                    </h2>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {reviews.map((review) => (
                        <div
                            key={review.name}
                            className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200"
                        >
                            <div className="flex gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <Star key={item} size={18} fill="currentColor" />
                                ))}
                            </div>

                            <p className="mt-4 text-slate-700">“{review.text}”</p>

                            <p className="mt-5 font-bold">{review.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}