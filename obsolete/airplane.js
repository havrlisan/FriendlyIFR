/* DEFINITIONS */

const airplane = {
    obj: null,
    paused: false,
    speed: 120,
    rotation: null,
    rotations: {
        LEFT: -0.05,
        RIGHT: 0.05,
        FAST_LEFT: -1,
        FAST_RIGHT: 1,
    },
    trail: null,
    lastPosition: {
        x: 0,
        y: 0,
    },
};

const keyBinds = {
    'B': airplane.rotations.LEFT,
    'M': airplane.rotations.RIGHT,
    'A': airplane.rotations.FAST_LEFT,
    'D': airplane.rotations.FAST_RIGHT,
};

/* AIRPLANE MOVEMENT */

function advanceAirplane() {
    airplane.obj.x += Math.cos(airplane.obj.rotation) * airplane.speed / 3000;
    airplane.obj.y += Math.sin(airplane.obj.rotation) * airplane.speed / 3000;
}

function rotateAirplane() {
    if (airplane.rotation != null)
        airplane.obj.rotation += airplane.rotation * (Math.PI / 180);
}

function setAirplaneVelocity(velocity) {
    airplane.speed = velocity;
}

/* AIRPLANE TRAIL */

function drawTrail() {
    if (airplane.paused) { return false };
    airplane.trail
        .lineStyle(2, 0xFFFFFF, 1)
        .moveTo(airplane.lastPosition.x, airplane.lastPosition.y)
        .lineTo(airplane.obj.x, airplane.obj.y);

    airplane.lastPosition.x = airplane.obj.x;
    airplane.lastPosition.y = airplane.obj.y;
}

function clearTrail() {
    airplane.trail.clear();
}
/* PAUSE MOVEMENT */

function pauseMovement() {
    airplane.paused = !airplane.paused;
    messagePause.visible = !messagePause.visible;
    drawTrail();
}

/* VISIBILITY */

function toggleAircraftVisibility(visible = true) {
    console.log(airplane.obj.visible);
    if (visible === false)
        airplane.obj.visible = false;
    else
        airplane.obj.visible = !airplane.obj.visible;
}

/* KEYBINDS */
function onKeyDown(event) {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    if (key == PAUSE_KEY)
        pauseMovement();
    else if (keyBinds.hasOwnProperty(key))
        airplane.rotation = keyBinds[key];
    else if (key == VISIBILITY_KEY)
        toggleAircraftVisibility();
}

function onKeyUp(event) {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    if (keyBinds.hasOwnProperty(key) && airplane.rotation === keyBinds[key]) // prevents short pause when two keys are pressed
        airplane.rotation = null;
}
