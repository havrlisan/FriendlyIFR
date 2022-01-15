/* CONFIRM LEAVE */
window.onbeforeunload = function () {
    return 'Are you sure you want to leave?';
};


/* AUTO PAUSE ON LOSE VISIBILITY */
document.addEventListener("visibilitychange", () => {
    // TODO: Warn that if leaving page, app will be paused / test mode will be interrupted!
    if (document.hidden) {
        if (!isInTestMode())
            pauseMovement(true)
        //else
            // TODO: Handle if in test mode
    }
});


/* DISABLE FOCUS AFTER CLICK */
Array.from(document.getElementsByTagName("button"))
    .forEach(btn => btn.onmouseup = btn.blur);

Array.from(document.getElementsByTagName("input"))
    .forEach(input => {
        if (input.type === "checkbox" || input.type === "radio")
            input.onmouseup = input.blur
    });


/* LOADING SCREEN */
const FLEX_CLASS = 'd-flex';
function showLoadingScreen(value) {
    value ? loadingScreen.classList.add(FLEX_CLASS) : loadingScreen.classList.remove(FLEX_CLASS);
    loadingScreen.style.display = value ? 'block' : 'none';
    loadingText.innerText = 'Loading...';
}


/* ENSURE MAX SPEED NOT CROSSED */
function validateInput(value, max_value) {
    if (typeof value !== 'string' || value === '' || isNaN(value)) { return [0, true] };
    if (value.includes('-'))
        value = '0'
    if (max_value === undefined)
        max_value = 999;

    let invalidInputs = /[^\w\d]/gi;
    value = value.replace(invalidInputs, '');
    let new_value = parseInt(value);

    // returns checked value and true if input was invalid
    return [new_value > max_value ? max_value : new_value, new_value > max_value];
}


/* BLINK ERROR */
function blinkInvalidInput(element) {
    if (element === undefined) { return false };

    element.classList.remove('text-black-50');
    element.classList.add('text-danger');
    setTimeout(() => {
        element.classList.remove('text-danger');
        element.classList.add('text-black-50');
    }, 3000);
}