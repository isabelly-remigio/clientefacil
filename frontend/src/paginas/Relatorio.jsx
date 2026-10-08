import { useEffect, useState } from "react";
import { chamarApi } from "../api";
import { formatarCpf } from "./Clientes";

export default function Relatorio() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    chamarApi("/clientes").then(setClientes);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Relatório de clientes cadastrados</h2>
        <button onClick={() => window.print()} className="nao-imprimir bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm">
          Imprimir / Salvar PDF
        </button>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Gerado em {new Date().toLocaleString("pt-BR")} — Total: {clientes.length} cliente(s)
      </p>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b bg-slate-50">
            <th className="py-2 px-2">Nome</th>
            <th>CPF</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Endereço</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id} className="border-b">
              <td className="py-2 px-2">{cliente.nome}</td>
              <td>{formatarCpf(cliente.cpf)}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.endereco}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
