"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Imovel } from "@/lib/types";
import ImovelForm from "@/components/admin/ImovelForm";

export default function EditarImovelPage() {
  const params = useParams();
  const id = params.id as string;
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("imoveis")
        .select("*")
        .eq("id", id)
        .single();
      setImovel(data as Imovel | null);
      setLoading(false);
    }
    fetch();
  }, [id]);

  if (loading) {
    return <div className="py-10 text-center text-cinza-medio">Carregando imóvel...</div>;
  }

  if (!imovel) {
    return (
      <div className="py-10 text-center">
        <p className="text-cinza-medio mb-4">Imóvel não encontrado.</p>
        <Link href="/admin" className="btn-primary">Voltar ao Dashboard</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-cinza-medio hover:text-laranja transition-colors">
          ← Voltar
        </Link>
        <h1 className="font-display text-2xl font-bold">Editar Imóvel</h1>
      </div>
      <ImovelForm imovel={imovel} />
    </>
  );
}
