"use client";

import { useMemo, useState } from "react";
import { Dashboard } from "./Dashboard";
import { AgendaToolbar, type Visao } from "./AgendaToolbar";
import { Calendario } from "./Calendario";
import { VisaoSemana } from "./VisaoSemana";
import { VisaoDia } from "./VisaoDia";
import { VisaoLista } from "./VisaoLista";
import {
  adicionarDias,
  adicionarMeses,
  formatarDiaCompleto,
  formatarPeriodoMes,
  formatarPeriodoSemana,
  getDiasDaSemana,
} from "./agendaUtils";
import type { Agendamento, Profissional, StatusAgendamento } from "@/types";

interface Props {
  agendamentos: Agendamento[];
  profissionais: Profissional[];
  onStatusChange: (id: string, status: StatusAgendamento) => void;
  onExcluir: (agendamento: Agendamento) => void;
}

export function AgendaTab({ agendamentos, profissionais, onStatusChange, onExcluir }: Props) {
  const [visao, setVisao] = useState<Visao>("mes");
  const [dataRef, setDataRef] = useState(() => new Date());
  const [filtroProfissionalId, setFiltroProfissionalId] = useState("todas");
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    return agendamentos.filter((a) => {
      if (filtroProfissionalId !== "todas" && a.profissionalId !== filtroProfissionalId) return false;
      if (buscaNormalizada && !a.cliente.toLowerCase().includes(buscaNormalizada)) return false;
      return true;
    });
  }, [agendamentos, filtroProfissionalId, busca]);

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

      {visao === "mes" && (
        <Calendario dataRef={dataRef} agendamentos={filtrados} onSelecionarDia={selecionarDia} />
      )}
      {visao === "semana" && (
        <VisaoSemana
          dias={getDiasDaSemana(dataRef)}
          agendamentos={filtrados}
          onSelecionarDia={selecionarDia}
        />
      )}
      {visao === "dia" && (
        <VisaoDia
          dia={dataRef}
          agendamentos={filtrados}
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
