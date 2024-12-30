// JavaScript for Pomodoro Timer
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const startTimerButton = document.getElementById('start-timer');
const timerDisplay = document.getElementById('timer-display');

let timerInterval;

function startTimer() {
    let workTime = parseInt(workTimeInput.value) * 60;
    let breakTime = parseInt(breakTimeInput.value) * 60;
    let isWorkTime = true;
    
    function updateTimer() {
        const minutes = Math.floor(workTime / 60);
        const seconds = workTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (workTime > 0) {
            workTime--;
        } else {
            isWorkTime = !isWorkTime;
            workTime = isWorkTime ? parseInt(workTimeInput.value) * 60 : breakTime;
            alert(isWorkTime ? 'Gassss belajar lagi!': 'udah dulu belajarnya, istirahat dulu yuk' );
        }
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

startTimerButton.addEventListener('click', startTimer);
