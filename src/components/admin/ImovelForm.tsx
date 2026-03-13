"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Imovel } from "@/lib/types";
import { generateSlug, getSupabaseImageUrl } from "@/lib/utils";

interface Props { imovel?: Imovel; }

// Converte número do banco para string de display
function dbToDisplay(value: number | null | undefined): string {
  if (!value) return "";
  return Math.round(value).toLocaleString("pt-BR");
}

// Remove formatação e retorna número limpo
function displayToNumber(display: string): number {
  const clean = display.replace(/\D/g, "");
  return clean ? parseInt(clean) : 0;
}

// Formata enquanto digita: "250000" -> "250.000"
function formatMoneyInput(raw: string): string {
  const clean = raw.replace(/\D/g, "");
  if (!clean) return "";
  const num = parseInt(clean);
  return num.toLocaleString("pt-BR");
}

export default function ImovelForm({ imovel }: Props) {
  const router = useRouter();
  const isEditing = !!imovel;

  const [form, setForm] = useState({
    titulo: imovel?.titulo || "",
    tipo: imovel?.tipo || "casa",
    modalidade: imovel?.modalidade || "venda",
    cidade: imovel?.cidade || "Peruíbe",
    bairro: imovel?.bairro || "",
    endereco: imovel?.endereco || "",
    quartos: imovel?.quartos?.toString() || "0",
    banheiros: imovel?.banheiros?.toString() || "0",
    vagas: imovel?.vagas?.toString() || "0",
    area_m2: imovel?.area_m2?.toString() || "",
    descricao: imovel?.descricao || "",
    status: imovel?.status || "ativo",
    destaque: imovel?.destaque ?? false,
    parcelamento_direto: imovel?.parcelamento_direto ?? false,
    numero_parcelas: imovel?.numero_parcelas?.toString() || "",
  });

  // Campos monetários separados (string formatada para display)
  const [preco, setPreco] = useState(dbToDisplay(imovel?.preco));
  const [entradaSugerida, setEntradaSugerida] = useState(dbToDisplay(imovel?.entrada_sugerida));
  const [parcelasAPartirDe, setParcelasAPartirDe] = useState(dbToDisplay(imovel?.parcelas_a_partir_de));
  const [valorAluguel, setValorAluguel] = useState(dbToDisplay(imovel?.valor_aluguel));

  const [existingFotos, setExistingFotos] = useState<string[]>(imovel?.fotos || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const isAluguel = form.modalidade === "aluguel";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  // Handler específico para campos monetários
  function handleMoneyChange(setter: (v: string) => void) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(formatMoneyInput(e.target.value));
    };
  }

  function handleFiles(files: FileList | File[]) {
    const fileArray = Array.from(files);
    if (existingFotos.length + newFiles.length + fileArray.length > 20) {
      setError("Máximo de 20 fotos."); return;
    }
    setNewFiles((p) => [...p, ...fileArray]);
    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setPreviews((p) => [...p, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }, [existingFotos, newFiles]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError(""); setSuccess(""); setSaving(true);

    const precoNum = displayToNumber(preco);
    const aluguelNum = displayToNumber(valorAluguel);

    if (!form.titulo.trim()) { setError("Obrigatório preencher o título."); setSaving(false); return; }
    if (!precoNum && !aluguelNum) { setError("Preencha o preço ou valor do aluguel."); setSaving(false); return; }

    try {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const ext = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("imoveis").upload(fileName, file);
        if (!upErr) uploadedUrls.push(fileName);
      }

      const allFotos = [...existingFotos, ...uploadedUrls];
      const entradaNum = displayToNumber(entradaSugerida);
      const parcelasNum = displayToNumber(parcelasAPartirDe);

      const record = {
        titulo: form.titulo.trim(),
        slug: generateSlug(form.titulo),
        tipo: form.tipo,
        modalidade: form.modalidade,
        cidade: form.cidade.trim(),
        bairro: form.bairro.trim() || null,
        endereco: form.endereco.trim() || null,
        preco: precoNum || 0,
        entrada_sugerida: entradaNum || null,
        parcelamento_direto: form.parcelamento_direto,
        parcelas_a_partir_de: parcelasNum || null,
        numero_parcelas: form.numero_parcelas ? parseInt(form.numero_parcelas) : null,
        valor_aluguel: aluguelNum || null,
        quartos: parseInt(form.quartos) || 0,
        banheiros: parseInt(form.banheiros) || 0,
        vagas: parseInt(form.vagas) || 0,
        area_m2: form.area_m2 ? parseFloat(form.area_m2) : null,
        descricao: form.descricao.trim() || null,
        status: form.status,
        destaque: form.destaque,
        fotos: allFotos,
      };

      if (isEditing) {
        const { error: err } = await supabase.from("imoveis").update(record).eq("id", imovel.id);
        if (err) throw err;
        setSuccess("Imóvel atualizado com sucesso! ✓");
      } else {
        const { error: err } = await supabase.from("imoveis").insert(record);
        if (err) throw err;
        setSuccess("Imóvel salvo com sucesso! ✓");
        setTimeout(() => router.push("/admin"), 1500);
      }
      setNewFiles([]); setPreviews([]); setExistingFotos(allFotos);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally { setSaving(false); }
  }

  const inputClass = "w-full py-3 px-4 rounded-lg border border-gray-200 bg-white text-base focus:outline-none focus:ring-2 focus:ring-laranja/30 focus:border-laranja";

  const previewImage = existingFotos.length > 0 ? getSupabaseImageUrl(existingFotos[0]) : previews.length > 0 ? previews[0] : null;

  // Componente de input monetário reutilizável
  function MoneyInput({ label, value, onChange, placeholder, required }: {
    label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string; required?: boolean;
  }) {
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}{required && " *"}</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cinza-medio font-medium">R$</span>
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={onChange}
            className={`${inputClass} pl-12`}
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">Informações básicas</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Título do imóvel *</label>
            <input name="titulo" value={form.titulo} onChange={handleChange} className={inputClass} placeholder='Ex: "Casa 2 quartos no Jardim Peruíbe"' />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handleChange} className={inputClass}>
                <option value="casa">Casa</option><option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option><option value="comercial">Comercial</option>
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Modalidade</label>
              <select name="modalidade" value={form.modalidade} onChange={handleChange} className={inputClass}>
                <option value="venda">Venda</option><option value="aluguel">Aluguel</option>
              </select></div>
            <div><label className="block text-sm font-medium mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="ativo">Ativo</option><option value="inativo">Inativo</option>
              </select></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Bairro</label>
              <input name="bairro" value={form.bairro} onChange={handleChange} className={inputClass} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Endereço completo <span className="text-xs text-cinza-medio font-normal">(privado — só aparece o bairro no site)</span></label>
            <input name="endereco" value={form.endereco} onChange={handleChange} className={inputClass} placeholder="Ex: Rua das Flores, 123 — Jardim Peruíbe" />
            <p className="text-xs text-cinza-medio mt-1">O endereço é usado para mostrar o mapa do bairro. O endereço exato não aparece para o comprador.</p>
          </div>
        </div>

        {/* Price */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">{isAluguel ? "Valores do aluguel" : "Preço e parcelamento"}</h2>
          {isAluguel ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MoneyInput label="Valor do aluguel mensal" value={valorAluguel} onChange={handleMoneyChange(setValorAluguel)} placeholder="1.500" required />
              <MoneyInput label="Valor do imóvel" value={preco} onChange={handleMoneyChange(setPreco)} placeholder="Opcional" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MoneyInput label="Preço do imóvel" value={preco} onChange={handleMoneyChange(setPreco)} placeholder="350.000" required />
                <MoneyInput label="Entrada sugerida" value={entradaSugerida} onChange={handleMoneyChange(setEntradaSugerida)} placeholder="70.000" />
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="parcelamento_direto" checked={form.parcelamento_direto} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-laranja/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-laranja"></div>
                </label>
                <span className="text-sm font-medium">Aceita parcelamento direto</span>
              </div>
              {form.parcelamento_direto && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-laranja/5 rounded-lg">
                  <MoneyInput label="Parcelas a partir de" value={parcelasAPartirDe} onChange={handleMoneyChange(setParcelasAPartirDe)} placeholder="1.500" />
                  <div>
                    <label className="block text-sm font-medium mb-1">Número de parcelas</label>
                    <input name="numero_parcelas" type="number" value={form.numero_parcelas} onChange={handleChange} className={inputClass} placeholder="120" />
                  </div>
                </div>
              )}
            </>
          )}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-laranja/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-laranja"></div>
            </label>
            <span className="text-sm font-medium">Mostrar na página inicial (destaque)</span>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">Características</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium mb-1">Quartos</label><input name="quartos" type="number" min="0" value={form.quartos} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Banheiros</label><input name="banheiros" type="number" min="0" value={form.banheiros} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Vagas</label><input name="vagas" type="number" min="0" value={form.vagas} onChange={handleChange} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Área (m²)</label><input name="area_m2" type="number" value={form.area_m2} onChange={handleChange} className={inputClass} /></div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-display font-bold text-lg mb-3">Descrição</h2>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={6} className={`${inputClass} resize-y`}
            placeholder="Descreva o imóvel com detalhes..." />
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="font-display font-bold text-lg">Fotos <span className="text-sm font-normal text-cinza-medio">(primeira = capa)</span></h2>
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragOver ? "border-laranja bg-laranja/5" : "border-gray-300"}`}
            onClick={() => document.getElementById("file-input")?.click()}>
            <p className="text-sm text-cinza-medio">Arraste as fotos aqui ou <span className="text-laranja font-medium">clique para selecionar</span></p>
            <input id="file-input" type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />
          </div>
          {existingFotos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {existingFotos.map((foto, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-cinza-claro">
                  <img src={getSupabaseImageUrl(foto)} alt="" className="w-full h-full object-cover" />
                  {i === 0 && <span className="absolute top-1 left-1 bg-laranja text-white text-[10px] py-0.5 px-1.5 rounded">Capa</span>}
                  <button type="button" onClick={() => setExistingFotos((p) => p.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {previews.map((p, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-cinza-claro">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setNewFiles((prev) => prev.filter((_, idx) => idx !== i)); setPreviews((prev) => prev.filter((_, idx) => idx !== i)); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div><div className="sticky top-24 space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-medium text-cinza-medio mb-3">Preview:</h3>
          <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="aspect-[4/3] bg-cinza-claro overflow-hidden">
              {previewImage ? <img src={previewImage} alt="" className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center text-gray-300"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg></div>}
            </div>
            <div className="p-3">
              <div className="flex gap-1 mb-1">
                <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full text-white ${isAluguel ? "bg-blue-600" : form.parcelamento_direto ? "bg-laranja" : "bg-cinza-escuro"}`}>
                  {isAluguel ? "Aluguel" : form.parcelamento_direto ? "Parc. Direto" : "Venda"}
                </span>
              </div>
              <p className="font-display font-bold text-sm line-clamp-1">{form.titulo || "Título"}</p>
              <p className="text-xs text-cinza-medio">{form.bairro ? `${form.bairro}, ` : ""}{form.cidade}</p>
              <p className={`font-display font-bold mt-1 ${isAluguel ? "text-blue-600" : "text-laranja"}`}>
                {isAluguel && valorAluguel ? `R$ ${valorAluguel}/mês` :
                  preco ? `R$ ${preco}` : "R$ —"}
              </p>
              {!isAluguel && entradaSugerida && (
                <p className="text-xs text-cinza-medio">Entrada: R$ {entradaSugerida}</p>
              )}
            </div>
          </div>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm">{success}</div>}
        <button type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-50">
          {saving ? "Salvando..." : isEditing ? "Atualizar Imóvel" : "Publicar Imóvel"}
        </button>
      </div></div>
    </form>
  );
}
