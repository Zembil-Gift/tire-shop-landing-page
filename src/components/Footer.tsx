import { business } from "../data/siteData";
import { Link } from "react-router-dom";

export default function Footer() {
    const links = [
        { label: "Home", to: "/" },
        { label: "Services", to: "/services" },
        { label: "Get Quote", to: "/get-quote" },
        { label: "Schedule", to: "/schedule" },
        { label: "Track Status", to: "/track-status" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
    ];

    return (
        <footer className="bg-slate-950 py-10 text-white">
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
                <div>
                    <p className="font-bold">{business.name}</p>
                    <p className="mt-2 text-sm text-slate-400">{business.address}</p>
                    <a href="tel:+16013661886" className="mt-1 block text-sm text-slate-300">
                        {business.displayPhone}
                    </a>
                </div>

                <nav className="grid grid-cols-2 gap-2 text-sm">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} className="text-slate-300 hover:text-white">
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="space-y-2 text-sm text-slate-300 md:text-right">
                    <a href={business.googleBusinessProfile} target="_blank" rel="noreferrer" className="hover:text-white">
                        Google Business Profile
                    </a>
                    <p className="text-slate-400">© 2026 {business.name}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
