import { useEffect, useState } from "react";
import AdminShell from "./AdminShell";
import { getAdminQuotes, sendQuote } from "../../services/quoteService";
import type { AdminQuote } from "../../types/quote.types";
import { formatDateTimeForDisplay } from "../../utils/dateTime";

export default function AdminQuotesPage() {
    const [quotes, setQuotes] = useState<AdminQuote[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | string | null>(null);
    const [quotedPrice, setQuotedPrice] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [loading, setLoading] = useState(false);

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

    async function handleSendQuote() {
        if (!selectedQuoteId || !quotedPrice || !reason) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await sendQuote(selectedQuoteId, parseFloat(quotedPrice), reason);
            setQuotes(
                quotes.map((q) =>
                    q.id === selectedQuoteId
                        ? { ...q, quotedPrice: parseFloat(quotedPrice), quoteReason: reason }
                        : q
                )
            );
            setSelectedQuoteId(null);
            setQuotedPrice("");
            setReason("");
            setError(null);
        } catch {
            setError("Failed to send quote.");
        } finally {
            setLoading(false);
        }
    }

    return (
      <AdminShell title="Quote Requests">
        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-600">
                <th className="px-2 py-2">No.</th>
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Vehicle</th>
                <th className="px-2 py-2">Tire Size</th>
                <th className="px-2 py-2">Qty</th>
                <th className="px-2 py-2">Tire Type</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Submitted At</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote, index) => (
                <tr key={String(quote.id)} className="border-b">
                  <td className="px-2 py-2">{index + 1}</td>
                  <td className="px-2 py-2">{quote.customerName}</td>
                  <td className="px-2 py-2">{quote.phone}</td>
                  <td className="px-2 py-2">{quote.email ?? "-"}</td>
                  <td className="px-2 py-2">{quote.vehicle}</td>
                  <td className="px-2 py-2">{quote.tireSize}</td>
                  <td className="px-2 py-2">{quote.quantity}</td>
                  <td className="px-2 py-2">{quote.preferredTireType}</td>
                  <td className="px-2 py-2">{quote.status}</td>
                  <td className="px-2 py-2">
                    {formatDateTimeForDisplay(quote.submittedAt)}
                  </td>
                  <td className="px-2 py-2">
                    {quote.quotedPrice ? (
                      <div className="space-y-1">
                        <div className="font-semibold text-green-700">
                          Quoted Price: ${quote.quotedPrice}
                        </div>
                        {quote.quoteReason && (
                          <div className="text-xs text-slate-600">
                            {quote.quoteReason}
                          </div>
                        )}
                        {quote.quotedAt && (
                          <div className="text-xs text-slate-500">
                            {formatDateTimeForDisplay(quote.quotedAt)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedQuoteId(quote.id)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Send Quote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!quotes.length && (
                <tr>
                  <td className="px-2 py-4 text-slate-500" colSpan={11}>
                    No quotes available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedQuoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-bold">Send Quote</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Quoted Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    placeholder="e.g., 399.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                    placeholder="e.g., Includes installation and balancing"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setSelectedQuoteId(null);
                    setQuotedPrice("");
                    setReason("");
                  }}
                  className="rounded bg-slate-300 px-4 py-2 hover:bg-slate-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => void handleSendQuote()}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {loading ? "Sending..." : "Send Quote"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    );
}
