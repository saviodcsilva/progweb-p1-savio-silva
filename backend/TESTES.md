# Testes da API — Projeto 1 (S3)

API: Loja Esportiva API · entidades: Cliente e Pedido (relação 1:N) · servidor: `npm run dev` em http://localhost:3000

| # | Método | URL | Body | Status obtido | Observação |
|---|---|---|---|---|---|
| 1 | POST | /clientes | {"nome":"Sávio Silva","email":"savio@email.com","telefone":"83999990000"} | 201 | cria cliente |
| 2 | POST | /clientes | {"nome":"Outro Cliente","email":"savio@email.com"} | 409 | regra: e-mail duplicado |
| 3 | POST | /pedidos | {"clienteId":1,"total":299.9} | 201 | cria pedido vinculado ao cliente 1 |
| 4 | GET | /pedidos?clienteId=1 | — | 200 | filtro 1:N por clienteId |
| 5 | GET | /pedidos/99 | — | 404 | pedido inexistente |
| 6 | POST | /pedidos | {"clienteId":1,"total":-50} | 400 | regra: total deve ser > 0 |
| 7 | POST | /pedidos | {"clienteId":999,"total":150} | 422 | regra: cliente pai precisa existir |
| 8 | PUT | /pedidos/1 | {"status":"pago"} | 200 | atualiza status do pedido |
| 9 | DELETE | /pedidos/1 | — | 204 | remove pedido |
