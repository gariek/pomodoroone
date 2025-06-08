let durations = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

let mode = "pomodoro";
let totalTime = durations[mode];
let currentTime = totalTime;
let timer = null;
let isRunning = false;

// Dados
let pomodoroCount = 0;
let focusSeconds = 0;
let pauseSeconds = 0;

const timerDisplay = document.getElementById("timer");
const countDisplay = document.getElementById("count");
const focusTimeDisplay = document.getElementById("focusTime");
const pauseTimeDisplay = document.getElementById("pauseTime");
const alarm = document.getElementById("alarm");

// Formata segundos para mm:ss
function format(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// Atualiza o timer na tela
function updateDisplay() {
  timerDisplay.textContent = format(currentTime);
}

// Atualiza dados na tela
function updateDataDisplay() {
  countDisplay.textContent = pomodoroCount;
  focusTimeDisplay.textContent = Math.floor(focusSeconds / 60);
  pauseTimeDisplay.textContent = Math.floor(pauseSeconds / 60);
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      currentTime--;
      if (mode === 'pomodoro') {
        focusSeconds++;
      } else {
        pauseSeconds++;
      }
      updateDisplay();
      updateDataDisplay();

      if (currentTime <= 0) {
        clearInterval(timer);
        isRunning = false;
        alarm.play();

        if (mode === 'pomodoro') {
          pomodoroCount++;
        }

        showNotification();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  currentTime = durations[mode];
  updateDisplay();
}

function setMode(newMode) {
  pauseTimer();
  mode = newMode;
  totalTime = durations[mode];
  currentTime = totalTime;
  updateDisplay();
  updateActiveButton();
}

function updateActiveButton() {
  document.querySelectorAll(".mode-buttons button").forEach(btn => btn.classList.remove("active"));
  if (mode === 'pomodoro') document.getElementById("btn-pomodoro").classList.add("active");
  if (mode === 'short') document.getElementById("btn-short").classList.add("active");
  if (mode === 'long') document.getElementById("btn-long").classList.add("active");
}

function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Tempo finalizado!", {
      body: mode === 'pomodoro' ? "Hora da pausa!" : "Hora de focar!",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        showNotification();
      }
    });
  }
}

document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const icon = document.getElementById("toggleMode");
  icon.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

updateDisplay();
updateDataDisplay();
updateActiveButton();
