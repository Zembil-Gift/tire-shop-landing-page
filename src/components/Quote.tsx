import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import AutocompleteField from "./AutocompleteField";
import { getSuggestedMakes, getSuggestedModels, resolveMakeFromModel } from "../data/popularVehicles";
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

type ValidationErrors = {
    fullName?: string;
    phone?: string;
    email?: string;
    vehicleYear?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    tireSize?: string;
    quantity?: string;
    preferredTireType?: string;
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

const PHONE_FORMAT_MESSAGE = "Accepted formats: (601) 366-1886 or 601-366-1886";

export default function Quote() {
    const [form, setForm] = useState<QuoteFormState>(initialState);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const makeSuggestions = useMemo(() => getSuggestedMakes(form.vehicleMake), [form.vehicleMake]);
    const modelSuggestions = useMemo(
        () => getSuggestedModels(form.vehicleMake, form.vehicleModel),
        [form.vehicleMake, form.vehicleModel],
    );

    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    }

    function updateVehicleMake(value: string) {
        setForm((prev) => {
            const detectedMakeForModel = resolveMakeFromModel(prev.vehicleModel);
            const isConflictingModel =
                Boolean(detectedMakeForModel) &&
                Boolean(value.trim()) &&
                detectedMakeForModel?.toLowerCase() !== value.trim().toLowerCase();

            return {
                ...prev,
                vehicleMake: value,
                vehicleModel: isConflictingModel ? "" : prev.vehicleModel,
            };
        });
        validateField("vehicleMake", value);
    }

    function updateVehicleModel(value: string) {
        const detectedMake = resolveMakeFromModel(value);
        setForm((prev) => ({
            ...prev,
            vehicleModel: value,
            vehicleMake: detectedMake ?? prev.vehicleMake,
        }));
        validateField("vehicleModel", value);
    }

    function isEmailValid(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isPhoneValid(phone: string): boolean {
        const digits = phone.replace(/\D/g, "");
        return digits.length >= 10;
    }

    function validateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        const newErrors: ValidationErrors = { ...validationErrors };

        if (field === "phone" && value) {
            if (!isPhoneValid(value as string)) {
                newErrors.phone = PHONE_FORMAT_MESSAGE;
            } else {
                delete newErrors.phone;
            }
        } else if (field === "email" && value) {
            if (!isEmailValid(value as string)) {
                newErrors.email = "Please enter a valid email address.";
            } else {
                delete newErrors.email;
            }
        } else if (field === "quantity" && value) {
            const qty = Number(value);
            if (isNaN(qty) || qty < 1) {
                newErrors.quantity = "Quantity must be at least 1.";
            } else {
                delete newErrors.quantity;
            }
        }

        setValidationErrors(newErrors);
    }

    function isPreferredTireType(value: string): value is PreferredTireType {
        return tireTypeOptions.some((option) => option.value === value);
    }

    function handleClear() {
        setForm(initialState);
        setValidationErrors({});
        setMessage(null);
        setError(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        setError(null);
        const newErrors: ValidationErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!isPhoneValid(form.phone)) {
            newErrors.phone = PHONE_FORMAT_MESSAGE;
        }

        if (!form.email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!isEmailValid(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!form.vehicleYear) {
            newErrors.vehicleYear = "Vehicle year is required.";
        }

        if (!form.vehicleMake.trim()) {
            newErrors.vehicleMake = "Vehicle make is required.";
        }

        if (!form.vehicleModel.trim()) {
            newErrors.vehicleModel = "Vehicle model is required.";
        }

        if (!form.tireSize.trim()) {
            newErrors.tireSize = "Tire size is required.";
        }

        if (!form.quantity) {
            newErrors.quantity = "Quantity is required.";
        } else if (Number(form.quantity) < 1) {
            newErrors.quantity = "Quantity must be at least 1.";
        }

        if (!form.preferredTireType) {
            newErrors.preferredTireType = "Please select a tire type.";
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            setError("Please fix the errors below before submitting.");
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
                preferredTireType: form.preferredTireType as PreferredTireType,
                message: form.message.trim() || undefined,
            });
            setMessage("Your quote request was submitted successfully.");
            setForm(initialState);
            setValidationErrors({});
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
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Request a tire quote
            </h2>
          </div>

          <form
            className="mt-10 rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-200"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Full name <span className="text-red-600">*</span>
                </span>
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.fullName
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., John Doe"
                  required
                />
                {validationErrors.fullName && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.fullName}
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Phone number <span className="text-red-600">*</span>
                </span>
                <input
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.phone
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., +1 (555) 123-4567"
                  required
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.phone}
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Email address <span className="text-red-600">*</span>
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.email
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., john@example.com"
                  required
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </label>

              <AutocompleteField
                label="Vehicle make"
                required
                value={form.vehicleMake}
                onChange={updateVehicleMake}
                placeholder="e.g., Toyota"
                suggestions={makeSuggestions}
                error={validationErrors.vehicleMake}
              />
              <AutocompleteField
                label="Vehicle model"
                required
                value={form.vehicleModel}
                onChange={updateVehicleModel}
                placeholder="e.g., Camry"
                suggestions={modelSuggestions}
                error={validationErrors.vehicleModel}
              />

              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Vehicle year <span className="text-red-600">*</span>
                </span>
                <input
                  type="number"
                  value={form.vehicleYear}
                  onChange={(event) =>
                    updateField("vehicleYear", event.target.value)
                  }
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.vehicleYear
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., 2023"
                  required
                />
                {validationErrors.vehicleYear && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.vehicleYear}
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Tire size <span className="text-red-600">*</span>
                </span>
                <input
                  value={form.tireSize}
                  onChange={(event) =>
                    updateField("tireSize", event.target.value)
                  }
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.tireSize
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., 215/55R17"
                  required
                />
                {validationErrors.tireSize && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.tireSize}
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Quantity needed <span className="text-red-600">*</span>
                </span>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) =>
                    updateField("quantity", event.target.value)
                  }
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.quantity
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  placeholder="e.g., 4"
                  required
                />
                {validationErrors.quantity && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.quantity}
                  </p>
                )}
              </label>
              <label className="flex flex-col sm:col-span-2">
                <span className="mb-1 text-sm font-medium text-slate-700">
                  Preferred tire type <span className="text-red-600">*</span>
                </span>
                <select
                  value={form.preferredTireType}
                  onChange={(event) => {
                    const value = event.target.value;
                    updateField(
                      "preferredTireType",
                      isPreferredTireType(value) ? value : ""
                    );
                  }}
                  className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                    validationErrors.preferredTireType
                      ? "border-red-500"
                      : "border-slate-300"
                  }`}
                  required
                >
                  <option value="" disabled>
                    Select tire type
                  </option>
                  {tireTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.preferredTireType && (
                  <p className="mt-1 text-xs font-medium text-red-600">
                    {validationErrors.preferredTireType}
                  </p>
                )}
              </label>
            </div>

            <label className="mt-4 flex flex-col">
              <span className="mb-1 text-sm font-medium text-slate-700">
                Additional message
              </span>
              <textarea
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                placeholder="e.g., I need the tires delivered by weekend"
              />
            </label>

            {message && (
              <p className="mt-4 text-sm font-medium text-emerald-700">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
            )}

            <div className="mx-auto mt-6 grid w-full max-w-lg grid-cols-2 gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleClear}
                disabled={isSubmitting}
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </section>
    );
}
