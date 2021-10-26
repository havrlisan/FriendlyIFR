/* CONFIRM LEAVE */

window.onbeforeunload = function(){
    return 'Are you sure you want to leave?';
  };

/* AUTO PAUSE ON LOSE VISIBILITY */

document.addEventListener("visibilitychange", () => {
    if (document.hidden)
        pauseMovement(true); // TODO: Different approach for Test mode
});


/* DISABLE FOCUS AFTER CLICK */

Array.from(document.getElementsByTagName("button"))
    .forEach(btn => btn.onmouseup = btn.blur);

Array.from(document.getElementsByTagName("input"))
    .forEach(input => {
        if (input.type === "checkbox" || input.type === "radio")
            input.onmouseup = input.blur
    });


/* ENSURE MAX SPEED NOT CROSSED */
// returns checked value and boolean that's true if input was invalid

function validateInput(value, max_value) {
    if (typeof value !== 'string' || value === '' || isNaN(value)) { return [0, true] };
    if (value.includes('-'))
        value = '0'

    if (max_value === undefined)
        max_value = 999;

    let invalidInputs = /[^\w\d]/gi;
    value = value.replace(invalidInputs, '');

    let new_value = parseInt(value);
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


/* DOWNLOAD FILE */

function downloadFile(name, path) {
    let a = document.createElement('a');
    a.href = path;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}