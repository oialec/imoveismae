import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Imovel } from "@/lib/types";
import { formatPrice, formatPriceAluguel, getWhatsAppLink, getSupabaseImageUrl, tipoLabel } from "@/lib/utils";
import FotoGaleria from "@/components/imoveis/FotoGaleria";

const NOME = process.env.NEXT_PUBLIC_NOME_CORRETORA || "Selma Villar";

async function getImovel(slug: string): Promise<Imovel | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("imoveis").select("*").eq("slug", slug).eq("status", "ativo").single();
  return data as Imovel | null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const imovel = await getImovel(params.slug);
  if (!imovel) return { title: "Imóvel não encontrado" };
  const isAluguel = imovel.modalidade === "aluguel";
  const priceText = isAluguel && imovel.valor_aluguel ? formatPriceAluguel(imovel.valor_aluguel) : formatPrice(imovel.preco);
  const bairroText = imovel.bairro ? ` em ${imovel.bairro},` : " em";
  return {
    title: `${tipoLabel(imovel.tipo)} ${imovel.quartos} Quartos${bairroText} ${imovel.cidade} | Parcelamento Direto`,
    description: `${tipoLabel(imovel.tipo)} com ${imovel.quartos} quartos${bairroText} ${imovel.cidade}. ${priceText} com parcelamento direto com o proprietário.${imovel.entrada_sugerida ? ` Entrada a partir de ${formatPrice(imovel.entrada_sugerida)}.` : ""} Sem banco, sem consulta de crédito. Fale com a Selma.`,
    openGraph: {
      title: `${imovel.titulo} — ${priceText}`,
      description: `${tipoLabel(imovel.tipo)} em ${imovel.cidade} — ${priceText}. Parcelamento direto com proprietário.`,
      images: imovel.fotos?.length > 0 ? [{ url: getSupabaseImageUrl(imovel.fotos[0]) }] : [],
    },
  };
}

export const revalidate = 60;

export default async function ImovelPage({ params }: { params: { slug: string } }) {
  const imovel = await getImovel(params.slug);
  if (!imovel) notFound();

  const isAluguel = imovel.modalidade === "aluguel";
  const priceText = isAluguel && imovel.valor_aluguel ? formatPriceAluguel(imovel.valor_aluguel) : formatPrice(imovel.preco);
  const whatsappMsg = `Oi Selma! Vi o ${tipoLabel(imovel.tipo).toLowerCase()} ${imovel.bairro ? `no ${imovel.bairro}` : `em ${imovel.cidade}`} por ${priceText} no site e quero saber mais. Pode me ajudar?`;

  return (
    <>
      <FotoGaleria fotos={imovel.fotos} titulo={imovel.titulo} />
      <div className="container-site py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-medium text-laranja bg-laranja/10 py-1 px-3 rounded-full">{tipoLabel(imovel.tipo)}</span>
                {isAluguel ? (
                  <span className="text-sm font-medium text-white bg-blue-600 py-1 px-3 rounded-full">Aluguel</span>
                ) : imovel.parcelamento_direto ? (
                  <span className="text-sm font-medium text-white bg-laranja py-1 px-3 rounded-full">Parcelamento Direto</span>
                ) : (
                  <span className="text-sm font-medium text-white bg-cinza-escuro py-1 px-3 rounded-full">Venda</span>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-1">{imovel.titulo}</h1>
              <p className="text-cinza-medio">{imovel.bairro ? `${imovel.bairro}, ` : ""}{imovel.cidade}</p>
            </div>

            {/* Price block with trust seals */}
            <div className="bg-cinza-claro rounded-xl p-6">
              {isAluguel && imovel.valor_aluguel ? (
                <p className="font-display text-3xl md:text-4xl font-bold text-blue-600">{formatPriceAluguel(imovel.valor_aluguel)}</p>
              ) : (
                <>
                  <p className="font-display text-3xl md:text-4xl font-bold text-laranja">{formatPrice(imovel.preco)}</p>
                  {imovel.entrada_sugerida && <p className="text-cinza-medio mt-1">Entrada: <strong>{formatPrice(imovel.entrada_sugerida)}</strong></p>}
                  {imovel.parcelas_a_partir_de && imovel.numero_parcelas && <p className="text-cinza-medio mt-1">Parcelas: <strong>{imovel.numero_parcelas}x de {formatPrice(imovel.parcelas_a_partir_de)}</strong> direto com o proprietário</p>}
                </>
              )}
              {imovel.parcelamento_direto && !isAluguel && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {["Sem consulta de crédito", "Contrato registrado", "Acompanhamento jurídico"].map((s) => (
                    <span key={s} className="text-xs font-medium text-green-700 bg-green-50 py-1 px-2 rounded-full">✅ {s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Quartos", value: imovel.quartos, show: imovel.quartos > 0 },
                { label: "Banheiros", value: imovel.banheiros, show: imovel.banheiros > 0 },
                { label: "Vagas", value: imovel.vagas, show: imovel.vagas > 0 },
                { label: "Área", value: imovel.area_m2 ? `${imovel.area_m2}m²` : null, show: !!imovel.area_m2 },
              ].filter(f => f.show).map((feat) => (
                <div key={feat.label} className="bg-cinza-claro rounded-lg p-4 text-center">
                  <p className="font-display text-2xl font-bold">{feat.value}</p>
                  <p className="text-sm text-cinza-medio">{feat.label}</p>
                </div>
              ))}
            </div>

            {imovel.descricao && (
              <div><h2 className="font-display text-xl font-bold mb-3">Sobre este imóvel</h2><div className="text-cinza-medio leading-relaxed whitespace-pre-line">{imovel.descricao}</div></div>
            )}

            {imovel.parcelamento_direto && !isAluguel && (
              <div className="bg-laranja/5 border-2 border-laranja/20 rounded-xl p-6">
                <h2 className="font-display text-xl font-bold mb-3 text-laranja">Como funciona o parcelamento direto?</h2>
                <div className="space-y-2 text-cinza-escuro text-sm">
                  <p>A negociação é feita direto com o proprietário — sem banco, sem consulta de crédito, sem burocracia. Tudo com contrato registrado em cartório e acompanhamento jurídico.</p>
                </div>
                <Link href="/como-funciona" className="text-sm text-laranja font-medium hover:underline mt-3 inline-block">Saiba mais sobre como funciona →</Link>
              </div>
            )}

            {/* Mapa do bairro */}
            {imovel.bairro && (
              <div>
                <h2 className="font-display text-xl font-bold mb-3">Localização</h2>
                <p className="text-cinza-medio text-sm mb-3">
                  Localizado no bairro {imovel.bairro}, {imovel.cidade}.
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${imovel.bairro}, ${imovel.cidade}, SP, Brasil`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa do bairro ${imovel.bairro} em ${imovel.cidade}`}
                  />
                </div>
                <p className="text-xs text-cinza-medio mt-2">O mapa mostra a região do bairro. O endereço exato é informado após o contato.</p>
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/images/selma-villar.png" alt={NOME} className="w-14 h-14 rounded-full object-cover border-2 border-laranja shrink-0" />
                  <div><p className="font-display font-bold">{NOME}</p><p className="text-sm text-cinza-medio">Corretora em Peruíbe</p></div>
                </div>
                <a href={getWhatsAppLink(whatsappMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">Quero saber mais</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-3 flex items-center justify-between gap-3">
        <div>
          <p className={`font-display font-bold text-lg ${isAluguel ? "text-blue-600" : "text-laranja"}`}>{priceText}</p>
          {!isAluguel && imovel.parcelas_a_partir_de && imovel.numero_parcelas && <p className="text-xs text-cinza-medio">{imovel.numero_parcelas}x de {formatPrice(imovel.parcelas_a_partir_de)}</p>}
        </div>
        <a href={getWhatsAppLink(whatsappMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary py-3 px-6 text-sm shrink-0">Quero saber mais</a>
      </div>
      <div className="lg:hidden h-20" />
    </>
  );
}
