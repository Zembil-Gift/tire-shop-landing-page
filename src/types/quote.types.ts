export type PreferredTireType = "BUDGET" | "MID_RANGE" | "PREMIUM" | "NOT_SURE";

export type QuoteRequestPayload = {
    fullName: string;
    phone: string;
    email: string;
    vehicleYear: number;
    vehicleMake: string;
    vehicleModel: string;
    tireSize: string;
    quantity: number;
    preferredTireType: PreferredTireType;
    message?: string;
};

export type AdminQuote = {
    id: number | string;
    customerName: string;
    phone: string;
    email?: string;
    vehicleYear?: number;
    vehicleMake?: string;
    vehicleModel?: string;
    vehicle: string;
    tireSize: string;
    quantity: number;
    preferredTireType: string;
    message?: string;
    status: string;
    submittedAt: string;
    createdAt?: string;
    quotedPrice?: number | null;
    quoteReason?: string | null;
    quotedAt?: string | null;
};
