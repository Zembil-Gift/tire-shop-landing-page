import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import AutocompleteField from "./AutocompleteField";
import { getSuggestedMakes, getSuggestedModels, resolveMakeFromModel } from "../data/popularVehicles";
import { appointmentServiceOptions } from "../data/siteData";
import { submitAppointment } from "../services/appointmentService";

type BookingFormState = {
    fullName: string;
    phone: string;
    email: string;
    vehicleMake: string;
    vehicleModel: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    notes: string;
};

type ValidationErrors = {
    fullName?: string;
    phone?: string;
    email?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    serviceType?: string;
    preferredDate?: string;
    preferredTime?: string;
};

const initialState: BookingFormState = {
    fullName: "",
    phone: "",
    email: "",
    vehicleMake: "",
    vehicleModel: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
};

const PHONE_FORMAT_MESSAGE = "Accepted formats: (601) 366-1886 or 601-366-1886";

export default function Booking() {
    const [form, setForm] = useState<BookingFormState>(initialState);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const makeSuggestions = useMemo(() => getSuggestedMakes(form.vehicleMake), [form.vehicleMake]);
    const modelSuggestions = useMemo(
        () => getSuggestedModels(form.vehicleMake, form.vehicleModel),
        [form.vehicleMake, form.vehicleModel],
    );

    const vehicleDetails = useMemo(
        () => `${form.vehicleMake} ${form.vehicleModel}`.trim(),
        [form.vehicleMake, form.vehicleModel],
    );

    function updateField<K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) {
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

    function isDateTimeInPast(date: string, time: string): boolean {
        if (!date || !time) return false;

        const appointmentDateTime = new Date(`${date}T${time}`);
        const now = new Date();

        return appointmentDateTime < now;
    }

    function validateField<K extends keyof BookingFormState>(field: K, value: BookingFormState[K]) {
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
        } else if ((field === "preferredDate" || field === "preferredTime") && (form.preferredDate && form.preferredTime)) {
            const dateToCheck = field === "preferredDate" ? (value as string) : form.preferredDate;
            const timeToCheck = field === "preferredTime" ? (value as string) : form.preferredTime;

            if (isDateTimeInPast(dateToCheck, timeToCheck)) {
                newErrors.preferredDate = "Appointment date and time cannot be in the past.";
                newErrors.preferredTime = "Appointment date and time cannot be in the past.";
            } else {
                delete newErrors.preferredDate;
                delete newErrors.preferredTime;
            }
        }

        setValidationErrors(newErrors);
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

        if (!form.vehicleMake.trim()) {
            newErrors.vehicleMake = "Vehicle make is required.";
        }

        if (!form.vehicleModel.trim()) {
            newErrors.vehicleModel = "Vehicle model is required.";
        }

        if (!form.serviceType.trim()) {
            newErrors.serviceType = "Service type is required.";
        }

        if (!form.preferredDate) {
            newErrors.preferredDate = "Appointment date is required.";
        }

        if (!form.preferredTime) {
            newErrors.preferredTime = "Appointment time is required.";
        }

        if (form.preferredDate && form.preferredTime && isDateTimeInPast(form.preferredDate, form.preferredTime)) {
            newErrors.preferredDate = "Appointment date and time cannot be in the past.";
            newErrors.preferredTime = "Appointment date and time cannot be in the past.";
        }

        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            setError("Please fix the errors below before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitAppointment({
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
                email: form.email.trim(),
                serviceType: form.serviceType,
                preferredDate: form.preferredDate,
                preferredTime: form.preferredTime,
                vehicleDetails,
                notes: form.notes.trim() || undefined,
            });
            setMessage("Appointment request submitted. We will contact you shortly.");
            setForm(initialState);
            setValidationErrors({});
            if (typeof window !== "undefined" && typeof window.gtag === "function") {
                window.gtag("event", "conversion", { send_to: "AW-CONFIG/APPOINTMENT_SUBMIT" });
            }
        } catch {
            setError("We could not submit your appointment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section id="booking" className="py-20">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div>
                    <p className="font-semibold text-red-600">Book Service</p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        Request an appointment
                    </h2>

                    <p className="mt-5 text-slate-600">
                        Fill out the form and our team will contact you to confirm your
                        appointment.
                    </p>
                </div>

                <form
                    className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
                    onSubmit={handleSubmit}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col">
                            <span className="mb-1 text-sm font-medium text-slate-700">
                                Full name <span className="text-red-600">*</span>
                            </span>
                            <input
                                value={form.fullName}
                                onChange={(event) => updateField("fullName", event.target.value)}
                                className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                                    validationErrors.fullName ? "border-red-500" : "border-slate-300"
                                }`}
                                placeholder="e.g., John Doe"
                                required
                            />
                            {validationErrors.fullName && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.fullName}</p>
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
                                    validationErrors.phone ? "border-red-500" : "border-slate-300"
                                }`}
                                placeholder="e.g., +1 (555) 123-4567"
                                required
                            />
                            {validationErrors.phone && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.phone}</p>
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
                                    validationErrors.email ? "border-red-500" : "border-slate-300"
                                }`}
                                placeholder="e.g., john@example.com"
                                required
                            />
                            {validationErrors.email && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.email}</p>
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
                                Service needed <span className="text-red-600">*</span>
                            </span>
                            <select
                                value={form.serviceType}
                                onChange={(event) => updateField("serviceType", event.target.value)}
                                className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                                    validationErrors.serviceType ? "border-red-500" : "border-slate-300"
                                }`}
                                required
                            >
                                <option value="" disabled>
                                    Select service type
                                </option>
                                {appointmentServiceOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.serviceType && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.serviceType}</p>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="mb-1 text-sm font-medium text-slate-700">
                                Appointment date <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="date"
                                value={form.preferredDate}
                                onChange={(event) => updateField("preferredDate", event.target.value)}
                                className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                                    validationErrors.preferredDate ? "border-red-500" : "border-slate-300"
                                }`}
                                required
                            />
                            {validationErrors.preferredDate && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.preferredDate}</p>
                            )}
                        </label>

                        <label className="flex flex-col">
                            <span className="mb-1 text-sm font-medium text-slate-700">
                                Appointment time <span className="text-red-600">*</span>
                            </span>
                            <input
                                type="time"
                                value={form.preferredTime}
                                onChange={(event) => updateField("preferredTime", event.target.value)}
                                className={`rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                                    validationErrors.preferredTime ? "border-red-500" : "border-slate-300"
                                }`}
                                required
                            />
                            {validationErrors.preferredTime && (
                                <p className="mt-1 text-xs font-medium text-red-600">{validationErrors.preferredTime}</p>
                            )}
                        </label>
                    </div>

                    <label className="mt-4 flex flex-col">
                        <span className="mb-1 text-sm font-medium text-slate-700">
                            Additional notes
                        </span>
                        <textarea
                            value={form.notes}
                            onChange={(event) => updateField("notes", event.target.value)}
                            className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="e.g., Please call 30 min before arrival"
                        />
                    </label>

                    {message && <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>}
                    {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-full bg-red-600 px-6 py-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Request Appointment"}
                    </button>
                </form>
            </div>
        </section>
    );
}
