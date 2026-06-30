"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { brl, DIAS, HORAS } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import type { Servico, Profissional, Agendamento } from "@/types";

interface Props {
  servicos: Servico[];
  profissionais: Profissional[];
  onAgendar: (a: Omit<Agendamento, "id" | "criadoEm" | "status">) => void;
}

type Escolha = {
  servico: Servico | null;
  profissional: Profissional | null;
  dia: Date | null;
  hora: string | null;
  nome: string;
  telefone: string;
};

const vazio: Escolha = {
  servico: null,
  profissional: null,
  dia: null,
  hora: null,
  nome: "",
  telefone: "",
};

export function Agendamento({ servicos, profissionais, onAgendar }: Props) {
  const [etapa, setEtapa] = useState(1);
  const [e, setE] = useState<Escolha>(vazio);
  const [pronto, setPronto] = useState(false);

  const proximosDias = useMemo(() => {
    const arr: Date[] = [];
    const hoje = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(hoje);
      d.setDate(hoje.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  function horasLivres(prof: Profissional | null, dia: Date | null) {
    if (!prof || !dia) return [];
    if (!prof.diasTrabalho.includes(dia.getDay())) return [];
    return HORAS.filter((h) => h >= prof.inicio && h < prof.fim);
  }

  function confirmar() {
    if (!e.servico || !e.profissional || !e.dia || !e.hora) return;
    onAgendar({
      servicoId: e.servico.id,
      servicoNome: e.servico.nome,
      preco: e.servico.preco,
      profissionalId: e.profissional.id,
      profissionalNome: e.profissional.nome,
      dia: e.dia.toISOString().slice(0, 10),
      hora: e.hora,
      cliente: e.nome,
      telefone: e.telefone,
    });
    setPronto(true);
  }

  if (pronto) {
    return (
      <section id="agendar" className="bg-champagne py-28">
        <div className="mx-auto max-w-lg px-7 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-ouro/15">
            <Check size={40} className="text-ouro" />
          </div>
          <h2 className="font-display text-4xl font-500 text-cacau">Agendado!</h2>
          <p className="mt-4 font-body text-taupe">
            {e.nome.split(" ")[0]}, seu horário com {e.profissional?.nome.split(" ")[0]} está
            reservado para {e.dia && `${DIAS[e.dia.getDay()]} ${e.dia.getDate()}/${e.dia.getMonth() + 1}`} às {e.hora}.
          </p>
          <button
            onClick={() => {
              setE(vazio);
              setEtapa(1);
              setPronto(false);
            }}
            className="btn-primary mt-8"
          >
            Fazer outro agendamento
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="agendar" className="bg-champagne py-28">
      <div className="mx-auto max-w-2xl px-7">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow mb-4">Reserve seu momento</p>
          <h2 className="font-display text-4xl font-500 text-cacau md:text-5xl">
            Agende online
          </h2>
        </Reveal>

        <Passos etapa={etapa} />

        <AnimatePresence mode="wait">
          <motion.div
            key={etapa}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-10"
          >
            {/* 1: serviço */}
            {etapa === 1 && (
              <Bloco titulo="Escolha o serviço">
                {servicos.map((s) => (
                  <Opcao
                    key={s.id}
                    onClick={() => {
                      setE((x) => ({ ...x, servico: s }));
                      setEtapa(2);
                    }}
                  >
                    <div>
                      <div className="font-display text-xl text-cacau">{s.nome}</div>
                      <div className="font-body text-sm text-taupe">{s.duracao} min</div>
                    </div>
                    <div className="font-display text-xl font-600 text-ouro">
                      {brl(s.preco)}
                    </div>
                  </Opcao>
                ))}
              </Bloco>
            )}

            {/* 2: profissional */}
            {etapa === 2 && (
              <Bloco titulo="Escolha a profissional" voltar={() => setEtapa(1)}>
                {profissionais.map((p) => (
                  <Opcao
                    key={p.id}
                    onClick={() => {
                      setE((x) => ({ ...x, profissional: p }));
                      setEtapa(3);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ouro font-display text-xl font-600 text-champagne">
                        {p.nome[0]}
                      </div>
                      <div>
                        <div className="font-display text-lg text-cacau">{p.nome}</div>
                        <div className="font-body text-sm text-taupe">{p.especialidade}</div>
                      </div>
                    </div>
                  </Opcao>
                ))}
              </Bloco>
            )}

            {/* 3: dia e hora */}
            {etapa === 3 && (
              <Bloco titulo="Escolha dia e horário" voltar={() => setEtapa(2)}>
                <div className="mb-6 flex gap-3 overflow-x-auto pb-3">
                  {proximosDias.map((d, i) => {
                    const ativo = e.dia?.toDateString() === d.toDateString();
                    const trabalha = e.profissional?.diasTrabalho.includes(d.getDay());
                    return (
                      <button
                        key={i}
                        disabled={!trabalha}
                        onClick={() => setE((x) => ({ ...x, dia: d, hora: null }))}
                        className={`flex w-16 shrink-0 flex-col items-center rounded-xl border py-3 transition-all ${
                          ativo
                            ? "border-ouro bg-ouro text-champagne"
                            : "border-linha bg-linen/40 text-cacau"
                        } ${!trabalha ? "cursor-not-allowed opacity-30" : "hover:border-ouro"}`}
                      >
                        <span className="font-mono text-[10px] uppercase">{DIAS[d.getDay()]}</span>
                        <span className="font-display text-xl font-600">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>

                {e.dia && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {horasLivres(e.profissional, e.dia).map((h) => (
                      <button
                        key={h}
                        onClick={() => setE((x) => ({ ...x, hora: h }))}
                        className={`rounded-xl border py-3 font-mono text-sm transition-all ${
                          e.hora === h
                            ? "border-ouro bg-ouro text-champagne"
                            : "border-linha bg-linen/40 text-cacau hover:border-ouro"
                        }`}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                )}

                {e.hora && (
                  <button onClick={() => setEtapa(4)} className="btn-primary mt-8 w-full">
                    Continuar
                  </button>
                )}
              </Bloco>
            )}

            {/* 4: dados */}
            {etapa === 4 && (
              <Bloco titulo="Seus dados" voltar={() => setEtapa(3)}>
                <Resumo e={e} />
                <input
                  placeholder="Seu nome"
                  value={e.nome}
                  onChange={(ev) => setE((x) => ({ ...x, nome: ev.target.value }))}
                  className="w-full rounded-xl border border-linha bg-linen/40 px-5 py-3.5 font-body text-cacau outline-none transition-colors placeholder:text-taupe focus:border-ouro"
                />
                <input
                  placeholder="WhatsApp (com DDD)"
                  value={e.telefone}
                  onChange={(ev) => setE((x) => ({ ...x, telefone: ev.target.value }))}
                  className="mt-4 w-full rounded-xl border border-linha bg-linen/40 px-5 py-3.5 font-body text-cacau outline-none transition-colors placeholder:text-taupe focus:border-ouro"
                />
                <button
                  disabled={!e.nome || !e.telefone}
                  onClick={confirmar}
                  className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Confirmar agendamento
                </button>
              </Bloco>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function Passos({ etapa }: { etapa: number }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4].map((n, i) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs transition-colors ${
              etapa >= n ? "bg-ouro text-champagne" : "bg-linen text-taupe"
            }`}
          >
            {n}
          </div>
          {i < 3 && <div className="h-px w-6 bg-linha" />}
        </div>
      ))}
    </div>
  );
}

function Bloco({
  titulo,
  voltar,
  children,
}: {
  titulo: string;
  voltar?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        {voltar && (
          <button onClick={voltar} className="text-ouro" aria-label="Voltar">
            <ChevronLeft size={22} />
          </button>
        )}
        <h3 className="font-display text-2xl font-500 text-cacau">{titulo}</h3>
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function Opcao({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl border border-linha bg-linen/40 px-6 py-5 text-left transition-all hover:border-ouro hover:bg-linen"
    >
      {children}
    </button>
  );
}

function Resumo({ e }: { e: Escolha }) {
  const linha = (k: string, v: string) => (
    <div className="flex justify-between border-b border-linha py-2">
      <span className="font-body text-taupe">{k}</span>
      <span className="font-display text-cacau">{v}</span>
    </div>
  );
  return (
    <div className="mb-6 rounded-2xl border border-linha bg-linen/40 p-5">
      {linha("Serviço", e.servico?.nome ?? "")}
      {linha("Profissional", e.profissional?.nome ?? "")}
      {linha(
        "Quando",
        e.dia ? `${DIAS[e.dia.getDay()]} ${e.dia.getDate()}/${e.dia.getMonth() + 1} às ${e.hora}` : ""
      )}
      {linha("Valor", e.servico ? brl(e.servico.preco) : "")}
    </div>
  );
}
