
console.log("JS Loaded ✅");
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDj7-wG_XPGFLSI0ZFEIia-q9QjwIlFlxI",
  authDomain: "fantasywriters-e7c64.firebaseapp.com",
  projectId: "fantasywriters-e7c64",
  storageBucket: "fantasywriters-e7c64.firebasestorage.app",
  messagingSenderId: "736890201761",
  appId: "1:736890201761:web:0e35a823c3a2a2fbd272e0",
  measurementId: "G-GXHW1BFKJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const form = document.getElementById('register-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const repeatPasswordInput = document.getElementById('repeat-password');
const submitBtn = document.getElementById('submit');
const successMessage = document.getElementById('success-message');

window.addEventListener('load', () => {
  form.classList.add('fade-in');
  document.querySelector('.register-info').classList.add('fade-in');
});

function resetErrors() {
  [emailInput, passwordInput, repeatPasswordInput].forEach(input => {
    input.classList.remove('error');
    document.getElementById(`${input.id}-error`).classList.remove('show');
  });
  const emailExistsError = document.getElementById('email-exists-error');
  if (emailExistsError) emailExistsError.classList.remove('show');
  successMessage.classList.add('hidden'); // Hide success message on reset
}

function validateInputs() {
  let hasError = false;
  resetErrors();

  if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
    emailInput.classList.add('error');
    document.getElementById('email-error').classList.add('show');
    hasError = true;
  }

  if (passwordInput.value.length < 6 || passwordInput.value.length > 32) {
    passwordInput.classList.add('error');
    document.getElementById('password-error').classList.add('show');
    hasError = true;
  }

  if (passwordInput.value !== repeatPasswordInput.value) {
    repeatPasswordInput.classList.add('error');
    document.getElementById('repeat-password-error').classList.add('show');
    hasError = true;
  }

  return !hasError;
}

async function checkEmailExists(email) {
  if (!email.includes('@') || !email.includes('.')) return false;
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error("❌ Email check error:", error.code, error.message);
    return false;
  }
}

// Real-time email check with debounce
let emailCheckTimeout;
emailInput.addEventListener('input', () => {
  clearTimeout(emailCheckTimeout);
  resetErrors();

  emailCheckTimeout = setTimeout(async () => {
    if (emailInput.value.trim() === '') return;

    const exists = await checkEmailExists(emailInput.value.trim());
    if (exists) {
      emailInput.classList.add('error');
      document.getElementById('email-exists-error').classList.add('show');
    } else {
      document.getElementById('email-exists-error').classList.remove('show');
      emailInput.classList.remove('error');
    }
  }, 700);
});

emailInput.addEventListener('blur', async () => {
  if (emailInput.value.trim() === '') return;

  const exists = await checkEmailExists(emailInput.value.trim());
  if (exists) {
    emailInput.classList.add('error');
    document.getElementById('email-exists-error').classList.add('show');
  } else {
    document.getElementById('email-exists-error').classList.remove('show');
    emailInput.classList.remove('error');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateInputs()) return;

  const exists = await checkEmailExists(emailInput.value.trim());
  if (exists) {
    emailInput.classList.add('error');
    document.getElementById('email-exists-error').classList.add('show');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').classList.add('hidden');
  submitBtn.querySelector('.loader').classList.remove('hidden');

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    // Send email verification immediately after registration
    await sendEmailVerification(userCredential.user);

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: emailInput.value,
      createdAt: new Date()
    });

    successMessage.classList.remove('hidden');
    successMessage.classList.add('fade-in');
    form.reset();
    resetErrors();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').classList.remove('hidden');
      submitBtn.querySelector('.loader').classList.add('hidden');
      successMessage.classList.add('hidden');
    }, 3000);

    console.log("✅ User created and verification email sent:", userCredential.user);
  } catch (error) {
    resetErrors();
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').classList.remove('hidden');
    submitBtn.querySelector('.loader').classList.add('hidden');

    if (error.code === 'auth/email-already-in-use') {
      emailInput.classList.add('error');
      document.getElementById('email-exists-error').classList.add('show');
    } else {
      console.error("❌ Registration error:", error.code, error.message);
    }
  }
});