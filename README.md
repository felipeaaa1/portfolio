# Felipe Arnaud — Portfólio

Portfólio pessoal desenvolvido em Angular para apresentar experiência profissional, tecnologias, formação e certificações em uma página única e responsiva.

## Tecnologias principais

- Angular 22
- TypeScript
- SCSS
- Componentes standalone
- IntersectionObserver
- Vitest
- Vercel como hospedagem planejada

## Funcionalidades

- Página única responsiva
- Sidebar social adaptada para desktop e dispositivos móveis
- Hero animado com efeito typewriter
- Fundo decorativo com partículas
- Timeline profissional
- Animação progressiva de entrada das seções
- Suporte a `prefers-reduced-motion`
- Navegação por âncoras internas

## Desenvolvimento local

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

O servidor fica disponível em `http://localhost:4200/`. O script também permite acesso pela rede local por utilizar `--host 0.0.0.0`.

## Build de produção

```bash
npm run build
```

Os arquivos estáticos do navegador são gerados em:

```text
dist/felipearnaud-portfolio/browser
```

## Testes

```bash
npm test
```

Os testes unitários são executados com Vitest por meio do builder de testes do Angular.

## Estrutura principal

```text
src/
├── app/
│   ├── components/   # Hero, sidebar e seções profissionais
│   ├── directives/   # Reveal progressivo com IntersectionObserver
│   └── app.*         # Composição e layout principal
├── index.html        # Metadados e documento base
└── styles.scss       # Estilos globais mínimos
public/               # Favicon, robots.txt e sitemap.xml
```

## Publicação

A hospedagem planejada é a Vercel, usando `npm run build` e o diretório de saída `dist/felipearnaud-portfolio/browser`.

Domínio final planejado: [felipearnaud.com](https://felipearnaud.com/).
