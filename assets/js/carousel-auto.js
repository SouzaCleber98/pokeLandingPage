// carousel-auto.js

document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll('.carousel__slide');
    const viewport = document.querySelector('.carousel__viewport');
    let currentIndex = 0;
  
    if (!slides.length || !viewport) return;
  
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      const offset = slides[currentIndex].offsetLeft;
      viewport.scrollTo({ left: offset, behavior: 'smooth' });
    }, 5000); // troca a cada 5 segundos
  });
  