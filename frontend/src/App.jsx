import { useState } from "react";
import { chamarApi } from "./api";
import Login from "./paginas/Login";
import Clientes from "./paginas/Clientes";
import Relatorio from "./paginas/Relatorio";

export default function App() {
  const [nomeUsuario, setNomeUsuario] = useState(localStorage.getItem("nome"));
  const [pagina, setPagina] = useState("clientes");

  async function sair() {
    await chamarApi("/logout", "POST").catch(() => {});
    localStorage.clear();
    setNomeUsuario(null);
  }

  if (!nomeUsuario) return <Login aoEntrar={setNomeUsuario} />;

  const botaoMenu = (nome, texto) => (
    <button
      onClick={() => setPagina(nome)}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${pagina === nome ? "bg-emerald-200 text-emerald-900" : "hover:bg-emerald-100"}`}
    >
      {texto}
    </button>
  );

  return (
    <div className="min-h-screen">
      <header className="nao-imprimir bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold text-emerald-700 mr-4">ClienteFácil</h1>
          {botaoMenu("clientes", "1. Clientes")}
          {botaoMenu("relatorio", "2. Relatório")}
          <span className="ml-auto text-sm text-slate-500">Olá, {nomeUsuario}</span>
          <button onClick={sair} className="px-3 py-2 text-sm rounded-lg hover:bg-rose-100 text-rose-700">3. Sair</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {pagina === "clientes" ? <Clientes /> : <Relatorio />}
      </main>
    </div>
  );
}
