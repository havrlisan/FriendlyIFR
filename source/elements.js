// Pixi container
const appParent = document.getElementById('pixi-app-container');

// Time
const lblCurrentTime = document.getElementById('lblCurrentTime');
const lblStopwatch = document.getElementById('lblStopwatch');
const btnStartStopwatch = document.getElementById('btnStartStopwatch');
const btnResetStopwatch = document.getElementById('btnResetStopwatch');

// Inputs
const edSpeed = document.getElementById('edSpeed');
const edSpeedHint = document.getElementById('edSpeedHint');
const edWindSpeed = document.getElementById('edWindSpeed');
// input hints (flash errors)
const edWindSpeedHint = document.getElementById('edWindSpeedHint');
const edWindDirection = document.getElementById('edWindDirection');
const edWindDirectionHint = document.getElementById('edWindDirectionHint');

// Controls
const swAirplaneVisible = document.getElementById('swAirplaneVisible');
const swCourseLinesVisible = document.getElementById('swCourseLinesVisible');
const swPaused = document.getElementById('swPaused');
const btnClearTrail = document.getElementById('btnClearTrail');

// Instruments
//const instruments = document.getElementsByName('instrument');
const swInstrumentDG = document.getElementById('swInstrumentDG');
const swInstrumentRBI = document.getElementById('swInstrumentRBI');
const swInstrumentRMI = document.getElementById('swInstrumentRMI');
const swInstrumentHSI = document.getElementById('swInstrumentHSI');
const swInstrumentCDI = document.getElementById('swInstrumentCDI');

// Options
const btnSaveImage = document.getElementById('btnSaveImage');
const btnSaveSetup = document.getElementById('btnSaveSetup');
const btnLoadSetup = document.getElementById('btnLoadSetup');
const btnTestMode = document.getElementById('btnTestMode');