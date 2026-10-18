/**
 * Software Architecture: Rick & Morty Single Page Application (SPA)
 * Written in Vanilla JS with Responsive Design patterns.
 */

// Global State Management
const state = {
    currentPage: 1,
    currentQuery: '',
    isLoading: false,
    hasMorePages: true,
    searchTimeout: null,
    countdownInterval: null,
    abortController: null, // Cancelador de peticiones HTTP
    apiBaseUrl: 'https://rickandmortyapi.com/api' // Reemplazar con '/api/rickandmorty' si usas el Proxy Spring Boot
};

// DOM Elements
const DOM = {
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    charactersGrid: document.getElementById('characters-grid'),
    loadingState: document.getElementById('loading-state'),
    countdownBanner: document.getElementById('countdown-banner'),
    countdownTimer: document.getElementById('countdown-timer'),
    scrollSentinel: document.getElementById('scroll-sentinel'),
    sectionTitle: document.getElementById('section-title'),
    resultsCount: document.getElementById('results-count'),
    detailModal: document.getElementById('detail-modal'),
    modalBody: document.getElementById('modal-body'),
    modalBackBtn: document.getElementById('modal-back-btn'),
    brandLogo: document.getElementById('logo-button')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupInfiniteScroll();
    fetchCharacters(true);
});

// Event Listeners Registration
function setupEventListeners() {
    // Escucha cada tecla del usuario en el buscador
    DOM.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        if (query.length > 0) {
            DOM.clearSearchBtn.classList.remove('hidden');
        } else {
            DOM.clearSearchBtn.classList.add('hidden');
        }

        handleSearchTrigger(query);
    });

    // Botón para borrar texto (X)
    DOM.clearSearchBtn.addEventListener('click', () => {
        DOM.searchInput.value = '';
        DOM.clearSearchBtn.classList.add('hidden');
        handleSearchTrigger('');
    });

    // Botón de regresar en el modal
    DOM.modalBackBtn.addEventListener('click', closeModal);

    // Tecla ESC para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Clic en el Logo "Rick & Morty" (regresa directo a Inicio)
    if (DOM.brandLogo) {
        DOM.brandLogo.addEventListener('click', () => {
            DOM.searchInput.value = '';
            DOM.clearSearchBtn.classList.add('hidden');
            handleSearchTrigger('');
        });
    }
}

/**
 * Controla el disparo inmediato del estado de carga y resetea temporizadores anteriores.
 * @param {string} query Término buscado
 */
function handleSearchTrigger(query) {
    // 1. Detener cualquier contador activo
    clearTimeout(state.searchTimeout);
    clearInterval(state.countdownInterval);
    hideCountdown();

    // 2. Abortar peticiones HTTP en vuelo
    if (state.abortController) {
        state.abortController.abort();
    }

    state.currentQuery = query;
    state.currentPage = 1;
    state.hasMorePages = true;

    // 3. Vaciar inmediatamente los resultados anteriores de la pantalla
    DOM.charactersGrid.innerHTML = '';
    DOM.resultsCount.textContent = '';

    // Si la búsqueda se limpia, recarga la lista inicial inmediatamente
    if (query === '') {
        DOM.sectionTitle.textContent = 'Personajes Populares';
        fetchCharacters(true);
    } else {
        // Muestra de inmediato el título de "Resultados para: ..."
        DOM.sectionTitle.textContent = `Resultados para: "${query}"`;
        startCountdownAndFetch(query);
    }
}

/**
 * Inicia la cuenta regresiva de 4 segundos obligatoria manteniendo el GIF de carga activo.
 * @param {string} query 
 */
function startCountdownAndFetch(query) {
    let timeLeft = 4;
    
    // Bloqueamos hasMorePages temporalmente para prevenir que el scroll infinito dispare llamadas
    state.hasMorePages = false;

    // Muestra inmediatamente el banner verde de 4s y el GIF de carga
    showCountdown(timeLeft);
    showLoading();

    state.countdownInterval = setInterval(() => {
        timeLeft--;
        DOM.countdownTimer.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(state.countdownInterval);
            hideCountdown();
            // Al terminar los 4 segundos exactos se realiza la llamada a la API
            fetchCharacters(true);
        }
    }, 1000);
}

/**
 * Realiza la petición a la API de Rick and Morty.
 * @param {boolean} isNewSearch Si es true limpia la grilla y actualiza el título
 */
async function fetchCharacters(isNewSearch = false) {
    if (state.isLoading) return;
    state.isLoading = true;

    showLoading();

    state.abortController = new AbortController();

    try {
        let endpoint = `${state.apiBaseUrl}/character?page=${state.currentPage}`;
        if (state.currentQuery) {
            endpoint += `&name=${encodeURIComponent(state.currentQuery)}`;
        }

        const response = await fetch(endpoint, { signal: state.abortController.signal });
        
        if (!response.ok) {
            if (response.status === 404) {
                renderNotFoundState();
                state.hasMorePages = false;
                return;
            }
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        state.hasMorePages = Boolean(data.info && data.info.next);
        DOM.resultsCount.textContent = `${data.info.count} personajes encontrados`;
        
        if (isNewSearch) {
            DOM.charactersGrid.innerHTML = '';
            DOM.sectionTitle.textContent = state.currentQuery 
                ? `Resultados para: "${state.currentQuery}"` 
                : 'Personajes Populares';
        }

        renderCharacters(data.results);
        state.currentPage++;

    } catch (error) {
        if (error.name === 'AbortError') {
            // Cancelado intencionalmente por nueva entrada del usuario
            return;
        }
        console.error('Error fetching characters:', error);
        if (isNewSearch) renderErrorState();
    } finally {
        state.isLoading = false;
        hideLoading();
    }
}

/**
 * Genera las tarjetas de los personajes.
 * @param {Array} characters 
 */
function renderCharacters(characters) {
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer flex flex-col justify-between';
        
        card.innerHTML = `
            <div>
                <div class="relative overflow-hidden aspect-square bg-gray-100">
                    <img src="${character.image}" alt="${character.name}" loading="lazy" class="w-full h-full object-cover">
                    <span class="absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(character.status)} shadow-sm">
                        ${translateStatus(character.status)}
                    </span>
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-800 text-base line-clamp-1 mb-1">${character.name}</h3>
                    <p class="text-xs text-gray-500 mb-2">${character.species} - ${character.gender}</p>
                    <div class="text-xs text-gray-600">
                        <span class="text-gray-400 block">Origen:</span>
                        <span class="font-medium line-clamp-1">${character.origin.name}</span>
                    </div>
                </div>
            </div>
            <div class="p-4 pt-0">
                <button class="w-full py-2 bg-gray-50 hover:bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg transition-colors border border-gray-100">
                    Ver Detalle
                </button>
            </div>
        `;

        card.addEventListener('click', () => openDetailModal(character));
        DOM.charactersGrid.appendChild(card);
    });
}

/**
 * Despliega la ventana modal con la información detallada.
 * @param {Object} character 
 */
async function openDetailModal(character) {
    DOM.modalBody.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <img src="${character.image}" alt="${character.name}" class="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-lg border border-gray-200">
            <div class="flex-1 space-y-4 w-full">
                <div>
                    <h2 class="text-2xl font-black text-gray-800">${character.name}</h2>
                    <span class="inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(character.status)}">
                        ${translateStatus(character.status)}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                    <div>
                        <span class="text-gray-400 text-xs block">Especie</span>
                        <span class="font-semibold text-gray-700">${character.species}</span>
                    </div>
                    <div>
                        <span class="text-gray-400 text-xs block">Género</span>
                        <span class="font-semibold text-gray-700">${character.gender}</span>
                    </div>
                    <div>
                        <span class="text-gray-400 text-xs block">Origen</span>
                        <span class="font-semibold text-gray-700">${character.origin.name}</span>
                    </div>
                    <div>
                        <span class="text-gray-400 text-xs block">Ubicación Actual</span>
                        <span class="font-semibold text-gray-700">${character.location.name}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-100 pt-4">
            <h4 class="font-bold text-gray-800 text-sm mb-3">Episodios donde aparece (${character.episode.length}):</h4>
            <div id="modal-episodes-list" class="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-2">
                <span class="text-xs text-gray-400 italic">Cargando episodios...</span>
            </div>
        </div>
    `;

    DOM.detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    fetchEpisodeNames(character.episode.slice(0, 10));
}

/**
 * Consulta la lista de nombres de episodios.
 * @param {Array} episodeUrls 
 */
async function fetchEpisodeNames(episodeUrls) {
    const episodesContainer = document.getElementById('modal-episodes-list');
    if (!episodesContainer) return;

    try {
        const episodePromises = episodeUrls.map(url => fetch(url).then(res => res.json()));
        const episodes = await Promise.all(episodePromises);

        episodesContainer.innerHTML = episodes.map(ep => `
            <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium text-xs rounded-md border border-emerald-100">
                ${ep.episode}: ${ep.name}
            </span>
        `).join('');
    } catch (err) {
        episodesContainer.innerHTML = '<span class="text-xs text-red-500">Error al cargar episodios</span>';
    }
}

function closeModal() {
    DOM.detailModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Configuración del Infinite Scroll Observer
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMorePages && !state.isLoading) {
            fetchCharacters(false);
        }
    }, { rootMargin: '200px' });

    observer.observe(DOM.scrollSentinel);
}

// Helpers visuales
function showLoading() {
    DOM.loadingState.classList.remove('hidden');
}

function hideLoading() {
    DOM.loadingState.classList.add('hidden');
}

function showCountdown(seconds) {
    DOM.countdownTimer.textContent = seconds;
    DOM.countdownBanner.classList.remove('hidden');
}

function hideCountdown() {
    DOM.countdownBanner.classList.add('hidden');
}

function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'alive': return 'bg-emerald-100 text-emerald-800';
        case 'dead': return 'bg-rose-100 text-rose-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function translateStatus(status) {
    switch (status.toLowerCase()) {
        case 'alive': return 'Vivo';
        case 'dead': return 'Muerto';
        default: return 'Desconocido';
    }
}

function renderNotFoundState() {
    DOM.charactersGrid.innerHTML = `
        <div class="col-span-full py-12 text-center">
            <i class="fa-solid fa-ghost text-4xl text-gray-300 mb-3"></i>
            <h3 class="text-lg font-bold text-gray-700">No se encontraron personajes</h3>
            <p class="text-sm text-gray-500">Intenta buscando otro nombre en la barra de búsqueda.</p>
        </div>
    `;
    DOM.resultsCount.textContent = '0 resultados';
}

function renderErrorState() {
    DOM.charactersGrid.innerHTML = `
        <div class="col-span-full py-12 text-center">
            <i class="fa-solid fa-triangle-exclamation text-4xl text-rose-400 mb-3"></i>
            <h3 class="text-lg font-bold text-gray-700">Ocurrió un error</h3>
            <p class="text-sm text-gray-500">No pudimos conectar con el servidor. Intenta de nuevo más tarde.</p>
        </div>
    `;
}