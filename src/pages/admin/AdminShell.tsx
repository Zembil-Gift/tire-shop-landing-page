import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type AdminShellProps = {
    title: string;
    children: ReactNode;
};

const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/quotes", label: "Quotes" },
    { to: "/admin/appointments", label: "Appointments" },
    { to: "/admin/work-orders", label: "Work Orders" },
];

export default function AdminShell({ title, children }: AdminShellProps) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-neutral-950 px-4 py-4 text-white sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-[96rem] flex-wrap items-center justify-between gap-3">
                    <h1 className="text-lg font-bold">Putnam Tire Admin</h1>
                    <button
                        type="button"
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                        onClick={() => {
                            localStorage.removeItem("accessToken");
                            localStorage.removeItem("refreshToken");
                            window.location.href = "/admin/login";
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[96rem] px-4 py-6 sm:px-6 lg:px-8">
                <nav className="mb-6 flex flex-wrap gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                location.pathname === link.to
                                    ? "bg-red-600 text-white"
                                    : "bg-white text-slate-700 ring-1 ring-slate-200"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <section className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    <div className="mt-5">{children}</div>
                </section>
            </div>
        </div>
    );
}
