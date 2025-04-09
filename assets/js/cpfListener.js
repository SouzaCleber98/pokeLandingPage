document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");
  const cpfMsg = document.getElementById("cpf-msg");

  // Remove o estado de erro/sucesso ao digitar
  cpfInput.addEventListener("input", () => {
    cpfInput.classList.remove("erro", "sucesso");
    cpfMsg.textContent = "";
    cpfMsg.classList.remove("erro", "sucesso");
  });

  // Validação ao sair do campo
  cpfInput.addEventListener("blur", () => {
    const valido = validarCPF(cpfInput.value);

    cpfInput.classList.remove("erro", "sucesso");
    cpfMsg.classList.remove("erro", "sucesso");

    if (!valido) {
      cpfInput.classList.add("erro");
      cpfMsg.textContent = "CPF inválido.";
      cpfMsg.classList.add("erro");
    } else {
      cpfInput.classList.add("sucesso");
      cpfMsg.textContent = "";
      cpfMsg.classList.add("sucesso");
    }
  });
});
