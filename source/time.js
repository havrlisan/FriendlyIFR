/* CURRENT TIME */

// vars
let currentTimeId = 0;

// init
displayCurrentTime();
currentTimeId = setInterval(displayCurrentTime, 1000);

function displayCurrentTime() {
  let current = new Date();
  let date = current.getDate() + '.' + (current.getMonth() + 1) + '.' + current.getFullYear() + '.';
  let time = fixNumberDisplay(current.getHours()) + ":" + fixNumberDisplay(current.getMinutes()) + ":" + fixNumberDisplay(current.getSeconds());
  lblCurrentTime.innerText = date + ' ' + time;
}

/* STOPWATCH */

// vars
let stopwatchActive = false;
let stopwatchId = 0;
let hr, min, sec;

// init
resetStopwatch();

// methods
function resetStopwatch() {
  hr = 0;
  min = 0;
  sec = 0;
  displayStopwatch();
  activateStopwatch();
}

function activateStopwatch() {
  if (stopwatchActive) {
    if (stopwatchId > 0)
      clearTimeout(stopwatchId);
    stopwatchId = setTimeout(stopwatchCycle, 1000);
  }
}

function toggleStopwatch() {
  stopwatchActive = !stopwatchActive;
  btnStartStopwatch.innerText = stopwatchActive ? 'Stop' : 'Start';
  activateStopwatch();
}

function displayStopwatch() {
  lblStopwatch.innerText = fixNumberDisplay(hr) + ':' + fixNumberDisplay(min) + ':' + fixNumberDisplay(sec);
}

function stopwatchCycle() {
  if (!stopwatchActive) { return false };

  sec = parseInt(sec);
  min = parseInt(min);
  hr = parseInt(hr);

  sec = sec + 1;
  if (sec == 60) {
    min = min + 1;
    sec = 0;
  }
  if (min == 60) {
    hr = hr + 1;
    min = 0;
    sec = 0;
  }

  displayStopwatch();
  stopwatchId = setTimeout(stopwatchCycle, 1000);
}

/* HELPERS */

function fixNumberDisplay(value) {
  return (value < 10) ? '0' + value : value;
};