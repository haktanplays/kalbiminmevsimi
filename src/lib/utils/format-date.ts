import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "d MMMM yyyy", { locale: tr });
}

export function formatDateShort(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, "d MMM yyyy", { locale: tr });
}
