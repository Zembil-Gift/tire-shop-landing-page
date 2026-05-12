import FeatureExplainer from "../components/FeatureExplainer";
import TrackStatus from "../components/TrackStatus";

export default function TrackStatusPage() {
    return (
        <div>
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <FeatureExplainer feature="track-status" showButton={false} />
                </div>
            </section>
            <TrackStatus />
        </div>
    );
}
