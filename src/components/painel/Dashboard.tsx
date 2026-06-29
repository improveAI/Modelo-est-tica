"use client";

import type { ReactElement } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { brl, DIAS } from "@/lib/utils";
import { formatarDataISO, formatarPeriodoMes, parseDataLocal } from "./agendaUtils";
import type { Agendamento } from "@/types";

interface Props {
  agendamentos: Agendamento[];
  totalProfissionais: number;
  dataRef: Date;
}

const EIXO = { fill: "#8a7a6c", fontSize: 11 };
const TOOLTIP_STYLE = { borderRadius: 12, border: "1px solid #e3d6c7", fontSize: 12 };

export function Dashboard({ agendamentos, totalProfissionais, dataRef }: Props) {
  const hojeIso = formatarDataISO(new Date());
  const totalHoje = agendamentos.filter((a) => a.dia === hojeIso).length;

  const faturamentoMes = agendamentos
    .filter((a) => {
      if (a.status !== "concluido") return false;
      const d = parseDataLocal(a.dia);
      return d.getFullYear() === dataRef.getFullYear() && d.getMonth() === dataRef.getMonth();
    })
    .reduce((soma, a) => soma + a.preco, 0);

  const porDiaSemana = DIAS.map((label, i) => ({
    dia: label,
    total: agendamentos.filter((a) => parseDataLocal(a.dia).getDay() === i).length,
  }));

  const contagemServicos = new Map<string, number>();
  for (const a of agendamentos) {
    contagemServicos.set(a.servicoNome, (contagemServicos.get(a.servicoNome) ?? 0) + 1);
  }
  const porServico = Array.from(contagemServicos.entries())
    .map(([servico, total]) => ({ servico, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <div className="mb-10">
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Kpi num={`${agendamentos.length}`} label="Agendamentos" />
        <Kpi num={`${totalHoje}`} label="Para hoje" />
        <Kpi num={brl(faturamentoMes)} label={`Faturamento · ${formatarPeriodoMes(dataRef)}`} />
        <Kpi num={`${totalProfissionais}`} label="Profissionais" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Grafico titulo="Agendamentos por dia da semana">
          <BarChart data={porDiaSemana}>
            <CartesianGrid stroke="#e3d6c7" vertical={false} />
            <XAxis dataKey="dia" tick={EIXO} axisLine={false} tickLine={false} />
            <YAxis tick={EIXO} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
            <Tooltip cursor={{ fill: "#efe6db" }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="total" fill="#b8915a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Grafico>

        <Grafico titulo="Serviços mais procurados">
          <BarChart data={porServico} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid stroke="#e3d6c7" horizontal={false} />
            <XAxis type="number" tick={EIXO} axisLine={false} tickLine={false} allowDecimals={false} />
            <YAxis
              dataKey="servico"
              type="category"
              tick={{ fill: "#3a2e26", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={130}
            />
            <Tooltip cursor={{ fill: "#efe6db" }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="total" fill="#c9a07a" radius={[0, 6, 6, 0]} />
          </BarChart>
        </Grafico>
      </div>
    </div>
  );
}

function Grafico({ titulo, children }: { titulo: string; children: ReactElement }) {
  return (
    <div className="rounded-2xl border border-linha bg-linen/40 p-5">
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest2 text-taupe">{titulo}</h3>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function Kpi({ num, label }: { num: string; label: string }) {
  return (
    <div className="rounded-2xl border border-linha bg-linen/40 p-5">
      <div className="font-display text-3xl font-600 text-ouro">{num}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-taupe">{label}</div>
    </div>
  );
}
