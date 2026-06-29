import type { SiteConfig } from "@/types";

/**
 * CONFIG DO CLIENTE
 * Tudo que muda de um cliente pro outro fica aqui.
 * Troque os valores e o site inteiro se adapta.
 */
export const siteConfig: SiteConfig = {
  nome: "Lumière",
  tagline: "Estética & Beleza",
  cidade: "São Paulo",
  fundadoEm: "2016",

  contato: {
    whatsapp: "5511999999999", // só números, com DDI 55
    telefone: "(11) 99999-9999",
    email: "contato@lumiere.com.br",
    endereco: "Rua das Flores, 88 — Jardins, São Paulo",
    instagram: "lumiere.estetica",
    mapsLink: "https://maps.google.com/?q=Rua+das+Flores+88+Sao+Paulo",
  },

  horario: "Ter a Sáb · 9h às 19h",

  servicos: [
    {
      id: "limpeza-pele",
      nome: "Limpeza de Pele Profunda",
      descricao: "Higienização completa com extração e máscara calmante.",
      duracao: 60,
      preco: 180,
      categoria: "Facial",
    },
    {
      id: "design-sobrancelha",
      nome: "Design de Sobrancelhas",
      descricao: "Mapeamento facial e modelagem com cera ou pinça.",
      duracao: 30,
      preco: 70,
      categoria: "Sobrancelhas",
    },
    {
      id: "massagem-relaxante",
      nome: "Massagem Relaxante",
      descricao: "Técnica corporal para alívio de tensões e bem-estar.",
      duracao: 60,
      preco: 150,
      categoria: "Corporal",
    },
    {
      id: "drenagem",
      nome: "Drenagem Linfática",
      descricao: "Estimula a circulação e reduz a retenção de líquidos.",
      duracao: 60,
      preco: 160,
      categoria: "Corporal",
    },
    {
      id: "peeling",
      nome: "Peeling de Diamante",
      descricao: "Esfoliação que renova a pele e suaviza marcas.",
      duracao: 45,
      preco: 200,
      categoria: "Facial",
    },
    {
      id: "spa-maos",
      nome: "Spa dos Pés e Mãos",
      descricao: "Hidratação profunda, esfoliação e cuidado completo.",
      duracao: 50,
      preco: 120,
      categoria: "Mãos & Pés",
    },
  ],

  // senha do painel da dona (demo — em produção isso vira auth do Supabase)
  senhaPainel: "admin123",
};
