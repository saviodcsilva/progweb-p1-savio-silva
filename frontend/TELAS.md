# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Clientes | carregando | DevTools → Network → throttling 3G → F5 | spinner "Carregando clientes…" |
| Clientes | vazio | abrir com a API recém-iniciada | "Nenhum cliente cadastrado ainda. Preencha o formulário ao lado." |
| Clientes | erro | parar a API (Ctrl+C) → F5 | caixa vermelha "Não consegui falar com a API. Ela está rodando?" + botão "Tentar de novo" |
| Clientes | sucesso | cadastrar cliente com nome e e-mail válidos | tabela com a linha do cliente e botões Editar/Remover |
| Clientes | erro de regra (409) | cadastrar dois clientes com o mesmo e-mail | aviso vermelho no topo: "Já existe um cliente cadastrado com este e-mail" |
| Pedidos | carregando | DevTools → Network → throttling 3G → F5 | spinner "Carregando pedidos…" |
| Pedidos | vazio | abrir sem pedidos cadastrados | "Nenhum pedido registrado ainda. Cadastre um cliente e crie o primeiro pedido." |
| Pedidos | erro | parar a API (Ctrl+C) → F5 | caixa vermelha "Não consegui falar com a API. Ela está rodando?" + botão "Tentar de novo" |
| Pedidos | sucesso | selecionar cliente no `<select>`, informar total e registrar | tabela mostrando o nome do cliente, status e valor formatado em R$ |
| Pedidos | erro de regra (400) | tentar registrar pedido com total `-50` | aviso vermelho no topo: "O valor \"total\" do pedido deve ser maior que zero" |

## Camadas
- api: `js/api.js` (e `js/config.js`) · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/` · entrada: `js/main.js`
