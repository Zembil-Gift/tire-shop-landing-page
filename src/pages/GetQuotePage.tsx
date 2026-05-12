import FeatureExplainer from "../components/FeatureExplainer";
import Quote from "../components/Quote";

export default function GetQuotePage() {
    return (
        <div>
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <FeatureExplainer feature="quote" showButton={false} />
                </div>
            </section>
            <Quote />
        </div>
    );
}
