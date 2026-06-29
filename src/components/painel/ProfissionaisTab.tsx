"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { DIAS, HORAS } from "@/lib/utils";
import type { Profissional } from "@/types";

interface Props {
  profissionais: Profissional[];
  addProfissional: (p: Omit<Profissional, "id">) => void;
  removeProfissional: (id: string) => void;
}

export function ProfissionaisTab({ profissionais, addProfissional, removeProfissional }: Props) {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    especialidade: "",
    inicio: "09:00",
    fim: "19:00",
    diasTrabalho: [2, 3, 4, 5, 6] as number[],
  });

  function toggleDia(d: number) {
    setForm((f) => ({
      ...f,
      diasTrabalho: f.diasTrabalho.includes(d)
        ? f.diasTrabalho.filter((x) => x !== d)
        : [...f.diasTrabalho, d],
    }));
  }

  function salvar() {
    if (!form.nome) return;
    addProfissional(form);
    setForm({ nome: "", especialidade: "", inicio: "09:00", fim: "19:00", diasTrabalho: [2, 3, 4, 5, 6] });
    setAberto(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-500 text-cacau">Equipe</h2>
        <button onClick={() => setAberto(!aberto)} className="btn-primary">
          <Plus size={16} /> Cadastrar
        </button>
      </div>

      {aberto && (
        <div className="mb-6 rounded-2xl border border-linha bg-linen/40 p-6">
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            className="mb-4 w-full rounded-xl border border-linha bg-champagne px-5 py-3 font-body outline-none focus:border-ouro"
          />
          <input
            placeholder="Especialidade"
            value={form.especialidade}
            onChange={(e) => setForm((f) => ({ ...f, especialidade: e.target.value }))}
            className="mb-4 w-full rounded-xl border border-linha bg-champagne px-5 py-3 font-body outline-none focus:border-ouro"
          />
          <div className="mb-4 flex gap-4">
            <Select label="Início" value={form.inicio} onChange={(v) => setForm((f) => ({ ...f, inicio: v }))} />
            <Select label="Fim" value={form.fim} onChange={(v) => setForm((f) => ({ ...f, fim: v }))} />
          </div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-taupe">
            Dias de trabalho
          </p>
          <div className="mb-5 flex flex-wrap gap-2">
            {DIAS.map((d, i) => {
              const on = form.diasTrabalho.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleDia(i)}
                  className={`w-12 rounded-lg py-2 font-mono text-xs uppercase transition-all ${
                    on ? "bg-ouro text-champagne" : "bg-champagne text-taupe"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <button onClick={salvar} className="btn-primary w-full">
            Salvar
          </button>
        </div>
      )}

      <div className="grid gap-3">
        {profissionais.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-linha bg-linen/40 p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ouro font-display text-xl font-600 text-champagne">
                {p.nome[0]}
              </div>
              <div>
                <div className="font-display text-lg text-cacau">{p.nome}</div>
                <div className="font-body text-sm text-taupe">{p.especialidade}</div>
                <div className="mt-1 font-mono text-[11px] text-taupe">
                  {p.inicio}–{p.fim} · {p.diasTrabalho.map((d) => DIAS[d]).join(" ")}
                </div>
              </div>
            </div>
            <button
              onClick={() => removeProfissional(p.id)}
              className="rounded-lg border border-linha p-2.5 text-red-400 transition-colors hover:border-red-300"
              aria-label="Remover"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-widest2 text-taupe">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-linha bg-champagne px-4 py-3 font-body outline-none focus:border-ouro"
      >
        {HORAS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
    </div>
  );
}
