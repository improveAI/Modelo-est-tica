"use client";

import { cn } from "@/lib/utils";
import { ehHoje, formatarDataISO, getDiasDoMes } from "./agendaUtils";
import type { Agendamento } from "@/types";

interface Props {
  dataRef: Date;
  agendamentos: Agendamento[];
  onSelecionarDia: (d: Date) => void;
}

const CABECALHO = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Calendario({ dataRef, agendamentos, onSelecionarDia }: Props) {
  const dias = getDiasDoMes(dataRef);

  const porDia = new Map<string, number>();
  for (const a of agendamentos) {
    porDia.set(a.dia, (porDia.get(a.dia) ?? 0) + 1);
  }

  return (
    <div className="rounded-2xl border border-linha bg-linen/40 p-5">
      <div className="grid grid-cols-7 gap-2">
        {CABECALHO.map((d) => (
          <div
            key={d}
            className="pb-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-taupe"
          >
            {d}
          </div>
        ))}

        {dias.map((dia, i) => {
          const iso = formatarDataISO(dia);
          const doMes = dia.getMonth() === dataRef.getMonth();
          const qtd = porDia.get(iso) ?? 0;

          return (
            <button
              key={i}
              onClick={() => onSelecionarDia(dia)}
              className={cn(
                "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-transparent font-body transition-colors hover:border-ouro",
                doMes ? "text-cacau" : "text-taupe/40",
                ehHoje(dia) && "border-ouro bg-champagne"
              )}
            >
              <span className="font-display text-lg">{dia.getDate()}</span>
              {qtd > 0 && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-ouro">
                  <span className="h-1.5 w-1.5 rounded-full bg-ouro" />
                  {qtd}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
