/* DEFINITIONS */

class Airplane extends PIXI.Sprite {
    // vars
    #_speed;
    #_rotationSpeed;
    #_paused = false;
    #_trail;
    #_lastPosition;

    // constructor
    constructor(texture) {
        super(texture);
        this.width = 30;
        this.height = 30;
        this.anchor.set(0.5, 0.5);
        this.speed = 120;
        this.paused = false;
    };

    // methods
    setPosition(x, y) {
        this.position.set(x, y);
        this.lastPosition = {
            x: x,
            y: y,
        };
    }

    advance() {
        this.x += Math.cos(this.rotation) * this.speed / 3000;
        this.y += Math.sin(this.rotation) * this.speed / 3000;
        return this;
    }

    rotate() {
        if (this.rotationSpeed != null)
            this.rotation += this.rotationSpeed * (Math.PI / 180);

        return this;
    }

    // getters and setters
    get speed() { return this._speed };
    set speed(value) { this._speed = value };
    get rotationSpeed() { return this._rotationSpeed };
    set rotationSpeed(value) { this._rotationSpeed = value };
    get paused() { return this._paused };
    set paused(value) { this._paused = value };
    get lastPosition() { return this._lastPosition };
    set lastPosition(value) { this._lastPosition = value };
    get trail() { return this._trail };
    set trail(value) { this._trail = value };

    // class methods
    static rotations = {
        LEFT: -0.05,
        RIGHT: 0.05,
        FAST_LEFT: -1,
        FAST_RIGHT: 1,
    };
}

const keyBinds = {
    'B': Airplane.rotations.LEFT,
    'M': Airplane.rotations.RIGHT,
    'A': Airplane.rotations.FAST_LEFT,
    'D': Airplane.rotations.FAST_RIGHT,
};

/* AIRPLANE TRAIL */

function drawTrail() {
    if (player.paused) { return false };
    player.trail
        .lineStyle(2, 0xFFFFFF, 1)
        .moveTo(player.lastPosition.x, player.lastPosition.y)
        .lineTo(player.x, player.y);

    player.lastPosition.x = player.x;
    player.lastPosition.y = player.y;
}

function clearTrail() {
    player.trail.clear();
}
/* PAUSE MOVEMENT */

function pauseMovement() {
    player.paused = !player.paused;
    messagePause.visible = !messagePause.visible;
    drawTrail();
}

/* KEYBINDS */
function onKeyDown(event) {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    if (key == PAUSE_KEY)
        pauseMovement()
    else if (keyBinds.hasOwnProperty(key))
        player.rotationSpeed = keyBinds[key]
    else if (key == VISIBILITY_KEY)
        player.visible = !player.visible;
}

function onKeyUp(event) {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    if (keyBinds.hasOwnProperty(key) && player.rotationSpeed === keyBinds[key]) // prevents short pause when two keys are pressed
        player.rotationSpeed = null;
}
