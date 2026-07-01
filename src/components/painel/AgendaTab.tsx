"use client";

import { useMemo, useState } from "react";
import { Ban } from "lucide-react";
import { Dashboard } from "./Dashboard";
import { AgendaToolbar, type Visao } from "./AgendaToolbar";
import { Calendario } from "./Calendario";
import { VisaoSemana } from "./VisaoSemana";
import { VisaoDia } from "./VisaoDia";
import { VisaoLista } from "./VisaoLista";
import { BloqueioPanel } from "./BloqueioPanel";
import {
  adicionarDias,
  adicionarMeses,
  formatarDiaCompleto,
  formatarPeriodoMes,
  formatarPeriodoSemana,
  getDiasDaSemana,
} from "./agendaUtils";
import type { Agendamento, Bloqueio, Profissional, StatusAgendamento } from "@/types";

interface Props {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  bloqueios: Bloqueio[];
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
  onAddBloqueio: (b: Omit<Bloqueio, "id" | "criadoEm">) => Promise<void>;
  onRemoveBloqueio: (id: string) => Promise<void>;
}

export function AgendaTab({
  agendamentos,
  profissionais,
  bloqueios,
  onStatusChange,
  onExcluir,
  onAddBloqueio,
  onRemoveBloqueio,
}: Props) {
  const [visao, setVisao] = useState<Visao>("mes");
  const [dataRef, setDataRef] = useState(() => new Date());
  const [filtroProfissionalId, setFiltroProfissionalId] = useState("todas");
  const [busca, setBusca] = useState("");
  const [painelBloqueioAberto, setPainelBloqueioAberto] = useState(false);

  const filtrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    return agendamentos.filter((a) => {
      if (filtroProfissionalId !== "todas" && a.profissionalId !== filtroProfissionalId) return false;
      if (buscaNormalizada && !a.cliente.toLowerCase().includes(buscaNormalizada)) return false;
      return true;
    });
  }, [agendamentos, filtroProfissionalId, busca]);

  // Bloqueios filtrados pelo profissional selecionado (ou todos se "todas")
  const bloqueiosFiltrados = useMemo(() => {
    if (filtroProfissionalId === "todas") return bloqueios;
    return bloqueios.filter(
      (b) => b.profissionalId === null || b.profissionalId === filtroProfissionalId
    );
  }, [bloqueios, filtroProfissionalId]);

  function navegar(direcao: -1 | 1) {
    if (visao === "mes") setDataRef((d) => adicionarMeses(d, direcao));
    else if (visao === "semana") setDataRef((d) => adicionarDias(d, direcao * 7));
    else if (visao === "dia") setDataRef((d) => adicionarDias(d, direcao));
  }

  function selecionarDia(d: Date) {
    setDataRef(d);
    setVisao("dia");
  }

  const periodoLabel =
    visao === "mes"
      ? formatarPeriodoMes(dataRef)
      : visao === "semana"
        ? formatarPeriodoSemana(getDiasDaSemana(dataRef))
        : visao === "dia"
          ? formatarDiaCompleto(dataRef)
          : "";

  return (
    <div>
      <Dashboard
        agendamentos={filtrados}
        totalProfissionais={profissionais.length}
        dataRef={dataRef}
      />

      <AgendaToolbar
        visao={visao}
        onVisaoChange={setVisao}
        periodoLabel={periodoLabel}
        onNavegar={navegar}
        onHoje={() => setDataRef(new Date())}
        profissionais={profissionais}
        filtroProfissionalId={filtroProfissionalId}
        onFiltroProfissionalChange={setFiltroProfissionalId}
        busca={busca}
        onBuscaChange={setBusca}
      />

      {/* Botão de bloqueio */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setPainelBloqueioAberto((v) => !v)}
          className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-body text-sm transition-colors ${
            painelBloqueioAberto
              ? "border-taupe bg-taupe/10 text-cacau"
              : "border-linha text-taupe hover:border-taupe hover:text-cacau"
          }`}
        >
          <Ban size={15} />
          {painelBloqueioAberto ? "Fechar bloqueios" : "Bloquear horário"}
          {bloqueios.length > 0 && (
            <span className="rounded-full bg-taupe/20 px-1.5 py-0.5 font-mono text-[10px]">
              {bloqueios.length}
            </span>
          )}
        </button>
      </div>

      {painelBloqueioAberto && (
        <div className="mb-6">
          <BloqueioPanel
            bloqueios={bloqueios}
            profissionais={profissionais}
            diaInicial={visao === "dia" ? dataRef : undefined}
            onAdd={onAddBloqueio}
            onRemove={onRemoveBloqueio}
            onFechar={() => setPainelBloqueioAberto(false)}
          />
        </div>
      )}

      {visao === "mes" && (
        <Calendario dataRef={dataRef} agendamentos={filtrados} onSelecionarDia={selecionarDia} />
      )}
      {visao === "semana" && (
        <VisaoSemana
          dias={getDiasDaSemana(dataRef)}
          agendamentos={filtrados}
          bloqueios={bloqueiosFiltrados}
          onSelecionarDia={selecionarDia}
        />
      )}
      {visao === "dia" && (
        <VisaoDia
          dia={dataRef}
          agendamentos={filtrados}
          bloqueios={bloqueiosFiltrados}
          onStatusChange={onStatusChange}
          onExcluir={onExcluir}
        />
      )}
      {visao === "lista" && (
        <VisaoLista agendamentos={filtrados} onStatusChange={onStatusChange} onExcluir={onExcluir} />
      )}
    </div>
  );
}
