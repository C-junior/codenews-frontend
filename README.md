# Sistema CodeNews - Frontend

Sistema de gestão de atendimento hospitalar desenvolvido em Vue.js 3 com Composition API.

## Stack Tecnológica

- **Framework**: Vite + Vue.js 3 (Composition API)
- **Estilização**: Tailwind CSS v3.4.17
- **HTTP Client**: Axios
- **Estado**: Pinia
- **Roteamento**: Vue Router 4

## Paleta de Cores

- **Azul Profundo**: #234A7A
- **Verde Medicina**: #8ABF5C
- **Cinza Claro**: #F3F7FA
- **Cinza Neutro**: #707B83
- **Branco**: #FFFFFF

## Tipografia

- **Montserrat**: Títulos
- **Nunito Sans**: Textos
- **Lato Bold**: Destaques

## Configuração do Projeto

```sh
npm install
```

### Desenvolvimento

```sh
npm run dev
```

Acesse: http://localhost:3000

### Build para Produção

```sh
npm run build
```

## Estrutura do Projeto

```
src/
├── components/           # Componentes Vue reutilizáveis
│   ├── base/            # Componentes base (botões, inputs, modais)
│   └── layout/          # Componentes de layout
├── views/               # Telas principais (8 obrigatórias)
├── composables/         # Lógica reutilizável (Composition API)
├── services/            # Serviços de API REST
├── stores/              # Gerenciamento de estado (Pinia)
├── utils/               # Utilitários e validações
├── assets/              # Recursos estáticos
└── router/              # Configuração de rotas
```

## Configuração da API

Configure a URL da API no arquivo `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```
