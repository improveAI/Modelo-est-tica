"use client";

import { Phone, MapPin, Instagram, Mail } from "lucide-react";
import { siteConfig } from "@/data/config";

export function Footer() {
  const { contato } = siteConfig;
  const ano = new Date().getFullYear();

  return (
    <footer id="contato" className="border-t border-linha bg-linen/50 py-20">
      <div className="mx-auto max-w-6xl px-7">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="font-display text-3xl font-600 text-cacau">
              {siteConfig.nome}
            </div>
            <p className="mt-3 font-body text-sm text-taupe">{siteConfig.tagline}</p>
            <p className="mt-1 font-body text-sm text-taupe">{siteConfig.horario}</p>
          </div>

          <div>
            <h4 className="mb-5 font-mono text-xs uppercase tracking-widest2 text-ouro">
              Contato
            </h4>
            <div className="space-y-3 font-body text-sm text-taupe">
              <a href={`tel:+${contato.whatsapp}`} className="flex items-center gap-2 hover:text-ouro">
                <Phone size={15} className="text-ouro" /> {contato.telefone}
              </a>
              <a href={`mailto:${contato.email}`} className="flex items-center gap-2 hover:text-ouro">
                <Mail size={15} className="text-ouro" /> {contato.email}
              </a>
              <a
                href={`https://instagram.com/${contato.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-ouro"
              >
                <Instagram size={15} className="text-ouro" /> @{contato.instagram}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 font-mono text-xs uppercase tracking-widest2 text-ouro">
              Onde estamos
            </h4>
            <a
              href={contato.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 font-body text-sm text-taupe hover:text-ouro"
            >
              <MapPin size={15} className="mt-0.5 shrink-0 text-ouro" />
              {contato.endereco}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-linha pt-7 font-mono text-[11px] text-taupe">
          <span>© {ano} {siteConfig.nome}. Todos os direitos reservados.</span>
          <span>
            Feito pela <span className="text-ouro">improveAI</span> · Inteligência que trabalha por você
          </span>
        </div>
      </div>
    </footer>
  );
}
