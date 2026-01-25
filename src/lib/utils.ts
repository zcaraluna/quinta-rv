import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + " gs.";
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
