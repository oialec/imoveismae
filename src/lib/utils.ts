export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceAluguel(value: number): string {
  return `${formatPrice(value)}/mês`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getWhatsAppLink(message?: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5513997158810';
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export function getSupabaseImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/imoveis/${path}`;
}

export function tipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    terreno: 'Terreno',
    comercial: 'Comercial',
  };
  return labels[tipo] || tipo;
}

export function modalidadeLabel(mod: string): string {
  return mod === 'aluguel' ? 'Aluguel' : 'Venda';
}
