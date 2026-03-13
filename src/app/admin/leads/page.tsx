"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

const statusLabels: Record<string, { label: string; color: string }> = {
  novo: { label: "Novo", color: "bg-blue-100 text-blue-700" },
  em_contato: { label: "Em Contato", color: "bg-yellow-100 text-yellow-700" },
  concluido: { label: "Concluído", color: "bg-green-100 text-green-700" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    const { data } = await supabase.from("leads").select("*").order("criado_em", { ascending: false });
    setLeads((data as Lead[]) || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchLeads();
  }

  const novos = leads.filter((l) => l.status === "novo").length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-cinza-medio hover:text-laranja">← Voltar</Link>
          <h1 className="font-display text-2xl font-bold">Quero Vender (Leads)</h1>
          {novos > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">{novos} novos</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-cinza-medio">Carregando...</div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-cinza-medio">Nenhum lead recebido ainda.</div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const st = statusLabels[lead.status] || statusLabels.novo;
            const whatsMsg = `Olá, ${lead.nome}! Vi que você quer vender seu imóvel. Sou a Selma Villar, corretora em Peruíbe. Podemos conversar?`;
            return (
              <div key={lead.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base">{lead.nome}</h3>
                      <span className={`text-xs font-medium py-0.5 px-2 rounded-full ${st.color}`}>{st.label}</span>
                    </div>
                    <p className="text-sm text-cinza-medio">
                      {lead.telefone} {lead.email && `· ${lead.email}`}
                    </p>
                    <p className="text-sm text-cinza-medio">
                      {lead.tipo_imovel && `${lead.tipo_imovel} · `}{lead.cidade}{lead.bairro && `, ${lead.bairro}`}
                    </p>
                    {lead.descricao && (
                      <p className="text-sm text-cinza-escuro mt-2 bg-cinza-claro p-3 rounded-lg">{lead.descricao}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(lead.criado_em).toLocaleDateString("pt-BR")} às {new Date(lead.criado_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={getWhatsAppLink(whatsMsg)} target="_blank" rel="noopener noreferrer"
                      className="btn-primary py-2 px-4 text-sm">WhatsApp</a>
                    <select value={lead.status} onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="py-2 px-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-laranja/30">
                      <option value="novo">Novo</option>
                      <option value="em_contato">Em Contato</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
