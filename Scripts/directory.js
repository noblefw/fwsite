// Fetch and render directory data dynamically
async function loadDirectory() {
  try {
    const response = await fetch('JSON/directory.json');
    if (!response.ok) throw new Error('Failed to load directory data');
    const data = await response.json();

    const container = document.getElementById('results-container');
    container.innerHTML = ''; // Clear existing content

    if (data.length === 0) {
      document.querySelector('.no-results').style.display = 'block';
      return;
    } else {
      document.querySelector('.no-results').style.display = 'none';
    }

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'info-card';
      card.dataset.type = item.type;
      card.dataset.genre = item.genre.join(',');
      card.dataset.status = item.status;
      card.dataset.location = item.location;
      card.dataset.name = item.name;

      card.innerHTML = `
        <div class="query-buttons">
          <button class="query-btn queried-btn" onclick="setQueried(this)">Queried</button>
          <button class="query-btn not-queried-btn" onclick="setNotQueried(this)">Not Queried</button>
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

    // Update results count
    document.getElementById('count').textContent = data.length;

  } catch (error) {
    console.error(error);
  }
}

// Call the function on page load
window.addEventListener('DOMContentLoaded', loadDirectory);
