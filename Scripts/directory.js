let allData = []; // store loaded data globally

function getKey(name) {
  return 'queryState-' + name.toLowerCase().replace(/\s+/g, '-');
}

async function loadDirectory() {
  try {
    const response = await fetch('JSON/directory.json');
    if (!response.ok) throw new Error('Failed to load directory data');
    allData = await response.json();

    renderDirectory(allData); // show all data on page load

    setupFilters();

  } catch (error) {
    console.error(error);
  }
}

function renderDirectory(data) {
  const container = document.getElementById('results-container');
  container.innerHTML = '';

  const noResultsElem = document.querySelector('.no-results');

  if (data.length === 0) {
    if (noResultsElem) noResultsElem.style.display = 'block';
  } else {
    if (noResultsElem) noResultsElem.style.display = 'none';
  }

  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'info-card';
    card.dataset.type = item.type;
    card.dataset.genre = item.genre.join(',');
    card.dataset.status = item.status;
    card.dataset.location = item.location.toLowerCase();
    card.dataset.name = item.name.toLowerCase();

    card.innerHTML = `
      <div class="query-buttons">
        <button class="query-btn queried-btn" onclick="setQueried(this)">Queried</button>
      </div>
      <h3>${item.name}</h3>
      <p><strong>Type:</strong> ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Genres:</strong> ${item.genre.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}</p>
      <p><strong>Submission Status:</strong> ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
      <p><strong>About:</strong> ${item.about}</p>
      <p><strong>Website:</strong> <a href="${item.website}" target="_blank" rel="noopener">${item.website.replace(/^https?:\/\//, '')}</a></p>
    `;

    container.appendChild(card);
  });

  // After cards are added, update buttons states from localStorage
  updateAllQueryButtons();

  document.getElementById('count').textContent = data.length;
}

function updateAllQueryButtons() {
  const cards = document.querySelectorAll('.info-card');
  cards.forEach(card => {
    const name = card.dataset.name;
    const key = getKey(name);
    const savedState = localStorage.getItem(key) || 'none';

    updateQueryButtons(card, savedState);
  });
}

function setQueried(button) {
  const card = button.closest('.info-card');
  const name = card.dataset.name;
  const key = getKey(name);

  localStorage.setItem(key, 'queried');
  updateQueryButtons(card, 'queried');
}

function updateQueryButtons(card, state) {
  const queriedBtn = card.querySelector('.queried-btn');

  if (state === 'queried') {
    queriedBtn.disabled = true;
    queriedBtn.classList.add('active');
  } else {
    queriedBtn.disabled = false;
    queriedBtn.classList.remove('active');
  }
}

function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const genreFilter = document.getElementById('genre-filter');
  const statusFilter = document.getElementById('status-filter');
  const locationFilter = document.getElementById('location-filter');

  [searchInput, typeFilter, genreFilter, statusFilter, locationFilter].forEach(element => {
    element.addEventListener('input', filterDirectory);
  });
}

function filterDirectory() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const typeValue = document.getElementById('type-filter').value;
  const genreValue = document.getElementById('genre-filter').value;
  const statusValue = document.getElementById('status-filter').value;
  const locationValue = document.getElementById('location-filter').value.toLowerCase();

  const filtered = allData.filter(item => {
    if (searchValue && !item.name.toLowerCase().includes(searchValue)) return false;
    if (typeValue && item.type !== typeValue) return false;
    if (genreValue && !item.genre.includes(genreValue)) return false;
    if (statusValue && item.status !== statusValue) return false;

    if (locationValue) {
      const loc = item.location.toLowerCase();
      if (locationValue === 'other') {
        if (['usa', 'uk', 'canada'].includes(loc)) return false;
      } else if (loc !== locationValue) {
        return false;
      }
    }

    return true;
  });

  renderDirectory(filtered);
}

function clearFilters() {
  document.getElementById('filter-form').reset();
  renderDirectory(allData);
}

// Call loadDirectory on page load
window.addEventListener('DOMContentLoaded', loadDirectory);
