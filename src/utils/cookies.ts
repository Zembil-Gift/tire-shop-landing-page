export function getCookieValue(name: string): string | null {
    const encodedName = `${encodeURIComponent(name)}=`;
    const parts = document.cookie.split(";").map((part) => part.trim());
    const match = parts.find((part) => part.startsWith(encodedName));
    if (!match) {
        return null;
    }
    return decodeURIComponent(match.slice(encodedName.length));
}
