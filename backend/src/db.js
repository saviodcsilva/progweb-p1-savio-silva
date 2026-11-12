import { DatabaseSync } from 'node:sqlite';

const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    telefone TEXT
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id   INTEGER NOT NULL REFERENCES clientes(id),
    data_criacao TEXT NOT NULL,
    status       TEXT NOT NULL CHECK (status IN ('aberto', 'pago', 'cancelado')),
    total        REAL NOT NULL CHECK (total > 0)
  );
`);

// Dados de exemplo ficticios: inseridos apenas se o banco estiver vazio
const { total } = db.prepare('SELECT COUNT(*) AS total FROM clientes').get();
if (total === 0) {
  const insCliente = db.prepare('INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)');
  const c1 = insCliente.run('Ana Lima', 'ana.lima@exemplo.com', '(83) 99999-1111');
  const c2 = insCliente.run('Bruno Souza', 'bruno.souza@exemplo.com', '(83) 99999-2222');

  const insPedido = db.prepare(`
    INSERT INTO pedidos (cliente_id, data_criacao, status, total)
    VALUES (?, ?, ?, ?)
  `);
  insPedido.run(c1.lastInsertRowid, new Date().toISOString(), 'pago', 289.9);
  insPedido.run(c2.lastInsertRowid, new Date().toISOString(), 'aberto', 459.0);
}
