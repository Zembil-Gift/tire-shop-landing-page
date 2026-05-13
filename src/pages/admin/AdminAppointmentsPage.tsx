import { useEffect, useState } from "react";
import AdminShell from "./AdminShell";
import { getAdminAppointments } from "../../services/appointmentService";
import type { AdminAppointment } from "../../types/appointment.types";
import { formatDateForDisplay, formatDateTimeForDisplay, formatTimeForDisplay } from "../../utils/dateTime";

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadAppointments() {
            try {
                const data = await getAdminAppointments();
                setAppointments(data);
            } catch {
                setError("Could not load appointments.");
            }
        }

        void loadAppointments();
    }, []);

    return (
        <AdminShell title="Appointments">
            {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-slate-600">
                            <th className="px-2 py-2">ID</th>
                            <th className="px-2 py-2">Customer</th>
                            <th className="px-2 py-2">Phone</th>
                            <th className="px-2 py-2">Email</th>
                            <th className="px-2 py-2">Service Type</th>
                            <th className="px-2 py-2">Date</th>
                            <th className="px-2 py-2">Time</th>
                            <th className="px-2 py-2">Vehicle</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={String(appointment.id)} className="border-b">
                                <td className="px-2 py-2">{appointment.id}</td>
                                <td className="px-2 py-2">{appointment.customerName}</td>
                                <td className="px-2 py-2">{appointment.phone}</td>
                                <td className="px-2 py-2">{appointment.email ?? "-"}</td>
                                <td className="px-2 py-2">{appointment.serviceType}</td>
                                <td className="px-2 py-2">{formatDateForDisplay(appointment.date)}</td>
                                <td className="px-2 py-2">{formatTimeForDisplay(appointment.time)}</td>
                                <td className="px-2 py-2">{appointment.vehicle}</td>
                                <td className="px-2 py-2">{appointment.status}</td>
                                <td className="px-2 py-2">{formatDateTimeForDisplay(appointment.submittedAt)}</td>
                            </tr>
                        ))}
                        {!appointments.length && (
                            <tr>
                                <td className="px-2 py-4 text-slate-500" colSpan={10}>
                                    No appointments available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminShell>
    );
}
