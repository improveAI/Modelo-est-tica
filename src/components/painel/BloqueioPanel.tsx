"use client";

import { useState } from "react";
import { X, Trash2, Ban } from "lucide-react";
import { HORAS } from "@/lib/utils";
import { formatarDataISO } from "./agendaUtils";
import type { Bloqueio, Profissional } from "@/types";

interface Props {
  bloqueios: Bloqueio[];
  profissionais: Profissional[];
  diaInicial?: Date;
  onAdd: (b: Omit<Bloqueio, "id" | "criadoEm">) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onFechar: () => void;
}

export function BloqueioPanel({ bloqueios, profissionais, diaInicial, onAdd, onRemove, onFechar }: Props) {
  const hoje = formatarDataISO(diaInicial ?? new Date());
  const [dia, setDia] = useState(hoje);
  const [profissionalId, setProfissionalId] = useState<string>("todas");
  const [horaInicio, setHoraInicio] = useState(HORAS[0]);
  const [horaFim, setHoraFim] = useState(HORAS[2]);
  const [motivo, setMotivo] = useState("");
  const [salvando, setSalvando] = useState(false);

  const horasFim = HORAS.filter((h) => h > horaInicio);

  async function salvar() {
    if (!dia || horaFim <= horaInicio) return;
    setSalvando(true);
    await onAdd({
      profissionalId: profissionalId === "todas" ? null : profissionalId,
      dia,
      horaInicio,
      horaFim,
      motivo: motivo.trim() || undefined,
    });
    setSalvando(false);
    setMotivo("");
  }

  const bloqueiosOrdenados = [...bloqueios].sort((a, b) =>
    a.dia.localeCompare(b.dia) || a.horaInicio.localeCompare(b.horaInicio)
  );

  const input =
    "w-full rounded-xl border border-linha bg-champagne px-4 py-2.5 font-body text-sm text-cacau outline-none transition-colors focus:border-ouro";

  return (
    <div className="rounded-2xl border border-linha bg-linen/40 p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ban size={18} className="text-taupe" />
          <h3 className="font-display text-lg font-500 text-cacau">Bloquear horário</h3>
        </div>
        <button onClick={onFechar} className="rounded-lg p-1.5 text-taupe transition-colors hover:bg-champagne">
          <X size={16} />
        </button>
      </div>

      {/* Formulário de novo bloqueio */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Profissional
          </label>
          <select
            value={profissionalId}
            onChange={(e) => setProfissionalId(e.target.value)}
            className={input}
          >
            <option value="todas">Todas as profissionais</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Dia
          </label>
          <input
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            className={input}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Motivo (opcional)
          </label>
          <input
            placeholder="Ex: almoço, folga, reunião…"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className={input}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Das
          </label>
          <select
            value={horaInicio}
            onChange={(e) => {
              setHoraInicio(e.target.value);
              if (horaFim <= e.target.value) {
                const prox = HORAS.find((h) => h > e.target.value);
                if (prox) setHoraFim(prox);
              }
            }}
            className={input}
          >
            {HORAS.slice(0, -1).map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Até
          </label>
          <select
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            className={input}
          >
            {horasFim.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={salvar}
        disabled={salvando || horaFim <= horaInicio}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {salvando ? "Salvando…" : "Criar bloqueio"}
      </button>

      {/* Lista de bloqueios existentes */}
      {bloqueiosOrdenados.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-taupe">
            Bloqueios cadastrados
          </p>
          <div className="grid gap-2">
            {bloqueiosOrdenados.map((b) => {
              const nomeProfissional =
                b.profissionalId === null
                  ? "Todas"
                  : profissionais.find((p) => p.id === b.profissionalId)?.nome ?? "—";
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-linha bg-champagne px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-600 text-cacau">
                        {b.dia} · {b.horaInicio}–{b.horaFim}
                      </span>
                      <span className="rounded-full bg-taupe/10 px-2 py-0.5 font-mono text-[10px] text-taupe">
                        {nomeProfissional}
                      </span>
                    </div>
                    {b.motivo && (
                      <p className="mt-0.5 font-body text-xs text-taupe">{b.motivo}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(b.id)}
                    className="ml-3 shrink-0 rounded-lg p-2 text-taupe transition-colors hover:bg-red-50 hover:text-red-500"
                    title="Remover bloqueio"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {bloqueiosOrdenados.length === 0 && (
        <p className="mt-5 text-center font-body text-sm text-taupe">
          Nenhum bloqueio cadastrado ainda.
        </p>
      )}
    </div>
  );
}
