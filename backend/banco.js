// Conexão com o banco SQLite e criação das tabelas
const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");

const banco = new Database("banco.db");

banco.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessoes (
    token TEXT PRIMARY KEY,
    usuario_id INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Cria o usuário administrador na primeira vez
const admin = banco.prepare("SELECT id FROM usuarios WHERE email = ?").get("admin@clientefacil.com");
if (!admin) {
  const senhaCriptografada = bcrypt.hashSync("admin123", 10);
  banco.prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)")
    .run("Administrador", "admin@clientefacil.com", senhaCriptografada);
  console.log("Usuário admin criado: admin@clientefacil.com / admin123");
}

module.exports = banco;
