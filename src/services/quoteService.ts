import { api } from "./api";
import type { AdminQuote, QuoteRequestPayload } from "../types/quote.types";

export async function submitQuote(data: QuoteRequestPayload): Promise<void> {
    await api.post("/api/quotes", data);
}

export async function getAdminQuotes(): Promise<AdminQuote[]> {
    const response = await api.get<AdminQuote[]>("/api/quotes");

    return response.data.map((quote) => {
        const vehicleFromParts = [quote.vehicleYear, quote.vehicleMake, quote.vehicleModel].filter(Boolean).join(" ");
        const vehicle = quote.vehicle?.trim() || vehicleFromParts || "-";
        const submittedAt = quote.submittedAt || quote.createdAt || "-";

        return {
            ...quote,
            vehicle,
            submittedAt,
        };
    });
}

export async function sendQuote(
    id: number | string,
    quotedPrice: number,
    reason: string
): Promise<void> {
    await api.put(`/api/admin/quotes/${id}/offer`, {
        quotedPrice,
        reason,
    });
}
