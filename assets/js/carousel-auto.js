// carousel-auto.js

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel__slide");
  const viewport = document.querySelector(".carousel__viewport");
  const navLinks = document.querySelectorAll(".carousel__navigation-button");
  const nextLinks = document.querySelectorAll(".carousel__next");
  const prevLinks = document.querySelectorAll(".carousel__prev");
  const searchInput = document.querySelectorAll(".search-input");
  let currentIndex = 0;
  let autoScrollInterval;

  if (!slides.length || !viewport) return;

  const scrollToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    const offset = slides[currentIndex].offsetLeft;
    viewport.scrollTo({ left: offset, behavior: "smooth" });
    searchInput[currentIndex].focus({ preventScroll: true });
  };

  const getIndexFromHref = (href) => {
    const match = href.match(/carousel__slide(\d+)/);
    return match ? parseInt(match[1], 10) - 1 : 0;
  };

  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      scrollToSlide(currentIndex + 1);
    }, 5000);
  };

  const resetAutoScroll = () => {
    clearInterval(autoScrollInterval);
    startAutoScroll();
  };

  nextLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetIndex = getIndexFromHref(link.getAttribute("href"));
      scrollToSlide(targetIndex);
      resetAutoScroll();
    });
  });

  prevLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetIndex = getIndexFromHref(link.getAttribute("href"));
      scrollToSlide(targetIndex);
      resetAutoScroll();
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetIndex = getIndexFromHref(link.getAttribute("href"));
      scrollToSlide(targetIndex);
      resetAutoScroll();
    });
  });

  startAutoScroll();

// Para evitar o auto-scroll quando o usuário digita no campo de pesquisa
document.querySelector('.search-input')
  .addEventListener('keydown', resetAutoScroll);

});

document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".search-input"); // Seleciona todos os inputs de pesquisa
  const forms = document.querySelectorAll(".search-form"); // Seleciona todos os formulários de pesquisa

  // Sincroniza os valores entre todos os inputs
  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const value = e.target.value;
      inputs.forEach((otherInput) => {
        if (otherInput !== e.target) {
          otherInput.value = value;
        }
      });
    });
  });

  // Lida com o envio dos formulários
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // Impede o envio padrão
      const searchValue = form.querySelector(".search-input").value.trim();
      if (searchValue !== "") {
        window.location.href = `pokedex.html?search=${encodeURIComponent(searchValue)}`;
      }
    });
  });
});


