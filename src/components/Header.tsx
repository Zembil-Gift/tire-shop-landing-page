import {useState} from "react";
import { Menu, Phone, X, MapPin } from "lucide-react";
import {Link, NavLink} from "react-router-dom";
import {business} from "../data/siteData";
import tireBanner from "../assets/tire-logo.png";

declare global {
    interface Window {
        gtag_report_conversion?: (url?: string) => boolean;
    }
}

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        {label: "Home", href: "/"},
        {label: "Services", href: "/services"},
        {label: "Get Quote", href: "/get-quote"},
        {label: "Track Status", href: "/track-status"},
        {label: "About", href: "/about"},
        {label: "Contact", href: "/contact"},
    ];

    const handleGetDirections = () => {
        const url =
            "https://www.google.com/maps/dir/?api=1&destination=4879+N+State+St,+Jackson,+MS+39206";

        if (window.gtag_report_conversion) {
            window.gtag_report_conversion(url);
        } else {
            window.location.href = url;
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-neutral-950/95 text-white shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full  text-white">
                        <img
                            src={tireBanner}
                            alt="Putnam Tire Auto and Repair shop banner"

                        />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-white">
            {business.name}
          </span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.href}
                            to={link.href}
                            className={({isActive}) =>
                                `text-sm font-medium transition hover:text-red-500 ${isActive ? "text-red-500" : "text-slate-200"}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="hidden items-center gap-3 md:flex">
                    <button
                        type="button"
                        onClick={handleGetDirections}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow hover:bg-slate-100"
                    >
                        <MapPin size={16}/>
                        Get Directions
                    </button>
                    <a
                        href={`tel:${business.phone}`}
                        className="hidden items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-700 md:inline-flex"
                    >
                        <Phone size={16}/>
                        Call Now
                    </a>
                </div>

                <button
                    type="button"
                    className="rounded-lg p-2 text-slate-100 md:hidden"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X/> : <Menu/>}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-4">
                        {links.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-slate-100 hover:text-red-500"
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setMobileOpen(false);
                                handleGetDirections();
                            }}
                            className="rounded-full bg-white px-5 py-3 text-center font-semibold text-neutral-950"
                        >
                            Get Directions
                        </button>
                        <a
                            href={`tel:${business.phone}`}
                            className="rounded-full bg-red-600 px-5 py-3 text-center font-semibold text-white"
                        >
                            Call Now
                        </a>
                    </nav>
                </div>
            )}
        </header>
    );
}
