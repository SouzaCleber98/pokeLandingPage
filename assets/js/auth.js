document.addEventListener("DOMContentLoaded", () => {
    const cadastroForm = document.querySelector("#modal-cadastro form");
    const loginForm = document.querySelector("#modal-login form");
  
    // Função para pegar os usuários salvos ou iniciar array vazio
    const getUsuarios = () => JSON.parse(localStorage.getItem("usuarios")) || [];
  
    // Função para salvar no localStorage
    const salvarUsuarios = (usuarios) =>
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
    // Cadastro
    cadastroForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const nome = cadastroForm.querySelector("input[placeholder='Nome completo']").value.trim();
      const email = cadastroForm.querySelector("input[placeholder='Email']").value.trim();
      const senha = cadastroForm.querySelector("input[placeholder='Senha']").value;
      const cpf = cadastroForm.querySelector("#cpf").value;
  
      const usuarios = getUsuarios();
  
      const emailJaExiste = usuarios.some((u) => u.email === email);
      if (emailJaExiste) {
        alert("Este email já está cadastrado!");
        return;
      }
  
      usuarios.push({ nome, email, senha, cpf });
      salvarUsuarios(usuarios);
  
      alert("Cadastro realizado com sucesso!");
      cadastroForm.reset();
    });
  
    // Login
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const email = loginForm.querySelector("input[placeholder='Email']").value.trim();
      const senha = loginForm.querySelector("input[placeholder='Senha']").value;
  
      const usuarios = getUsuarios();
      const usuarioEncontrado = usuarios.find(
        (u) => u.email === email && u.senha === senha
      );
  
      if (usuarioEncontrado) {
        alert(`Bem-vindo(a), ${usuarioEncontrado.nome}!`);
        loginForm.reset();
      } else {
        alert("Email ou senha inválidos.");
      }
    });
  });
  