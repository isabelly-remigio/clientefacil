# ClienteFácil – Sistema de Cadastro de Clientes

Tecnologias: **React + Tailwind** (front-end), **Node.js + Express** (back-end em JavaScript) e **SQLite** (banco de dados).

## Como rodar

Precisa ter o Node.js (versão 18 ou mais nova) instalado.

### 1. Back-end
```
cd backend
npm install
npm start
```
O servidor abre em http://localhost:3001 e cria sozinho o arquivo `banco.db`.

### 2. Front-end (em outro terminal)
```
cd frontend
npm install
npm run dev
```
Abra http://localhost:5173 no navegador.

### Login inicial
- E-mail: **admin@clientefacil.com**
- Senha: **admin123**

## Requisitos atendidos
- RF01 Login com e-mail e senha
- RF02 Cadastro com nome, CPF, e-mail, telefone e endereço
- RF03 Validação de CPF e e-mail
- RF04 Bloqueia CPF repetido
- RF05 Editar cliente
- RF06 Excluir cliente (com confirmação)
- RF07 Listar clientes
- RF08 Buscar por nome ou CPF
- RF09 Relatório de clientes (imprimir ou salvar em PDF)
- RNF03 Senhas guardadas com criptografia (bcrypt)
- RNF04 Não salva cadastro com campo obrigatório vazio
