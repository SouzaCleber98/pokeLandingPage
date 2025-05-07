const pokedexContainer = document.getElementById('pokedex');
const maxPokemon = 151;
const MAX_IMAGE_RETRIES = 20;
const IMAGE_RETRY_DELAY = 6000;
const POKEMON_BATCH_SIZE = 20; // Número de Pokémon por "scroll"

let currentOffset = 1; // Controla o índice do próximo Pokémon a ser carregado
let isLoading = false; // Estado para controlar se o carregamento está em andamento

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url, retries = 3, delayTime = 1500) => {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.log("Muitas requisições, tentando novamente...");
        await delay(delayTime);
        attempts++;
      } else {
        return await res.json();
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      await delay(delayTime);
      attempts++;
    }
  }
  return null;
};

const tryLoadImage = async (url, attempts = 0) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = () => resolve(url);
    img.onerror = () => {
      if (attempts < MAX_IMAGE_RETRIES) {
        console.log(`Tentando novamente a imagem: ${url} (Tentativa ${attempts + 1})`);
        setTimeout(() => {
          resolve(tryLoadImage(url, attempts + 1));
        }, IMAGE_RETRY_DELAY);
      } else {
        reject(`Falha ao carregar imagem após ${MAX_IMAGE_RETRIES} tentativas: ${url}`);
      }
    };
  });
};

const fetchPokemonById = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  return await fetchWithRetry(url);
};

const createPokemonCard = (pokemon) => {
  const cardWrapper = document.createElement('div');
  cardWrapper.classList.add('card-wrapper');

  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  const [type1, type2] = pokemon.types.map(t => t.type.name);
  const bgColor = `linear-gradient(135deg, var(--type-${type1}) 50%, var(--type-${type2 || type1}) 50%)`;

  const cardFront = document.createElement('div');
  cardFront.classList.add('card', 'card-front');
  cardFront.style.background = bgColor;
  cardFront.innerHTML = `
    <div class="card-image">
      <img src="" alt="${pokemon.name}" data-image-status="loading" data-image-type="front">
    </div>
    <div class="card-id">
      <span>#${pokemon.id}</span>
    </div>
    <div class="card-name">
      <h3>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h3>
    </div>
    <div class="card-type">
      ${pokemon.types.map(t => `
        <img src="assets/img/Icons/${t.type.name}.svg" alt="${t.type.name}" class="type-icon">
      `).join('')}
    </div>
  `;

  const cardBack = document.createElement('div');
  cardBack.classList.add('card', 'card-back');
  cardBack.style.background = bgColor;
  cardBack.innerHTML = `
    <div class="card-image">
      <img src="" alt="${pokemon.name} back" data-image-status="loading" data-image-type="back">
    </div>
    <div class="card-info">
      <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
      <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
    </div>
  `;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  cardWrapper.appendChild(cardInner);
  pokedexContainer.appendChild(cardWrapper);

  cardWrapper.addEventListener('click', () => {
    cardWrapper.classList.toggle('flipped');
  });

  // Imagens
  loadPokemonImage(pokemon.id, 'front', pokemon.sprites.other?.showdown?.front_default || pokemon.sprites.front_default, cardFront.querySelector('img'));
  loadPokemonImage(pokemon.id, 'back', pokemon.sprites.other?.showdown?.back_default || pokemon.sprites.back_default, cardBack.querySelector('img'));
};

const loadPokemonImage = async (id, side, imageUrl, imgElement) => {
  try {
    const validUrl = await tryLoadImage(imageUrl);
    imgElement.src = validUrl;
    imgElement.dataset.imageStatus = "loaded";
  } catch (err) {
    console.warn(err);
  }
};

const loadPokemonBatch = async () => {
  if (isLoading) return; // Se estiver carregando, não faz nada
  isLoading = true; // Marca que o carregamento está em andamento

  for (let i = currentOffset; i < currentOffset + POKEMON_BATCH_SIZE && i <= maxPokemon; i++) {
    const pokemon = await fetchPokemonById(i);
    if (pokemon) {
      createPokemonCard(pokemon);
      await delay(600); // Delay para evitar sobrecarga na API
    }
  }

  currentOffset += POKEMON_BATCH_SIZE; // Atualiza o índice para o próximo lote de Pokémon
  isLoading = false; // Marca que o carregamento foi concluído
};

const showLoadingIndicator = () => {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading-indicator';
  loadingIndicator.textContent = 'Carregando mais Pokémon...';
  pokedexContainer.appendChild(loadingIndicator);
  return loadingIndicator;
};

const hideLoadingIndicator = (loadingIndicator) => {
  if (loadingIndicator) {
    loadingIndicator.remove();
  }
};

// Função para detectar o scroll
const checkScrollPosition = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading) { // Se estiver a 200px do fim
    const loadingIndicator = showLoadingIndicator();
    loadPokemonBatch().then(() => hideLoadingIndicator(loadingIndicator)); // Carregar o próximo lote e esconder o indicador
  }
};

const init = () => {
  loadPokemonBatch(); // Carregar o primeiro lote
  window.addEventListener('scroll', checkScrollPosition); // Adicionar o evento de scroll
};

init();
