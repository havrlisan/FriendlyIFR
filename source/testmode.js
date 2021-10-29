function updateTestMode() {
    let value = testModeState === testModeStates.initiated;
    let elements = document.getElementsByClassName('can-disable');
    for (let i = 0; i < elements.length; i++)
        value ? elements[i].setAttribute('disabled', value) : elements[i].removeAttribute('disabled');
}