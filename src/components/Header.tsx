import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { business } from "../data/siteData";
import tireBanner from "../assets/tire-logo.png";

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = [
        { label: "Home", href: "#home" },
        { label: "Services", href: "#services" },
        { label: "About", href: "#about" },
        { label: "Reviews", href: "#reviews" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <a href="#home" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                        <img
                            src={tireBanner}
                            alt="Putnam Tire Auto and Repair shop banner"

                        />
                    </div>

                    <span className="text-xl font-bold tracking-tight">
            {business.name}
          </span>
                </a>

                <nav className="hidden items-center gap-8 md:flex">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium hover:text-red-600"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <a
                    href={`tel:${business.phone}`}
                    className="hidden items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-red-700 md:inline-flex"
                >
                    <Phone size={16} />
                    Call Now
                </a>

                <button
                    type="button"
                    className="rounded-lg p-2 md:hidden"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                >
                    {mobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t bg-white px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-4">
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                            >
                                {link.label}
                            </a>
                        ))}

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