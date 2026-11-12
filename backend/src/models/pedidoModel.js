import { db } from '../db.js';

const COLUNAS = `id, cliente_id AS clienteId,
  data_criacao AS dataCriacao, status, total`;

export const pedidoModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM pedidos ORDER BY id`).all();
  },

  listarPorCliente(clienteId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM pedidos WHERE cliente_id = ? ORDER BY id`)
      .all(clienteId);
  },

  buscarPorId(id) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM pedidos WHERE id = ?`)
      .get(id) ?? null;
  },

  inserir({ clienteId, total, status }) {
    const r = db
      .prepare(`INSERT INTO pedidos (cliente_id, data_criacao, status, total)
                VALUES (?, ?, ?, ?)`)
      .run(Number(clienteId), new Date().toISOString(), status ?? 'aberto', Number(total));
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE pedidos SET cliente_id = ?, status = ?, total = ? WHERE id = ?')
      .run(Number(novo.clienteId), novo.status, Number(novo.total), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM pedidos WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
