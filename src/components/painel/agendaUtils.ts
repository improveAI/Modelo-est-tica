import { DIAS } from "@/lib/utils";

/**
 * Datas da agenda são tratadas sempre em horário local (nunca via
 * `new Date(iso)`/`toISOString()`), porque isso interpreta a string
 * como UTC e pode "voltar um dia" em fusos negativos como o do Brasil.
 */

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function parseDataLocal(iso: string): Date {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

export function formatarDataISO(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function ehMesmoDia(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ehHoje(d: Date): boolean {
  return ehMesmoDia(d, new Date());
}

export function adicionarDias(d: Date, n: number): Date {
  const novo = new Date(d);
  novo.setDate(novo.getDate() + n);
  return novo;
}

export function adicionarMeses(d: Date, n: number): Date {
  const novo = new Date(d);
  novo.setMonth(novo.getMonth() + n);
  return novo;
}

/** Grade completa do mês (semanas inteiras, com dias do mês anterior/seguinte pra preencher). */
export function getDiasDoMes(ref: Date): Date[] {
  const primeiroDia = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const inicio = adicionarDias(primeiroDia, -primeiroDia.getDay());

  const dias: Date[] = [];
  for (let i = 0; i < 42; i++) {
    dias.push(adicionarDias(inicio, i));
  }
  return dias;
}

/** Os 7 dias (Dom–Sáb) da semana que contém a data de referência. */
export function getDiasDaSemana(ref: Date): Date[] {
  const inicio = adicionarDias(ref, -ref.getDay());
  return Array.from({ length: 7 }, (_, i) => adicionarDias(inicio, i));
}

export function formatarPeriodoMes(ref: Date): string {
  return `${MESES[ref.getMonth()]} ${ref.getFullYear()}`;
}

export function formatarPeriodoSemana(dias: Date[]): string {
  const inicio = dias[0];
  const fim = dias[dias.length - 1];
  if (inicio.getMonth() === fim.getMonth()) {
    return `${inicio.getDate()} a ${fim.getDate()} de ${MESES[inicio.getMonth()]} de ${inicio.getFullYear()}`;
  }
  return `${inicio.getDate()} de ${MESES[inicio.getMonth()]} a ${fim.getDate()} de ${MESES[fim.getMonth()]} de ${fim.getFullYear()}`;
}

export function formatarDiaCompleto(d: Date): string {
  return `${DIAS_COMPLETOS[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatarDiaCurto(d: Date): string {
  return `${DIAS[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const DIAS_COMPLETOS = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];
