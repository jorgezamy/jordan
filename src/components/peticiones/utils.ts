import { Timestamp } from "firebase/firestore";

export function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp.toDate());
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "");
}
