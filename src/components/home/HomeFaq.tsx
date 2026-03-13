"use client";

import { useState } from "react";

const faqs = [
  { q: "Posso comprar um imóvel com o nome sujo?", a: "Sim. A negociação é feita direto com o proprietário do imóvel, sem passar por banco. Não tem consulta de SPC, Serasa ou score. Se você tem uma entrada e consegue pagar as parcelas, você pode comprar." },
  { q: "Parcelamento direto com proprietário é seguro?", a: "Sim. Toda negociação tem contrato registrado em cartório e acompanhamento jurídico. A Selma é formada em Direito e garante que toda a documentação esteja em ordem. Não é compra de boca — é transação legal com respaldo da lei." },
  { q: "Preciso comprovar renda?", a: "Não. Como não é financiamento bancário, não existe exigência de comprovante de renda, holerite ou declaração de imposto. A negociação é entre você e o dono do imóvel." },
  { q: "Qual o valor mínimo de entrada?", a: "Depende do imóvel e da negociação com o proprietário. Existem opções com entradas diferentes. O primeiro passo é conversar com a Selma. Você pode usar FGTS, rescisão ou qualquer reserva como entrada." },
  { q: "E se eu atrasar uma parcela?", a: "As condições de atraso ficam definidas no contrato antes de fechar. Tudo é combinado com transparência, sem surpresas. É um acordo entre você e o proprietário, com respaldo legal." },
  { q: "O imóvel fica no meu nome?", a: "O processo de transferência é parte do contrato e fica documentado com prazo definido. Você tem segurança jurídica do início ao fim." },
  { q: "Qual a diferença disso pro Minha Casa Minha Vida?", a: "No Minha Casa Minha Vida, você entra numa fila e pode esperar anos sem ser chamado. Aqui, se você tem uma entrada, pode sair do aluguel agora. E uma coisa não impede a outra — dá pra tentar os dois caminhos ao mesmo tempo." },
  { q: "A Selma cobra alguma taxa de consulta?", a: "Não. A conversa inicial é gratuita e sem compromisso. Você conta sua situação e ela diz se tem alguma opção que funciona pra você." },
];

export default function HomeFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
          Dúvidas sobre comprar imóvel sem banco
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-gray-200 last:border-0">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left gap-4">
                <span className="font-display font-bold text-base md:text-lg text-cinza-escuro">{faq.q}</span>
                <svg className={`w-5 h-5 text-laranja shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && <div className="pb-5 text-cinza-medio leading-relaxed">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
