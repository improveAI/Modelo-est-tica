"use client";

import { siteConfig } from "@/data/config";
import { Reveal } from "@/components/ui/Reveal";

const diferenciais = [
  "Profissionais especializadas e produtos premium",
  "Ambiente acolhedor, pensado para o seu relaxamento",
  "Agendamento online, sem espera e sem complicação",
];

export function Sobre() {
  return (
    <section id="sobre" className="bg-linen/50 py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-7 md:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-linha">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop"
              alt="Interior do espaço de estética"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow mb-4">O espaço</p>
          <h2 className="font-display text-4xl font-500 leading-tight text-cacau md:text-5xl">
            Um refúgio para
            <br />
            cuidar de si
          </h2>
          <p className="mt-6 font-body leading-relaxed text-taupe">
            A {siteConfig.nome} nasceu em {siteConfig.fundadoEm}, em {siteConfig.cidade},
            com um propósito simples: oferecer um espaço onde cada pessoa se sinta
            acolhida e cuidada de verdade.
          </p>
          <p className="mt-4 font-body leading-relaxed text-taupe">
            Aqui, beleza e bem-estar caminham juntos. Cada detalhe foi pensado para
            que o seu tempo conosco seja só seu.
          </p>

          <ul className="mt-8 space-y-4">
            {diferenciais.map((d) => (
              <li key={d} className="flex items-start gap-3 font-body text-cacau">
                <span className="mt-1 font-display text-ouro">—</span>
                {d}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
