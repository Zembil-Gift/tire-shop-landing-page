import { useEffect, useState } from "react";
import AdminShell from "./AdminShell";
import { getAdminQuotes } from "../../services/quoteService";
import type { AdminQuote } from "../../types/quote.types";

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<AdminQuote[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadQuotes() {
            try {
                const data = await getAdminQuotes();
                setQuotes(data);
            } catch {
                setError("Could not load quotes.");
            }
        }

        void loadQuotes();
    }, []);

    return (
        <AdminShell title="Quote Requests">
            {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-slate-600">
                            <th className="px-2 py-2">ID</th>
                            <th className="px-2 py-2">Customer</th>
                            <th className="px-2 py-2">Phone</th>
                            <th className="px-2 py-2">Vehicle</th>
                            <th className="px-2 py-2">Tire Size</th>
                            <th className="px-2 py-2">Qty</th>
                            <th className="px-2 py-2">Tire Type</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={String(quote.id)} className="border-b">
                                <td className="px-2 py-2">{quote.id}</td>
                                <td className="px-2 py-2">{quote.customerName}</td>
                                <td className="px-2 py-2">{quote.phone}</td>
                                <td className="px-2 py-2">{quote.vehicle}</td>
                                <td className="px-2 py-2">{quote.tireSize}</td>
                                <td className="px-2 py-2">{quote.quantity}</td>
                                <td className="px-2 py-2">{quote.preferredTireType}</td>
                                <td className="px-2 py-2">{quote.status}</td>
                                <td className="px-2 py-2">{quote.submittedAt}</td>
                            </tr>
                        ))}
                        {!quotes.length && (
                            <tr>
                                <td className="px-2 py-4 text-slate-500" colSpan={9}>
                                    No quotes available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminShell>
    );
}
