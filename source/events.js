// Sidebar
let sidebarClosed = false;
const openNav = () => {
    sidebar.style.width = "370px";
    appParent.style.width = 'calc(100vw - 370px)';
    btnToggleSidebar.innerText = '>';
    sidebarClosed = false;
}

const closeNav = () => {
    sidebar.style.width = "0";
    appParent.style.width = '100vw';
    btnToggleSidebar.innerText = '<';
    sidebarClosed = true;
}

btnToggleSidebar.onclick = () => {
    if (sidebarClosed)
        openNav()
    else   
        closeNav()
}

// Stopwatch
btnStartStopwatch.onclick = toggleStopwatch;
btnResetStopwatch.onclick = resetStopwatch;

// Inputs
edSpeed.oninput = (e) => {
    const [value, error] = validateInput(e.target.value, MAX_SPEED);
    player.speed = value;
    if (error)
        blinkInvalidInput(edSpeedHint);
}

edWindSpeed.oninput = (e) => {
    const [value, error] = validateInput(e.target.value, MAX_WIND_SPEED);
    wind.speed = value;
    if (error)
        blinkInvalidInput(edWindSpeedHint);
}

edWindDirection.oninput = (e) => {
    const [value, error] = validateInput(e.target.value, MAX_ANGLE);
    wind.direction = value;
    if (error)
        blinkInvalidInput(edWindDirectionHint);
}

// Controls
swAirplaneVisible.onchange = () => {
    player.setVisible(swAirplaneVisible.checked);
};

swCourseLinesVisible.onchange = () => {
    setCourseLinesVisible(swCourseLinesVisible.checked);
};

swPaused.onchange = () => {
    pauseMovement(swPaused.checked)
};

btnClearTrail.onclick = () => {
    player.clearTrail();
}

// Options
btnSaveImage.onclick = () => {
    alert('To take screenshot, use PrintScreen button on your keyboard!')
    //let blob = app.renderer.plugins.extract.base64(app.stage);
    //downloadFile('FriendlyIFR-screenshot.png', blob);
}

btnSaveSetup.onclick = () => {
    saveSetup();
}

btnLoadSetup.onclick = () => {
    testModeState = testModeStates.none;
    if (fileLoader)
        fileLoader.click();
}

btnTestMode.onclick = () => {
    if (testModeState === testModeStates.none) {
        testModeState = testModeStates.initiated;
        return fileLoader.click(); // update text and style after loaded
    } else if (testModeState === testModeStates.initiated) {
        testModeState = testModeStates.started;
        pauseMovement(false);
    } else if (testModeState === testModeStates.started) {
        testModeState = testModeStates.finished;
        pauseMovement(true);
        btnSaveImage.removeAttribute('disabled');
        player.setVisible(true);
    } else if (testModeState === testModeStates.finished) {
        testModeState = testModeStates.none;
        updateTestMode();
    }

    btnTestMode.innerText = testModeText[testModeState];
    if (testModeState === testModeStates.none)
        btnTestMode.classList.replace(testModeStyle[testModeStates.finished], testModeStyle[testModeState]);
    else
        btnTestMode.classList.replace(testModeStyle[testModeState - 1], testModeStyle[testModeState]);
}

fileLoader.onchange = () => {
    if (fileLoader.files.length === 1) {
        let file = fileLoader.files[0];
        if (file.name.toLowerCase().endsWith('.nav'))
            loadSetup(file)
        else
            alert('Only .nav files can be loaded!')
    }
    fileLoader.value = '';
}

// Editor
btnDrawRadial.onclick = () => {
    btnDrawRadial.innerText = (btnDrawRadial.classList.contains('active')) ? 'Drawing radial' : 'Draw radial';
}
rbVORA.onchange = updateEditorValues;
rbVORB.onchange = updateEditorValues;

const CurrentVOR = () => rbVORA.checked ? VORa : VORb;
function updateEditorValues() {
    currVOR = CurrentVOR();
    let currVORData = currVOR.arcCurveData;
    edVORRadius.value = currVORData.radius;
    edVORStart.value = currVORData.start;
    edVORLength.value = currVORData.length;
}

edVORRadius.oninput = (e) => {
    const [value, _error] = validateInput(e.target.value, 2000);
    CurrentVOR().arcCurveRadius = value;
}

edVORStart.oninput = (e) => {
    const [value, _error] = validateInput(e.target.value, MAX_ANGLE);
    CurrentVOR().arcCurveStart = value;
}

edVORLength.oninput = (e) => {
    const [value, _error] = validateInput(e.target.value, MAX_ANGLE);
    CurrentVOR().arcCurveLength = value;
}