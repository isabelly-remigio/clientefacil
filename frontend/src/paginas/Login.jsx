import { useState } from "react";
import { chamarApi } from "../api";

export default function Login({ aoEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar(evento) {
    evento.preventDefault();
    setErro("");
    try {
      const resposta = await chamarApi("/login", "POST", { email, senha });
      localStorage.setItem("token", resposta.token);
      localStorage.setItem("nome", resposta.nome);
      aoEntrar(resposta.nome);
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-sky-100 to-orange-100 px-4">
      <form onSubmit={entrar} className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-8 space-y-4">
        <h1 className="text-2xl font-bold text-emerald-700">ClienteFácil</h1>
        <p className="text-sm text-slate-500">Entre com seu e-mail e senha.</p>

        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2" required />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2" required />

        {erro && <p className="text-sm text-rose-600">{erro}</p>}

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 font-medium">Entrar</button>
      </form>
    </div>
  );
}
