import { limparCamposFormulario } from './function/clearForm.js';
import { mostrarToast } from './function/toast.js';

document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.querySelector("#modal-cadastro form");
    const loginForm = document.querySelector("#modal-login form");

    const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
    const salvarUsuarios = (usuarios) => localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Função para exibir mensagens de erro ou sucesso
    function exibirMensagem(input, msgElement, tipo, mensagem) {
        input.classList.remove("erro", "sucesso");
        msgElement.classList.remove("erro", "sucesso");
        msgElement.textContent = "";

        input.classList.add(tipo);
        msgElement.classList.add(tipo);
        msgElement.textContent = mensagem;
    }

    // Função para verificar e-mail no cadastro
    const verificarEmail = () => {
        const email = cadastroForm.querySelector("input[placeholder='Email']").value.trim();
        const usuarios = getUsuarios();
        const emailMsg = document.getElementById("email-msg");

        const emailJaExiste = usuarios.some(u => u.email === email);
        if (emailJaExiste) {
            exibirMensagem(cadastroForm.querySelector("input[placeholder='Email']"), emailMsg, "erro", "Este email já está cadastrado!");
        } else {
            exibirMensagem(cadastroForm.querySelector("input[placeholder='Email']"), emailMsg, "sucesso", "");
        }
    };

    // Função debounce para verificar e-mail com atraso
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Verificação do e-mail
    const emailInput = cadastroForm.querySelector("input[placeholder='Email']");
    emailInput.addEventListener("input", debounce(verificarEmail, 600));

    // Cadastro de usuário
    cadastroForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nome = cadastroForm.querySelector("input[placeholder='Nome completo']").value.trim();
        const email = emailInput.value.trim();
        const senha = cadastroForm.querySelector("input[placeholder='Senha']").value;
        const cpf = cadastroForm.querySelector(".cpf").value.trim(); // Alterado para buscar pela classe "cpf"
        const usuarios = getUsuarios();

        // Verificação de email duplicado
        const emailJaExiste = usuarios.some(u => u.email === email);
        if (emailJaExiste) {
            return exibirMensagem(emailInput, document.getElementById("email-msg"), "erro", "Este email já está cadastrado!");
        }

        // Validação de CPF
        if (!validarCPF(cpf)) {
            return exibirMensagem(cadastroForm.querySelector(".cpf"), document.getElementById("cpf-msg"), "erro", "CPF inválido."); // Alterado para buscar pela classe "cpf"
        }

        // Se tudo estiver ok, adicionar o usuário
        usuarios.push({ nome, email, senha, cpf });
        salvarUsuarios(usuarios);

        cadastroForm.reset();
        limparCamposFormulario(cadastroForm);
        fecharModal("modal-cadastro");
        mostrarToast("Cadastro realizado com sucesso!");
    });

    // Login
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = loginForm.querySelector("input[placeholder='Email']").value.trim();
        const senha = loginForm.querySelector("input[placeholder='Senha']").value;
        const usuarios = getUsuarios();
        const loginMsg = document.getElementById("login-msg");

        // Remover erro visual de campos
        [loginForm.querySelector("input[placeholder='Email']"), loginForm.querySelector("input[placeholder='Senha']")]
            .forEach(input => input.classList.remove("erro", "sucesso"));

        if (loginMsg) {
            loginMsg.classList.remove("erro", "sucesso");
            loginMsg.textContent = "";  // Limpar a mensagem
        }

        const usuarioEncontrado = usuarios.find(u => u.email === email && u.senha === senha);

        if (usuarioEncontrado) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
            loginForm.reset();
            limparCamposFormulario(loginForm);
            fecharModal("modal-login");
            mostrarToast("Login realizado com sucesso!");
            atualizarUI();
        } else {
            exibirMensagem(loginForm.querySelector("input[placeholder='Email']"), loginMsg, "erro", "Email ou senha inválidos.");
            exibirMensagem(loginForm.querySelector("input[placeholder='Senha']"), loginMsg, "erro", "Email ou senha inválidos.");
        }
    });

    // Remover erro visual ao digitar novamente no campo de email
    loginForm.querySelector("input[placeholder='Email']").addEventListener("input", () => {
        loginForm.querySelector("input[placeholder='Email']").classList.remove("erro", "sucesso");
        const loginMsg = document.getElementById("login-msg");
        if (loginMsg) {
            loginMsg.textContent = ""; // Limpar mensagem ao digitar novamente
        }
    });

    // Remover erro visual ao digitar novamente no campo de senha
    loginForm.querySelector("input[placeholder='Senha']").addEventListener("input", () => {
        loginForm.querySelector("input[placeholder='Senha']").classList.remove("erro", "sucesso");
    });

    atualizarUI();

    // Função para fechar o modal (reutilizável)
    function fecharModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = "none";
    }

    // Função para atualizar a UI com o usuário logado
    function atualizarUI() {
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
        const loginItem = document.getElementById("btn-login");
        const cadastroItem = document.getElementById("btn-cadastro");
        const userInfo = document.getElementById("user-info");

        if (usuarioLogado) {
            if (loginItem) loginItem.style.display = "none";
            if (cadastroItem) cadastroItem.style.display = "none";
            if (userInfo) {
                userInfo.innerHTML = `
                    <span> ${usuarioLogado.nome}</span>
                    <a href="#" id="btn-logout">Sair</a>
                `;
            }

            const btnLogout = document.getElementById("btn-logout");
            if (btnLogout) {
                btnLogout.addEventListener("click", (e) => {
                    e.preventDefault();
                    localStorage.removeItem("usuarioLogado");
                    atualizarUI();
                    mostrarToast("Logout realizado com sucesso!");
                });
            }

        } else {
            if (loginItem) loginItem.style.display = "list-item";
            if (cadastroItem) cadastroItem.style.display = "list-item";
            if (userInfo) userInfo.innerHTML = "";
        }
    }

    // Usuário padrão para testes
    const usuarios = getUsuarios();
    if (usuarios.length === 0) {
        const usuarioPadrao = {
            nome: "Usuário Padrão",
            email: "teste@teste",
            senha: "teste",
            cpf: "000.000.000-00"
        };
        usuarios.push(usuarioPadrao);
        salvarUsuarios(usuarios);
    }
});
