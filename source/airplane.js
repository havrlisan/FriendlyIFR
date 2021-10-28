/* AIRPLANE CLASS */
class Airplane extends MovableSprite {

    /* VARS */
    #speed;
    #rotationSpeed = 0;
    #paused = false;
    #trail;
    #lastPosition;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.width = 30;
        this.height = 30;
        this.anchor.set(0.5, 0.5);
        this.trail = app.stage.addChild(new PIXI.smooth.SmoothGraphics());
        this.reset();
    };

    setPosition(x, y) {
        super.setPosition(x, y);
        this.lastPosition = {
            x: x,
            y: y,
        };
    }

    setStartPosition() {
        this.setPosition((app.renderer.view.width / 2) - (this.width / 2), (app.renderer.view.height / 2) - (this.height / 2));
        this.angle = 45;
    }

    advance() {
        if (!this.paused && !this.mouseMove) {
            // move depending on airplane rotation (Heading)
            if (this.speed > 0) {
                this.x += (Math.sin(this.rotation) * this.speed) / 21000; // 21000 is scale
                this.y -= (Math.cos(this.rotation) * this.speed) / 21000;
            }

            if (wind.speed > 0) {
                // move depending on wind
                this.x += Math.sin(degrees_to_radians(-wind.direction)) * wind.speed / 21000;
                this.y += Math.cos(degrees_to_radians(-wind.direction)) * wind.speed / 21000;
            }
        }
        return this;
    }

    rotate(delta) {
        this.angle += this.rotationSpeed / 60 * delta; // 60 fps multiplied by delta in case of display frame rate difference
        return this;
    }

    setVisible(value) {
        this.visible = value;
        this.trail.visible = value;
        swAirplaneVisible.checked = value;
        return this;
    }

    reset() {
        this.speed = 120;
        this.rotationSpeed = 0;
        this.setVisible(true);
        this.clearTrail();
        this.setStartPosition();
    }

    /* TRAIL METHODS */
    drawTrail() {
        if ((this.mouseMove) || ((this.lastPosition.x === this.x) && (this.lastPosition.y === this.y))) {
            return this
        };

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
    get speed() {
        return this.#speed
    };
    set speed(value) {
        this.#speed = value;
        edSpeed.value = value;
    };
    get rotationSpeed() {
        return this.#rotationSpeed
    };
    set rotationSpeed(value) {
        this.#rotationSpeed = value
    };
    get paused() {
        return this.#paused
    };
    set paused(value) {
        this.#paused = value
    };
    get lastPosition() {
        return this.#lastPosition
    };
    set lastPosition(value) {
        this.#lastPosition = value
    };
    get trail() {
        return this.#trail
    };
    set trail(value) {
        this.#trail = value
    };

    /* STATIC VARS */
    static rotations = {
        LEFT: () => {
            return -3 // 3°/s
        },
        RIGHT: () => {
            return 3
        },
        FAST_LEFT: () => {
            return -30
        },
        FAST_RIGHT: () => {
            return 30
        },
    };
}