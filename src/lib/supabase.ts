import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase.
 *
 * Se as variáveis de ambiente não estiverem preenchidas, o cliente fica
 * null e src/lib/db.ts cai automaticamente no fallback em memória.
 *
 * PARA LIGAR O BANCO:
 * 1. Crie um projeto em https://supabase.com
 * 2. Rode o schema em supabase/schema.sql no SQL Editor do Supabase
 * 3. Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Só cria o cliente se as variáveis existirem (evita erro em dev sem banco)
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const supabaseAtivo = Boolean(supabase);
