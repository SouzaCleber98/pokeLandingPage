import { limparCamposFormulario } from './function/clearForm.js';
import { mostrarToast } from './function/toast.js';

document.addEventListener("DOMContentLoaded", () => {
  const contatoForm = document.querySelector("#contato form");

  if (contatoForm) {
    contatoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = contatoForm.querySelector("input[placeholder='Nome']").value.trim();
      const email = contatoForm.querySelector("input[placeholder='Email']").value.trim();
      const cpf = contatoForm.querySelector(".cpf").value.trim();
      const mensagem = contatoForm.querySelector("textarea").value.trim();
      const cpfMsg = document.getElementById("cpf-msg");
      const cpfInput = contatoForm.querySelector("#cpf");

      // Limpa feedbacks anteriores com sua função
      limparCamposFormulario(contatoForm);

      if (!validarCPF(cpf)) {
        cpfInput.classList.add("erro");
        cpfMsg.textContent = "CPF inválido.";
        cpfMsg.classList.add("erro");
        return;
      }

      // Sucesso
      contatoForm.reset();
      limparCamposFormulario(contatoForm);
      mostrarToast("Mensagem enviada com sucesso!");
    });
  }
});
