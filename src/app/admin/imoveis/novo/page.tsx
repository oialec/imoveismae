"use client";

import Link from "next/link";
import ImovelForm from "@/components/admin/ImovelForm";

export default function NovoImovelPage() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-cinza-medio hover:text-laranja transition-colors">
          ← Voltar
        </Link>
        <h1 className="font-display text-2xl font-bold">Novo Imóvel</h1>
      </div>
      <ImovelForm />
    </>
  );
}
