"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Servicos } from "@/components/sections/Servicos";
import { Sobre } from "@/components/sections/Sobre";
import { Agendamento } from "@/components/sections/Agendamento";
import { Footer } from "@/components/sections/Footer";
import { getProfissionais, getServicos, addAgendamento } from "@/lib/db";
import type { Agendamento as AgendamentoType, Profissional, Servico } from "@/types";

export default function Home() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);

  useEffect(() => {
    getProfissionais().then(setProfissionais);
    getServicos().then(setServicos);
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
      <Agendamento servicos={servicos} profissionais={profissionais} onAgendar={handleAgendar} />
      <Footer />
    </main>
  );
}
