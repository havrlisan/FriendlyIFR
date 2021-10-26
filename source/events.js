// Specific
window.onmouseup = (e) => {
    if (VORdrawingRadial != null) {
        VORdrawingRadial.finishRadial();
        VORdrawingRadial = null;
    }
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
    VORa.setLineVisibility(swCourseLinesVisible.checked);
    VORb.setLineVisibility(swCourseLinesVisible.checked);
};

swPaused.onchange = () => {
    pauseMovement(swPaused.checked)
};

btnClearTrail.onclick = () => {
    player.clearTrail();
}

// Options
btnSaveImage.onclick = () => {
    alert('To take screenshot, "use PrintScreen" button on your keyboard!')
    //let blob = app.renderer.plugins.extract.base64();
    //downloadFile('FriendlyIFR-screenshot.png', blob);
}

btnSaveSetup.onclick = () => {
    alert('todo')
}

btnLoadSetup.onclick = () => {
    loadSetup(false)
}

btnTestMode.onclick = () => {
    loadSetup(true)
}

// Editor
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