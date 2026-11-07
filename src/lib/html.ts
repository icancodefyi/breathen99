const MAP: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text for safe interpolation into HTML (emails contain customer-supplied fields). */
export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (c) => MAP[c]);
}

/** Single-line plain text (for email subjects). */
export function oneLine(value: unknown): string {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}
