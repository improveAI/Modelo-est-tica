-- ============================================================
-- Schema do banco — Lumière Estética
-- Rode isto no SQL Editor do Supabase quando for ligar o banco.
-- ============================================================

-- Profissionais
create table if not exists profissionais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  especialidade text,
  dias_trabalho int[] not null default '{2,3,4,5,6}', -- 0=Dom ... 6=Sáb
  inicio text not null default '09:00',
  fim text not null default '19:00',
  criado_em timestamptz not null default now()
);

-- Agendamentos
create table if not exists agendamentos (
  id uuid primary key default gen_random_uuid(),
  servico_id text not null,
  servico_nome text not null,
  preco numeric not null,
  profissional_id uuid references profissionais(id) on delete set null,
  profissional_nome text not null,
  dia date not null,
  hora text not null,
  cliente text not null,
  telefone text not null,
  status text not null default 'confirmado'
    check (status in ('confirmado','concluido','faltou','cancelado')),
  criado_em timestamptz not null default now()
);

-- Índice para buscar horários ocupados rápido
create index if not exists idx_agendamentos_prof_dia
  on agendamentos (profissional_id, dia);

-- ============================================================
-- RLS (Row Level Security)
-- Ajuste conforme sua necessidade de auth. Exemplo permissivo
-- para começar (leitura pública, escrita pública). Em produção,
-- restrinja a escrita do painel a usuários autenticados.
-- ============================================================
alter table profissionais enable row level security;
alter table agendamentos enable row level security;

-- leitura pública (o site mostra profissionais e horários)
create policy "leitura publica profissionais" on profissionais
  for select using (true);

create policy "leitura publica agendamentos" on agendamentos
  for select using (true);

-- inserção pública de agendamentos (cliente marca horário)
create policy "cliente cria agendamento" on agendamentos
  for insert with check (true);

-- ATENÇÃO: o painel ainda não tem Supabase Auth (só uma senha fixa
-- client-side em src/data/config.ts), então a escrita de profissionais
-- fica pública por enquanto, igual a inserção de agendamento acima.
-- Quando o painel tiver login real via Supabase Auth, troque estas
-- duas policies por uma só restrita a authenticated, ex:
--   create policy "dono gerencia profissionais" on profissionais
--     for all using (auth.role() = 'authenticated');
create policy "painel cadastra profissional" on profissionais
  for insert with check (true);

create policy "painel remove profissional" on profissionais
  for delete using (true);

-- mesma ressalva: sem auth real ainda, então o cancelamento de
-- agendamento pelo painel também fica com policy pública por ora.
create policy "painel cancela agendamento" on agendamentos
  for delete using (true);

-- ============================================================
-- Migração: projeto já existia antes do campo "status" e da
-- visão de agenda completa do painel. Rode isto uma vez no SQL
-- Editor se sua tabela "agendamentos" já estava criada (quem
-- criar o banco do zero já recebe a coluna pela definição acima).
-- ============================================================
alter table agendamentos
  add column if not exists status text not null default 'confirmado'
  check (status in ('confirmado','concluido','faltou','cancelado'));

create policy "painel atualiza status agendamento" on agendamentos
  for update using (true) with check (true);
