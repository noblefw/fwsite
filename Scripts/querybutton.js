    function setQueried(button) {
    const card = button.closest('.info-card');
    card.classList.add('queried');

    const queriedBtn = card.querySelector('.queried-btn');
    const notQueriedBtn = card.querySelector('.not-queried-btn');

    queriedBtn.classList.add('active');
    notQueriedBtn.classList.remove('active');
  }

  function setNotQueried(button) {
    const card = button.closest('.info-card');
    card.classList.remove('queried');

    const queriedBtn = card.querySelector('.queried-btn');
    const notQueriedBtn = card.querySelector('.not-queried-btn');

    queriedBtn.classList.remove('active');
    notQueriedBtn.classList.add('active');
  }

