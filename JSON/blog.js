// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  // Get the dropdown element
  const categoryDropdown = document.querySelector('.category-dropdown');
  // Get all post cards
  const postCards = document.querySelectorAll('.post-card');

  // Add event listener for dropdown changes
  categoryDropdown.addEventListener('change', () => {
    const selectedCategory = categoryDropdown.value;

    // Loop through all post cards
    postCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'all' || cardCategory === selectedCategory) {
        // Show the card
        card.style.display = 'flex';
      } else {
        // Hide the card
        card.style.display = 'none';
      }
    });
  });
});