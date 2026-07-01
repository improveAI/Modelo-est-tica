// ============================================================
// Tipos centrais do projeto
// ============================================================

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  duracao: number; // minutos
  preco: number; // reais
  categoria: string;
  fotoUrl?: string;
  ativo?: boolean; // undefined = true (serviços do config.ts não têm este campo)
}

export interface Contato {
  whatsapp: string;
  telefone: string;
  email: string;
  endereco: string;
  instagram: string;
  mapsLink: string;
}

export interface SiteConfig {
  nome: string;
  tagline: string;
  cidade: string;
  fundadoEm: string;
  contato: Contato;
  horario: string;
  senhaPainel: string;
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  diasTrabalho: number[]; // 0=Dom ... 6=Sáb
  inicio: string; // "09:00"
  fim: string; // "19:00"
}

export interface Bloqueio {
  id: string;
  profissionalId: string | null; // null = bloqueia para todas
  dia: string;        // AAAA-MM-DD
  horaInicio: string; // "09:00"
  horaFim: string;    // "11:00" — bloqueia slots >= inicio e < fim
  motivo?: string;
  criadoEm: string;
}

export type StatusAgendamento = "confirmado" | "concluido" | "faltou" | "cancelado";

export interface Agendamento {
  id: string;
  servicoId: string;
  servicoNome: string;
  preco: number;
  profissionalId: string;
  profissionalNome: string;
  dia: string; // AAAA-MM-DD
  hora: string; // "14:30"
  cliente: string;
  telefone: string;
  status: StatusAgendamento;
  criadoEm: string;
}
