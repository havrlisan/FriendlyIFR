// Stopwatch
btnStartStopwatch.onclick = toggleStopwatch;
btnResetStopwatch.onclick = resetStopwatch;

// Inputs
edSpeed.oninput = (e) => {
    const [newSpeed, error] = validateInput(e.target.value, MAX_SPEED);
    e.target.value = newSpeed.toString();
    player.speed = newSpeed;
    if (error)
        blinkInvalidInput(edSpeedHint);
}

edWindSpeed.oninput = (e) => {
    if (e.target.value === '') { return false };
    const [newSpeed, error] = validateInput(e.target.value, MAX_WIND_SPEED);
    e.target.value = newSpeed.toString();
    wind.speed = newSpeed;
    if (error)
        blinkInvalidInput(edWindSpeedHint);
}

edWindDirection.oninput = (e) => {
    if (e.target.value === '') { return false };
    const [newDirection, error] = validateInput(e.target.value, MAX_ANGLE);
    e.target.value = newDirection.toString();
    wind.direction = newDirection;
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
    alert('todo')
}

btnTestMode.onclick = () => {
    alert('todo')
}