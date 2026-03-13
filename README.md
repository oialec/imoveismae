# Imóveis Peruíbe — Site da Corretora Selma Villar

Site completo para corretora de imóveis autônoma em Peruíbe, SP.
Diferencial: **parcelamento direto com o proprietário** — sem banco, sem financiamento.

## Stack Técnica

- **Front-end:** Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Back-end / Banco:** Supabase (PostgreSQL + Auth + Storage)
- **Deploy:** Vercel

## Como Rodar Localmente

```bash
# 1. Clone o repositório
git clone <url>
cd peruibe-imoveis

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Rode o projeto
npm run dev
```

Acesse: http://localhost:3000

## Configuração do Supabase

### Storage
Crie um bucket chamado `imoveis` no Supabase Storage (marcado como Public).

### Autenticação
Crie um usuário manualmente em Authentication > Users.

### RLS Policies
```sql
CREATE POLICY "Imóveis ativos são públicos" ON imoveis FOR SELECT USING (status = 'ativo');
CREATE POLICY "Admin pode tudo" ON imoveis FOR ALL USING (auth.role() = 'authenticated');
```

## Páginas

- `/` — Página inicial
- `/imoveis` — Listagem com filtros
- `/imoveis/[slug]` — Detalhe do imóvel
- `/sobre` — Quem Sou Eu
- `/como-funciona` — Parcelamento direto + FAQ
- `/admin` — Painel administrativo
