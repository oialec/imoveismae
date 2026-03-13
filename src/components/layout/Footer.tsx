import Link from "next/link";
import { getWhatsAppLink } from "@/lib/utils";

const NOME = process.env.NEXT_PUBLIC_NOME_CORRETORA || "Selma Villar";
const CRECI = process.env.NEXT_PUBLIC_CRECI || "167207-F";
const ANO = process.env.NEXT_PUBLIC_ANO_INICIO || "2012";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5513997158810";

function formatPhone(num: string): string {
  if (num.length === 13) return `(${num.slice(2, 4)}) ${num.slice(4, 9)}-${num.slice(9)}`;
  return num;
}

export default function Footer() {
  return (
    <footer className="bg-cinza-escuro text-white">
      <div className="container-site py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img src="/images/selma-villar.png" alt={NOME} className="w-12 h-12 rounded-full object-cover border-2 border-laranja" />
              <div>
                <p className="font-display font-bold text-lg">{NOME}</p>
                <p className="text-sm text-gray-400">CRECI {CRECI}</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">
              Imóveis em Peruíbe com parcelamento direto com o proprietário. Compre sua casa sem banco, sem consulta de crédito e com segurança jurídica. Corretora autônoma com formação em Direito.
            </p>
            <p className="text-xs text-gray-500 mt-1">Corretora autônoma em Peruíbe desde {ANO}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-white/10 rounded-full py-1 px-3">⚖ Formada em Direito</span>
              <span className="text-xs bg-white/10 rounded-full py-1 px-3">📋 CRECI {CRECI}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Região de atuação: Peruíbe, Itanhaém, Mongaguá, Praia Grande e Baixada Santista</p>
          </div>

          <div>
            <h3 className="font-display font-bold text-base mb-4">Navegação</h3>
            <nav className="flex flex-col gap-2">
              {[
                { href: "/", label: "Início" },
                { href: "/imoveis", label: "Comprar Imóvel" },
                { href: "/imoveis?modalidade=aluguel", label: "Alugar Imóvel" },
                { href: "/como-funciona", label: "Como Funciona" },
                { href: "/quero-vender", label: "Quero Vender" },
                { href: "/sobre", label: "Quem Sou Eu" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-300 hover:text-laranja transition-colors">{link.label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="font-display font-bold text-base mb-4">Contato</h3>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-laranja transition-colors mb-4">
              <svg className="w-5 h-5 text-laranja" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {formatPhone(WHATSAPP)}
            </a>
            <div>
              <a href={getWhatsAppLink("Olá Selma! Vi seu site e gostaria de mais informações.")} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-5">Fale Comigo</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {NOME} — CRECI {CRECI} — Todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}
