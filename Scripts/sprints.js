import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
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
  const db = getFirestore(app);

  let timerInterval;
  let quoteInterval;
  let timeLeft = 0;
  let isRunning = false;
  let audio = null;
  let currentUser = null;

  const slider = document.getElementById('volume-slider');
  const textElement = document.getElementById('motivation-text');
  const durationSelect = document.getElementById('duration');
  const ambienceSelect = document.getElementById('ambience');

  const quotes = [
    "You’ve got this!",
    "Keep going, you're doing amazing!",
    "Let the words flow.",
    "Don't stop now!",
    "Your story matters!",
    "Every word brings you closer to the finish.",
    "You’re not just writing, you’re creating worlds.",
    "Write now, edit later.",
    "Believe in your story.",
    "Every great story starts with a single word.",
    "Your characters need you.",
    "Every word counts, keep writing!",
    "Trust the flow and keep typing.",
    "You’re crushing it right now!",
    "Imagine the world you’re building.",
  ];

  let quoteIndex = 0;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
    } else {
      currentUser = null;
      console.warn("User not logged in");
    }
  });

  function showNextQuote() {
    textElement.style.opacity = 0;
    setTimeout(() => {
      textElement.textContent = quotes[quoteIndex];
      quoteIndex = (quoteIndex + 1) % quotes.length;
      textElement.style.opacity = 1;
    }, 1000);
  }

  window.toggleSprint = function() {
    const startBtn = document.getElementById('start-btn');
    if (!isRunning) {
      startSprint();
      startBtn.textContent = 'Pause Sprint';
    } else {
      pauseSprint();
      startBtn.textContent = 'Start Sprint';
    }
  };

  window.resetSprint = function() {
    clearInterval(timerInterval);
    clearInterval(quoteInterval);
    isRunning = false;
    timeLeft = 0;
    document.getElementById('sprint-timer').textContent = '00:00';
    document.getElementById('sprint-status').textContent = 'Ready to Sprint!';
    document.getElementById('start-btn').textContent = 'Start Sprint';
    textElement.textContent = "You've got this!";
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
    // Enable duration dropdown again on reset
    durationSelect.disabled = false;
  };

  function startSprint() {
    if (isRunning) return;
    timeLeft = parseFloat(durationSelect.value) * 60;
    if (timeLeft <= 0) return;
    isRunning = true;

    // Disable duration dropdown while sprint is running (even if paused)
    durationSelect.disabled = true;

    document.getElementById('sprint-status').textContent = 'Sprint In Progress';

    timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        endSprint();
        return;
      }
      timeLeft--;
      updateTimerDisplay(timeLeft);
    }, 1000);

    quoteInterval = setInterval(showNextQuote, 6000);
    showNextQuote();

    // Start ambience audio
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const ambienceSrc = ambienceSelect.value;
    if (ambienceSrc !== 'none') {
      audio = new Audio(ambienceSrc);
      audio.loop = true;
      audio.volume = slider.value / 100;
      audio.play();
    } else {
      audio = null;
    }
  }

  function pauseSprint() {
    if (!isRunning) return;
    clearInterval(timerInterval);
    clearInterval(quoteInterval);
    isRunning = false;
    if (audio) audio.pause();
    // Duration remains disabled while paused
  }

  function endSprint() {
    clearInterval(timerInterval);
    clearInterval(quoteInterval);
    isRunning = false;
    document.getElementById('sprint-status').textContent = 'Sprint Complete!';
    document.getElementById('start-btn').textContent = 'Start Sprint';
    document.getElementById('sprint-timer').textContent = '00:00';
    if (audio) {
      audio.pause();
      audio = null;
    }

      // Play finishing sound
      const finishSound = new Audio('Sound/Alarm2.mp3');
      finishSound.volume = 1; // Set volume to max for finishing sound
      finishSound.play();


    // Enable duration dropdown when sprint ends
    durationSelect.disabled = false;
    

    confetti({
      particleCount: 300,
      spread: 90,
      origin: { y: 0.6 }
    });

    // Show modal to input word count
    const modal = document.getElementById('word-count-modal');
    modal.classList.remove('hidden');

    const submitBtn = document.getElementById('submit-word-count');
    submitBtn.onclick = async () => {
      const wordCountInput = document.getElementById('word-count-input');
      const wordCount = parseInt(wordCountInput.value);
      if (isNaN(wordCount) || wordCount < 0) {
        alert('Please enter a valid number for word count.');
        return;
      }
      if (!currentUser) {
        alert('You must be logged in to submit your word count.');
        modal.classList.add('hidden');
        return;
      }
      try {
        await addDoc(collection(db, 'userSprintData'), {
          userId: currentUser.uid,
          wordCount: wordCount,
          timestamp: new Date()
        });
        alert('Word count submitted successfully!');
      } catch (error) {
        console.error('Error saving word count:', error);
        alert('Failed to submit word count.');
      }
      wordCountInput.value = '';
      modal.classList.add('hidden');
    };
  }

  function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('sprint-timer').textContent =
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Volume control updates audio volume live
  slider.addEventListener('input', () => {
    if (audio) audio.volume = slider.value / 100;
  });

  // Background image change
  const backgroundSelect = document.getElementById('background');
  const sprintCard = document.querySelector('.sprint-card');

  backgroundSelect.addEventListener('change', () => {
    const bgUrl = backgroundSelect.value;
    if (sprintCard) {
      sprintCard.style.backgroundImage = `url('${bgUrl}')`;
    }
  });

  // Initialize background on load
  if (sprintCard) {
    sprintCard.style.backgroundImage = `url('${backgroundSelect.value}')`;
  }

  // Change ambience during sprint seamlessly without pause
  ambienceSelect.addEventListener('change', () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newSrc = ambienceSelect.value;
    if (isRunning && newSrc !== 'none') {
      audio = new Audio(newSrc);
      audio.loop = true;
      audio.volume = slider.value / 100;
      audio.play();
    } else {
      audio = null;
    }
  });

  // Buttons event listeners
  document.getElementById('start-btn').addEventListener('click', toggleSprint);
  document.getElementById('reset-btn').addEventListener('click', resetSprint);
});
