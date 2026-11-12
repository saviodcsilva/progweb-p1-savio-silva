import { db } from '../db.js';

export const clienteModel = {
  listar() {
    return db.prepare('SELECT * FROM clientes ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id) ?? null;
  },

  existeEmail(email) {
    const linha = db
      .prepare('SELECT 1 FROM clientes WHERE LOWER(email) = LOWER(?)')
      .get(email);
    return linha !== undefined;
  },

  inserir({ nome, email, telefone }) {
    const r = db
      .prepare('INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)')
      .run(nome, email, telefone ?? null);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id = ?')
      .run(novo.nome, novo.email, novo.telefone ?? null, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
    return r.changes > 0;
  },
};
