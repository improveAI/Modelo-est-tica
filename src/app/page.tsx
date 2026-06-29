"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Servicos } from "@/components/sections/Servicos";
import { Sobre } from "@/components/sections/Sobre";
import { Agendamento } from "@/components/sections/Agendamento";
import { Footer } from "@/components/sections/Footer";
import { getProfissionais, addAgendamento } from "@/lib/db";
import type { Agendamento as AgendamentoType, Profissional } from "@/types";

export default function Home() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
  }, []);

  async function handleAgendar(a: Omit<AgendamentoType, "id" | "criadoEm" | "status">) {
    await addAgendamento(a);
  }

  return (
    <main>
      <Header />
      <Hero />
      <Servicos />
      <Sobre />
      <Agendamento profissionais={profissionais} onAgendar={handleAgendar} />
      <Footer />
    </main>
  );
}
