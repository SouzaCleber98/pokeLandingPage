const pokedexContainer = document.getElementById('pokedex');
let maxPokemon = 151;
const MAX_IMAGE_RETRIES = 20;
const IMAGE_RETRY_DELAY = 6000;
const POKEMON_BATCH_SIZE = 20; // Número de Pokémon por "scroll"
let currentOffset = 1;        // Próximo ID a ser carregado
let isLoading = false;        // Indica se um lote está em carregamento
let currentLoadToken = Symbol(); // Token para cancelar lotes antigos

// Definição das regiões
const regions = {
  kanto: { start: 1,   end: 151 },
  johto: { start: 152, end: 251 },
  hoenn: { start: 252, end: 386 },
  sinnoh:{ start: 387, end: 493 },
  unova: { start: 494, end: 649 },
  kalos: { start: 650, end: 721 },
  alola: { start: 722, end: 809 },
  galar: { start: 810, end: 898 },
  hisui: { start: 899, end: 905 },
  paldea:{ start: 906, end: 1025 },
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchWithRetry(url, retries = 3, delayTime = 1500) {
  let attempts = 0;
  while (attempts < retries) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        await delay(delayTime);
        attempts++;
      } else {
        return res.json();
      }
    } catch {
      await delay(delayTime);
      attempts++;
    }
  }
  return null;
}

async function tryLoadImage(url, attempts = 0) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload  = () => resolve(url);
    img.onerror = () => {
      if (attempts < MAX_IMAGE_RETRIES) {
        setTimeout(() => resolve(tryLoadImage(url, attempts + 1)), IMAGE_RETRY_DELAY);
      } else {
        reject(`Erro imagem: ${url}`);
      }
    };
  });
}

async function fetchPokemonById(id) {
  return fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`);
}

function createPokemonCard(pokemon) {
  const wrapper = document.createElement('div');
  wrapper.className = 'card-wrapper';
  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const [t1, t2] = pokemon.types.map(t => t.type.name);
  const bg = `linear-gradient(135deg, var(--type-${t1}) 50%, var(--type-${t2||t1}) 50%)`;

  const front = document.createElement('div');
  front.className = 'card card-front';
  front.style.background = bg;
  front.innerHTML = /* html */`
    <div class="pokeball-bg">
      <img src="assets/img/Icons/default/pokeball.svg" alt="">
    </div>
    <div class="card-image">
      <img data-image-type="front" src="" alt="">
    </div>
    <div class="card-id"><span>#${pokemon.id}</span></div>
    <div class="card-name"><h3>${
      pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
    }</h3></div>
    <div class="card-type">${
      pokemon.types.map(t =>
        `<img class="type-icon type-${t.type.name}" src="assets/img/Icons/${t.type.name}.svg" alt="">`
      ).join('')
    }</div>
  `;

  const back = document.createElement('div');
  back.className = 'card card-back';
  back.style.background = bg;
  back.innerHTML = /* html */`
    <div class="pokeball-bg">
      <img src="assets/img/Icons/default/pokeball.svg" alt="">
    </div>
    <div class="card-image">
      <img data-image-type="back" src="" alt="">
    </div>
    <div class="card-info">
      <p><strong>Peso:</strong> ${(pokemon.weight/10).toFixed(1)} kg</p>
      <p><strong>Altura:</strong> ${(pokemon.height/10).toFixed(1)} m</p>
    </div>
  `;

  inner.append(front, back);
  wrapper.appendChild(inner);
  pokedexContainer.appendChild(wrapper);

  // carregar sprites
  const frontImg = front.querySelector('img[data-image-type="front"]');
  const backImg  = back.querySelector('img[data-image-type="back"]');
  tryLoadImage(pokemon.sprites.other.showdown.front_default || pokemon.sprites.front_default)
    .then(url => frontImg.src = url).catch(() => {});
  tryLoadImage(pokemon.sprites.other.showdown.back_default  || pokemon.sprites.back_default)
    .then(url => backImg.src = url).catch(() => {});
}

// dispara o próximo lote
async function loadNextBatch() {
  if (isLoading || currentOffset > maxPokemon) return;
  isLoading = true;
  const token = currentLoadToken;
  const start = currentOffset;
  const end   = Math.min(start + POKEMON_BATCH_SIZE, maxPokemon + 1);

  try {
    for (let id = start; id < end; id++) {
      if (token !== currentLoadToken) break;
      const p = await fetchPokemonById(id);
      if (p) createPokemonCard(p);
      await delay(200);
    }
  } catch (e) {
    console.error(e);
  } finally {
    // Só atualiza offset se não houver troca de região
    if (token === currentLoadToken) {
      currentOffset = end;
    }
    isLoading = false;

    // **NOVO**: se ainda estivermos no fim do scroll, dispara novamente
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 200 &&
      currentOffset <= maxPokemon
    ) {
      // chama de novo para continuar carregando enquanto estivermos no fim
      loadNextBatch();
    }
  }
}


function checkScrollPosition() {
  if (isLoading || currentOffset > maxPokemon) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 200) {
    loadNextBatch();
  }
}

function disableRegionControls(disabled) {
  document
    .querySelectorAll('.region-selector button, .region-selector select')
    .forEach(el => el.disabled = disabled);
}

function loadRegion(region) {
  disableRegionControls(true);
  pokedexContainer.innerHTML = '';
  currentOffset = regions[region].start;
  maxPokemon = regions[region].end;
  isLoading = false;
  currentLoadToken = Symbol();
  loadNextBatch();
  setTimeout(() => disableRegionControls(false), 3000);
}

function init() {
  // região padrão
  loadRegion('kanto');
  window.addEventListener('scroll', checkScrollPosition);

  // listeners do seletor
  const selector = document.querySelector('.region-selector');
  selector.addEventListener('change', e => {
    if (e.target.tagName === 'SELECT') loadRegion(e.target.value);
  });
  selector.addEventListener('click', e => {
    if (e.target.matches('button[data-region]')) {
      document
        .querySelectorAll('.region-selector button')
        .forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      loadRegion(e.target.dataset.region);
    }
  });
}

init();
