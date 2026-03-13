"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getSupabaseImageUrl } from "@/lib/utils";

export default function ConfiguracoesPage() {
  const [configs, setConfigs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  useEffect(() => { fetchConfigs(); }, []);

  async function fetchConfigs() {
    const { data } = await supabase.from("configuracoes").select("*");
    const map: Record<string, string> = {};
    if (data) data.forEach((c: { chave: string; valor: string | null }) => { map[c.chave] = c.valor || ""; });
    setConfigs(map);
    setLoading(false);
  }

  function handleChange(key: string, value: string) {
    setConfigs({ ...configs, [key]: value });
  }

  async function handleImageUpload(key: string, file: File, setUploading: (v: boolean) => void) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `site/${key}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("imoveis").upload(fileName, file);
    if (!error) {
      handleChange(key, fileName);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true); setSuccess("");
    for (const [chave, valor] of Object.entries(configs)) {
      await supabase.from("configuracoes").upsert({ chave, valor, atualizado_em: new Date().toISOString() }, { onConflict: "chave" });
    }
    setSuccess("Configurações salvas com sucesso! ✓");
    setSaving(false);
  }

  if (loading) return <div className="py-10 text-center text-cinza-medio">Carregando...</div>;

  const inputClass = "w-full py-3 px-4 rounded-lg border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-laranja/30 focus:border-laranja";

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-cinza-medio hover:text-laranja">← Voltar</Link>
        <h1 className="font-display text-2xl font-bold">Configurações do Site</h1>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Hero */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">Página Inicial (Hero)</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem de fundo do Hero</label>
            {configs.hero_imagem && (
              <img src={getSupabaseImageUrl(configs.hero_imagem)} alt="Hero" className="w-full h-32 object-cover rounded-lg mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("hero_imagem", e.target.files[0], setUploadingHero)}
              className="text-sm" />
            {uploadingHero && <p className="text-xs text-laranja mt-1">Enviando imagem...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Título do Hero</label>
            <input value={configs.hero_titulo || ""} onChange={(e) => handleChange("hero_titulo", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtítulo do Hero</label>
            <textarea value={configs.hero_subtitulo || ""} onChange={(e) => handleChange("hero_subtitulo", e.target.value)} rows={2} className={`${inputClass} resize-y`} />
          </div>
        </div>

        {/* Corretora */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">Sobre a Corretora</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Foto da corretora</label>
            {configs.corretora_foto && (
              <img src={getSupabaseImageUrl(configs.corretora_foto)} alt="Foto" className="w-24 h-24 object-cover rounded-full mb-2" />
            )}
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload("corretora_foto", e.target.files[0], setUploadingFoto)}
              className="text-sm" />
            {uploadingFoto && <p className="text-xs text-laranja mt-1">Enviando foto...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio (texto principal da página Sobre)</label>
            <textarea value={configs.corretora_bio || ""} onChange={(e) => handleChange("corretora_bio", e.target.value)} rows={4} className={`${inputClass} resize-y`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Minha História (texto mais longo)</label>
            <textarea value={configs.corretora_historia || ""} onChange={(e) => handleChange("corretora_historia", e.target.value)} rows={4} className={`${inputClass} resize-y`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Anos de experiência</label>
              <input value={configs.corretora_anos_experiencia || ""} onChange={(e) => handleChange("corretora_anos_experiencia", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Famílias atendidas</label>
              <input value={configs.corretora_familias_atendidas || ""} onChange={(e) => handleChange("corretora_familias_atendidas", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidades de atuação</label>
              <input value={configs.corretora_cidades_atuacao || ""} onChange={(e) => handleChange("corretora_cidades_atuacao", e.target.value)} className={inputClass} placeholder="Peruíbe, Itanhaém" />
            </div>
          </div>
        </div>

        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">{success}</div>}
        <button onClick={handleSave} disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar Configurações"}
        </button>
      </div>
    </>
  );
}
