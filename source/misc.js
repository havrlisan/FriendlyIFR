/* DISABLE FOCUS AFTER CLICK */
Array.from(document.getElementsByTagName("button"))
    .forEach(btn => btn.onmouseup = btn.blur);

Array.from(document.getElementsByTagName("input"))
    .forEach(input => {
        if (input.type === "checkbox")
            input.onmouseup = input.blur
    });


/* AUTO PAUSE ON LOSE VISIBILITY */
document.addEventListener("visibilitychange", () => {
    if (document.hidden)
        pauseMovement(true); // TODO: Different approach for Test mode
});


/* ENSURE MAX SPEED NOT CROSSED */
// returns checked value and boolean that's true if input was invalid
function validateInput(value, max_value) {
    if (typeof value !== 'string' || value === '') { return [0, true] };
    if (value.includes('-'))
        value = '0'

    if (max_value === undefined)
        max_value = 999;

    let invalidInputs = /[^\w\d]/gi;
    value = value.replace(invalidInputs, '');

    let newSpeed = parseInt(value);
    return [newSpeed > max_value ? max_value : newSpeed, newSpeed > max_value];
}


/* BLINK ERROR */
function blinkInvalidInput(element) {
    if (element === undefined) { return false };

    console.log(element);
    element.classList.remove('text-black-50');
    element.classList.add('text-danger');
    setTimeout(() => {
        element.classList.remove('text-danger');
        element.classList.add('text-black-50');
    }, 3000);
}