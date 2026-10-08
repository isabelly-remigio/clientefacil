// Servidor da API do ClienteFácil
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const banco = require("./banco");
const { somenteNumeros, cpfValido, emailValido } = require("./validacoes");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  const usuario = banco.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);

  if (!usuario || !bcrypt.compareSync(senha || "", usuario.senha)) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  const token = crypto.randomUUID();
  banco.prepare("INSERT INTO sessoes (token, usuario_id) VALUES (?, ?)").run(token, usuario.id);
  res.json({ token, nome: usuario.nome });
});

app.post("/logout", (req, res) => {
  banco.prepare("DELETE FROM sessoes WHERE token = ?").run(req.headers.authorization);
  res.json({ mensagem: "Saiu do sistema." });
});

// Confere se a pessoa está logada antes de mexer nos clientes
function verificarLogin(req, res, next) {
  const sessao = banco.prepare("SELECT * FROM sessoes WHERE token = ?").get(req.headers.authorization);
  if (!sessao) return res.status(401).json({ erro: "Faça login para continuar." });
  next();
}

// Confere os dados do cliente e devolve a mensagem de erro (ou nada se estiver tudo certo)
function conferirCliente(cliente) {
  if (!cliente.nome || !cliente.cpf || !cliente.email || !cliente.telefone || !cliente.endereco) {
    return "Preencha todos os campos.";
  }
  if (!cpfValido(cliente.cpf)) return "CPF inválido.";
  if (!emailValido(cliente.email)) return "E-mail inválido.";
  return null;
}

// ---------- CLIENTES ----------

// Listar e buscar (por nome ou CPF)
app.get("/clientes", verificarLogin, (req, res) => {
  const busca = req.query.busca || "";
  const buscaCpf = somenteNumeros(busca);
  const clientes = banco
    .prepare("SELECT * FROM clientes WHERE nome LIKE ? OR (? <> '' AND cpf LIKE ?) ORDER BY nome")
    .all(`%${busca}%`, buscaCpf, `%${buscaCpf}%`);
  res.json(clientes);
});

// Cadastrar
app.post("/clientes", verificarLogin, (req, res) => {
  const cliente = req.body;
  const erro = conferirCliente(cliente);
  if (erro) return res.status(400).json({ erro });

  const cpf = somenteNumeros(cliente.cpf);
  const jaExiste = banco.prepare("SELECT id FROM clientes WHERE cpf = ?").get(cpf);
  if (jaExiste) return res.status(400).json({ erro: "Já existe um cliente com este CPF." });

  banco.prepare("INSERT INTO clientes (nome, cpf, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)")
    .run(cliente.nome.trim(), cpf, cliente.email.trim(), cliente.telefone.trim(), cliente.endereco.trim());
  res.json({ mensagem: "Cliente cadastrado com sucesso!" });
});

// Editar
app.put("/clientes/:id", verificarLogin, (req, res) => {
  const cliente = req.body;
  const erro = conferirCliente(cliente);
  if (erro) return res.status(400).json({ erro });

  const cpf = somenteNumeros(cliente.cpf);
  const outro = banco.prepare("SELECT id FROM clientes WHERE cpf = ? AND id <> ?").get(cpf, req.params.id);
  if (outro) return res.status(400).json({ erro: "Já existe outro cliente com este CPF." });

  banco.prepare("UPDATE clientes SET nome = ?, cpf = ?, email = ?, telefone = ?, endereco = ? WHERE id = ?")
    .run(cliente.nome.trim(), cpf, cliente.email.trim(), cliente.telefone.trim(), cliente.endereco.trim(), req.params.id);
  res.json({ mensagem: "Cliente atualizado com sucesso!" });
});

// Excluir
app.delete("/clientes/:id", verificarLogin, (req, res) => {
  banco.prepare("DELETE FROM clientes WHERE id = ?").run(req.params.id);
  res.json({ mensagem: "Cliente excluído." });
});

app.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
