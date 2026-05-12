const STATUS_STYLES: Record<string, string> = {
    "Request Received": "bg-slate-200 text-slate-800",
    "Appointment Confirmed": "bg-blue-100 text-blue-700",
    "Vehicle Received": "bg-yellow-100 text-yellow-800",
    "Work In Progress": "bg-orange-100 text-orange-800",
    "Waiting for Tires": "bg-purple-100 text-purple-800",
    "Ready for Pickup": "bg-green-100 text-green-800",
    Completed: "bg-emerald-200 text-emerald-900",
};

type StatusBadgeProps = {
    status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-slate-200 text-slate-800"}`}
        >
            {status}
        </span>
    );
}
