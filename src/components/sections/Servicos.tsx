"use client";

import { brl } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import type { Servico } from "@/types";

interface Props {
  servicos: Servico[];
}

export function Servicos({ servicos }: Props) {
  return (
    <section id="servicos" className="bg-champagne py-28">
      <div className="mx-auto max-w-6xl px-7">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <p className="eyebrow mb-4">Nosso menu</p>
          <h2 className="font-display text-4xl font-500 text-cacau md:text-5xl">
            Tratamentos & rituais
          </h2>
          <p className="mt-4 font-body text-taupe">
            Cada serviço é um momento dedicado a você. Escolha o seu.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-linha bg-linen/40 transition-all duration-300 hover:-translate-y-1 hover:border-ouro/50 hover:bg-linen overflow-hidden">
                {s.fotoUrl && (
                  <img
                    src={s.fotoUrl}
                    alt={s.nome}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest2 text-ouro">
                    {s.categoria}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-500 text-cacau">
                    {s.nome}
                  </h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-taupe">
                    {s.descricao}
                  </p>
                  <div className="mt-6 flex items-end justify-between border-t border-linha pt-5">
                    <span className="font-mono text-xs text-taupe">{s.duracao} min</span>
                    <span className="font-display text-2xl font-600 text-ouro">
                      {brl(s.preco)}
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
