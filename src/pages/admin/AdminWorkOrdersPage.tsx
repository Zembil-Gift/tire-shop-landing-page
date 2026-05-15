import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import AdminShell from "./AdminShell";
import { createAdminWorkOrder, getAllWorkOrders, updateStatus } from "../../services/workOrderService";
import type { WorkOrder } from "../../types/workOrder.types";
import { getAppointmentsWithoutWorkOrder } from "../../services/appointmentService";
import type { AdminAppointment } from "../../types/appointment.types";
import { formatDateTimeForDisplay } from "../../utils/dateTime";

const DEFAULT_STATUS_OPTIONS = [
    "REQUEST_RECEIVED",
    "APPOINTMENT_CONFIRMED",
    "VEHICLE_RECEIVED",
    "WORK_IN_PROGRESS",
    "WAITING_FOR_TIRES",
    "READY_FOR_PICKUP",
    "COMPLETED",
];

type CreateOrderFormState = {
    appointmentId: string;
    serviceType: string;
    status: string;
    estimatedCompletionTime: string;
    staffNote: string;
};

type WorkOrderEditState = {
    orderId: number;
    status: string;
    estimatedCompletionTime: string;
    staffNote: string;
};

const INITIAL_CREATE_ORDER_FORM: CreateOrderFormState = {
    appointmentId: "",
    serviceType: "",
    status: "REQUEST_RECEIVED",
    estimatedCompletionTime: "",
    staffNote: "",
};

function toStatusLabel(status: string): string {
    return status
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
}

function toDateTimeInputValue(value?: string | null): string {
    if (!value) {
        return "";
    }

    return value.includes("T") ? value.slice(0, 16) : value;
}

function toApiDateTimeValue(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
        return null;
    }

    return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
}

export default function AdminWorkOrdersPage() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
    const [isUpdatingById, setIsUpdatingById] = useState<Record<number, boolean>>({});
    const [editState, setEditState] = useState<WorkOrderEditState | null>(null);
    const [createForm, setCreateForm] = useState<CreateOrderFormState>(INITIAL_CREATE_ORDER_FORM);

    useEffect(() => {
        async function loadPageData() {
            try {
                const [workOrderData, appointmentData] = await Promise.all([
                    getAllWorkOrders(),
                    getAppointmentsWithoutWorkOrder(),
                ]);
                setWorkOrders(workOrderData);
                setAppointments(appointmentData);
            } catch {
                setError("Could not load work-order admin data.");
            }
        }

        void loadPageData();
    }, []);

    const statusOptions = useMemo(
        () => Array.from(new Set([...DEFAULT_STATUS_OPTIONS, ...workOrders.map((order) => order.status)])),
        [workOrders],
    );

    async function handleToggleCreateForm() {
        if (isCreateOpen) {
            setIsCreateOpen(false);
            setCreateError(null);
            return;
        }

        setIsLoadingAppointments(true);
        setCreateError(null);
        try {
            const appointmentData = await getAppointmentsWithoutWorkOrder();
            setAppointments(appointmentData);
            setIsCreateOpen(true);
        } catch {
            setCreateError("Failed to load available appointments.");
        } finally {
            setIsLoadingAppointments(false);
        }
    }

    function applyAppointmentSelection(appointmentId: string) {
        if (!appointmentId) {
            setCreateForm((previous) => ({
                ...previous,
                appointmentId: "",
                serviceType: "",
            }));
            return;
        }

        const selectedAppointment = appointments.find((appointment) => String(appointment.id) === appointmentId);
        if (!selectedAppointment) {
            return;
        }

        setCreateForm((previous) => ({
            ...previous,
            appointmentId,
            serviceType: selectedAppointment.serviceType,
        }));
    }

    async function handleCreateOrder(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCreateError(null);

        if (!createForm.appointmentId) {
            setCreateError("Please select a scheduled appointment.");
            return;
        }

        if (!createForm.serviceType.trim() || !createForm.status.trim()) {
            setCreateError("Please complete all required fields.");
            return;
        }

        setIsCreating(true);
        try {
            const createdOrder = await createAdminWorkOrder({
                appointmentId: Number(createForm.appointmentId),
                serviceType: createForm.serviceType,
                status: createForm.status,
                estimatedCompletionTime: toApiDateTimeValue(createForm.estimatedCompletionTime),
                staffNote: createForm.staffNote.trim() || null,
            });

            setWorkOrders((previous) => [createdOrder, ...previous]);
            setCreateForm(INITIAL_CREATE_ORDER_FORM);
            setIsCreateOpen(false);
        } catch {
            setCreateError("Could not create work order.");
        } finally {
            setIsCreating(false);
        }
    }

    function openEditModal(order: WorkOrder) {
        setEditState({
            orderId: order.id,
            status: order.status,
            estimatedCompletionTime: toDateTimeInputValue(order.estimatedCompletionTime),
            staffNote: order.staffNote ?? "",
        });
    }

    async function handleSaveEdit() {
        if (!editState) {
            return;
        }

        setError(null);
        setIsUpdatingById((previous) => ({ ...previous, [editState.orderId]: true }));

        try {
            const updatedOrder = await updateStatus(editState.orderId, {
                status: editState.status,
                estimatedCompletionTime: toApiDateTimeValue(editState.estimatedCompletionTime),
                staffNote: editState.staffNote.trim() || null,
            });

            setWorkOrders((previous) => previous.map((item) => (item.id === editState.orderId ? updatedOrder : item)));
            setEditState(null);
        } catch {
            setError("Could not update work order.");
        } finally {
            setIsUpdatingById((previous) => ({ ...previous, [editState.orderId]: false }));
        }
    }

    return (
        <AdminShell title="Work Orders">
            {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

            <div className="mb-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-900">Create Work Order</h3>
                    <button
                        type="button"
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={() => void handleToggleCreateForm()}
                        disabled={isLoadingAppointments}
                    >
                        {isLoadingAppointments
                            ? "Loading..."
                            : isCreateOpen
                              ? "Close"
                              : "Create Order"}
                    </button>
                </div>

                {isCreateOpen && (
                    <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleCreateOrder}>
                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Scheduled Appointment
                            <select
                                value={createForm.appointmentId}
                                onChange={(event) => applyAppointmentSelection(event.target.value)}
                                className="rounded-lg border border-slate-300 px-3 py-2"
                                required
                            >
                                <option value="">Select appointment ticket</option>
                                {appointments.map((appointment) => (
                                    <option key={String(appointment.id)} value={String(appointment.id)}>
                                        A-{appointment.id} - {appointment.customerName} - {appointment.phone}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Service Type
                            <input value={createForm.serviceType} className="rounded-lg border border-slate-300 px-3 py-2 bg-slate-100" readOnly />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Status
                            <select
                                value={createForm.status}
                                onChange={(event) => setCreateForm((previous) => ({ ...previous, status: event.target.value }))}
                                className="rounded-lg border border-slate-300 px-3 py-2"
                                required
                            >
                                {statusOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {toStatusLabel(option)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700">
                            Estimated Completion Time
                            <input
                                type="datetime-local"
                                value={createForm.estimatedCompletionTime}
                                onChange={(event) =>
                                    setCreateForm((previous) => ({
                                        ...previous,
                                        estimatedCompletionTime: event.target.value,
                                    }))
                                }
                                className="rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm text-slate-700 md:col-span-2">
                            Staff Note
                            <textarea
                                value={createForm.staffNote}
                                onChange={(event) => setCreateForm((previous) => ({ ...previous, staffNote: event.target.value }))}
                                className="min-h-24 rounded-lg border border-slate-300 px-3 py-2"
                            />
                        </label>

                        {createError && <p className="text-sm text-red-700 md:col-span-2">{createError}</p>}

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isCreating}
                            >
                                {isCreating ? "Creating..." : "Create Order"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="overflow-x-hidden overflow-y-visible">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b text-left text-slate-600">
                            <th className="px-3 py-2 whitespace-nowrap">No</th>
                            <th className="px-3 py-2 whitespace-nowrap">Work Order #</th>
                            <th className="px-3 py-2 whitespace-nowrap">Customer</th>
                            <th className="px-3 py-2 whitespace-nowrap">Phone</th>
                            <th className="px-3 py-2 whitespace-nowrap">Email</th>
                            <th className="px-3 py-2 whitespace-nowrap">Service Type</th>
                            <th className="px-3 py-2 whitespace-nowrap">Status</th>
                            <th className="px-3 py-2 whitespace-nowrap">Est. Completion</th>
                            <th className="px-3 py-2 whitespace-nowrap">Staff Note</th>
                        
                            <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.map((order, index) => (
                            <tr key={order.id} className="border-b">
                                <td className="px-3 py-2 whitespace-nowrap">{index + 1}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{order.workOrderNumber}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{order.customerName}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{order.phone}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{order.email ?? "-"}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{order.serviceType}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{toStatusLabel(order.status)}</td>
                                <td className="px-3 py-2 whitespace-nowrap">{formatDateTimeForDisplay(order.estimatedCompletionTime)}</td>
                                <td className="px-3 py-2 whitespace-nowrap max-w-xs truncate">{order.staffNote ?? "-"}</td>
                                
                                <td className="px-3 py-2">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                        onClick={() => openEditModal(order)}
                                    >
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!workOrders.length && (
                            <tr>
                                <td className="px-3 py-4 text-slate-500" colSpan={9}>
                                    No work orders available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editState && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setEditState(null)}
                >
                    <div
                        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 md:w-full md:max-w-md"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-slate-900">Update Work Order</h3>

                        <div className="mt-4 grid gap-4">
                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                                Status
                                <select
                                    value={editState.status}
                                    onChange={(event) => setEditState({ ...editState, status: event.target.value })}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {toStatusLabel(option)}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                                Estimated Completion Time
                                <input
                                    type="datetime-local"
                                    value={editState.estimatedCompletionTime}
                                    onChange={(event) =>
                                        setEditState({ ...editState, estimatedCompletionTime: event.target.value })
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>

                            <label className="flex flex-col gap-1 text-sm text-slate-700">
                                Staff Note
                                <textarea
                                    value={editState.staffNote}
                                    onChange={(event) => setEditState({ ...editState, staffNote: event.target.value })}
                                    className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                                />
                            </label>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                onClick={() => setEditState(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="flex-1 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
                                onClick={() => void handleSaveEdit()}
                                disabled={isUpdatingById[editState.orderId]}
                            >
                                {isUpdatingById[editState.orderId] ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
