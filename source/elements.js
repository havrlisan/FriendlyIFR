// Container
const loadingScreen = document.getElementById('loadingScreen');
const loadingText = document.getElementById('loadingText');
const contentScreen = document.getElementById('contentScreen');
const appParent = document.getElementById('pixi-app-container');
const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const imgToggleSidebar = document.getElementById('imgToggleSidebar');

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

// Information
const mSetupInfo = document.getElementById('setupInformation');

// Options
const fileLoader = document.getElementById('fileLoader');
const btnSaveImage = document.getElementById('btnSaveImage');
const btnSaveSetup = document.getElementById('btnSaveSetup');
const btnLoadSetup = document.getElementById('btnLoadSetup');
const btnTestMode = document.getElementById('btnTestMode');

// Editor
const btnDrawRadial = document.getElementById('btnDrawRadial');
const rbVORA = document.getElementById('rbVORA');
const rbVORB = document.getElementById('rbVORB');
const edVORRadius = document.getElementById('edVORRadius');
const edVORStart = document.getElementById('edVORStart');
const edVORLength = document.getElementById('edVORLength');