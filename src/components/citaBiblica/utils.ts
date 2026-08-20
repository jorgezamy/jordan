import { Timestamp } from "firebase/firestore";

export function formatFecha(timestamp?: Timestamp) {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(timestamp.toDate());
}
