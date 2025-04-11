document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  function atualizarInterfaceUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
    const loginBtn = document.getElementById("btn-login");
    const cadastroBtn = document.getElementById("btn-cadastro");
    const userInfo = document.getElementById("user-info");

    if (usuario) {
      loginBtn.style.display = "none";
      cadastroBtn.style.display = "none";

      userInfo.innerHTML = `
        <span>Olá, ${usuario.nome.split(" ")[0]}!</span>
        <button id="btn-logout">Sair</button>
      `;

      document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        location.reload(); // ou atualizarInterfaceUsuario();
      });
    } else {
      loginBtn.style.display = "inline-block";
      cadastroBtn.style.display = "inline-block";
      userInfo.innerHTML = "";
    }
  }

  atualizarInterfaceUsuario();
});
