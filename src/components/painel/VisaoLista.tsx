"use client";

import { AgendamentoCard } from "./AgendamentoCard";
import type { Agendamento, StatusAgendamento } from "@/types";

interface Props {
  agendamentos: Agendamento[];
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
}

export function VisaoLista({ agendamentos, onStatusChange, onExcluir }: Props) {
  const ordenados = [...agendamentos].sort((a, b) =>
    `${a.dia}T${a.hora}`.localeCompare(`${b.dia}T${b.hora}`)
  );

  if (ordenados.length === 0) {
    return (
      <div className="rounded-2xl border border-linha bg-linen/40 p-12 text-center font-body text-taupe">
        Nenhum agendamento encontrado com esse filtro.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {ordenados.map((a) => (
        <AgendamentoCard
          key={a.id}
          agendamento={a}
          onStatusChange={onStatusChange}
          onExcluir={onExcluir}
        />
      ))}
    </div>
  );
}
