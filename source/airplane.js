/* AIRPLANE CLASS */
class Airplane extends MovableSprite {

    /* VARS */
    #speed;
    #rotationSpeed = 0;
    #paused = false;
    #trail;
    #trailCounter = 0;
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

    assignEvents() {
        super.assignEvents();
        this.on('mousedown', () => { this.mouseMove = (testModeState === testModeStates.none) });
    }

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

    advance(delta) {
        if (!this.paused && !this.mouseMove) {
            // move depending on airplane rotation (Heading)
            if (this.speed > 0) {
                this.x += (Math.sin(this.rotation) * this.speed) / 9061 * delta; // 9061 is scale
                this.y -= (Math.cos(this.rotation) * this.speed) / 9061 * delta;
            }

            if (wind.speed > 0) {
                // move depending on wind
                this.x += Math.sin(degrees_to_radians(-wind.direction)) * wind.speed / 9061 * delta;
                this.y += Math.cos(degrees_to_radians(-wind.direction)) * wind.speed / 9061 * delta;
            }
        }
        return this;
    }

    rotate(delta) {
        this.angle += this.rotationSpeed / 60 * delta;
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
    renderTrail(delta) {
        if (this.paused) { return this };

        let trail_speed = (this.speed === 0) ? wind.speed : this.speed;

        this.#trailCounter++;
        if (this.#trailCounter > (60 / trail_speed) * 1200) {
            this.drawTrail();
            this.#trailCounter = 0;
        }
    }
    drawTrail() {
        if ((this.mouseMove) || ((this.lastPosition.x === this.x) && (this.lastPosition.y === this.y))) {
            return this
        };

        this.trail
            .lineStyle(2.5, 0x000000, 1)
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