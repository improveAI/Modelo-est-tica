"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/data/config";
import { cn } from "@/lib/utils";

const links = [
  { href: "#servicos", label: "Serviços" },
  { href: "#sobre", label: "O Espaço" },
  { href: "#agendar", label: "Agendar" },
  { href: "#contato", label: "Contato" },
];

export function Header() {
  const [aberto, setAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-champagne/90 backdrop-blur-md border-b border-linha"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-7 py-5">
        <a href="#" className="font-display text-2xl font-600 tracking-wide text-cacau">
          {siteConfig.nome}
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-body text-sm uppercase tracking-[0.12em] text-taupe transition-colors hover:text-ouro"
            >
              {l.label}
            </a>
          ))}
          <a href="#agendar" className="btn-primary">
            Agendar
          </a>
        </nav>

        <button
          className="text-cacau md:hidden"
          onClick={() => setAberto((v) => !v)}
          aria-label="Menu"
        >
          {aberto ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* menu mobile */}
      <div
        className={cn(
          "overflow-hidden border-b border-linha bg-champagne transition-all duration-300 md:hidden",
          aberto ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col px-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAberto(false)}
              className="border-b border-linha py-4 font-body text-sm uppercase tracking-[0.12em] text-taupe"
            >
              {l.label}
            </a>
          ))}
          <a href="#agendar" onClick={() => setAberto(false)} className="btn-primary my-5">
            Agendar
          </a>
        </nav>
      </div>
    </header>
  );
}
