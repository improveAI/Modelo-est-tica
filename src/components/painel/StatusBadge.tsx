"use client";

import type { StatusAgendamento } from "@/types";

export const STATUS_LABEL: Record<StatusAgendamento, string> = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  faltou: "Faltou",
  cancelado: "Cancelado",
};

export const STATUS_CLASSES: Record<StatusAgendamento, string> = {
  confirmado: "bg-ouro/15 text-ouro border-ouro/30",
  concluido: "bg-emerald-50 text-emerald-700 border-emerald-200",
  faltou: "bg-amber-50 text-amber-700 border-amber-200",
  cancelado: "bg-red-50 text-red-400 border-red-200",
};

const OPCOES: StatusAgendamento[] = ["confirmado", "concluido", "faltou", "cancelado"];

interface Props {
  status: StatusAgendamento;
  onChange?: (status: StatusAgendamento) => void;
}

/** Badge colorido por status; vira um <select> quando `onChange` é passado. */
export function StatusBadge({ status, onChange }: Props) {
  const classe = `rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-widest2 ${STATUS_CLASSES[status]}`;

  if (!onChange) {
    return <span className={classe}>{STATUS_LABEL[status]}</span>;
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as StatusAgendamento)}
      className={`${classe} cursor-pointer outline-none`}
    >
      {OPCOES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
