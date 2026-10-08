// Funções para conversar com o back-end
const ENDERECO_API = "http://localhost:3001";

export async function chamarApi(caminho, metodo = "GET", dados) {
  const resposta = await fetch(ENDERECO_API + caminho, {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token") || "",
    },
    body: dados ? JSON.stringify(dados) : undefined,
  });
  const resultado = await resposta.json();
  if (!resposta.ok) throw new Error(resultado.erro || "Erro no servidor.");
  return resultado;
}
