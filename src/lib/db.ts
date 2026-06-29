import { supabase, supabaseAtivo } from "./supabase";
import type { Profissional, Agendamento, StatusAgendamento } from "@/types";

/**
 * Camada de dados.
 *
 * Se o Supabase estiver configurado (variáveis de ambiente presentes),
 * lê/escreve direto no banco. Caso contrário, cai num fallback em
 * memória (mesmo comportamento do antigo src/lib/store.ts) para o
 * app continuar funcionando em dev/demo sem banco.
 */

// ------------------------------------------------------------------
// Fallback em memória (usado só quando o Supabase está desligado)
// ------------------------------------------------------------------

let profissionaisMemoria: Profissional[] = [
  {
    id: "p1",
    nome: "Helena Costa",
    especialidade: "Estética facial e limpeza de pele",
    diasTrabalho: [2, 3, 4, 5, 6],
    inicio: "09:00",
    fim: "18:00",
  },
  {
    id: "p2",
    nome: "Beatriz Lima",
    especialidade: "Massagem e drenagem linfática",
    diasTrabalho: [2, 3, 4, 5, 6],
    inicio: "10:00",
    fim: "19:00",
  },
];

let agendamentosMemoria: Agendamento[] = [];

// ------------------------------------------------------------------
// Mapeamento entre colunas do banco (snake_case) e os tipos do app
// ------------------------------------------------------------------

type ProfissionalRow = {
  id: string;
  nome: string;
  especialidade: string | null;
  dias_trabalho: number[];
  inicio: string;
  fim: string;
};

type AgendamentoRow = {
  id: string;
  servico_id: string;
  servico_nome: string;
  preco: number;
  profissional_id: string | null;
  profissional_nome: string;
  dia: string;
  hora: string;
  cliente: string;
  telefone: string;
  status: StatusAgendamento;
  criado_em: string;
};

function rowToProfissional(row: ProfissionalRow): Profissional {
  return {
    id: row.id,
    nome: row.nome,
    especialidade: row.especialidade ?? "",
    diasTrabalho: row.dias_trabalho,
    inicio: row.inicio,
    fim: row.fim,
  };
}

function rowToAgendamento(row: AgendamentoRow): Agendamento {
  return {
    id: row.id,
    servicoId: row.servico_id,
    servicoNome: row.servico_nome,
    preco: row.preco,
    profissionalId: row.profissional_id ?? "",
    profissionalNome: row.profissional_nome,
    dia: row.dia,
    hora: row.hora,
    cliente: row.cliente,
    telefone: row.telefone,
    status: row.status,
    criadoEm: row.criado_em,
  };
}

// ------------------------------------------------------------------
// Profissionais
// ------------------------------------------------------------------

export async function getProfissionais(): Promise<Profissional[]> {
  if (!supabaseAtivo || !supabase) {
    return profissionaisMemoria;
  }

  const { data, error } = await supabase
    .from("profissionais")
    .select("*")
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("Erro ao buscar profissionais:", error.message);
    return [];
  }

  return (data as ProfissionalRow[]).map(rowToProfissional);
}

export async function addProfissional(
  p: Omit<Profissional, "id">
): Promise<Profissional | null> {
  if (!supabaseAtivo || !supabase) {
    const novo: Profissional = { ...p, id: `p${Date.now()}` };
    profissionaisMemoria = [...profissionaisMemoria, novo];
    return novo;
  }

  const { data, error } = await supabase
    .from("profissionais")
    .insert({
      nome: p.nome,
      especialidade: p.especialidade,
      dias_trabalho: p.diasTrabalho,
      inicio: p.inicio,
      fim: p.fim,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao cadastrar profissional:", error.message);
    return null;
  }

  return rowToProfissional(data as ProfissionalRow);
}

export async function removeProfissional(id: string): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    profissionaisMemoria = profissionaisMemoria.filter((p) => p.id !== id);
    return true;
  }

  const { error } = await supabase.from("profissionais").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover profissional:", error.message);
    return false;
  }

  return true;
}

// ------------------------------------------------------------------
// Agendamentos
// ------------------------------------------------------------------

export async function getAgendamentos(): Promise<Agendamento[]> {
  if (!supabaseAtivo || !supabase) {
    return agendamentosMemoria;
  }

  const { data, error } = await supabase
    .from("agendamentos")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Erro ao buscar agendamentos:", error.message);
    return [];
  }

  return (data as AgendamentoRow[]).map(rowToAgendamento);
}

export async function addAgendamento(
  a: Omit<Agendamento, "id" | "criadoEm" | "status">
): Promise<Agendamento | null> {
  if (!supabaseAtivo || !supabase) {
    const novo: Agendamento = {
      ...a,
      id: `a${Date.now()}`,
      status: "confirmado",
      criadoEm: new Date().toISOString(),
    };
    agendamentosMemoria = [...agendamentosMemoria, novo];
    return novo;
  }

  const { data, error } = await supabase
    .from("agendamentos")
    .insert({
      servico_id: a.servicoId,
      servico_nome: a.servicoNome,
      preco: a.preco,
      profissional_id: a.profissionalId,
      profissional_nome: a.profissionalNome,
      dia: a.dia,
      hora: a.hora,
      cliente: a.cliente,
      telefone: a.telefone,
      status: "confirmado",
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar agendamento:", error.message);
    return null;
  }

  return rowToAgendamento(data as AgendamentoRow);
}

export async function updateAgendamentoStatus(
  id: string,
  status: StatusAgendamento
): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    agendamentosMemoria = agendamentosMemoria.map((a) =>
      a.id === id ? { ...a, status } : a
    );
    return true;
  }

  const { error } = await supabase
    .from("agendamentos")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar status do agendamento:", error.message);
    return false;
  }

  return true;
}

export async function removeAgendamento(id: string): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    agendamentosMemoria = agendamentosMemoria.filter((a) => a.id !== id);
    return true;
  }

  const { error } = await supabase.from("agendamentos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover agendamento:", error.message);
    return false;
  }

  return true;
}
