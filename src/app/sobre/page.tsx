import type { Metadata } from "next";
import { getConfig, getConfigValue } from "@/lib/config";
import { getWhatsAppLink, getSupabaseImageUrl } from "@/lib/utils";

const NOME = process.env.NEXT_PUBLIC_NOME_CORRETORA || "Selma Villar";
const CRECI = process.env.NEXT_PUBLIC_CRECI || "167207-F";

export const metadata: Metadata = {
  title: "Selma Villar | Corretora de Imóveis em Peruíbe — Formada em Direito, CRECI 167207-F",
  description: "Conheça a Selma Villar, corretora autônoma em Peruíbe com formação em Direito. Especialista em parcelamento direto com proprietário. Atendimento pessoal, sem imobiliária.",
};

export const revalidate = 60;

export default async function SobrePage() {
  const config = await getConfig();
  const foto = getConfigValue(config, "corretora_foto");
  const bio = getConfigValue(config, "corretora_bio", "Sou a Selma Villar, corretora de imóveis em Peruíbe e formada em Direito.\n\nTrabalho de um jeito diferente: não sou de imobiliária, não empurro imóvel e não dependo de banco pra fechar negócio. Meu trabalho é encontrar o imóvel que cabe na sua realidade e garantir que tudo seja feito com segurança jurídica — contrato registrado, documentação completa, tudo nos conformes.\n\nEu entendo que pra muita gente, comprar uma casa parece impossível. O banco diz não, o sistema é complicado, e ninguém tem paciência de explicar como funciona. Eu tenho.\n\nSou moradora de Peruíbe há mais de 12 anos. Conheço cada bairro, cada rua, cada oportunidade que aparece. E se você tem vontade de sair do aluguel e uma reserva pra começar, a gente conversa. Sem compromisso, sem julgamento.");
  const historia = getConfigValue(config, "corretora_historia", "");
  const anosExp = getConfigValue(config, "corretora_anos_experiencia", "12");
  const familias = getConfigValue(config, "corretora_familias_atendidas", "200");
  const cidades = getConfigValue(config, "corretora_cidades_atuacao", "Peruíbe, Itanhaém, Mongaguá");
  const numCidades = cidades.split(",").length;

  return (
    <>
      <section className="bg-cinza-claro section-padding">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {foto ? (
              <img src={getSupabaseImageUrl(foto)} alt={NOME} className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover border-2 border-laranja shrink-0" />
            ) : (
              <img src="/images/selma-villar.png" alt={NOME} className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover border-2 border-laranja shrink-0" />
            )}
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{NOME}</h1>
              <p className="text-lg text-laranja font-semibold mb-4">CRECI {CRECI} — Formada em Direito</p>
              <p className="text-cinza-medio leading-relaxed max-w-xl whitespace-pre-line">{bio}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: `${anosExp}+`, label: "Anos de experiência" },
              { number: `${familias}+`, label: "Famílias atendidas" },
              { number: String(numCidades), label: "Cidades de atuação" },
              { number: "100%", label: "Dedicação pessoal" },
            ].map((stat) => (
              <div key={stat.label} className="bg-cinza-claro rounded-xl p-6">
                <p className="font-display text-3xl md:text-4xl font-bold text-laranja">{stat.number}</p>
                <p className="text-sm text-cinza-medio mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {historia && (
        <section className="bg-cinza-claro section-padding">
          <div className="container-site max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-6">Minha História</h2>
            <p className="text-cinza-medio leading-relaxed whitespace-pre-line text-center">{historia}</p>
          </div>
        </section>
      )}

      <section className={`${historia ? "" : "bg-cinza-claro"} section-padding`}>
        <div className="container-site">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Por que trabalhar comigo?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "◎", title: "Sem banco, sem burocracia", desc: "A negociação é direta entre você e o proprietário. Sem consulta de crédito, sem score, sem filas. Se você tem uma entrada, tem caminho." },
              { icon: "⚖", title: "Segurança jurídica", desc: "Sou formada em Direito. Toda negociação tem contrato registrado em cartório, documentação verificada e acompanhamento jurídico." },
              { icon: "♡", title: "Atendimento pessoal", desc: "Você fala direto comigo, não com escritório ou robô. Acompanho cada etapa pessoalmente — da primeira conversa até a chave na mão." },
              { icon: "★", title: "Sem imobiliária no meio", desc: "Sou autônoma. Não empurro imóvel de carteira. Procuro o que cabe no seu bolso e na sua realidade." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm">
                <span className="text-3xl text-laranja mb-3 block">{item.icon}</span>
                <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-cinza-medio">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-laranja text-white section-padding">
        <div className="container-site text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Quer sair do aluguel?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">O primeiro passo é uma conversa. É gratuita, sem compromisso e sem consulta de crédito.</p>
          <a href={getWhatsAppLink(`Oi Selma! Vi seu site e quero conversar sobre imóveis em Peruíbe.`)} target="_blank" rel="noopener noreferrer"
            className="bg-white text-laranja font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Fale com a Selma pelo WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
