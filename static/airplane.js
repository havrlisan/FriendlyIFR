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
        this.speed = 120;
        this.rotationSpeed = 0;
        this.paused = false;
    };

    /* METHODS */
    setPosition(x, y) {
        this.position.set(x, y);
        this.lastPosition = {
            x: x,
            y: y,
        };
    }

    advance() {
        if (!this.paused) {
            // move depending on airplane rotation (Heading)
            this.x += Math.cos(this.rotation) * this.speed / 3000;
            this.y += Math.sin(this.rotation) * this.speed / 3000;

            // move depending on wind
            this.x += Math.sin(degrees_to_radians(-wind.direction)) * wind.speed / 3000;
            this.y += Math.cos(degrees_to_radians(-wind.direction)) * wind.speed / 3000;
        }
        return this;
    }

    rotate() {
        this.rotation += this.rotationSpeed * (Math.PI / 180);
        return this;
    }

    toggleVisibility() {
        player.visible = !player.visible;
        return this;
    }

    /* TRAIL METHODS */
    drawTrail() {
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
        LEFT: -0.05,
        RIGHT: 0.05,
        FAST_LEFT: -1,
        FAST_RIGHT: 1,
    };
}
