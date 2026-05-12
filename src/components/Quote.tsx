import { useState } from "react";
import type { FormEvent } from "react";
import { tireTypeOptions } from "../data/siteData";
import { submitQuote } from "../services/quoteService";
import type { PreferredTireType } from "../types/quote.types";

type QuoteFormState = {
    fullName: string;
    phone: string;
    email: string;
    vehicleYear: string;
    vehicleMake: string;
    vehicleModel: string;
    tireSize: string;
    quantity: string;
    preferredTireType: PreferredTireType | "";
    message: string;
};

const initialState: QuoteFormState = {
    fullName: "",
    phone: "",
    email: "",
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    tireSize: "",
    quantity: "",
    preferredTireType: "",
    message: "",
};

export default function Quote() {
    const [form, setForm] = useState<QuoteFormState>(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function isEmailValid(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isPhoneValid(phone: string) {
        return phone.replace(/\D/g, "").length >= 10;
    }

    function isPreferredTireType(value: string): value is PreferredTireType {
        return tireTypeOptions.some((option) => option.value === value);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        setError(null);

        if (!isEmailValid(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!isPhoneValid(form.phone)) {
            setError("Please enter a valid phone number.");
            return;
        }

        if (!form.preferredTireType) {
            setError("Please select a tire type.");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitQuote({
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                vehicleYear: Number(form.vehicleYear),
                vehicleMake: form.vehicleMake.trim(),
                vehicleModel: form.vehicleModel.trim(),
                tireSize: form.tireSize.trim(),
                quantity: Number(form.quantity),
                preferredTireType: form.preferredTireType,
                message: form.message.trim() || undefined,
            });
            setMessage("Your quote request was submitted successfully.");
            setForm(initialState);
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
                window.gtag("event", "conversion", { send_to: "AW-CONFIG/QUOTE_SUBMIT" });
            }
        } catch {
            setError("We could not submit your quote. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="quote" className="bg-white py-20">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="font-semibold text-red-600">Get Tire Quote</p>
                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Request a tire quote</h2>
                </div>

                <form className="mt-10 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input
                            value={form.fullName}
                            onChange={(event) => updateField("fullName", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Full name"
                            required
                        />
                        <input
                            value={form.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Phone number"
                            required
                        />
                        <input
                            type="email"
                            value={form.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Email address"
                            required
                        />
                        <input
                            type="number"
                            value={form.vehicleYear}
                            onChange={(event) => updateField("vehicleYear", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Vehicle year"
                            required
                        />
                        <input
                            value={form.vehicleMake}
                            onChange={(event) => updateField("vehicleMake", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Vehicle make"
                            required
                        />
                        <input
                            value={form.vehicleModel}
                            onChange={(event) => updateField("vehicleModel", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Vehicle model"
                            required
                        />
                        <input
                            value={form.tireSize}
                            onChange={(event) => updateField("tireSize", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Tire size"
                            required
                        />
                        <input
                            type="number"
                            min={1}
                            value={form.quantity}
                            onChange={(event) => updateField("quantity", event.target.value)}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Quantity needed"
                            required
                        />
                        <select
                            value={form.preferredTireType}
                            onChange={(event) => {
                                const value = event.target.value;
                                updateField("preferredTireType", isPreferredTireType(value) ? value : "");
                            }}
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600 sm:col-span-2"
                            required
                        >
                            <option value="" disabled>
                                Preferred tire type
                            </option>
                            {tireTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <textarea
                        value={form.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        className="mt-4 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                        placeholder="Additional message"
                    />

                    {message && <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>}
                    {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-full bg-red-600 px-6 py-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Quote Request"}
                    </button>
                </form>
            </div>
        </section>
    );
}
