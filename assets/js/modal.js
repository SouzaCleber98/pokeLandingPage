document.addEventListener("DOMContentLoaded", () => {
    const openModalBtns = document.querySelectorAll(".open-modal");
    const closeModalBtns = document.querySelectorAll(".modal .close");
  
    openModalBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute("data-target");
        const modal = document.getElementById(targetId);
        if (modal) modal.style.display = "block";
      });
    });
  
    closeModalBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal");
        modal.style.display = "none";
      });
    });
  
    window.addEventListener("click", (event) => {
      const modals = document.querySelectorAll(".modal");
      modals.forEach((modal) => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });
    });
  });
  