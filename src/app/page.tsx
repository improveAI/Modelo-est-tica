"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Servicos } from "@/components/sections/Servicos";
import { Sobre } from "@/components/sections/Sobre";
import { Agendamento } from "@/components/sections/Agendamento";
import { Footer } from "@/components/sections/Footer";
import { getProfissionais, getServicos, getBloqueios, addAgendamento } from "@/lib/db";
import type { Agendamento as AgendamentoType, Profissional, Servico, Bloqueio } from "@/types";

export default function Home() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
    getServicos().then(setServicos);
    getBloqueios().then(setBloqueios);
  }, []);

  async function handleAgendar(a: Omit<AgendamentoType, "id" | "criadoEm" | "status">) {
    await addAgendamento(a);
  }

  return (
    <main>
      <Header />
      <Hero />
      <Servicos servicos={servicos} />
      <Sobre />
      <Agendamento servicos={servicos} profissionais={profissionais} bloqueios={bloqueios} onAgendar={handleAgendar} />
      <Footer />
    </main>
  );
}
