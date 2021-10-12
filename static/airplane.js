/* AIRPLANE CLASS */
class Airplane extends PIXI.Sprite {

    /* VARS */
    #_speed;
    #_rotationSpeed;
    #_paused;
    #_trail;
    #_lastPosition;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.width = 30;
        this.height = 30;
        this.anchor.set(0.5, 0.5);
        this.speed = 50;
        this.rotationSpeed = 0;
        this.paused = false;
        this.setStartPosition();
    };

    /* METHODS */
    setPosition(x, y) {
        this.position.set(x, y);
        this.lastPosition = {
            x: x,
            y: y,
        };
    }

    setStartPosition() {
        this.setPosition((app.renderer.view.width / 2) - (this.width / 2), (app.renderer.view.height / 2) - (this.height / 2));
        this.angle = 0//90;
    }

    advance() {
        if (!this.paused) {
            // move depending on airplane rotation (Heading)
            this.x += Math.sin(this.rotation) * this.speed / 3000;
            this.y -= Math.cos(this.rotation) * this.speed / 3000;

            // move depending on wind
            this.x += Math.sin(degrees_to_radians(-wind.direction)) * wind.speed / 3000;
            this.y += Math.cos(degrees_to_radians(-wind.direction)) * wind.speed / 3000;
        }
        return this;
    }

    rotate() {
        this.angle += this.rotationSpeed;
        return this;
    }

    toggleVisibility() {
        this.visible = !this.visible;
        this.trail.visible = this.visible;
        return this;
    }

    reset() {
        this.speed = 120;
        this.rotationSpeed = 0;
        this.visible = true;
        this.trail.visible = true;
        this.clearTrail();
        this.setStartPosition();
    }

    /* TRAIL METHODS */
    drawTrail() {
        if ((this.lastPosition.x === this.x) && (this.lastPosition.y === this.y)) { return this };

        this.trail
            .lineStyle(2, 0xFFFFFF, 1)
            .moveTo(this.lastPosition.x, this.lastPosition.y)
            .lineTo(this.x, this.y);

        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        return this;
    }

    clearTrail() {
        this.trail.clear();
        return this;
    }

    /* PROPERTIES */
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

    /* STATIC VARS */
    static rotations = {
        LEFT: () => { return -(3 / 144) }, // We turn 3°/s, and divide that by our FPS
        RIGHT: () => { return (3 / 144) },
        FAST_LEFT: () => { return -1 },
        FAST_RIGHT: () => { return 1 },
    };
}
