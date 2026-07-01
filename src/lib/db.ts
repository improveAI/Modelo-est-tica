import { supabase, supabaseAtivo } from "./supabase";
import type { Profissional, Agendamento, StatusAgendamento, Servico, Bloqueio } from "@/types";
import { servicosPadrao } from "@/data/config";

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

let servicosMemoria: Servico[] = servicosPadrao.map((s) => ({ ...s }));
let bloqueiosMemoria: Bloqueio[] = [];

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

// ------------------------------------------------------------------
// Serviços
// ------------------------------------------------------------------

type ServicoRow = {
  id: string;
  nome: string;
  descricao: string | null;
  duracao: number;
  preco: number;
  categoria: string;
  foto_url: string | null;
  ativo: boolean;
  criado_em: string;
};

function rowToServico(row: ServicoRow): Servico {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao ?? "",
    duracao: row.duracao,
    preco: Number(row.preco),
    categoria: row.categoria,
    fotoUrl: row.foto_url ?? undefined,
    ativo: row.ativo,
  };
}

/** Somente serviços ativos — usado pelo site público. */
export async function getServicos(): Promise<Servico[]> {
  if (!supabaseAtivo || !supabase) {
    return servicosMemoria.filter((s) => s.ativo !== false);
  }

  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .eq("ativo", true)
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("Erro ao buscar serviços:", error.message);
    return [];
  }

  return (data as ServicoRow[]).map(rowToServico);
}

/** Todos os serviços (ativos e inativos) — usado pelo painel. */
export async function getServicosAdmin(): Promise<Servico[]> {
  if (!supabaseAtivo || !supabase) {
    return servicosMemoria;
  }

  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .order("criado_em", { ascending: true });

  if (error) {
    console.error("Erro ao buscar serviços (admin):", error.message);
    return [];
  }

  return (data as ServicoRow[]).map(rowToServico);
}

export async function addServico(
  s: Omit<Servico, "id" | "ativo">
): Promise<Servico | null> {
  if (!supabaseAtivo || !supabase) {
    const novo: Servico = { ...s, id: `s${Date.now()}`, ativo: true };
    servicosMemoria = [...servicosMemoria, novo];
    return novo;
  }

  const { data, error } = await supabase
    .from("servicos")
    .insert({
      nome: s.nome,
      descricao: s.descricao,
      duracao: s.duracao,
      preco: s.preco,
      categoria: s.categoria,
      foto_url: s.fotoUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao cadastrar serviço:", error.message);
    return null;
  }

  return rowToServico(data as ServicoRow);
}

export async function updateServico(
  id: string,
  s: Partial<Omit<Servico, "id" | "ativo">>
): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    servicosMemoria = servicosMemoria.map((x) =>
      x.id === id ? { ...x, ...s } : x
    );
    return true;
  }

  const patch: Record<string, unknown> = {};
  if (s.nome !== undefined) patch.nome = s.nome;
  if (s.descricao !== undefined) patch.descricao = s.descricao;
  if (s.duracao !== undefined) patch.duracao = s.duracao;
  if (s.preco !== undefined) patch.preco = s.preco;
  if (s.categoria !== undefined) patch.categoria = s.categoria;
  if (s.fotoUrl !== undefined) patch.foto_url = s.fotoUrl;

  const { error } = await supabase.from("servicos").update(patch).eq("id", id);

  if (error) {
    console.error("Erro ao atualizar serviço:", error.message);
    return false;
  }

  return true;
}

export async function toggleAtivoServico(
  id: string,
  ativo: boolean
): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    servicosMemoria = servicosMemoria.map((s) =>
      s.id === id ? { ...s, ativo } : s
    );
    return true;
  }

  const { error } = await supabase
    .from("servicos")
    .update({ ativo })
    .eq("id", id);

  if (error) {
    console.error("Erro ao alterar ativo do serviço:", error.message);
    return false;
  }

  return true;
}

export async function removeServico(id: string): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    servicosMemoria = servicosMemoria.filter((s) => s.id !== id);
    return true;
  }

  const { error } = await supabase.from("servicos").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover serviço:", error.message);
    return false;
  }

  return true;
}

// ------------------------------------------------------------------
// Bloqueios de horário
// ------------------------------------------------------------------

type BloqueioRow = {
  id: string;
  profissional_id: string | null;
  dia: string;
  hora_inicio: string;
  hora_fim: string;
  motivo: string | null;
  criado_em: string;
};

function rowToBloqueio(row: BloqueioRow): Bloqueio {
  return {
    id: row.id,
    profissionalId: row.profissional_id,
    dia: row.dia,
    horaInicio: row.hora_inicio,
    horaFim: row.hora_fim,
    motivo: row.motivo ?? undefined,
    criadoEm: row.criado_em,
  };
}

/** Todos os bloqueios — usado pelo painel e pela home (para filtrar horas). */
export async function getBloqueios(): Promise<Bloqueio[]> {
  if (!supabaseAtivo || !supabase) {
    return bloqueiosMemoria;
  }

  const { data, error } = await supabase
    .from("bloqueios")
    .select("*")
    .order("dia", { ascending: true });

  if (error) {
    console.error("Erro ao buscar bloqueios:", error.message);
    return [];
  }

  return (data as BloqueioRow[]).map(rowToBloqueio);
}

export async function addBloqueio(
  b: Omit<Bloqueio, "id" | "criadoEm">
): Promise<Bloqueio | null> {
  if (!supabaseAtivo || !supabase) {
    const novo: Bloqueio = {
      ...b,
      id: `bl${Date.now()}`,
      criadoEm: new Date().toISOString(),
    };
    bloqueiosMemoria = [...bloqueiosMemoria, novo];
    return novo;
  }

  const { data, error } = await supabase
    .from("bloqueios")
    .insert({
      profissional_id: b.profissionalId,
      dia: b.dia,
      hora_inicio: b.horaInicio,
      hora_fim: b.horaFim,
      motivo: b.motivo ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar bloqueio:", error.message);
    return null;
  }

  return rowToBloqueio(data as BloqueioRow);
}

export async function removeBloqueio(id: string): Promise<boolean> {
  if (!supabaseAtivo || !supabase) {
    bloqueiosMemoria = bloqueiosMemoria.filter((b) => b.id !== id);
    return true;
  }

  const { error } = await supabase.from("bloqueios").delete().eq("id", id);

  if (error) {
    console.error("Erro ao remover bloqueio:", error.message);
    return false;
  }

  return true;
}

/** Verifica se um slot de hora está bloqueado para um dado profissional e dia. */
export function horaBloqueada(
  hora: string,
  dia: string,
  profissionalId: string,
  bloqueios: Bloqueio[]
): boolean {
  return bloqueios.some(
    (b) =>
      b.dia === dia &&
      (b.profissionalId === null || b.profissionalId === profissionalId) &&
      hora >= b.horaInicio &&
      hora < b.horaFim
  );
}
