"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Imovel } from "@/lib/types";
import { formatPrice, getSupabaseImageUrl } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [leadsNovos, setLeadsNovos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImoveis();
    fetchLeads();
  }, []);

  async function fetchLeads() {
    const { data } = await supabase.from("leads").select("id").eq("status", "novo");
    setLeadsNovos(data?.length || 0);
  }

  async function fetchImoveis() {
    const { data } = await supabase
      .from("imoveis")
      .select("*")
      .order("criado_em", { ascending: false });
    setImoveis((data as Imovel[]) || []);
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === "ativo" ? "inativo" : "ativo";
    await supabase.from("imoveis").update({ status: newStatus }).eq("id", id);
    fetchImoveis();
  }

  const total = imoveis.length;
  const ativos = imoveis.filter((i) => i.status === "ativo").length;
  const inativos = total - ativos;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
        <Link href="/admin/imoveis/novo" className="btn-primary">
          + Adicionar Novo Imóvel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: total, color: "text-cinza-escuro" },
          { label: "Ativos", value: ativos, color: "text-green-600" },
          { label: "Inativos", value: inativos, color: "text-red-500" },
          { label: "Aluguel", value: imoveis.filter((i) => i.modalidade === "aluguel").length, color: "text-blue-600" },
          { label: "Leads Novos", value: leadsNovos, color: "text-laranja", link: "/admin/leads" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative">
            {s.link ? (
              <Link href={s.link} className="absolute inset-0 rounded-xl" />
            ) : null}
            <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-cinza-medio">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center text-cinza-medio">Carregando...</div>
      ) : imoveis.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-cinza-medio mb-4">Nenhum imóvel cadastrado ainda.</p>
          <Link href="/admin/imoveis/novo" className="btn-primary">
            Cadastrar primeiro imóvel
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cinza-claro">
                <tr>
                  <th className="text-left text-xs font-medium text-cinza-medio uppercase py-3 px-4">Imóvel</th>
                  <th className="text-left text-xs font-medium text-cinza-medio uppercase py-3 px-4">Preço</th>
                  <th className="text-left text-xs font-medium text-cinza-medio uppercase py-3 px-4">Status</th>
                  <th className="text-left text-xs font-medium text-cinza-medio uppercase py-3 px-4">Destaque</th>
                  <th className="text-right text-xs font-medium text-cinza-medio uppercase py-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {imoveis.map((im) => (
                  <tr key={im.id} className="hover:bg-cinza-claro/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-md overflow-hidden bg-cinza-claro shrink-0">
                          {im.fotos && im.fotos.length > 0 ? (
                            <img src={getSupabaseImageUrl(im.fotos[0])} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-cinza-escuro line-clamp-1">{im.titulo}</p>
                          <p className="text-xs text-cinza-medio">{im.cidade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{formatPrice(im.preco)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium py-1 px-2 rounded-full ${
                        im.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}>
                        {im.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {im.destaque && <span className="text-xs font-medium text-laranja">★ Destaque</span>}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/imoveis/${im.id}/editar`}
                        className="text-sm text-laranja hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => toggleStatus(im.id, im.status)}
                        className={`text-sm ${im.status === "ativo" ? "text-red-500" : "text-green-600"} hover:underline`}
                      >
                        {im.status === "ativo" ? "Arquivar" : "Ativar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {imoveis.map((im) => (
              <div key={im.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 rounded-md overflow-hidden bg-cinza-claro shrink-0">
                    {im.fotos && im.fotos.length > 0 ? (
                      <img src={getSupabaseImageUrl(im.fotos[0])} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">—</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{im.titulo}</p>
                    <p className="text-sm font-bold text-laranja">{formatPrice(im.preco)}</p>
                  </div>
                  <span className={`text-xs font-medium py-1 px-2 rounded-full shrink-0 ${
                    im.status === "ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {im.status === "ativo" ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href={`/admin/imoveis/${im.id}/editar`} className="text-sm text-laranja hover:underline">
                    Editar
                  </Link>
                  <button
                    onClick={() => toggleStatus(im.id, im.status)}
                    className={`text-sm ${im.status === "ativo" ? "text-red-500" : "text-green-600"} hover:underline`}
                  >
                    {im.status === "ativo" ? "Arquivar" : "Ativar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
