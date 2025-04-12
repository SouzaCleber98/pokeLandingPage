// carousel-auto.js

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel__slide");
  const viewport = document.querySelector(".carousel__viewport");
  const navLinks = document.querySelectorAll(".carousel__navigation-button");
  const nextLinks = document.querySelectorAll(".carousel__next");
  const prevLinks = document.querySelectorAll(".carousel__prev");
  let currentIndex = 0;
  let autoScrollInterval;

  if (!slides.length || !viewport) return;

  const scrollToSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    const offset = slides[currentIndex].offsetLeft;
    viewport.scrollTo({ left: offset, behavior: "smooth" });
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
});
