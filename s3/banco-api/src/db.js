import { DatabaseSync } from 'node:sqlite';

const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS clientes (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT NOT NULL,
    cpf   TEXT NOT NULL UNIQUE,
    email TEXT
  );

  CREATE TABLE IF NOT EXISTS contas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo       TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupanca')),
    saldo      REAL NOT NULL,
    cliente_id INTEGER NOT NULL REFERENCES clientes(id),
    criada_em  TEXT NOT NULL
  );
`);
