export interface Imovel {
  id: string;
  titulo: string;
  slug: string;
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial';
  modalidade: 'venda' | 'aluguel';
  cidade: string;
  bairro: string | null;
  endereco: string | null;
  preco: number;
  entrada_sugerida: number | null;
  parcelamento_direto: boolean;
  parcelas_a_partir_de: number | null;
  numero_parcelas: number | null;
  valor_aluguel: number | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  area_m2: number | null;
  descricao: string | null;
  status: 'ativo' | 'inativo';
  destaque: boolean;
  fotos: string[];
  criado_em: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string | null;
  tipo_imovel: string | null;
  cidade: string;
  bairro: string | null;
  descricao: string | null;
  status: 'novo' | 'em_contato' | 'concluido';
  criado_em: string;
}

export interface Configuracao {
  id: string;
  chave: string;
  valor: string | null;
  atualizado_em: string;
}
