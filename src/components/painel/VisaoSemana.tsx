"use client";

import { cn, HORAS } from "@/lib/utils";
import { ehHoje, formatarDataISO } from "./agendaUtils";
import type { Agendamento, Bloqueio } from "@/types";

interface Props {
  dias: Date[];
  agendamentos: Agendamento[];
  bloqueios: Bloqueio[];
  onSelecionarDia: (d: Date) => void;
}

const CABECALHO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function VisaoSemana({ dias, agendamentos, bloqueios, onSelecionarDia }: Props) {
  function agendamentosDe(diaIso: string, hora: string): Agendamento[] {
    return agendamentos.filter((a) => a.dia === diaIso && a.hora === hora);
  }

  function bloqueioNaHora(diaIso: string, hora: string): Bloqueio | undefined {
    return bloqueios.find(
      (b) => b.dia === diaIso && hora >= b.horaInicio && hora < b.horaFim
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-linha bg-linen/40">
      <div className="grid min-w-[760px] grid-cols-[72px_repeat(7,1fr)]">
        <div className="border-b border-linha p-3" />
        {dias.map((d, i) => (
          <div
            key={i}
            className={cn("border-b border-linha p-3 text-center", ehHoje(d) && "bg-champagne")}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-taupe">
              {CABECALHO[d.getDay()]}
            </div>
            <div className="font-display text-lg text-cacau">{d.getDate()}</div>
          </div>
        ))}

        {HORAS.map((hora) => (
          <LinhaHorario
            key={hora}
            hora={hora}
            dias={dias}
            agendamentosDe={agendamentosDe}
            bloqueioNaHora={bloqueioNaHora}
            onSelecionarDia={onSelecionarDia}
          />
        ))}
      </div>
    </div>
  );
}

function LinhaHorario({
  hora,
  dias,
  agendamentosDe,
  bloqueioNaHora,
  onSelecionarDia,
}: {
  hora: string;
  dias: Date[];
  agendamentosDe: (diaIso: string, hora: string) => Agendamento[];
  bloqueioNaHora: (diaIso: string, hora: string) => Bloqueio | undefined;
  onSelecionarDia: (d: Date) => void;
}) {
  return (
    <>
      <div className="border-b border-linha p-2 text-right font-mono text-[11px] text-taupe">
        {hora}
      </div>
      {dias.map((d, i) => {
        const iso = formatarDataISO(d);
        const itens = agendamentosDe(iso, hora);
        const bloqueio = bloqueioNaHora(iso, hora);
        return (
          <div key={i} className="min-h-[44px] border-b border-l border-linha p-1">
            {bloqueio ? (
              <div
                title={bloqueio.motivo ? `Bloqueado: ${bloqueio.motivo}` : "Bloqueado"}
                className="flex h-full min-h-[36px] items-center rounded-lg bg-taupe/10 px-2"
              >
                <span className="truncate font-mono text-[10px] text-taupe">
                  🔒 {bloqueio.motivo ?? "Bloqueado"}
                </span>
              </div>
            ) : (
              itens.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onSelecionarDia(d)}
                  title={`${a.cliente} · ${a.servicoNome}`}
                  className="mb-1 w-full truncate rounded-lg bg-ouro/15 px-2 py-1 text-left font-mono text-[10px] text-ouro transition-colors hover:bg-ouro/25"
                >
                  {a.cliente.split(" ")[0]}
                </button>
              ))
            )}
          </div>
        );
      })}
    </>
  );
}
