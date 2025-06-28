const timerDisplay = document.getElementById("timer");
const sessionLabel = document.getElementById("session-label");
const progressBar = document.getElementById("progress-bar");
const sessionCounter = document.createElement("p");
sessionCounter.id = "session-counter";
document
  .querySelector(".container")
  .insertBefore(sessionCounter, document.getElementById("progress-container"));

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const toggleThemeButton = document.getElementById("toggle-theme");

const workDuration = 25 * 60; // 25 minutes
const shortBreak = 5 * 60; // 5 minutes
const longBreak = 15 * 60; // 15 minutes

let timeLeft = workDuration;
let isRunning = false;
let interval;
let isWorkSession = true;
let completedSessions = 0;
let cycle = 0; // after 4 work sessions -> long break

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
  updateProgressBar();
}

function updateProgressBar() {
  const total = isWorkSession
    ? cycle % 4 === 0 && cycle !== 0
      ? longBreak
      : workDuration
    : shortBreak;
  const percent = ((total - timeLeft) / total) * 100;
  progressBar.style.width = `${percent}%`;
}

function playSound() {
  const audio = new Audio("https://www.soundjay.com/button/beep-07.wav");
  audio.play();
}

function flashBackground() {
  document.body.classList.add("flash");
  setTimeout(() => document.body.classList.remove("flash"), 1500);
}

function switchSession() {
  if (isWorkSession) {
    completedSessions++;
    cycle++;
  }
  sessionCounter.textContent = `Sessions complètes terminées : ${completedSessions}`;
  isWorkSession = !isWorkSession;
  if (isWorkSession) {
    timeLeft = workDuration;
    sessionLabel.textContent = "Session de travail";
  } else {
    timeLeft = cycle % 4 === 0 ? longBreak : shortBreak;
    sessionLabel.textContent =
      cycle % 4 === 0 ? "Grande pause" : "Petite pause";
  }
  updateTimerDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  interval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(interval);
      isRunning = false;
      playSound();
      flashBackground();
      switchSession();
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  isRunning = false;
  timeLeft = workDuration;
  isWorkSession = true;
  cycle = 0;
  completedSessions = 0;
  sessionLabel.textContent = "Session de travail";
  sessionCounter.textContent = "Sessions complètes terminées : 0";
  updateTimerDisplay();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    document.body.style.backgroundImage = "url('images/dark-background.jpg')";
  } else {
    document.body.style.backgroundImage = "url('images/light-background.jpg')";
  }

  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
  document.documentElement.style.height = "80%";
  document.body.style.height = "100%";

  // Ajouter animation de zoom lent
  document.body.style.animation =
    "zoomBackground 60s ease-in-out infinite alternate";
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
toggleThemeButton.addEventListener("click", toggleTheme);

resetTimer();

toggleTheme(); // Ensure correct background at start

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById("theme-button");
const darkTheme = document.body.classList.toggle("dark-mode");
const iconTheme = "uil-sun";

//Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem("selected-theme");
const selectedIcon = localStorage.getItem("selected-icon");

//We obtain the current theme that the interface has by validating the dark-them class
const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme)
    ? (document.body.style.backgroundImage =
        "url('images/dark-background.jpg')")
    : (document.body.style.backgroundImage =
        "url('images/light-background.jpg')");
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";

//We validate if the user previously chose a topic
if (selectedTheme) {
  //If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark theme.
  document.body.classList[
    selectedTheme ===
    (document.body.style.backgroundImage = "url('images/light-background.jpg')")
      ? "add"
      : "remove"
  ](darkTheme);
  themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](
    iconTheme
  );
}

//Activate / deactivate the theme manually with the button
themeButton.addEventListener("click", () => {
  //Add or remove the dark / icon theme
  document.body.classList.toggle(darkTheme);
  themeButton.classList.toggle(iconTheme);
  //We save the theme and the current icon that the user chose
  localStorage.setItem("selected-theme", getCurrentTheme());
  localStorage.setItem("selected-icon", getCurrentIcon());
});
