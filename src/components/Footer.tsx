import { business } from "../data/siteData";

export default function Footer() {
    return (
        <footer className="bg-slate-950 py-10 text-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
                <p className="font-bold">{business.name}</p>

                <p className="text-sm text-slate-400">
                    © 2026 {business.name}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}