# Hub Escutaris

Central digital de conteúdos da Escutaris — materiais técnicos sobre NR-1, ISO 45003 e riscos psicossociais para RH, SST e lideranças.

**URL ao vivo:** https://comunidade.escutaris.com

## Stack

- React 18 + TypeScript
- Vite + Tailwind CSS + shadcn/ui
- Supabase (auth + banco de dados)
- PWA via vite-plugin-pwa

## Desenvolvimento local

```sh
npm install
npm run dev
```

O servidor sobe em `http://localhost:8080`.

## Deploy

Automático via GitHub Actions → FTP Hostinger a cada push na branch `main`.

## Estrutura

- `/src/pages` — páginas principais (Index, Admin, Login, etc.)
- `/src/components` — componentes React
- `/src/hooks` — hooks customizados
- `/public/assets` — imagens e recursos estáticos
- `/supabase` — migrações e configuração do banco
