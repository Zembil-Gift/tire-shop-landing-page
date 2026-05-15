import { api } from "./api";
import type { AdminAppointment, AppointmentPayload } from "../types/appointment.types";

export async function submitAppointment(data: AppointmentPayload): Promise<void> {
    await api.post("/api/appointments", data);
}

export async function getAdminAppointments(): Promise<AdminAppointment[]> {
    const response = await api.get<AdminAppointment[]>("/api/admin/appointments");
    return response.data.map((appointment) => ({
        ...appointment,
        date: appointment.date ?? appointment.appointmentDate ?? "-",
        time: appointment.time ?? appointment.appointmentTime ?? "-",
        vehicle: appointment.vehicle ?? appointment.vehicleDetails ?? "-",
        submittedAt: appointment.submittedAt ?? appointment.createdAt ?? "-",
    }));
}

export async function getAppointmentsWithoutWorkOrder(): Promise<AdminAppointment[]> {
    const response = await api.get<AdminAppointment[]>("/api/admin/appointments/without-work-order");
    return response.data.map((appointment) => ({
        ...appointment,
        date: appointment.date ?? appointment.appointmentDate ?? "-",
        time: appointment.time ?? appointment.appointmentTime ?? "-",
        vehicle: appointment.vehicle ?? appointment.vehicleDetails ?? "-",
        submittedAt: appointment.submittedAt ?? appointment.createdAt ?? "-",
    }));
}
