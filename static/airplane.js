/* DEFINITIONS */

let airplane = {
  obj: null,
  paused: false,
  rotation: null,
  rotations: {
    LEFT: -0.05,
    RIGHT: 0.05,
    FAST_LEFT: -1,
    FAST_RIGHT: 1,
  },
  trail: null,
};

const keyBinds = {
  'B': airplane.rotations.LEFT,
  'M': airplane.rotations.RIGHT,
  'A': airplane.rotations.FAST_LEFT,
  'D': airplane.rotations.FAST_RIGHT,
};

/* AIRPLANE MOVEMENT */

function advanceAirplane() {
  // TODO: Implement custom velocity
  airplane.obj.vx = 0.4;
  airplane.obj.vy = 0.4;

  airplane.obj.x += airplane.obj.vx * Math.cos(airplane.obj.rotation);
  airplane.obj.y += airplane.obj.vy * Math.sin(airplane.obj.rotation);
}

function rotateAirplane() {
  if (airplane.rotation != null)
    airplane.obj.rotation += airplane.rotation * (Math.PI / 180);
}

/* AIRPLANE TRAIL */

function drawTrail() {
  if (airplane.paused) { return false };

  airplane.trail.lineStyle(1, 0xFFFFFF, 1);
  airplane.trail.lineTo(airplane.obj.x, airplane.obj.y);
}

/* PAUSE MOVEMENT */

function pauseMovement() {
  airplane.paused = !airplane.paused;
  messagePause.visible = !messagePause.visible;
  drawTrace();
}

/* KEYBINDS */
function onKeyDown(event) {
  if (!appLoaded) { return false };

  let key = event.key.toUpperCase();
  if (key == PAUSE_KEY)
    pauseMovement();
  else if (keyBinds.hasOwnProperty(key))
    airplane.rotation = keyBinds[key];
}

function onKeyUp(event) {
  if (!appLoaded) { return false };

  let key = event.key.toUpperCase();
  if (keyBinds.hasOwnProperty(key) && airplane.rotation === keyBinds[key]) // prevents short pause when two keys are pressed
    airplane.rotation = null;
}
