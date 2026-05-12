import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminShell from "./AdminShell";
import { getAdminQuotes } from "../../services/quoteService";
import { getAdminAppointments } from "../../services/appointmentService";
import { getAllWorkOrders } from "../../services/workOrderService";

type DashboardCounts = {
    quotes: number;
    appointments: number;
    workOrders: number;
};

export default function AdminDashboardPage() {
    const [counts, setCounts] = useState<DashboardCounts>({ quotes: 0, appointments: 0, workOrders: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [quotes, appointments, workOrders] = await Promise.all([
                    getAdminQuotes(),
                    getAdminAppointments(),
                    getAllWorkOrders(),
                ]);
                setCounts({ quotes: quotes.length, appointments: appointments.length, workOrders: workOrders.length });
            } catch {
                setError("Could not load dashboard stats.");
            }
        }

        void loadDashboard();
    }, []);

    const cards = [
        { label: "Total Quotes", count: counts.quotes, to: "/admin/quotes" },
        { label: "Total Appointments", count: counts.appointments, to: "/admin/appointments" },
        { label: "Active Work Orders", count: counts.workOrders, to: "/admin/work-orders" },
    ];

    return (
        <AdminShell title="Dashboard">
            {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
            <div className="grid gap-4 md:grid-cols-3">
                {cards.map((card) => (
                    <Link key={card.label} to={card.to} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200">
                        <p className="text-sm font-semibold text-slate-600">{card.label}</p>
                        <p className="mt-2 text-3xl font-bold text-slate-900">{card.count}</p>
                    </Link>
                ))}
            </div>
        </AdminShell>
    );
}
