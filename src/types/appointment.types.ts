export type AppointmentPayload = {
    fullName: string;
    phone: string;
    email: string;
    serviceType: string;
    preferredDate: string;
    preferredTime: string;
    vehicleDetails: string;
    notes?: string;
};

export type AdminAppointment = {
    id: number | string;
    customerName: string;
    phone: string;
    email?: string;
    serviceType: string;
    date?: string;
    time?: string;
    vehicle?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    vehicleDetails?: string;
    status: string;
    submittedAt?: string;
    createdAt?: string;
};
