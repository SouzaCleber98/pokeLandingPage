// clearForm.js
export function limparCamposFormulario(formulario) {
  formulario.querySelectorAll("input").forEach((input) => {
    input.classList.remove("sucesso", "erro");
  });

  formulario.querySelectorAll(".msg").forEach((msg) => {
    msg.textContent = "";
    msg.classList.remove("sucesso", "erro");
  });
}
// Limpa todos os campos de um formulário, removendo classes de erro e sucesso
// e limpando mensagens de erro/sucesso.