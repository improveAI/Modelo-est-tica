"use client";

import { useEffect, useState } from "react";
import { Lock, LogOut, Users, CalendarDays, Scissors } from "lucide-react";
import { siteConfig } from "@/data/config";
import {
  getProfissionais,
  getAgendamentos,
  getServicosAdmin,
  addProfissional as dbAddProfissional,
  removeProfissional as dbRemoveProfissional,
  removeAgendamento as dbRemoveAgendamento,
  updateAgendamentoStatus as dbUpdateAgendamentoStatus,
  addServico as dbAddServico,
  updateServico as dbUpdateServico,
  toggleAtivoServico as dbToggleAtivoServico,
  removeServico as dbRemoveServico,
} from "@/lib/db";
import { AgendaTab } from "@/components/painel/AgendaTab";
import { ProfissionaisTab } from "@/components/painel/ProfissionaisTab";
import { ServicosTab } from "@/components/painel/ServicosTab";
import type { Agendamento, Profissional, Servico, StatusAgendamento } from "@/types";

export default function Painel() {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [aba, setAba] = useState<"agenda" | "profissionais" | "servicos">("agenda");

  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
    getAgendamentos().then(setAgendamentos);
    getServicosAdmin().then(setServicos);
  }, []);

  // --- Profissionais ---
  async function addProfissional(p: Omit<Profissional, "id">) {
    const novo = await dbAddProfissional(p);
    if (novo) setProfissionais((prev) => [...prev, novo]);
  }

  async function removeProfissional(id: string) {
    const ok = await dbRemoveProfissional(id);
    if (ok) setProfissionais((prev) => prev.filter((p) => p.id !== id));
  }

  // --- Agendamentos ---
  async function excluirAgendamento(a: Agendamento) {
    const confirmado = window.confirm(
      `Excluir definitivamente o agendamento de ${a.cliente} (${a.servicoNome}, ${a.dia} às ${a.hora})? Essa ação não pode ser desfeita.`
    );
    if (!confirmado) return;
    const ok = await dbRemoveAgendamento(a.id);
    if (ok) setAgendamentos((prev) => prev.filter((x) => x.id !== a.id));
  }

  async function alterarStatusAgendamento(id: string, status: StatusAgendamento) {
    const ok = await dbUpdateAgendamentoStatus(id, status);
    if (ok) {
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  }

  // --- Serviços ---
  async function adicionarServico(s: Omit<Servico, "id" | "ativo">) {
    const novo = await dbAddServico(s);
    if (novo) setServicos((prev) => [...prev, novo]);
  }

  async function editarServico(id: string, s: Partial<Omit<Servico, "id" | "ativo">>) {
    const ok = await dbUpdateServico(id, s);
    if (ok) setServicos((prev) => prev.map((x) => (x.id === id ? { ...x, ...s } : x)));
  }

  async function toggleServico(id: string, ativo: boolean) {
    const ok = await dbToggleAtivoServico(id, ativo);
    if (ok) setServicos((prev) => prev.map((x) => (x.id === id ? { ...x, ativo } : x)));
  }

  async function removerServico(s: Servico) {
    const confirmado = window.confirm(
      `Remover o serviço "${s.nome}"? Essa ação não pode ser desfeita.`
    );
    if (!confirmado) return;
    const ok = await dbRemoveServico(s.id);
    if (ok) setServicos((prev) => prev.filter((x) => x.id !== s.id));
  }

  if (!logado) {
    return (
      <div className="flex min-h-screen items-center justify-center px-7">
        <div className="w-full max-w-sm rounded-3xl border border-linha bg-linen/40 p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ouro/15">
            <Lock size={32} className="text-ouro" />
          </div>
          <h1 className="font-display text-2xl font-500 text-cacau">Painel da gestão</h1>
          <p className="mt-2 font-body text-sm text-taupe">
            Acesso restrito à equipe da {siteConfig.nome}
          </p>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro(false);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (senha === siteConfig.senhaPainel ? setLogado(true) : setErro(true))
            }
            className="mt-6 w-full rounded-xl border border-linha bg-champagne px-5 py-3.5 font-body text-cacau outline-none focus:border-ouro"
          />
          {erro && (
            <p className="mt-2 font-body text-sm text-red-400">
              Senha incorreta. (demo: {siteConfig.senhaPainel})
            </p>
          )}
          <button
            onClick={() => (senha === siteConfig.senhaPainel ? setLogado(true) : setErro(true))}
            className="btn-primary mt-6 w-full"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="flex items-center justify-between border-b border-linha px-7 py-5">
        <div className="font-display text-xl font-600 text-cacau">
          {siteConfig.nome} · Gestão
        </div>
        <button onClick={() => setLogado(false)} className="btn-ghost py-2.5">
          <LogOut size={15} /> Sair
        </button>
      </header>

      <div className="mx-auto max-w-6xl px-7">
        <div className="flex gap-1 border-b border-linha pt-6">
          <AbaBtn ativo={aba === "agenda"} onClick={() => setAba("agenda")}>
            <CalendarDays size={16} /> Agenda
          </AbaBtn>
          <AbaBtn ativo={aba === "servicos"} onClick={() => setAba("servicos")}>
            <Scissors size={16} /> Serviços
          </AbaBtn>
          <AbaBtn ativo={aba === "profissionais"} onClick={() => setAba("profissionais")}>
            <Users size={16} /> Profissionais
          </AbaBtn>
        </div>

        <div className="py-8">
          {aba === "agenda" && (
            <AgendaTab
              agendamentos={agendamentos}
              profissionais={profissionais}
              onStatusChange={alterarStatusAgendamento}
              onExcluir={excluirAgendamento}
            />
          )}

          {aba === "servicos" && (
            <ServicosTab
              servicos={servicos}
              onAdd={adicionarServico}
              onUpdate={editarServico}
              onToggleAtivo={toggleServico}
              onRemove={removerServico}
            />
          )}

          {aba === "profissionais" && (
            <ProfissionaisTab
              profissionais={profissionais}
              addProfissional={addProfissional}
              removeProfissional={removeProfissional}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AbaBtn({
  children,
  ativo,
  onClick,
}: {
  children: React.ReactNode;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 border-b-2 px-5 py-3 font-body text-sm uppercase tracking-[0.08em] transition-colors ${
        ativo ? "border-ouro text-ouro" : "border-transparent text-taupe"
      }`}
    >
      {children}
    </button>
  );
}