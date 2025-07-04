function toggleDarkMode() {
  const toggle = document.getElementById('darkmode-toggle');
  const isDark = toggle.checked;
  const logo = document.getElementById('site-logo');

  if (isDark) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    if (logo) logo.src = "Images/Title_logo_DM.png";
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    if (logo) logo.src = "Images/Title_logo.png";
  }
}

function loadDarkModePreference() {
  const darkMode = localStorage.getItem('darkMode');
  const toggle = document.getElementById('darkmode-toggle');
  const logo = document.getElementById('site-logo');

  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
    if (logo) logo.src = "Images/Title_logo_DM.png";
  } else {
    document.body.classList.remove('dark-mode');
    if (toggle) toggle.checked = false;
    if (logo) logo.src = "Images/Title_logo.png";
  }
}

document.addEventListener('DOMContentLoaded', loadDarkModePreference);
