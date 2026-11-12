# Loja Esportiva · Gestão de Pedidos

Sistema web fullstack para cadastro de clientes e controle de pedidos de artigos esportivos (camisas, chuteiras e acessórios).
Projeto 1 da disciplina Programação Web (UEPB, 2026.2).

- **Aplicação (Frontend):** (preencher após deploy na Vercel)
- **API (Backend):** (preencher após deploy no Render)
- **Vídeo de apresentação:** (preencher com link do YouTube/Drive)

> A API está hospedada no plano gratuito do Render: o primeiro acesso pode levar cerca de um minuto para acordar o servidor, e os dados voltam aos registros de exemplo a cada reinício do serviço.

## Tecnologias

- **Backend:** Node.js 22+, Express 5, SQLite (`node:sqlite`, SQL puro com placeholders `?`)
- **Frontend:** HTML5 semântico, CSS3, Bootstrap 5.3.8, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

## Rotas da API

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| GET | `/` | Health check da API | 200 |
| GET | `/clientes` | Lista todos os clientes | 200 |
| POST | `/clientes` | Cadastra um novo cliente | 201, 400, 409 |
| GET | `/clientes/:id` | Busca um cliente por ID | 200, 404 |
| PUT | `/clientes/:id` | Atualiza dados de um cliente | 200, 404 |
| DELETE | `/clientes/:id` | Remove um cliente sem pedidos | 204, 404, 409 |
| GET | `/pedidos` | Lista pedidos (aceita `?clienteId=`) | 200 |
| POST | `/pedidos` | Registra um novo pedido | 201, 400, 422 |
| GET | `/pedidos/:id` | Busca um pedido por ID | 200, 404 |
| PUT | `/pedidos/:id` | Atualiza status ou total de um pedido | 200, 400, 404 |
| DELETE | `/pedidos/:id` | Remove um pedido | 204, 404 |

Todos os erros seguem o formato padronizado `{ "erro": "mensagem" }`.

## Regras de negócio

- **Campos obrigatórios (400):** clientes exigem `nome` e `email`; pedidos exigem `clienteId` e `total`.
- **E-mail único (409):** não é permitido cadastrar dois clientes com o mesmo e-mail.
- **Valor e status válidos (400):** o `total` do pedido deve ser maior que zero e o `status` deve ser `aberto`, `pago` ou `cancelado`.
- **Integridade referencial na criação (422):** um pedido só pode ser registrado para um `clienteId` existente.
- **Bloqueio de exclusão com vínculo (409):** não é permitido remover um cliente que possua pedidos vinculados.

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, converte tipos e responde
    services/      regras de negócio
    models/        acesso ao banco SQLite (SQL puro)
    middleware/    logger e tratamento centralizado de erros
    utils/         fábrica de erros com status HTTP
    db.js          conexão, PRAGMA foreign_keys, schema e seed
frontend/
  js/
    config.js      URL da API (local ou produção)
    api.js         camada HTTP (fetch)
    services/      validações e limpeza no lado do cliente
    state/         store reativo da aplicação
    ui/            manipulação segura do DOM (textContent)
    main.js        liga store, services e views
MODELAGEM.md       diagrama de classes e decisões de SOLID (S2)
s1/ … s4/          exercícios práticos das semanas
```

## Autor

Sávio da Costa Silva · Ciência da Computação · UEPB (2026.2)
