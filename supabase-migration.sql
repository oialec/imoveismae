-- ============================================
-- MIGRAÇÃO DO BANCO - Imóveis Peruíbe v2
-- Execute este SQL no Supabase > SQL Editor
-- ============================================

-- 1. ADICIONAR NOVAS COLUNAS NA TABELA IMOVEIS
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS modalidade text NOT NULL DEFAULT 'venda';
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS parcelas_a_partir_de numeric;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS numero_parcelas integer;
ALTER TABLE imoveis ADD COLUMN IF NOT EXISTS valor_aluguel numeric;

-- 2. CRIAR TABELA DE LEADS (Quero Vender)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  email text,
  tipo_imovel text,
  cidade text NOT NULL DEFAULT 'Peruíbe',
  bairro text,
  descricao text,
  status text NOT NULL DEFAULT 'novo',
  criado_em timestamptz NOT NULL DEFAULT now()
);

-- 3. CRIAR TABELA DE CONFIGURAÇÕES
CREATE TABLE IF NOT EXISTS configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor text,
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- 4. HABILITAR RLS
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES - IMOVEIS
DROP POLICY IF EXISTS "Imoveis leitura publica" ON imoveis;
CREATE POLICY "Imoveis leitura publica" ON imoveis FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gerencia imoveis" ON imoveis;
CREATE POLICY "Admin gerencia imoveis" ON imoveis FOR ALL USING (auth.role() = 'authenticated');

-- 6. POLICIES - LEADS
DROP POLICY IF EXISTS "Leads insert publico" ON leads;
CREATE POLICY "Leads insert publico" ON leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin gerencia leads" ON leads;
CREATE POLICY "Admin gerencia leads" ON leads FOR ALL USING (auth.role() = 'authenticated');

-- 7. POLICIES - CONFIGURAÇÕES
DROP POLICY IF EXISTS "Config leitura publica" ON configuracoes;
CREATE POLICY "Config leitura publica" ON configuracoes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gerencia config" ON configuracoes;
CREATE POLICY "Admin gerencia config" ON configuracoes FOR ALL USING (auth.role() = 'authenticated');

-- 8. POLICIES - STORAGE
DROP POLICY IF EXISTS "Fotos publicas" ON storage.objects;
CREATE POLICY "Fotos publicas" ON storage.objects FOR SELECT USING (bucket_id = 'imoveis');

DROP POLICY IF EXISTS "Admin upload fotos" ON storage.objects;
CREATE POLICY "Admin upload fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'imoveis');

DROP POLICY IF EXISTS "Admin delete fotos" ON storage.objects;
CREATE POLICY "Admin delete fotos" ON storage.objects FOR DELETE USING (bucket_id = 'imoveis');

-- 9. CONFIGS PADRÃO
INSERT INTO configuracoes (chave, valor) VALUES
  ('hero_titulo', 'Seu imóvel em Peruíbe com parcelamento direto'),
  ('hero_subtitulo', 'Sem banco, sem financiamento, sem burocracia. Combine a entrada e as parcelas diretamente com o proprietário.'),
  ('hero_imagem', ''),
  ('corretora_foto', ''),
  ('corretora_bio', 'Sou moradora de Peruíbe há mais de 12 anos. Conheço cada bairro, cada rua. Meu trabalho é encontrar o imóvel certo para a sua vida.'),
  ('corretora_historia', ''),
  ('corretora_anos_experiencia', '12'),
  ('corretora_familias_atendidas', '200'),
  ('corretora_cidades_atuacao', 'Peruíbe, Itanhaém, Mongaguá')
ON CONFLICT (chave) DO NOTHING;
