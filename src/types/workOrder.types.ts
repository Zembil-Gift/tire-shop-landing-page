export type WorkOrderStatus = {
    workOrderNumber: string;
    serviceType: string;
    status: string;
    estimatedCompletionTime?: string | null;
    staffNote?: string | null;
    customerName?: string;
};

export type WorkOrder = {
    id: number;
    workOrderNumber: string;
    customerName: string;
    phone: string;
    email?: string;
    serviceType: string;
    status: string;
    estimatedCompletionTime?: string | null;
    staffNote?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

export type CreateAdminWorkOrderPayload = {
    appointmentId: number;
    serviceType: string;
    status: string;
    estimatedCompletionTime: string | null;
    staffNote: string | null;
};

export type UpdateWorkOrderStatusPayload = {
    status: string;
    estimatedCompletionTime: string | null;
    staffNote: string | null;
};
