"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getWhatsAppLink } from "@/lib/utils";

const NOME = process.env.NEXT_PUBLIC_NOME_CORRETORA || "Selma Villar";

export default function QueroVenderPage() {
  const [form, setForm] = useState({ nome: "", telefone: "", email: "", tipo_imovel: "casa", cidade: "Peruíbe", bairro: "", valor_estimado: "", aceita_parcelamento: "talvez", descricao: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    if (!form.nome.trim() || !form.telefone.trim()) { setError("Por favor, preencha seu nome e telefone."); return; }
    setSending(true);
    await supabase.from("leads").insert({
      nome: form.nome.trim(), telefone: form.telefone.trim(), email: form.email.trim() || null,
      tipo_imovel: form.tipo_imovel, cidade: form.cidade.trim(), bairro: form.bairro.trim() || null,
      descricao: `${form.descricao}${form.valor_estimado ? `\nValor estimado: R$ ${form.valor_estimado}` : ""}${form.aceita_parcelamento ? `\nAceita parcelamento: ${form.aceita_parcelamento}` : ""}`.trim() || null,
    });
    const msg = `Oi ${NOME}! Quero vender meu imóvel.\n\nNome: ${form.nome}\nTelefone: ${form.telefone}\nTipo: ${form.tipo_imovel}\nCidade: ${form.cidade}${form.bairro ? `\nBairro: ${form.bairro}` : ""}${form.valor_estimado ? `\nValor estimado: R$ ${form.valor_estimado}` : ""}${form.aceita_parcelamento ? `\nAceita parcelamento direto: ${form.aceita_parcelamento}` : ""}${form.descricao ? `\nDescrição: ${form.descricao}` : ""}`;
    window.open(getWhatsAppLink(msg), "_blank");
    setSent(true); setSending(false);
  }

  const inputClass = "w-full py-3 px-4 rounded-lg border border-gray-200 bg-white text-base text-cinza-escuro focus:outline-none focus:ring-2 focus:ring-laranja/30 focus:border-laranja";

  if (sent) return (
    <div className="section-padding"><div className="container-site max-w-lg text-center">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="font-display text-2xl font-bold mb-3 text-green-800">Recebemos seus dados!</h1>
        <p className="text-green-700 mb-6">Em breve entrarei em contato. Se o WhatsApp abriu, já pode enviar a mensagem.</p>
        <a href={getWhatsAppLink(`Oi ${NOME}! Enviei meus dados pelo site sobre venda de imóvel.`)} target="_blank" rel="noopener noreferrer" className="btn-primary">Abrir WhatsApp novamente</a>
      </div>
    </div></div>
  );

  return (
    <>
      <section className="bg-cinza-claro section-padding">
        <div className="container-site text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Quer vender seu imóvel em Peruíbe?</h1>
          <p className="text-cinza-medio text-lg max-w-2xl mx-auto">
            Preencha o formulário e eu entro em contato. Cuido de tudo: divulgação, negociação e documentação — com segurança jurídica e CRECI ativo.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Benefits */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-display font-bold text-lg mb-4">Por que vender com a Selma:</h2>
              {[
                { icon: "📣", text: "Divulgação no site, Instagram e redes — seu imóvel aparece pra quem está procurando" },
                { icon: "🤝", text: "Negociação profissional — encontro compradores qualificados, inclusive pra parcelamento direto" },
                { icon: "⚖", text: "Documentação completa — sou formada em Direito e cuido de toda a parte jurídica" },
                { icon: "♡", text: "Sem imobiliária no meio — atendimento pessoal, direto comigo" },
                { icon: "📋", text: "CRECI 167207-F ativo — transparência e legalidade" },
              ].map((b) => (
                <div key={b.text} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{b.icon}</span>
                  <p className="text-sm text-cinza-escuro">{b.text}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Seu nome *</label><input name="nome" value={form.nome} onChange={handleChange} className={inputClass} placeholder="Nome completo" /></div>
                  <div><label className="block text-sm font-medium mb-1">Telefone / WhatsApp *</label><input name="telefone" value={form.telefone} onChange={handleChange} className={inputClass} placeholder="(13) 99999-9999" type="tel" /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Email (opcional)</label><input name="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="seu@email.com" type="email" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Tipo do imóvel</label>
                    <select name="tipo_imovel" value={form.tipo_imovel} onChange={handleChange} className={inputClass}><option value="casa">Casa</option><option value="apartamento">Apartamento</option><option value="terreno">Terreno</option><option value="comercial">Comercial</option></select></div>
                  <div><label className="block text-sm font-medium mb-1">Cidade</label><input name="cidade" value={form.cidade} onChange={handleChange} className={inputClass} /></div>
                  <div><label className="block text-sm font-medium mb-1">Bairro</label><input name="bairro" value={form.bairro} onChange={handleChange} className={inputClass} placeholder="Opcional" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-1">Valor estimado do imóvel (R$)</label><input name="valor_estimado" value={form.valor_estimado} onChange={handleChange} className={inputClass} placeholder="Ex: 250000" type="number" /></div>
                  <div><label className="block text-sm font-medium mb-1">Aceita parcelamento direto?</label>
                    <select name="aceita_parcelamento" value={form.aceita_parcelamento} onChange={handleChange} className={inputClass}><option value="sim">Sim</option><option value="nao">Não</option><option value="talvez">Talvez — quero entender</option></select></div>
                </div>
                <div><label className="block text-sm font-medium mb-1">Fale um pouco sobre o imóvel</label>
                  <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={4} className={`${inputClass} resize-y`} placeholder="Quantos quartos, tamanho, se tem garagem, estado do imóvel..." /></div>
                {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                <button type="submit" disabled={sending} className="btn-primary w-full py-4 text-lg disabled:opacity-50">{sending ? "Enviando..." : "Enviar e abrir WhatsApp"}</button>
                <p className="text-xs text-cinza-medio text-center">Seus dados são enviados diretamente pra mim. Sem spam, sem repasses. Entro em contato pelo WhatsApp em até 24 horas.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
