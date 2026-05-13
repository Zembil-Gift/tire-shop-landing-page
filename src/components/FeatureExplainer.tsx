import { Link } from "react-router-dom";

type FeatureType = "quote" | "track-status";

type FeatureExplainerProps = {
    feature: FeatureType;
    showButton?: boolean;
};

const featureContent: Record<
    FeatureType,
    { title: string; description: string; buttonLabel: string; to: string }
> = {
    quote: {
        title: "Get Tire Quote",
        description:
            "Share your vehicle and tire needs, and our team will send you pricing options for budget, mid-range, or premium tires.",
        buttonLabel: "Get Free Quote",
        to: "/get-quote",
    },
    "track-status": {
        title: "Track Work Status",
        description:
            "Check your current work order updates anytime using your phone number or work order number, including estimated completion and shop notes.",
        buttonLabel: "Track Your Service",
        to: "/track-status",
    },
};

export default function FeatureExplainer({ feature, showButton = true }: FeatureExplainerProps) {
    const content = featureContent[feature];

    return (
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">{content.title}</h3>
                    <p className="mt-2 max-w-2xl text-slate-600">{content.description}</p>
                </div>
                {showButton && (
                    <Link
                        to={content.to}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                        {content.buttonLabel}
                    </Link>
                )}
            </div>
        </div>
    );
}
