import { useEffect, useState } from "react";
import { chamarApi } from "../api";

const clienteVazio = { nome: "", cpf: "", email: "", telefone: "", endereco: "" };

// Mostra o CPF com pontos e traço: 123.456.789-00
export function formatarCpf(cpf) {
  if (!cpf) return "";
  const apenasNumeros = cpf.replace(/\D/g, "").slice(0, 11);
  return apenasNumeros
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    .replace(/(\d{3})(\d{3})(\d{1})/, "$1.$2.$3")
    .replace(/(\d{3})(\d{1})/, "$1.$2");
}

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [formulario, setFormulario] = useState(clienteVazio);
  const [idEditando, setIdEditando] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function carregarClientes() {
    const lista = await chamarApi("/clientes?busca=" + encodeURIComponent(busca));
    setClientes(lista);
  }

  useEffect(() => {
    carregarClientes();
  }, [busca]);

  async function salvar(evento) {
    evento.preventDefault();
    setErro("");
    setMensagem("");
    try {
      let resposta;
      // Remove a máscara antes de enviar para a API se preferir salvar apenas números
      const dadosParaEnviar = {
        ...formulario,
        cpf: formulario.cpf.replace(/\D/g, "")
      };

      if (idEditando) {
        resposta = await chamarApi("/clientes/" + idEditando, "PUT", dadosParaEnviar);
      } else {
        resposta = await chamarApi("/clientes", "POST", dadosParaEnviar);
      }
      setMensagem(resposta.mensagem);
      setFormulario(clienteVazio);
      setIdEditando(null);
      carregarClientes();
    } catch (e) {
      setErro(e.message);
    }
  }

  function editar(cliente) {
    setFormulario({ ...cliente, cpf: formatarCpf(cliente.cpf) });
    setIdEditando(cliente.id);
    setMensagem("");
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(cliente) {
    if (!confirm(`Deseja mesmo excluir ${cliente.nome}?`)) return;
    const resposta = await chamarApi("/clientes/" + cliente.id, "DELETE");
    setMensagem(resposta.mensagem);
    carregarClientes();
  }

  function cancelar() {
    setFormulario(clienteVazio);
    setIdEditando(null);
    setErro("");
  }

  // Função personalizada para lidar com a mudança dos campos (incluindo a máscara do CPF)
  const handleChange = (e, nome) => {
    let valor = e.target.value;
    if (nome === "cpf") {
      valor = formatarCpf(valor);
    }
    setFormulario({ ...formulario, [nome]: valor });
  };

  const campo = (nome, texto, tipo = "text") => (
    <input
      type={tipo}
      placeholder={texto}
      value={formulario[nome]}
      onChange={(e) => handleChange(e, nome)}
      className="border border-slate-300 rounded-lg px-3 py-2 bg-white"
      required
    />
  );

  return (
    <div className="space-y-8">
      <form onSubmit={salvar} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold mb-4">{idEditando ? "Editar cliente" : "Cadastrar cliente"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {campo("nome", "Nome completo")}
          {campo("cpf", "CPF")}
          {campo("email", "E-mail", "email")}
          {campo("telefone", "Telefone")}
          <div className="sm:col-span-2 grid">{campo("endereco", "Endereço")}</div>
        </div>

        {erro && <p className="mt-3 text-sm text-rose-600 bg-rose-50 rounded-lg px-3 py-2">{erro}</p>}
        {mensagem && <p className="mt-3 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{mensagem}</p>}

        <div className="mt-4 flex gap-2">
          <button 
            className={`text-white rounded-lg px-5 py-2 font-medium transition-colors ${
              idEditando 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {idEditando ? "Salvar alterações" : "Cadastrar"}
          </button>

          {idEditando && (
            <button type="button" onClick={cancelar} className="rounded-lg px-5 py-2 hover:bg-slate-100">Cancelar</button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold">Clientes ({clientes.length})</h2>
          <input
            placeholder="Buscar por nome ou CPF"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 w-full sm:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2">Nome</th>
                <th>CPF</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{cliente.nome}</td>
                  <td>{formatarCpf(cliente.cpf)}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefone}</td>
                  <td className="text-right whitespace-nowrap">
                    <button onClick={() => editar(cliente)} className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 mr-2">Editar</button>
                    <button onClick={() => excluir(cliente)} className="px-3 py-1 rounded-lg bg-rose-100 text-rose-700">Excluir</button>
                  </td>
                </tr>
              ))}
              {clientes.length === 0 && (
                <tr><td colSpan="5" className="py-6 text-center text-slate-400">Nenhum cliente encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}