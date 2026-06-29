"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/data/config";

export function Hero() {
  const anos = new Date().getFullYear() - parseInt(siteConfig.fundadoEm);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* imagem de fundo suave */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(rgba(247,241,234,0.55), rgba(247,241,234,0.8)), url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop') center/cover",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-7">
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {siteConfig.tagline} · {siteConfig.cidade}
          </motion.p>

          <motion.h1
            className="font-display text-5xl font-500 leading-[1.05] text-cacau sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
          >
            O cuidado que
            <br />
            <span className="italic text-ouro">você merece.</span>
          </motion.h1>

          <motion.p
            className="mt-7 max-w-md font-body text-lg leading-relaxed text-taupe"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34 }}
          >
            Tratamentos faciais e corporais num espaço pensado para o seu bem-estar.
            Agende seu momento em poucos cliques.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.46 }}
          >
            <a href="#agendar" className="btn-primary">
              Agendar horário
            </a>
            <a href="#servicos" className="btn-ghost">
              Ver serviços
            </a>
          </motion.div>

          <motion.div
            className="mt-16 flex gap-12 border-t border-linha pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Stat num={`${anos}`} label="Anos de cuidado" />
            <Stat num="5k+" label="Clientes felizes" />
            <Stat num="4.9★" label="Avaliação" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl font-600 text-ouro">{num}</div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-taupe">
        {label}
      </div>
    </div>
  );
}
