import { createServerSupabaseClient } from "@/lib/supabase-server";

const BASE_URL = "https://imoveismae.vercel.app";

export default async function sitemap() {
  const supabase = createServerSupabaseClient();
  const { data: imoveis } = await supabase
    .from("imoveis")
    .select("slug, criado_em")
    .eq("status", "ativo");

  const imoveisEntries = (imoveis || []).map((imovel: { slug: string; criado_em: string }) => ({
    url: `${BASE_URL}/imoveis/${imovel.slug}`,
    lastModified: imovel.criado_em,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/imoveis`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${BASE_URL}/como-funciona`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/quero-vender`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    ...imoveisEntries,
  ];
}
