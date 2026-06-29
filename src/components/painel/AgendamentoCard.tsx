"use client";

import { Trash2 } from "lucide-react";
import { brl } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import type { Agendamento, StatusAgendamento } from "@/types";

interface Props {
  agendamento: Agendamento;
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
  mostrarData?: boolean;
}

export function AgendamentoCard({
  agendamento: a,
  onStatusChange,
  onExcluir,
  mostrarData = true,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-linen/40 p-5">
      <div className="flex items-center gap-4">
        <div className="rounded-xl border border-linha bg-champagne px-4 py-2 text-center">
          <div className="font-display font-600 text-ouro">{a.hora}</div>
          {mostrarData && <div className="font-mono text-[10px] text-taupe">{a.dia}</div>}
        </div>
        <div>
          <div className="font-display text-lg text-cacau">{a.cliente}</div>
          <div className="font-body text-sm text-taupe">
            {a.servicoNome} · {a.profissionalNome.split(" ")[0]}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="font-display text-lg font-600 text-ouro">{brl(a.preco)}</div>
        <StatusBadge status={a.status} onChange={(s) => onStatusChange(a.id, s)} />
        <button
          onClick={() => onExcluir(a)}
          className="rounded-lg border border-linha p-2.5 text-red-400 transition-colors hover:border-red-300"
          aria-label="Excluir agendamento"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
