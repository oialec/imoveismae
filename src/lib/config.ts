import { createServerSupabaseClient } from './supabase-server';
import { Configuracao } from './types';

export async function getConfig(): Promise<Record<string, string>> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('configuracoes').select('*');
  const configs: Record<string, string> = {};
  if (data) {
    (data as Configuracao[]).forEach((c) => {
      configs[c.chave] = c.valor || '';
    });
  }
  return configs;
}

export function getConfigValue(configs: Record<string, string>, key: string, fallback: string = ''): string {
  return configs[key] || fallback;
}
