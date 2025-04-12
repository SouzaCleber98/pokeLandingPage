document.addEventListener("DOMContentLoaded", () => {
  const cpfInputs = document.querySelectorAll(".cpf"); // Pega todos os campos com a classe .cpf

  cpfInputs.forEach((cpfInput) => {
    const cpfMsg = cpfInput.nextElementSibling; // Assumindo que a mensagem vem logo após o input

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
});
