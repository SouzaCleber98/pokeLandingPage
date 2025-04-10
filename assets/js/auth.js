import { limparCamposFormulario } from './function/clearForm.js';
import { mostrarToast } from './function/toast.js';


document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.querySelector("#modal-cadastro form");
    const loginForm = document.querySelector("#modal-login form");

    const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
    const salvarUsuarios = (usuarios) =>
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

    const emailInput = cadastroForm.querySelector("input[placeholder='Email']");
    const emailMsg = document.getElementById("email-msg");
    const cpfInput = cadastroForm.querySelector("#cpf");
    const cpfMsg = document.getElementById("cpf-msg");

    // Para fechar o modal (reutilizável)
    function fecharModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "none"; // ou use o método que você já usa para esconder
    }

    // Função debounce
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Verificação de e-mail com debounce
    const verificarEmail = () => {
        const email = emailInput.value.trim();
        const usuarios = getUsuarios();

        emailInput.classList.remove("erro", "sucesso");
        emailMsg.classList.remove("erro", "sucesso");
        emailMsg.textContent = "";

        const emailJaExiste = usuarios.some((u) => u.email === email);
        if (emailJaExiste) {
            emailInput.classList.add("erro");
            emailMsg.textContent = "Este email já está cadastrado!";
            emailMsg.classList.add("erro");
        } else if (email.length > 0) {
            emailInput.classList.add("sucesso");
        }
    };

    emailInput.addEventListener("input", debounce(verificarEmail, 600));

    // Cadastro
    cadastroForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = cadastroForm.querySelector("input[placeholder='Nome completo']").value.trim();
        const email = emailInput.value.trim();
        const senha = cadastroForm.querySelector("input[placeholder='Senha']").value;
        const cpf = cpfInput.value.trim();
        const usuarios = getUsuarios();

        // Limpa mensagens e classes do email (já feito pelo debounce, mas aqui apenas para garantir)
        emailInput.classList.remove("erro", "sucesso");
        emailMsg.classList.remove("erro", "sucesso");
        emailMsg.textContent = "";

        // Verifica e-mail duplicado
        const emailJaExiste = usuarios.some((u) => u.email === email);
        if (emailJaExiste) {
            emailInput.classList.add("erro");
            emailMsg.textContent = "Este email já está cadastrado!";
            emailMsg.classList.add("erro");
            return;
        }

        // Verifica o CPF
        cpfInput.classList.remove("erro", "sucesso");
        cpfMsg.classList.remove("erro", "sucesso");
        cpfMsg.textContent = "";
        if (!validarCPF(cpf)) {
            cpfInput.classList.add("erro");
            cpfMsg.textContent = "CPF inválido.";
            cpfMsg.classList.add("erro");
            return;
        } else {
            cpfInput.classList.add("sucesso");
        }

        // Se tudo estiver ok, adicionar usuário
        usuarios.push({ nome, email, senha, cpf });
        salvarUsuarios(usuarios);

        // Limpa as mensagens de e-mail e CPF (ou mostra mensagem de sucesso, se quiser)
        emailMsg.textContent = "";
        cpfMsg.textContent = "";
        cadastroForm.reset();
        limparCamposFormulario(cadastroForm);
        fecharModal("modal-cadastro");
        mostrarToast("Cadastro realizado com sucesso!");


    });

    // Login (continua igual)
    const loginEmailInput = loginForm.querySelector("input[placeholder='Email']");
    const loginSenhaInput = loginForm.querySelector("input[placeholder='Senha']");
    const loginMsg = document.getElementById("login-msg");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginEmailInput.value.trim();
        const senha = loginSenhaInput.value;
        const usuarios = getUsuarios();

        [loginEmailInput, loginSenhaInput].forEach(i => i.classList.remove("erro", "sucesso"));
        [loginMsg].forEach(m => {
            m.classList.remove("erro", "sucesso");
            m.textContent = "";
        });

        const usuarioEncontrado = usuarios.find(
            (u) => u.email === email && u.senha === senha
        );

        if (usuarioEncontrado) {
            loginEmailInput.classList.add("sucesso");
            loginSenhaInput.classList.add("sucesso");
            loginForm.reset();
            limparCamposFormulario(loginForm);
            fecharModal("modal-login");
            mostrarToast("Login realizado com sucesso!");


        } else {
            loginEmailInput.classList.add("erro");
            loginSenhaInput.classList.add("erro");
            loginMsg.textContent = "Email ou senha inválidos.";
            loginMsg.classList.add("erro");
        }
    });
    // Remover erro visual ao digitar novamente
    loginEmailInput.addEventListener("input", () => {
        loginEmailInput.classList.remove("erro", "sucesso");
        loginMsg.textContent = "";
        loginMsg.classList.remove("erro", "sucesso");
    });

    loginSenhaInput.addEventListener("input", () => {
        loginSenhaInput.classList.remove("erro", "sucesso");
    });

});
