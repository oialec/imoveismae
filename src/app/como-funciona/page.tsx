import type { Metadata } from "next";
import { getWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Como Comprar Imóvel sem Banco em Peruíbe | Parcelamento Direto",
  description: "Entenda como funciona o parcelamento direto com o proprietário. Sem consulta de crédito, sem banco, com contrato registrado e acompanhamento jurídico. Veja o passo a passo.",
};

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="bg-cinza-claro section-padding">
        <div className="container-site text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">Como comprar sua casa sem banco e sem burocracia</h1>
          <p className="text-cinza-medio max-w-2xl mx-auto text-lg">
            O parcelamento direto com o proprietário é uma forma de comprar imóvel sem depender de banco, sem consulta de crédito e sem exigir comprovante de renda. Você negocia a entrada e as parcelas direto com o dono do imóvel, com tudo documentado e registrado em cartório.
          </p>
          <p className="text-cinza-escuro font-medium mt-4 max-w-2xl mx-auto">
            É a solução pra quem quer sair do aluguel mas enfrenta barreiras com o sistema bancário tradicional.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site max-w-3xl space-y-10">
          {[
            { step: "1", title: "Conversa inicial com a Selma", text: "Você entra em contato pelo WhatsApp e conta sua realidade: quanto pode dar de entrada, quanto consegue pagar por mês, que região prefere. A conversa é gratuita, sem compromisso e sem julgamento. Não tem consulta de crédito nessa etapa — nem em nenhuma outra." },
            { step: "2", title: "Busca do imóvel ideal", text: "Com base no que você me conta, eu procuro imóveis em Peruíbe, Itanhaém, Mongaguá e região que aceitam parcelamento direto com o proprietário. Sou corretora autônoma — não trabalho pra imobiliária e não empurro imóvel. Só indico o que faz sentido pra sua situação." },
            { step: "3", title: "Negociação e contrato", text: "Encontrou o imóvel? A negociação de entrada e parcelas é feita direto com o proprietário. Eu acompanho todo o processo pra garantir que as condições sejam justas pros dois lados. Tudo é formalizado em contrato registrado em cartório, com acompanhamento jurídico. Sou formada em Direito — você tem segurança do começo ao fim." },
            { step: "4", title: "Chaves na mão", text: "Com o contrato assinado e a entrada paga, você recebe as chaves. As parcelas são pagas direto pro proprietário, conforme combinado no contrato. Sem banco no meio, sem surpresas, sem juros abusivos." },
          ].map((item) => (
            <div key={item.step} className="flex gap-5">
              <div className="w-12 h-12 bg-laranja text-white rounded-full flex items-center justify-center font-display text-xl font-bold shrink-0">{item.step}</div>
              <div>
                <h2 className="font-display font-bold text-xl mb-2">{item.title}</h2>
                <p className="text-cinza-medio leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cinza-claro section-padding">
        <div className="container-site max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">Pra quem é o parcelamento direto?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {[
              "Tem nome sujo ou score baixo e não consegue financiamento",
              "Trabalha por conta própria e não tem como comprovar renda no papel",
              "Já foi negado pelo banco",
              "Tem uma reserva (FGTS, rescisão, economia) mas não o suficiente pra comprar à vista",
              "Paga aluguel e quer começar a investir no que é seu",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-lg p-4">
                <span className="text-laranja font-bold text-lg shrink-0">✓</span>
                <span className="text-sm text-cinza-escuro">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-site max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">E a segurança?</h2>
          <div className="bg-white rounded-2xl shadow-sm border-2 border-laranja/20 p-6 md:p-8 space-y-4 mb-6">
            <p className="text-cinza-escuro">Toda negociação intermediada por mim tem:</p>
            {[
              "Contrato registrado em cartório",
              "Acompanhamento jurídico (sou formada em Direito)",
              "Documentação completa do imóvel verificada",
              "Condições de atraso, transferência e prazo definidos em contrato",
            ].map((item) => (
              <p key={item} className="flex items-center gap-2 text-cinza-escuro"><span className="text-green-600 font-bold">✅</span>{item}</p>
            ))}
            <p className="text-cinza-escuro font-semibold mt-4">Não é compra de boca. É transação legal, segura e documentada.</p>
          </div>
        </div>
      </section>

      <section className="bg-laranja text-white section-padding">
        <div className="container-site text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Quer entender se funciona pra você?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-lg mx-auto">A conversa é gratuita e sem compromisso.</p>
          <a href={getWhatsAppLink("Oi Selma! Quero entender como funciona o parcelamento direto. Pode me explicar?")} target="_blank" rel="noopener noreferrer"
            className="bg-white text-laranja font-bold py-4 px-10 rounded-lg hover:bg-gray-100 transition-colors text-lg">
            Fale com a Selma pelo WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
