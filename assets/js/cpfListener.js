document.addEventListener("DOMContentLoaded", () => {
  const cpfInput = document.getElementById("cpf");

  if (cpfInput) {
    // Valida ao sair do campo
    cpfInput.addEventListener("blur", () => {
      const valido = validarCPF(cpfInput.value);
      cpfInput.classList.toggle("erro-cpf", !valido);
    });

    // Valida ao enviar o formulário
    const form = cpfInput.closest("form");
    if (form) {
      form.addEventListener("submit", (event) => {
        const valido = validarCPF(cpfInput.value);
        cpfInput.classList.toggle("erro-cpf", !valido);

        if (!valido) {
          cpfInput.focus();
          event.preventDefault(); // Impede o envio
        }
      });
    }
  }
});
