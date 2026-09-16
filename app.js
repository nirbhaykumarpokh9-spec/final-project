// --- Artworks Collection ---
const ARTWORKS = [
  {
    id: 1,
    title: "Starry Night Over the Rhône",
    artist: "Vincent van Gogh",
    year: "1888",
    category: "Post-Impressionism",
    medium: "Oil on canvas",
    dimensions: "72.5 cm × 92 cm",
    image: "https://uploads3.wikiart.org/00142/images/vincent-van-gogh/the-starry-night.jpg",
    description: "Captures the atmosphere of nighttime lighting reflected across the river waters in Arles, creating a luminous, serene experience."
  },
  {
    id: 2,
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    category: "Surrealism",
    medium: "Oil on canvas",
    dimensions: "24 cm × 33 cm",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80",
    description: "Famous surrealist masterpiece depicting melting clock faces scattered across a quiet, dreamlike landscape."
  },
  {
    id: 3,
    title: "Geometric Composition II",
    artist: "Piet Mondrian",
    year: "1929",
    category: "Abstract",
    medium: "Oil on canvas",
    dimensions: "50 cm × 50 cm",
    image: "https://s3.us-east-1.amazonaws.com/i.frg.im/H9xeqoj6/14x14geometric-composition-detail-modern-art-piet-mondrian.jpg",
    description: "An exploration of balance and harmony using primary colors divided strictly by thick black horizontal and vertical lines."
  },
  {
    id: 4,
    title: "Wanderer above the Sea of Fog",
    artist: "Caspar David Friedrich",
    year: "1818",
    category: "Romanticism",
    medium: "Oil on canvas",
    dimensions: "94.8 cm × 74.8 cm",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    description: "An iconic romantic painting depicting a figure standing atop a rocky precipice looking out over a misty mountain region."
  },
  {
    id: 5,
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: "1665",
    category: "Baroque",
    medium: "Oil on canvas",
    dimensions: "44.5 cm × 39 cm",
    image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=800&q=80",
    description: "A tronie painting featuring an enigmatic young girl wearing an exotic turban and a striking pearl earring."
  },
  {
    id: 6,
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    category: "Ukiyo-e",
    medium: "Woodblock print",
    dimensions: "25.7 cm × 37.8 cm",
    image: "https://images.unsplash.com/photo-1579783928621-7a13d66a62d1?auto=format&fit=crop&w=800&q=80",
    description: "A famous Japanese woodblock print depicting a towering wave threatening boats with Mount Fuji framed in the background."
  }
];

let activeCategory = "All";
let searchQuery = "";
let favorites = new Set();
let currentModalArtworkId = null;

const galleryGrid = document.getElementById('gallery-grid');
const categoryFiltersContainer = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const resultsCount = document.getElementById('results-count');
const emptyState = document.getElementById('empty-state');

const artModal = document.getElementById('art-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalArtist = document.getElementById('modal-artist');
const modalCategory = document.getElementById('modal-category');
const modalDesc = document.getElementById('modal-desc');
const modalMedium = document.getElementById('modal-medium');
const modalDims = document.getElementById('modal-dims');
const favoriteBtn = document.getElementById('favorite-btn');

function renderCategoryButtons() {
  const categories = ["All", ...new Set(ARTWORKS.map(a => a.category))];
  
  categoryFiltersContainer.innerHTML = categories.map(cat => `
    <button 
      onclick="setCategory('${cat}')"
      class="px-3.5 py-1.5 text-xs rounded-full font-medium transition ${
        activeCategory === cat 
          ? 'bg-amber-500 text-slate-950 font-semibold' 
          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
      }">
      ${cat}
    </button>
  `).join('');
}

function getFilteredArtworks() {
  return ARTWORKS.filter(art => {
    const matchesCategory = activeCategory === "All" || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderGallery() {
  const artworks = getFilteredArtworks();

  resultsCount.textContent = `Showing ${artworks.length} artwork${artworks.length !== 1 ? 's' : ''}`;

  if (artworks.length === 0) {
    galleryGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    galleryGrid.classList.remove('hidden');
    
    galleryGrid.innerHTML = artworks.map(art => `
      <div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg group hover:border-amber-500/50 transition duration-300 flex flex-col justify-between">
        <div>
          <div class="relative overflow-hidden bg-slate-950 h-64 flex items-center justify-center">
            <img 
              src="${art.image}" 
              alt="${art.title}" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            >
            <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-amber-400 text-[10px] uppercase font-bold px-2 py-1 rounded border border-slate-700">
              ${art.category}
            </span>
          </div>
          
          <div class="p-4">
            <h3 class="font-bold text-slate-100 text-base line-clamp-1 group-hover:text-amber-400 transition" title="${art.title}">
              ${art.title}
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">by ${art.artist} (${art.year})</p>
            <p class="text-xs text-slate-300 mt-2 line-clamp-2">${art.description}</p>
          </div>
        </div>

        <div class="p-4 pt-0 border-t border-slate-700/50 mt-3 flex items-center justify-between">
          <span class="text-[11px] text-slate-500">${art.medium}</span>
          <button 
            onclick="openModal(${art.id})"
            class="px-3 py-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center gap-1">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i> View Art
          </button>
        </div>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

window.setCategory = function(category) {
  activeCategory = category;
  renderCategoryButtons();
  renderGallery();
};

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderGallery();
});

window.openModal = function(id) {
  const artwork = ARTWORKS.find(a => a.id === id);
  if (!artwork) return;

  currentModalArtworkId = id;

  modalImg.src = artwork.image;
  modalTitle.textContent = artwork.title;
  modalArtist.textContent = `by ${artwork.artist} (${artwork.year})`;
  modalCategory.textContent = artwork.category;
  modalDesc.textContent = artwork.description;
  modalMedium.textContent = artwork.medium;
  modalDims.textContent = artwork.dimensions;

  updateFavoriteButton();

  artModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  lucide.createIcons();
};

function closeModal() {
  artModal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

closeModalBtn.addEventListener('click', closeModal);
artModal.addEventListener('click', (e) => {
  if (e.target === artModal) closeModal();
});

favoriteBtn.addEventListener('click', () => {
  if (!currentModalArtworkId) return;
  if (favorites.has(currentModalArtworkId)) {
    favorites.delete(currentModalArtworkId);
  } else {
    favorites.add(currentModalArtworkId);
  }
  updateFavoriteButton();
});

function updateFavoriteButton() {
  const isFav = favorites.has(currentModalArtworkId);
  if (isFav) {
    favoriteBtn.className = "text-xs px-3 py-2 bg-rose-600 text-white rounded-lg font-medium transition flex items-center gap-1.5";
    favoriteBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4 fill-current"></i> Favorited`;
  } else {
    favoriteBtn.className = "text-xs px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium transition flex items-center gap-1.5";
    favoriteBtn.innerHTML = `<i data-lucide="heart" class="w-4 h-4"></i> Favorite`;
  }
  lucide.createIcons();
}

renderCategoryButtons();
renderGallery();