document.addEventListener("DOMContentLoaded", () => { const openModalBtn = document.getElementById("openModal"); const closeModalBtn = document.querySelector(".close"); const modal = document.querySelector(".modal");

openModalBtn.addEventListener("click", () => { modal.style.display = "block"; });
    
closeModalBtn.addEventListener("click", () => { modal.style.display = "none"; });
    
window.addEventListener("click", (event) => { if (event.target === modal) { modal.style.display = "none"; } }); });