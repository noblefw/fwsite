document.addEventListener('DOMContentLoaded', () => {
  // Globals
  let allData = [];

  const filterForm = document.getElementById('filter-form');
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const genreFilter = document.getElementById('genre-filter');
  // const statusFilter = document.getElementById('status-filter'); // verwijderd
  const locationFilter = document.getElementById('location-filter');
  const resultsContainer = document.getElementById('results-container');
  const resultsCount = document.getElementById('count');
  const noResults = document.querySelector('.no-results');

  // Utility for localStorage key
  function getKey(name) {
    return 'queryState-' + name.toLowerCase().replace(/\s+/g, '-');
  }

  // Toggle queried state when button clicked
  function toggleQueried(button) {
    const card = button.closest('.info-card');
    const name = card.dataset.name;
    const key = getKey(name);

    const isQueried = card.classList.contains('queried');
    const newState = isQueried ? 'none' : 'queried';

    try {
      localStorage.setItem(key, newState);
    } catch (e) {
      console.warn(`Failed to save to localStorage for ${key}:`, e);
    }

    updateQueryButtons(card, newState);
  }

  // Update query button UI for a card
  function updateQueryButtons(card, state) {
    const queriedBtn = card.querySelector('.queried-btn');
    if (!queriedBtn) return;

    if (state === 'queried') {
      card.classList.add('queried');
      queriedBtn.classList.add('active');
      queriedBtn.textContent = 'Queried';
    } else {
      card.classList.remove('queried');
      queriedBtn.classList.remove('active');
      queriedBtn.textContent = 'Queried';
    }
  }

  // Apply saved query states on all cards
  function updateAllQueryButtons() {
    const cards = document.querySelectorAll('.info-card');
    cards.forEach(card => {
      const name = card.dataset.name;
      const key = getKey(name);
      let savedState = 'none';

      try {
        savedState = localStorage.getItem(key) || 'none';
      } catch (e) {
        console.warn(`Failed to read from localStorage for ${key}:`, e);
      }

      updateQueryButtons(card, savedState);
    });
  }

  // Render cards to DOM
  function renderDirectory(data) {
    resultsContainer.innerHTML = '';
    noResults.style.display = data.length === 0 ? 'block' : 'none';

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'info-card';
      card.dataset.type = item.type || '';
      card.dataset.genre = Array.isArray(item.genre) ? item.genre.join(',') : '';
      // card.dataset.status = item.status || ''; // verwijderd
      card.dataset.location = item.location ? item.location.toLowerCase() : '';
      card.dataset.name = item.name ? item.name.toLowerCase() : '';

      card.innerHTML = `
        <div class="query-buttons">
          <button class="query-btn queried-btn" onclick="toggleQueried(this)">Queried</button>
        </div>
        <h3>${item.name || 'N/A'}</h3>
        <p><strong>Type:</strong> ${item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'N/A'}</p>
        <p><strong>Location:</strong> ${item.location || 'N/A'}</p>
        <p><strong>Genres:</strong> ${Array.isArray(item.genre) ? item.genre.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ') : 'N/A'}</p>
        <!--<p><strong>Submission Status:</strong> ${item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}</p>--> <!-- verwijderd -->
        <p><strong>About:</strong> ${item.about || 'N/A'}</p>
        <p><strong>Website:</strong> <a href="${item.website || '#'}" target="_blank" rel="noopener">${item.website ? item.website.replace(/^https?:\/\//, '') : 'N/A'}</a></p>
      `;

      resultsContainer.appendChild(card);
    });

    updateAllQueryButtons();
    resultsCount.textContent = data.length;
  }

  // Debounce to limit filtering frequency
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // Filtering logic
  function filterDirectory() {
    const searchValue = searchInput.value.toLowerCase();
    const typeValue = typeFilter.value;
    const genreValue = genreFilter.value;
    // const statusValue = statusFilter.value; // verwijderd
    const locationValue = locationFilter.value.toLowerCase();

    const filtered = allData.filter(item => {
      const name = item.name ? item.name.toLowerCase() : '';
      const type = item.type || '';
      const genres = Array.isArray(item.genre) ? item.genre : [];
      // const status = item.status || ''; // verwijderd
      const location = item.location ? item.location.toLowerCase() : '';

      if (searchValue && !name.includes(searchValue)) return false;
      if (typeValue && type !== typeValue) return false;
      if (genreValue && !genres.includes(genreValue)) return false;
      // if (statusValue && status !== statusValue) return false; // verwijderd

      if (locationValue) {
        if (locationValue === 'other') {
          if (['usa', 'uk', 'canada'].includes(location)) return false;
        } else if (location !== locationValue) {
          return false;
        }
      }

      return true;
    });

    renderDirectory(filtered);
  }

  // Setup event listeners for filters
  function setupFilters() {
    const debouncedFilter = debounce(filterDirectory, 300);
    [searchInput, typeFilter, genreFilter, /* statusFilter, */ locationFilter].forEach(el => {
      el.addEventListener('input', debouncedFilter);
      el.addEventListener('change', debouncedFilter);
    });
  }

  // Clear filters and reset view
  window.clearFilters = function () {
    filterForm.reset();
    renderDirectory(allData);
  };

  // Load JSON and initialize
  async function loadDirectory() {
    try {
      const res = await fetch('JSON/directory.json');
      if (!res.ok) throw new Error(`Failed to load directory: ${res.status}`);
      allData = await res.json();

      renderDirectory(allData);
      setupFilters();
    } catch (e) {
      console.error(e);
    }
  }

  // Make toggleQueried globally accessible for inline onclick
  window.toggleQueried = toggleQueried;

  // Start loading data
  loadDirectory();
});
