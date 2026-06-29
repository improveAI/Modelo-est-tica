# Lumière — Site de Estética com Agendamento

Site institucional + sistema de agendamento online para clínicas de estética e
beleza, com um painel de gestão completo pra dona do negócio acompanhar a
agenda, os profissionais e o faturamento. Template adaptável da **improveAI**.

## Funcionalidades

**Site público**
- Landing page institucional (hero, serviços, sobre, contato/footer).
- Fluxo de agendamento em 4 passos: serviço → profissional → dia/horário → dados do cliente.
- Os agendamentos feitos no site aparecem em tempo real no painel da dona (mesmo banco Supabase).

**Painel de gestão (`/painel`)**
- Cadastro e remoção de profissionais (nome, especialidade, dias e horário de trabalho).
- Agenda com 4 visões: **Mês** (calendário com indicador de quantidade por dia), **Semana** (grade dia × horário), **Dia** (timeline do expediente) e **Lista** (cronológica).
- Filtro por profissional e busca por nome de cliente, aplicados em todas as visões.
- Status de cada agendamento (**confirmado / concluído / faltou / cancelado**), editável direto no card.
- Exclusão definitiva de agendamento (separada do cancelamento, que só muda o status e preserva o histórico).
- Dashboard com KPIs (agendamentos, agendamentos do dia, faturamento do mês, nº de profissionais) e gráficos (agendamentos por dia da semana, serviços mais procurados).
- Login simples por senha (demo — ver seção de próximos passos).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design tokens em `tailwind.config.ts` — paleta nude/dourado: `champagne`, `ouro`, `cacau`, `taupe`, `linha`)
- **Supabase** (banco de dados + autenticação de API) — liga automaticamente quando as variáveis de ambiente estão presentes; sem elas, o app cai num fallback em memória e continua funcionando
- **Framer Motion** (animações de entrada/transição)
- **Recharts** (gráficos do dashboard)
- **lucide-react** (ícones)

## Rodando localmente

Pré-requisitos: Node.js 20+ e npm.

```bash
npm install
npm run dev
```

Abra http://localhost:3000

- Site público: `/`
- Painel da gestão: `/painel` (senha demo: `admin123`)

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com as chaves do seu projeto Supabase:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

**Sem essas variáveis o app não quebra** — `src/lib/supabase.ts` detecta a
ausência e `src/lib/db.ts` usa um fallback em memória (dados resetam ao
recarregar a página), útil pra rodar/demonstrar sem precisar de banco.

`.env.local` nunca deve ser commitado — já está no `.gitignore`.

## Configurar o Supabase (persistência real)

1. Crie um projeto em https://supabase.com.
2. No **SQL Editor** do projeto, rode o conteúdo de `supabase/schema.sql` — isso cria as tabelas `profissionais` e `agendamentos`, os índices e as políticas de RLS (Row Level Security).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
4. Cole essas duas chaves no `.env.local` (ver seção acima).
5. Reinicie `npm run dev`. Com as variáveis presentes, o cliente Supabase ativa automaticamente e `src/lib/db.ts` passa a ler/escrever direto no banco — home e painel compartilham os mesmos dados.

> Se o banco já existia antes do campo de status do agendamento, `supabase/schema.sql` também tem uma seção de **migração** (`alter table` + policy de update) — role até o fim do arquivo.

## Estrutura de pastas

```
src/
  app/
    layout.tsx              # layout raiz + fontes
    page.tsx                # home (site público)
    globals.css             # base + componentes Tailwind
    painel/page.tsx         # painel da dona — login, carregamento de dados e handlers
  components/
    sections/                # Header, Hero, Servicos, Sobre, Agendamento, Footer
    ui/                      # Reveal (animação on scroll)
    painel/                  # toda a UI do painel de gestão
      AgendaTab.tsx           # orquestra visão/data/filtros e renderiza a visão ativa
      AgendaToolbar.tsx       # seletor de visão, navegação, filtro de profissional, busca
      Calendario.tsx          # visão mês
      VisaoSemana.tsx         # visão semana
      VisaoDia.tsx            # visão dia (timeline)
      VisaoLista.tsx          # visão lista
      Dashboard.tsx           # KPIs + gráficos (recharts)
      AgendamentoCard.tsx     # card reutilizável (cliente, serviço, status, excluir)
      StatusBadge.tsx         # badge/dropdown de status do agendamento
      ProfissionaisTab.tsx    # cadastro/remoção de profissionais
      agendaUtils.ts          # funções puras de data (mês/semana/formatação)
  data/
    config.ts                # ⭐ CONFIG DO CLIENTE — edite aqui pra cada cliente
  lib/
    db.ts                    # leitura/escrita de profissionais e agendamentos (Supabase, com fallback em memória)
    supabase.ts               # cliente Supabase (só ativa se houver variáveis de ambiente)
    utils.ts                  # helpers (cn, brl, DIAS, HORAS, etc.)
  types/
    index.ts                  # tipos TypeScript centrais (Profissional, Agendamento, StatusAgendamento...)
supabase/
  schema.sql                  # schema do banco + migrações (rodar no SQL Editor do Supabase)
```

## Adaptar pra um novo cliente

1. Edite **`src/data/config.ts`**: nome, tagline, cidade, contato, horário e lista de serviços.
2. As cores ficam em `tailwind.config.ts`, na paleta `champagne` / `linen` / `cacau` / `taupe` / `ouro` / `ouro-rose` / `linha` — troque os valores hex pra mudar a identidade visual sem tocar nos componentes.
3. Troque as imagens placeholder (Hero e Sobre) pelas fotos reais do cliente.
4. Crie um projeto Supabase próprio pro cliente e siga a seção "Configurar o Supabase" acima.

## Próximos passos sugeridos

- [ ] Bloquear horários já ocupados no agendamento (cruzar com agendamentos existentes)
- [ ] Auth real no painel (Supabase Auth) no lugar da senha fixa
- [ ] Enviar confirmação por WhatsApp/email ao agendar
- [ ] Página de cada serviço (SEO)
- [ ] Trocar imagens placeholder pelas reais do cliente

## Deploy

Recomendado: **Vercel** (criadora do Next.js, deploy em 1 clique a partir do GitHub).

1. Importe o repositório em https://vercel.com/new.
2. Configure as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) em **Project Settings → Environment Variables**.
3. Deploy — a Vercel detecta o Next.js automaticamente, sem configuração extra.

---
Feito pela **improveAI** · Inteligência que trabalha por você
