"use client";

import { HORAS } from "@/lib/utils";
import { AgendamentoCard } from "./AgendamentoCard";
import { formatarDataISO, formatarDiaCompleto } from "./agendaUtils";
import type { Agendamento, StatusAgendamento } from "@/types";

interface Props {
  dia: Date;
  agendamentos: Agendamento[];
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
}

export function VisaoDia({ dia, agendamentos, onStatusChange, onExcluir }: Props) {
  const iso = formatarDataISO(dia);
  const doDia = agendamentos.filter((a) => a.dia === iso);

  const porHora = new Map<string, Agendamento[]>();
  for (const a of doDia) {
    porHora.set(a.hora, [...(porHora.get(a.hora) ?? []), a]);
  }

  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-500 text-cacau">{formatarDiaCompleto(dia)}</h3>

      {doDia.length === 0 && (
        <p className="mb-5 font-body text-sm text-taupe">Nenhum agendamento neste dia.</p>
      )}

      <div className="grid gap-2">
        {HORAS.map((h) => {
          const itens = porHora.get(h) ?? [];
          return (
            <div key={h} className="flex gap-4 border-b border-linha pb-3">
              <div className="w-14 shrink-0 pt-2 font-mono text-xs text-taupe">{h}</div>
              <div className="grid flex-1 gap-2">
                {itens.length === 0 ? (
                  <div className="h-2 rounded-xl border border-dashed border-linha" />
                ) : (
                  itens.map((a) => (
                    <AgendamentoCard
                      key={a.id}
                      agendamento={a}
                      onStatusChange={onStatusChange}
                      onExcluir={onExcluir}
                      mostrarData={false}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
