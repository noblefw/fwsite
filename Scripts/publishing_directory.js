document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.getElementById('filter-form');
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const genreFilter = document.getElementById('genre-filter');
  const statusFilter = document.getElementById('status-filter');
  const locationFilter = document.getElementById('location-filter');
  const resultsContainer = document.getElementById('results-container');
  const resultsCount = document.getElementById('count');
  const noResults = document.querySelector('.no-results');
  const cards = document.querySelectorAll('.info-card');

  // Function to filter cards
  function filterCards() {
    let visibleCount = 0;

    const searchTerm = searchInput.value.toLowerCase();
    const selectedType = typeFilter.value;
    const selectedGenre = genreFilter.value;
    const selectedStatus = statusFilter.value;
    const selectedLocation = locationFilter.value;

    cards.forEach(card => {
      const cardName = card.dataset.name.toLowerCase();
      const cardType = card.dataset.type;
      const cardGenres = card.dataset.genre.split(',');
      const cardStatus = card.dataset.status;
      const cardLocation = card.dataset.location;

      const matchesSearch = searchTerm === '' || cardName.includes(searchTerm);
      const matchesType = selectedType === '' || cardType === selectedType;
      const matchesGenre = selectedGenre === '' || cardGenres.includes(selectedGenre);
      const matchesStatus = selectedStatus === '' || cardStatus === selectedStatus;
      const matchesLocation = selectedLocation === '' || cardLocation === selectedLocation;

      if (matchesSearch && matchesType && matchesGenre && matchesStatus && matchesLocation) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide no-results message
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';

    // Update result count
    resultsCount.textContent = visibleCount;
  }

  // Clear filters
  window.clearFilters = function () {
    filterForm.reset();
    searchInput.value = '';
    cards.forEach(card => {
      card.style.display = 'block';
    });
    noResults.style.display = 'none';
    resultsCount.textContent = cards.length;
  };

  // Initial count
  resultsCount.textContent = cards.length;

  // Attach event listeners
  filterForm.addEventListener('change', filterCards);
  searchInput.addEventListener('input', filterCards);
});