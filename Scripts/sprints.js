  let timerInterval;
  let quoteInterval;
  let timeLeft = 0;
  let isRunning = false;
  let audio = null;

  const slider = document.getElementById('volume-slider');
  const textElement = document.getElementById('motivation-text');
  const durationSelect = document.getElementById('duration');
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

  function showNextQuote() {
    textElement.style.opacity = 0;
    setTimeout(() => {
      textElement.textContent = quotes[quoteIndex];
      quoteIndex = (quoteIndex + 1) % quotes.length;
      textElement.style.opacity = 1;
    }, 1000);
  }

  function toggleSprint() {
    const startBtn = document.getElementById('start-btn');
    if (!isRunning) {
      startSprint();
      startBtn.textContent = 'Pause Sprint';
    } else {
      pauseSprint();
      startBtn.textContent = 'Start Sprint';
    }
  }

  function startSprint() {
    if (!timeLeft) {
      const duration = parseInt(durationSelect.value);
      timeLeft = duration * 60;
    }

    const background = document.getElementById('background').value;
    const ambience = document.getElementById('ambience').value;
    const sprintCard = document.getElementById('sprint-card');
    const sprintStatus = document.getElementById('sprint-status');

    sprintCard.style.backgroundImage = `url('${background}')`;
    sprintStatus.textContent = 'Start Writing!';
    sprintStatus.classList.remove('sprint-complete');

    durationSelect.disabled = true;

    if (audio) {
      audio.play();
    } else if (ambience !== 'none') {
      audio = new Audio(ambience);
      audio.loop = true;
      audio.volume = slider.value / 100;
      audio.play();
    }

    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(quoteInterval);

        sprintStatus.textContent = 'Sprint Complete! 🎉';
        sprintStatus.classList.add('sprint-complete');

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 0.62}
        });
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6, x: 0.62}
          });
        }, 300);
        
        document.getElementById('sprint-timer').textContent = '00:00';

        if (audio) {
          audio.pause();
          audio = null;
        }

        const alarmSound = new Audio('Sound/Alarm2.mp3');
        alarmSound.volume = 1;
        alarmSound.play();

        const sprintMinutes = parseInt(durationSelect.value);
        textElement.style.opacity = 0;
        setTimeout(() => {
          textElement.textContent = `You just finished a ${sprintMinutes}-minute sprint!`;
          textElement.style.opacity = 1;
        }, 1000);

        document.getElementById('start-btn').textContent = 'Start Sprint';
        isRunning = false;
        timeLeft = 0;
        durationSelect.disabled = false;
      } else {
        updateTimerDisplay(timeLeft);
      }
    }, 1000);

    isRunning = true;
  }

  function pauseSprint() {
    clearInterval(timerInterval);
    if (audio) audio.pause();
    isRunning = false;
  }

  function resetSprint() {
    clearInterval(timerInterval);
    clearInterval(quoteInterval);
    timeLeft = 45 * 60;
    isRunning = false;

    durationSelect.value = '45';
    document.getElementById('background').value = 'Images/sprints/dragonknight.jpg';
    document.getElementById('ambience').value = 'none';
    slider.value = 50;
    document.getElementById('start-btn').textContent = 'Start Sprint';
    durationSelect.disabled = false;

    const sprintStatus = document.getElementById('sprint-status');
    sprintStatus.textContent = 'Ready to Sprint!';
    sprintStatus.classList.remove('sprint-complete');

    updateTimerDisplay(timeLeft);
    document.getElementById('sprint-card').style.backgroundImage = `url('Images/sprints/dragonknight.jpg')`;

    if (audio) {
      audio.pause();
      audio = null;
    }

    quoteIndex = 0;
    showNextQuote();
    quoteInterval = setInterval(showNextQuote, 5000);
  }

  function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('sprint-timer').textContent =
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateSliderBackground() {
    if (audio) audio.volume = slider.value / 100;
  }

  slider.addEventListener('input', updateSliderBackground);

  document.getElementById('background').addEventListener('change', function () {
    const newBackground = this.value;
    document.getElementById('sprint-card').style.backgroundImage = `url('${newBackground}')`;
  });

  durationSelect.addEventListener('change', function () {
    if (!isRunning) {
      const duration = parseInt(this.value);
      timeLeft = duration * 60;
      updateTimerDisplay(timeLeft);
    }
  });

  document.getElementById('ambience').addEventListener('change', function () {
    const selectedAmbience = this.value;

    if (audio) {
      audio.pause();
      audio = null;
    }

    if (selectedAmbience !== 'none') {
      audio = new Audio(selectedAmbience);
      audio.loop = true;
      audio.volume = slider.value / 100;
      audio.play();
    }
  });

  // Start quotes on load
  showNextQuote();
  quoteInterval = setInterval(showNextQuote, 5000);

  const password = "dragonknight";
  let attempt = prompt("Enter password to access this page:");
  if (attempt !== password) {
    alert("Wrong password!");
    window.location.href = "https://fantasywriters.org/404.html"; // redirect away or close
  }