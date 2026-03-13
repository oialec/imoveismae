"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Imovel } from "@/lib/types";
import ImovelCard from "@/components/imoveis/ImovelCard";
import { getWhatsAppLink } from "@/lib/utils";

function ImoveisContent() {
  const searchParams = useSearchParams();
  const modalidadeParam = searchParams.get("modalidade") || "";
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalidade, setModalidade] = useState(modalidadeParam);
  const [tipo, setTipo] = useState("");
  const [cidade, setCidade] = useState("");
  const [faixaPreco, setFaixaPreco] = useState("");
  const [quartos, setQuartos] = useState("");

  useEffect(() => { setModalidade(modalidadeParam); }, [modalidadeParam]);
  useEffect(() => { fetchImoveis(); }, [tipo, cidade, faixaPreco, quartos, modalidade]);

  async function fetchImoveis() {
    setLoading(true);
    let query = supabase.from("imoveis").select("*").eq("status", "ativo").order("criado_em", { ascending: false });
    if (modalidade) query = query.eq("modalidade", modalidade);
    if (tipo) query = query.eq("tipo", tipo);
    if (cidade) query = query.ilike("cidade", `%${cidade}%`);
    if (quartos) query = query.gte("quartos", parseInt(quartos));
    if (faixaPreco) {
      const [min, max] = faixaPreco.split("-").map(Number);
      if (modalidade === "aluguel") { query = query.gte("valor_aluguel", min).lte("valor_aluguel", max); }
      else { query = query.gte("preco", min).lte("preco", max); }
    }
    const { data } = await query;
    setImoveis((data as Imovel[]) || []);
    setLoading(false);
  }

  const isAluguel = modalidade === "aluguel";
  const inputClass = "w-full py-3 px-4 rounded-lg border border-gray-200 bg-white text-base text-cinza-escuro focus:outline-none focus:ring-2 focus:ring-laranja/30 focus:border-laranja";
  const faixasVenda = [{ value: "", label: "Qualquer preço" },{ value: "0-200000", label: "Até R$ 200 mil" },{ value: "200000-500000", label: "R$ 200 mil - R$ 500 mil" },{ value: "500000-1000000", label: "R$ 500 mil - R$ 1 milhão" },{ value: "1000000-999999999", label: "Acima de R$ 1 milhão" }];
  const faixasAluguel = [{ value: "", label: "Qualquer valor" },{ value: "0-1000", label: "Até R$ 1.000/mês" },{ value: "1000-2000", label: "R$ 1.000 - R$ 2.000/mês" },{ value: "2000-4000", label: "R$ 2.000 - R$ 4.000/mês" },{ value: "4000-999999", label: "Acima de R$ 4.000/mês" }];

  return (
    <>
      <section className="bg-cinza-claro py-8 md:py-12">
        <div className="container-site">
          <h1 className="font-display text-2xl md:text-4xl font-bold mb-2">
            {isAluguel ? "Imóveis para alugar em Peruíbe e região" : "Imóveis à venda em Peruíbe com parcelamento direto"}
          </h1>
          <p className="text-cinza-medio">
            {isAluguel ? "Casas e apartamentos para aluguel com atendimento pessoal e condições flexíveis." : "Todos com negociação direto com o proprietário, sem banco, sem consulta de crédito e com segurança jurídica."}
          </p>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setModalidade("")} className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${!modalidade ? "bg-laranja text-white" : "bg-white text-cinza-escuro hover:bg-gray-100"}`}>Todos</button>
            <button onClick={() => setModalidade("venda")} className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${modalidade === "venda" ? "bg-laranja text-white" : "bg-white text-cinza-escuro hover:bg-gray-100"}`}>Comprar</button>
            <button onClick={() => setModalidade("aluguel")} className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${modalidade === "aluguel" ? "bg-blue-600 text-white" : "bg-white text-cinza-escuro hover:bg-gray-100"}`}>Alugar</button>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 md:p-6 bg-cinza-claro rounded-xl">
            <div><label className="block text-sm font-medium mb-1">Tipo</label><select value={tipo} onChange={(e) => setTipo(e.target.value)} className={inputClass}><option value="">Todos</option><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="terreno">Terreno</option><option value="comercial">Comercial</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Cidade</label><input type="text" placeholder="Ex: Peruíbe" value={cidade} onChange={(e) => setCidade(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">{isAluguel ? "Faixa de aluguel" : "Faixa de preço"}</label><select value={faixaPreco} onChange={(e) => setFaixaPreco(e.target.value)} className={inputClass}>{(isAluguel ? faixasAluguel : faixasVenda).map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}</select></div>
            <div><label className="block text-sm font-medium mb-1">Quartos (mín.)</label><select value={quartos} onChange={(e) => setQuartos(e.target.value)} className={inputClass}><option value="">Qualquer</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map((i) => (<div key={i} className="bg-cinza-claro rounded-xl animate-pulse h-80" />))}</div>
          ) : imoveis.length > 0 ? (
            <>
              <p className="text-sm text-cinza-medio mb-4">{imoveis.length} {imoveis.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{imoveis.map((imovel) => (<ImovelCard key={imovel.id} imovel={imovel} />))}</div>
            </>
          ) : (
            <div className="text-center py-16 bg-cinza-claro rounded-xl">
              <p className="text-cinza-escuro text-lg font-medium mb-2">Não encontrou o que procura?</p>
              <p className="text-cinza-medio mb-6">A Selma busca imóveis sob medida pra você. Conta o que precisa e ela te ajuda a encontrar.</p>
              <a href={getWhatsAppLink("Oi Selma! Não encontrei o imóvel que procuro no site. Pode me ajudar?")} target="_blank" rel="noopener noreferrer" className="btn-primary">Me ajuda a encontrar meu imóvel</a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ImoveisPage() {
  return (<Suspense fallback={<div className="section-padding text-center text-cinza-medio">Carregando...</div>}><ImoveisContent /></Suspense>);
}
