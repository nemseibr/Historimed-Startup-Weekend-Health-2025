# Historimed

Historimed é uma aplicação web construída com Next.js e Firebase, projetada para gerenciar conteúdo histórico e oferecer uma interface moderna e responsiva.

## Sobre o projeto

- App criado com Next.js em TypeScript.
- Integração com Firebase para autenticação, armazenamento de dados e funcionalidades em tempo real.
- Layout responsivo com componentes personalizados e design moderno.
- Estrutura de rotas que inclui páginas de home, timeline, drive e configurações.

## Tecnologias utilizadas

- `Next.js` — framework React para renderização híbrida e rotas simplificadas.
- `React` — biblioteca de interface do usuário.
- `TypeScript` — tipagem estática para maior segurança e manutenção.
- `Firebase` — backend como serviço para autenticação e banco de dados.
- `Tailwind CSS` — estilização utilitária para criar interfaces rápidas e consistentes.
- `Radix UI` — componentes acessíveis e reutilizáveis para a interface.
- `React Hook Form` — gerenciamento de formulários e validação.
- `Zod` — esquema e validação de dados.
- `Framer Motion` — animações e transições suaves.
- `Recharts` — visualização de gráficos e dados.

## Estrutura principal

- `src/app/` — diretório principal das rotas e páginas.
- `src/components/` — componentes de interface reutilizáveis.
- `src/firebase/` — configuração e hooks Firebase.
- `src/lib/` — utilitários e tipos compartilhados.

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesse `http://localhost:9002` no navegador.

## Observações

- Ajuste as variáveis de ambiente do Firebase conforme necessário.
- Este projeto usa o `turbopack` no script de desenvolvimento.

## Deploy no Vercel

1. Crie um novo projeto no Vercel e conecte ao repositório Git.
2. Defina o diretório raiz do projeto como `historimed-main` para que o Vercel encontre o `package.json` correto.
3. Configure o build:
   - `Build Command`: `npm run build`
   - `Install Command`: `npm install`
   - `Output Directory`: deixe vazio para Next.js
4. Defina as variáveis de ambiente do Firebase no painel do Vercel, se você quiser conectar um projeto real:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (opcional)

Se você não tiver Firebase, não defina essas variáveis. O app carregará em modo demo com dados fictícios.

Importante: agora o deploy deve usar apenas as configurações do projeto no Vercel, sem `vercel.json` local.
