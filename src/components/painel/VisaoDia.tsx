"use client";

import { HORAS } from "@/lib/utils";
import { AgendamentoCard } from "./AgendamentoCard";
import { formatarDataISO, formatarDiaCompleto } from "./agendaUtils";
import type { Agendamento, Bloqueio, StatusAgendamento } from "@/types";

interface Props {
  dia: Date;
  agendamentos: Agendamento[];
  bloqueios: Bloqueio[];
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
}

export function VisaoDia({ dia, agendamentos, bloqueios, onStatusChange, onExcluir }: Props) {
  const iso = formatarDataISO(dia);
  const doDia = agendamentos.filter((a) => a.dia === iso);
  const bloqueiosDoDia = bloqueios.filter((b) => b.dia === iso);

  const porHora = new Map<string, Agendamento[]>();
  for (const a of doDia) {
    porHora.set(a.hora, [...(porHora.get(a.hora) ?? []), a]);
  }

  function bloqueioNoSlot(hora: string) {
    return bloqueiosDoDia.find(
      (b) => hora >= b.horaInicio && hora < b.horaFim
    );
  }

  return (
    <div>
      <h3 className="mb-5 font-display text-xl font-500 text-cacau">{formatarDiaCompleto(dia)}</h3>

      {doDia.length === 0 && bloqueiosDoDia.length === 0 && (
        <p className="mb-5 font-body text-sm text-taupe">Nenhum agendamento neste dia.</p>
      )}

      <div className="grid gap-2">
        {HORAS.map((h) => {
          const itens = porHora.get(h) ?? [];
          const bloqueio = bloqueioNoSlot(h);

          return (
            <div key={h} className="flex gap-4 border-b border-linha pb-3">
              <div className="w-14 shrink-0 pt-2 font-mono text-xs text-taupe">{h}</div>
              <div className="grid flex-1 gap-2">
                {bloqueio ? (
                  <div className="flex items-center gap-2 rounded-xl border border-taupe/20 bg-taupe/8 px-4 py-2">
                    <span className="font-mono text-xs text-taupe">🔒</span>
                    <span className="font-body text-xs text-taupe">
                      Bloqueado
                      {bloqueio.motivo ? ` — ${bloqueio.motivo}` : ""}
                      {bloqueio.profissionalId === null ? " (todas)" : ""}
                    </span>
                  </div>
                ) : itens.length === 0 ? (
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
