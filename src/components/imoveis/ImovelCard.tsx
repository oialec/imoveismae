import Link from "next/link";
import { Imovel } from "@/lib/types";
import { formatPrice, formatPriceAluguel, getSupabaseImageUrl, tipoLabel } from "@/lib/utils";

export default function ImovelCard({ imovel }: { imovel: Imovel }) {
  const fotoUrl = imovel.fotos && imovel.fotos.length > 0 ? getSupabaseImageUrl(imovel.fotos[0]) : null;
  const isAluguel = imovel.modalidade === "aluguel";

  return (
    <Link href={`/imoveis/${imovel.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-cinza-claro">
        {fotoUrl ? (
          <img src={fotoUrl} alt={imovel.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cinza-medio">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isAluguel ? (
            <span className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-full">Aluguel</span>
          ) : imovel.parcelamento_direto ? (
            <span className="bg-laranja text-white text-xs font-bold py-1 px-3 rounded-full">Parcelamento Direto</span>
          ) : (
            <span className="bg-cinza-escuro text-white text-xs font-bold py-1 px-3 rounded-full">Venda</span>
          )}
        </div>
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-cinza-escuro text-xs font-medium py-1 px-2 rounded-md">
          {tipoLabel(imovel.tipo)}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-bold text-base md:text-lg text-cinza-escuro line-clamp-2 mb-1">{imovel.titulo}</h3>
        <p className="text-sm text-cinza-medio mb-3">{imovel.bairro ? `${imovel.bairro}, ` : ""}{imovel.cidade}</p>
        <div className="flex items-center gap-4 text-xs text-cinza-medio mb-3">
          {imovel.quartos > 0 && <span>{imovel.quartos} {imovel.quartos === 1 ? "quarto" : "quartos"}</span>}
          {imovel.banheiros > 0 && <span>{imovel.banheiros} banh.</span>}
          {imovel.area_m2 && <span>{imovel.area_m2}m²</span>}
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100">
          {isAluguel && imovel.valor_aluguel ? (
            <p className="font-display font-bold text-xl text-blue-600">{formatPriceAluguel(imovel.valor_aluguel)}</p>
          ) : (
            <>
              <p className="font-display font-bold text-xl text-laranja">{formatPrice(imovel.preco)}</p>
              {imovel.parcelamento_direto && imovel.parcelas_a_partir_de && imovel.numero_parcelas && (
                <p className="text-xs text-cinza-medio mt-0.5">
                  ou {imovel.numero_parcelas}x de {formatPrice(imovel.parcelas_a_partir_de)}
                </p>
              )}
              {!imovel.parcelas_a_partir_de && imovel.entrada_sugerida && (
                <p className="text-xs text-cinza-medio mt-0.5">Entrada: {formatPrice(imovel.entrada_sugerida)}</p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
