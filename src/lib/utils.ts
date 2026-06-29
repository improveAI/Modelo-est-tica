import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Junta classes Tailwind de forma segura (resolve conflitos). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const HORAS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00", "18:30",
];

/** Formata reais. */
export function brl(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Link de WhatsApp com mensagem pré-pronta. */
export function waLink(numero: string, msg: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
