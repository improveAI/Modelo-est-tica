"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ImageOff } from "lucide-react";
import { brl } from "@/lib/utils";
import type { Servico } from "@/types";

interface Props {
  servicos: Servico[];
  onAdd: (s: Omit<Servico, "id" | "ativo">) => Promise<void>;
  onUpdate: (id: string, s: Partial<Omit<Servico, "id" | "ativo">>) => Promise<void>;
  onToggleAtivo: (id: string, ativo: boolean) => Promise<void>;
  onRemove: (s: Servico) => Promise<void>;
}

type FormData = {
  nome: string;
  descricao: string;
  duracao: string;
  preco: string;
  categoria: string;
  fotoUrl: string;
};

const formVazio: FormData = {
  nome: "",
  descricao: "",
  duracao: "",
  preco: "",
  categoria: "",
  fotoUrl: "",
};

function servicoToForm(s: Servico): FormData {
  return {
    nome: s.nome,
    descricao: s.descricao,
    duracao: String(s.duracao),
    preco: String(s.preco),
    categoria: s.categoria,
    fotoUrl: s.fotoUrl ?? "",
  };
}

export function ServicosTab({ servicos, onAdd, onUpdate, onToggleAtivo, onRemove }: Props) {
  const [modo, setModo] = useState<"lista" | "novo" | "editar">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(formVazio);
  const [salvando, setSalvando] = useState(false);

  function abrirNovo() {
    setForm(formVazio);
    setEditandoId(null);
    setModo("novo");
  }

  function abrirEditar(s: Servico) {
    setForm(servicoToForm(s));
    setEditandoId(s.id);
    setModo("editar");
  }

  function cancelar() {
    setModo("lista");
    setEditandoId(null);
    setForm(formVazio);
  }

  function campo(key: keyof FormData, valor: string) {
    setForm((f) => ({ ...f, [key]: valor }));
  }

  function formValido() {
    return (
      form.nome.trim() &&
      form.descricao.trim() &&
      form.categoria.trim() &&
      Number(form.duracao) > 0 &&
      Number(form.preco) >= 0
    );
  }

  async function salvar() {
    if (!formValido()) return;
    setSalvando(true);
    const dados = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      duracao: Number(form.duracao),
      preco: Number(form.preco),
      categoria: form.categoria.trim(),
      fotoUrl: form.fotoUrl.trim() || undefined,
    };
    if (modo === "novo") {
      await onAdd(dados);
    } else if (editandoId) {
      await onUpdate(editandoId, dados);
    }
    setSalvando(false);
    cancelar();
  }

  if (modo !== "lista") {
    return <Formulario form={form} campo={campo} onSalvar={salvar} onCancelar={cancelar} salvando={salvando} modo={modo} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-500 text-cacau">Serviços</h2>
          <p className="mt-1 font-body text-sm text-taupe">
            {servicos.length} serviço{servicos.length !== 1 ? "s" : ""} cadastrado{servicos.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={abrirNovo} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo serviço
        </button>
      </div>

      {servicos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-linha py-20 text-center">
          <p className="font-body text-taupe">Nenhum serviço cadastrado ainda.</p>
          <button onClick={abrirNovo} className="btn-ghost mt-4">
            <Plus size={15} /> Adicionar primeiro serviço
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {servicos.map((s) => (
            <CardServico
              key={s.id}
              servico={s}
              onEditar={() => abrirEditar(s)}
              onToggle={() => onToggleAtivo(s.id, !s.ativo)}
              onRemover={() => onRemove(s)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CardServico({
  servico: s,
  onEditar,
  onToggle,
  onRemover,
}: {
  servico: Servico;
  onEditar: () => void;
  onToggle: () => void;
  onRemover: () => void;
}) {
  const ativo = s.ativo !== false;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-linen/40 transition-all ${
        ativo ? "border-linha" : "border-linha/50 opacity-60"
      }`}
    >
      {s.fotoUrl ? (
        <img src={s.fotoUrl} alt={s.nome} className="h-36 w-full object-cover" />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-champagne">
          <ImageOff size={28} className="text-linha" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-ouro">
              {s.categoria}
            </p>
            <h3 className="mt-1 font-display text-lg font-500 text-cacau leading-snug">
              {s.nome}
            </h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase ${
              ativo
                ? "bg-emerald-50 text-emerald-700"
                : "bg-taupe/10 text-taupe"
            }`}
          >
            {ativo ? "ativo" : "inativo"}
          </span>
        </div>

        <p className="mt-2 flex-1 font-body text-xs leading-relaxed text-taupe line-clamp-2">
          {s.descricao}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-linha pt-4">
          <div>
            <span className="font-display text-xl font-600 text-ouro">{brl(s.preco)}</span>
            <span className="ml-2 font-mono text-[10px] text-taupe">{s.duracao} min</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggle}
              title={ativo ? "Desativar" : "Ativar"}
              className="rounded-lg p-2 text-taupe transition-colors hover:bg-champagne hover:text-cacau"
            >
              {ativo ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <button
              onClick={onEditar}
              title="Editar"
              className="rounded-lg p-2 text-taupe transition-colors hover:bg-champagne hover:text-cacau"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={onRemover}
              title="Remover"
              className="rounded-lg p-2 text-taupe transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Formulario({
  form,
  campo,
  onSalvar,
  onCancelar,
  salvando,
  modo,
}: {
  form: FormData;
  campo: (k: keyof FormData, v: string) => void;
  onSalvar: () => void;
  onCancelar: () => void;
  salvando: boolean;
  modo: "novo" | "editar";
}) {
  const input =
    "w-full rounded-xl border border-linha bg-champagne px-4 py-3 font-body text-sm text-cacau outline-none transition-colors placeholder:text-taupe focus:border-ouro";

  return (
    <div className="mx-auto max-w-xl">
      <h2 className="mb-6 font-display text-2xl font-500 text-cacau">
        {modo === "novo" ? "Novo serviço" : "Editar serviço"}
      </h2>

      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Nome *
          </label>
          <input
            className={input}
            placeholder="Ex: Limpeza de Pele Profunda"
            value={form.nome}
            onChange={(e) => campo("nome", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Descrição *
          </label>
          <textarea
            className={`${input} resize-none`}
            rows={3}
            placeholder="Descreva o serviço brevemente"
            value={form.descricao}
            onChange={(e) => campo("descricao", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
              Duração (min) *
            </label>
            <input
              className={input}
              type="number"
              min="5"
              step="5"
              placeholder="60"
              value={form.duracao}
              onChange={(e) => campo("duracao", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
              Preço (R$) *
            </label>
            <input
              className={input}
              type="number"
              min="0"
              step="0.01"
              placeholder="150.00"
              value={form.preco}
              onChange={(e) => campo("preco", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            Categoria *
          </label>
          <input
            className={input}
            placeholder="Ex: Facial, Corporal, Sobrancelhas…"
            value={form.categoria}
            onChange={(e) => campo("categoria", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-taupe">
            URL da foto (opcional)
          </label>
          <input
            className={input}
            type="url"
            placeholder="https://exemplo.com/foto.jpg"
            value={form.fotoUrl}
            onChange={(e) => campo("fotoUrl", e.target.value)}
          />
          <p className="mt-1.5 font-body text-[11px] text-taupe">
            Cole o link de uma imagem pública. Upload direto será adicionado em breve.
          </p>
        </div>

        {form.fotoUrl && (
          <img
            src={form.fotoUrl}
            alt="Pré-visualização"
            className="h-36 w-full rounded-xl object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button
          onClick={onSalvar}
          disabled={salvando}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando ? "Salvando…" : modo === "novo" ? "Adicionar serviço" : "Salvar alterações"}
        </button>
        <button onClick={onCancelar} className="btn-ghost px-6">
          Cancelar
        </button>
      </div>
    </div>
  );
}