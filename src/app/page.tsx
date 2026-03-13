import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getConfig, getConfigValue } from "@/lib/config";
import { Imovel } from "@/lib/types";
import ImovelCard from "@/components/imoveis/ImovelCard";
import { getWhatsAppLink, getSupabaseImageUrl } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

async function getImoveisDestaque(): Promise<Imovel[]> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("imoveis").select("*").eq("status", "ativo").eq("destaque", true).order("criado_em", { ascending: false }).limit(6);
  return (data as Imovel[]) || [];
}

export const revalidate = 60;

const faqItems = [
  { q: "Posso comprar um imóvel com o nome sujo?", a: "Sim. A negociação é feita direto com o proprietário do imóvel, sem passar por banco. Não tem consulta de SPC, Serasa ou score. Se você tem uma entrada e consegue pagar as parcelas, você pode comprar." },
  { q: "Parcelamento direto com proprietário é seguro?", a: "Sim. Toda negociação tem contrato registrado em cartório e acompanhamento jurídico. A Selma é formada em Direito e garante que toda a documentação esteja em ordem. Não é compra de boca — é transação legal com respaldo da lei." },
  { q: "Preciso comprovar renda?", a: "Não. Como não é financiamento bancário, não existe exigência de comprovante de renda, holerite ou declaração de imposto. A negociação é entre você e o dono do imóvel." },
  { q: "Qual o valor mínimo de entrada?", a: "Depende do imóvel e da negociação com o proprietário. Existem opções com entradas diferentes. O primeiro passo é conversar com a Selma. Você pode usar FGTS, rescisão ou qualquer reserva como entrada." },
  { q: "E se eu atrasar uma parcela?", a: "As condições de atraso ficam definidas no contrato antes de fechar. Tudo é combinado com transparência, sem surpresas. É um acordo entre você e o proprietário, com respaldo legal." },
  { q: "O imóvel fica no meu nome?", a: "O processo de transferência é parte do contrato e fica documentado com prazo definido. Você tem segurança jurídica do início ao fim." },
  { q: "Qual a diferença disso pro Minha Casa Minha Vida?", a: "No Minha Casa Minha Vida, você entra numa fila e pode esperar anos sem ser chamado. Aqui, se você tem uma entrada, pode sair do aluguel agora. E uma coisa não impede a outra — dá pra tentar os dois caminhos ao mesmo tempo." },
  { q: "A Selma cobra alguma taxa de consulta?", a: "Não. A conversa inicial é gratuita e sem compromisso. Você conta sua situação e ela diz se tem alguma opção que funciona pra você." },
];

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

export default async function HomePage() {
  const [imoveisDestaque, config] = await Promise.all([getImoveisDestaque(), getConfig()]);
  const heroImg = getConfigValue(config, "hero_imagem");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="relative text-white overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0">
          {heroImg ? (
            <img src={getSupabaseImageUrl(heroImg)} alt="Imóveis em Peruíbe" className="w-full h-full object-cover" />
          ) : (
            <img src="/images/hero-peruibe.jpg" alt="Vista de Peruíbe - Litoral Sul SP" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>
        <div className="container-site relative py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm md:text-base text-laranja-light font-medium mb-4 tracking-wide animate-fade-up">Peruíbe e Região | Sem banco, sem burocracia</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up delay-100">
                Sua casa própria,<br /><span className="text-laranja-light">sem depender de banco.</span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-xl mb-8 animate-fade-up delay-200">
                Imóveis em Peruíbe e região com parcelamento direto com o proprietário. Sem consulta de crédito, sem burocracia, com contrato registrado e acompanhamento jurídico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-3 animate-fade-up delay-300">
                <a href={getWhatsAppLink("Oi Selma! Vi seu site e quero saber mais sobre os imóveis com parcelamento direto.")} target="_blank" rel="noopener noreferrer"
                  className="bg-laranja text-white font-bold py-4 px-8 rounded-lg hover:bg-laranja-dark hover:shadow-xl transition-all duration-300 text-base inline-flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Fale com a Selma
                </a>
                <Link href="/imoveis" className="border-2 border-white/80 text-white font-bold py-4 px-8 rounded-lg hover:bg-white/10 transition-all duration-300 text-base text-center">
                  Ver imóveis disponíveis
                </Link>
              </div>
              <p className="text-sm text-white/60 animate-fade-up delay-400">Conversa gratuita, sem compromisso.</p>
              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 mt-6 animate-fade-up delay-500">
                {["✓ Sem consulta de crédito", "✓ Nome sujo não impede", "⚖ Formada em Direito", "📋 CRECI 167207-F"].map((b) => (
                  <span key={b} className="text-xs text-white/80 bg-white/10 backdrop-blur-sm py-1.5 px-3 rounded-full border border-white/10">{b}</span>
                ))}
              </div>
            </div>
            {/* Selma photo */}
            <div className="hidden lg:flex justify-center animate-fade-up delay-400">
              <div className="relative">
                <div className="absolute -inset-4 bg-laranja/20 rounded-3xl blur-2xl"></div>
                <img src="/images/selma-villar.png" alt="Selma Villar - Corretora de Imóveis em Peruíbe" className="relative w-80 h-auto rounded-2xl shadow-2xl border-4 border-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O PROBLEMA */}
      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-6">
              Você já tentou comprar sua casa e ouviu &quot;não&quot;?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="text-cinza-medio leading-relaxed space-y-4 mb-8">
              <p>Você trabalha todo dia, paga aluguel todo mês, faz de tudo pra manter as contas em dia. Mas quando tenta financiar um imóvel, o banco diz que você não tem perfil.</p>
              <p>Score baixo. Nome com restrição. Renda que não aparece no papel. E lá vai você de volta pro aluguel, sentindo que a casa própria é coisa pra quem tem dinheiro sobrando.</p>
              <p>Enquanto isso, todo mês o dinheiro do aluguel vai embora — e no final, nada fica no seu nome.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-semibold text-cinza-escuro mb-4">Se você se encaixa em alguma dessas situações, a Selma pode te ajudar:</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              "Trabalha por conta própria e não consegue comprovar renda no banco",
              "Tem nome sujo ou score baixo",
              "Já foi negado em financiamento bancário",
              "Paga aluguel e sente que tá jogando dinheiro fora",
              "Tem uma reserva (FGTS, rescisão, economia) mas não dá pra comprar à vista",
              "Quer sair da casa dos pais ou do aluguel apertado",
            ].map((item, i) => (
              <Reveal key={item} delay={250 + i * 80}>
                <div className="flex items-start gap-3 bg-cinza-claro rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                  <span className="text-laranja font-bold text-lg shrink-0">✓</span>
                  <span className="text-sm text-cinza-escuro">{item}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <p className="text-center text-cinza-escuro font-medium mb-4">Existe um caminho diferente. Sem banco, sem burocracia — e com toda a segurança que você precisa.</p>
            <div className="text-center"><a href="#como-funciona" className="btn-outline">Veja como funciona ↓</a></div>
          </Reveal>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-cinza-claro section-padding">
        <div className="container-site">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Como comprar sua casa sem banco — em 3 passos</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
            {[
              { step: "1", title: "Converse com a Selma", desc: "Você conta sua realidade: quanto pode dar de entrada, quanto consegue pagar por mês, que região prefere. Sem julgamento, sem consulta de crédito. Só uma conversa pra entender o que cabe no seu bolso." },
              { step: "2", title: "Encontre o imóvel certo", desc: "A Selma busca imóveis em Peruíbe e região que aceitam parcelamento direto. Ela não trabalha pra imobiliária — trabalha pra você. Só indica o que faz sentido pra sua situação." },
              { step: "3", title: "Contrato seguro e chaves na mão", desc: "A negociação é feita direto com o dono. Tudo em contrato registrado em cartório, com acompanhamento jurídico. A Selma é formada em Direito — você tem segurança do começo ao fim." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 150}>
                <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="w-12 h-12 bg-laranja text-white rounded-full flex items-center justify-center font-display text-xl font-bold mx-auto mb-4">{item.step}</div>
                  <h3 className="font-display font-bold text-lg mb-2 text-center">{item.title}</h3>
                  <p className="text-sm text-cinza-medio text-center">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Exemplo real */}
          <Reveal>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border-2 border-laranja/20 p-6 md:p-8 hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-display font-bold text-lg text-center mb-4">Exemplo real de negociação:</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center"><p className="text-sm text-cinza-medio">Imóvel</p><p className="font-display font-bold text-xl">R$ 250.000</p></div>
                <div className="text-center"><p className="text-sm text-cinza-medio">Entrada</p><p className="font-display font-bold text-xl">R$ 100.000</p></div>
                <div className="text-center"><p className="text-sm text-cinza-medio">Parcelas</p><p className="font-display font-bold text-xl">R$ 2.000/mês</p></div>
                <div className="text-center"><p className="text-sm text-cinza-medio">Negociação</p><p className="font-display font-bold text-xl text-laranja">Direto com o dono</p></div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {["Sem consulta de crédito", "Sem comprovante de renda", "Contrato em cartório", "Acompanhamento jurídico"].map((s) => (
                  <span key={s} className="text-xs font-medium text-green-700 bg-green-50 py-1 px-3 rounded-full">✅ {s}</span>
                ))}
              </div>
              <p className="text-xs text-cinza-medio text-center mb-4">Os valores são um exemplo. Existem opções com entradas e parcelas menores.</p>
              <div className="text-center">
                <a href={getWhatsAppLink("Oi Selma! Quero descobrir qual imóvel cabe no meu bolso.")} target="_blank" rel="noopener noreferrer" className="btn-primary">Descubra qual imóvel cabe no seu bolso</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* IMÓVEIS EM DESTAQUE */}
      <section className="section-padding">
        <div className="container-site">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl md:text-4xl font-bold mb-3">Imóveis disponíveis com parcelamento direto</h2>
            </div>
          </Reveal>
          {imoveisDestaque.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {imoveisDestaque.map((imovel, i) => (
                <Reveal key={imovel.id} delay={i * 100}><ImovelCard imovel={imovel} /></Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="text-center py-12 bg-cinza-claro rounded-xl">
                <p className="text-cinza-medio text-lg mb-4">Novos imóveis em breve!</p>
                <a href={getWhatsAppLink("Olá Selma! Gostaria de saber quais imóveis estão disponíveis.")} target="_blank" rel="noopener noreferrer" className="btn-primary">Me avise quando tiver novidades</a>
              </div>
            </Reveal>
          )}
          <Reveal><div className="text-center mt-10"><Link href="/imoveis" className="btn-outline">Ver todos os imóveis</Link></div></Reveal>
        </div>
      </section>

      {/* QUERO VENDER */}
      <Reveal>
        <section className="bg-cinza-claro section-padding">
          <div className="container-site text-center">
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">Quer vender seu imóvel em Peruíbe?</h2>
            <p className="text-cinza-medio text-lg mb-8 max-w-xl mx-auto">Cadastre aqui e eu cuido da divulgação, negociação e documentação. Atendimento pessoal, sem imobiliária no meio.</p>
            <Link href="/quero-vender" className="btn-primary text-lg py-4 px-10">Quero Vender Meu Imóvel</Link>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-center mb-8">Dúvidas sobre comprar imóvel sem banco</h2>
          </Reveal>
          <div className="space-y-3">
            {faqItems.map((faq, i) => (
              <Reveal key={faq.q} delay={i * 60}>
                <details className="bg-white rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
                  <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                    <span className="font-display font-bold text-base text-cinza-escuro pr-4">{faq.q}</span>
                    <svg className="w-5 h-5 text-laranja shrink-0 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <div className="px-5 pb-5 text-cinza-medio leading-relaxed">{faq.a}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-laranja text-white section-padding">
        <div className="container-site text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-6">Sua casa própria pode estar mais perto do que você imagina</h2>
            <p className="text-white/90 text-lg mb-4">Você não precisa esperar limpar o nome. Não precisa esperar o banco aprovar. Não precisa esperar ser chamado no Minha Casa Minha Vida.</p>
            <p className="text-white/90 text-lg mb-8">Se você tem vontade de sair do aluguel e uma reserva pra começar, o próximo passo é simples: fala com a Selma. A conversa é gratuita, sem compromisso, e sem julgamento.</p>
            <a href={getWhatsAppLink("Oi Selma! Quero sair do aluguel e quero entender como funciona o parcelamento direto.")} target="_blank" rel="noopener noreferrer"
              className="bg-white text-laranja font-bold py-4 px-10 rounded-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 text-lg inline-flex items-center gap-3 hover:-translate-y-0.5 mb-6">
              Fale com a Selma agora pelo WhatsApp
            </a>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/80">
              <span>✅ Atendimento gratuito</span><span>✅ Sem consulta de crédito</span><span>✅ Contrato registrado</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
