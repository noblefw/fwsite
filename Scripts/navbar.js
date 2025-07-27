/*import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj7-wG_XPGFLSI0ZFEIia-q9QjwIlFlxI",
  authDomain: "fantasywriters-e7c64.firebaseapp.com",
  projectId: "fantasywriters-e7c64",
  storageBucket: "fantasywriters-e7c64.firebasestorage.app",
  messagingSenderId: "736890201761",
  appId: "1:736890201761:web:0e35a823c3a2a2fbd272e0",
  measurementId: "G-GXHW1BFKJ0"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const authWrapper = document.getElementById('auth-sensitive-nav');
  const authButtons = authWrapper.querySelector('.auth-buttons');
  const profileMenu = authWrapper.querySelector('.profile-menu');
  const profileBtn = authWrapper.querySelector('.profile-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Toggle profile menu visibility
  profileBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('show');
  });

  // Close profile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
      profileMenu.classList.remove('show');
    }
  });

  // Logout
  logoutBtn?.addEventListener('click', async () => {
    await signOut(auth);
    window.location.href = "index.html";
  });

  // Handle auth state
  onAuthStateChanged(auth, (user) => {
    authWrapper.classList.remove('hidden');
    if (user) {
      authButtons.classList.add('hidden');
      profileMenu.classList.remove('hidden');
    } else {
      authButtons.classList.remove('hidden');
      profileMenu.classList.add('hidden');
    }
  });

  */

  // Hamburger + dropdown mobile nav
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navbar-links');
  const dropdowns = document.querySelectorAll('.dropdown');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Close all dropdowns when hamburger is toggled
    dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
  });

  dropdowns.forEach(dropdown => {
    const dropbtn = dropdown.querySelector('.dropbtn');
    const dropdownContent = dropdown.querySelector('.dropdown-content');

    dropbtn?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        // Toggle current dropdown, close others
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
        dropdown.classList.toggle('active');
      }
    });

    // Prevent clicks on dropdown-content from closing the dropdown
    dropdownContent?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  // Close nav and dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
  });
