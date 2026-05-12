import { useState } from "react";
import type { FormEvent } from "react";
import StatusBadge from "./StatusBadge";
import { checkStatus } from "../services/workOrderService";
import type { WorkOrderStatus } from "../types/workOrder.types";

type SearchMode = "phone" | "workOrderNumber";

export default function TrackStatus() {
    const [mode, setMode] = useState<SearchMode>("phone");
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusResult, setStatusResult] = useState<WorkOrderStatus | null>(null);
    const [notFound, setNotFound] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        setNotFound(false);
        setStatusResult(null);

        try {
            const payload = mode === "phone" ? { phone: value } : { workOrderNumber: value };
            const result = await checkStatus(payload);
            if (!result) {
                setNotFound(true);
                return;
            }
            setStatusResult(result);
        } catch {
            setError("No work order found for the information provided.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section id="track-status" className="py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-red-600">Track Work Status</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Check your service status</h2>
                </div>

                <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                    <div className="mb-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setMode("phone")}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "phone" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                            Search by Phone
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("workOrderNumber")}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "workOrderNumber" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"}`}
                        >
                            Search by Work Order Number
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
                        <input
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder={mode === "phone" ? "Enter phone number" : "Enter work order number"}
                            required
                        />
                        <button
                            type="submit"
                            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                            disabled={isLoading}
                        >
                            {isLoading ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
                    {notFound && <p className="mt-4 text-sm font-medium text-slate-700">No work order found for the information provided.</p>}

                    {statusResult && (
                        <div className="mt-6 grid gap-4 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
                            <p>
                                <span className="font-semibold">Work Order #:</span> {statusResult.workOrderNumber}
                            </p>
                            <p>
                                <span className="font-semibold">Service Type:</span> {statusResult.serviceType}
                            </p>
                            <p>
                                <span className="font-semibold">Status:</span> <StatusBadge status={statusResult.status} />
                            </p>
                            <p>
                                <span className="font-semibold">Estimated Completion:</span>{" "}
                                {statusResult.estimatedCompletionTime ?? "Not available"}
                            </p>
                            <p className="sm:col-span-2">
                                <span className="font-semibold">Staff Note:</span> {statusResult.staffNote ?? "No notes yet"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
