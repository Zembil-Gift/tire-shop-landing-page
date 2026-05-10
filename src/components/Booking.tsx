export default function Booking() {
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

                <form className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Full name"
                        />

                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Phone number"
                        />

                        <input
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Vehicle type"
                        />

                        <select
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Service needed
                            </option>
                            <option>Flat Tire Repair</option>
                            <option>New Tires</option>
                            <option>Used Tires</option>
                            <option>Wheel Balancing</option>
                            <option>Roadside Assistance</option>
                        </select>

                        <input
                            type="date"
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                        />

                        <input
                            type="time"
                            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                        />
                    </div>

                    <textarea
                        className="mt-4 min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-600"
                        placeholder="Message"
                    />

                    <button
                        type="button"
                        className="mt-4 w-full rounded-full bg-red-600 px-6 py-4 font-semibold text-white hover:bg-red-700"
                    >
                        Request Appointment
                    </button>
                </form>
            </div>
        </section>
    );
}