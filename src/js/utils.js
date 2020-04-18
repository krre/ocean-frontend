export function formatDateTime(date) {
    return formatDate(date) + " " + formatTime(date);
}

export function formatDate(date) {
    const d = new Date(date);
    return ("0" + d.getDay()).slice(-2) + "." + ("0" + d.getMonth()).slice(-2) + "." + d.getFullYear();
}

export function formatTime(date) {
    const d = new Date(date);
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
}
