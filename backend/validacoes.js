// Funções que conferem se CPF e e-mail são válidos

function somenteNumeros(texto) {
  return String(texto).replace(/\D/g, "");
}

function cpfValido(cpf) {
  cpf = somenteNumeros(cpf);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false; // ex: 111.111.111-11

  // primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== Number(cpf[9])) return false;

  // segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  return digito2 === Number(cpf[10]);
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = { somenteNumeros, cpfValido, emailValido };
