"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { Profissional } from "@/types";

export type Visao = "mes" | "semana" | "dia" | "lista";

interface Props {
  visao: Visao;
  onVisaoChange: (v: Visao) => void;
  periodoLabel: string;
  onNavegar: (direcao: -1 | 1) => void;
  onHoje: () => void;
  profissionais: Profissional[];
  filtroProfissionalId: string;
  onFiltroProfissionalChange: (id: string) => void;
  busca: string;
  onBuscaChange: (v: string) => void;
}

const VISOES: { id: Visao; label: string }[] = [
  { id: "mes", label: "Mês" },
  { id: "semana", label: "Semana" },
  { id: "dia", label: "Dia" },
  { id: "lista", label: "Lista" },
];

export function AgendaToolbar({
  visao,
  onVisaoChange,
  periodoLabel,
  onNavegar,
  onHoje,
  profissionais,
  filtroProfissionalId,
  onFiltroProfissionalChange,
  busca,
  onBuscaChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-linha bg-champagne p-1">
          {VISOES.map((v) => (
            <button
              key={v.id}
              onClick={() => onVisaoChange(v.id)}
              className={`rounded-lg px-3 py-1.5 font-body text-sm transition-colors ${
                visao === v.id ? "bg-ouro text-champagne" : "text-taupe"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {visao !== "lista" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavegar(-1)}
              className="rounded-lg border border-linha p-2 text-taupe transition-colors hover:border-ouro hover:text-ouro"
              aria-label="Período anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onHoje}
              className="rounded-lg border border-linha px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-taupe transition-colors hover:border-ouro hover:text-ouro"
            >
              Hoje
            </button>
            <button
              onClick={() => onNavegar(1)}
              className="rounded-lg border border-linha p-2 text-taupe transition-colors hover:border-ouro hover:text-ouro"
              aria-label="Próximo período"
            >
              <ChevronRight size={16} />
            </button>
            <span className="font-display text-lg text-cacau">{periodoLabel}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filtroProfissionalId}
          onChange={(e) => onFiltroProfissionalChange(e.target.value)}
          className="rounded-xl border border-linha bg-champagne px-4 py-2.5 font-body text-sm text-cacau outline-none focus:border-ouro"
        >
          <option value="todas">Todas as profissionais</option>
          {profissionais.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
          />
          <input
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            placeholder="Buscar cliente"
            className="rounded-xl border border-linha bg-champagne py-2.5 pl-9 pr-4 font-body text-sm text-cacau outline-none focus:border-ouro"
          />
        </div>
      </div>
    </div>
  );
}
