import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDj7-wG_XPGFLSI0ZFEIia-q9QjwIlFlxI",
  authDomain: "fantasywriters-e7c64.firebaseapp.com",
  projectId: "fantasywriters-e7c64",
  storageBucket: "fantasywriters-e7c64.firebasestorage.app",
  messagingSenderId: "736890201761",
  appId: "1:736890201761:web:0e35a823c3a2a2fbd272e0",
  measurementId: "G-GXHW1BFKJ0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const loginError = document.getElementById('login-error');
const successMessage = document.getElementById('success-message');
const submitBtn = loginForm.querySelector('.submit-btn');
const loader = loginForm.querySelector('.loader');
const btnText = loginForm.querySelector('.btn-text');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 6 && password.length <= 32;
}

function showError(element, message) {
  element.textContent = message;
  element.classList.add('show');
}

function hideError(element) {
  element.textContent = '';
  element.classList.remove('show');
}

function toggleLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    loader.classList.remove('hidden');
    btnText.classList.add('hidden');
  } else {
    submitBtn.disabled = false;
    loader.classList.add('hidden');
    btnText.classList.remove('hidden');
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  hideError(emailError);
  hideError(passwordError);
  hideError(loginError);
  successMessage.classList.remove('fade-in');
  successMessage.classList.add('hidden');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let valid = true;

  if (!validateEmail(email)) {
    showError(emailError, 'Please enter a valid email address.');
    emailInput.classList.add('error');
    valid = false;
  } else {
    emailInput.classList.remove('error');
  }

  if (!validatePassword(password)) {
    showError(passwordError, 'Password must be 6 to 32 characters.');
    passwordInput.classList.add('error');
    valid = false;
  } else {
    passwordInput.classList.remove('error');
  }

  if (!valid) return;

  toggleLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Set localStorage flag on successful login
    localStorage.setItem('isLoggedIn', 'true');
    // Success
    successMessage.textContent = `Welcome back, ${userCredential.user.email}!`;
    successMessage.classList.remove('hidden');
    setTimeout(() => successMessage.classList.add('fade-in'), 50);
    loginForm.reset();
    // Optionally redirect
    // window.location.href = '/dashboard.html';
  } catch (error) {
    showError(loginError, `Error: ${error.message}`);
  } finally {
    toggleLoading(false);
  }
});

// Show form with fade-in + prefill email if provided
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form')?.classList.add('fade-in');
  document.querySelector('.login-info')?.classList.add('fade-in');

  const params = new URLSearchParams(window.location.search);
  const prefillEmail = params.get('email');
  if (prefillEmail) {
    emailInput.value = prefillEmail;
  }
});