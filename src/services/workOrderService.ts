import { api } from "./api";
import type {
    CreateAdminWorkOrderPayload,
    UpdateWorkOrderStatusPayload,
    WorkOrder,
    WorkOrderStatus,
} from "../types/workOrder.types";

export async function checkStatus(params: { phone?: string; workOrderNumber?: string }): Promise<WorkOrderStatus> {
    const response = await api.get<WorkOrderStatus>("/api/work-orders/status", { params });
    return response.data;
}

export async function getAllWorkOrders(): Promise<WorkOrder[]> {
    const response = await api.get<WorkOrder[]>("/api/admin/work-orders");
    return response.data;
}

export async function updateStatus(id: number, payload: UpdateWorkOrderStatusPayload): Promise<WorkOrder> {
    const response = await api.put<WorkOrder>(`/api/admin/work-orders/${id}/status`, payload);
    return response.data;
}

export async function createAdminWorkOrder(payload: CreateAdminWorkOrderPayload): Promise<WorkOrder> {
    const response = await api.post<WorkOrder>("/api/admin/work-orders", payload);
    return response.data;
}
