function hasDisplayValue(value?: string | null): value is string {
    return Boolean(value && value.trim() && value.trim() !== "-");
}

function parseDateOnly(value: string): Date | null {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        return null;
    }

    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
}

function parseTimeOnly(value: string): Date | null {
    const match = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) {
        return null;
    }

    const [, hours, minutes, seconds] = match;
    return new Date(1970, 0, 1, Number(hours), Number(minutes), Number(seconds ?? 0));
}

function parseDateTime(value: string): Date | null {
    const normalized = value.includes(" ") && !value.includes("T") ? value.replace(" ", "T") : value;
    const parsed = new Date(normalized);
    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    return parsed;
}

export function formatDateForDisplay(value?: string | null, fallback = "-"): string {
    if (!hasDisplayValue(value)) {
        return fallback;
    }

    const date = parseDateOnly(value.trim()) ?? parseDateTime(value.trim());
    if (!date) {
        return value.trim();
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

export function formatTimeForDisplay(value?: string | null, fallback = "-"): string {
    if (!hasDisplayValue(value)) {
        return fallback;
    }

    const date = parseTimeOnly(value.trim()) ?? parseDateTime(value.trim());
    if (!date) {
        return value.trim();
    }

    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

export function formatDateTimeForDisplay(value?: string | null, fallback = "-"): string {
    if (!hasDisplayValue(value)) {
        return fallback;
    }

    const date = parseDateTime(value.trim()) ?? parseDateOnly(value.trim());
    if (!date) {
        return value.trim();
    }

    return new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}
