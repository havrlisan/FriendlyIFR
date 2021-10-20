/* INSTRUMENT CLASS */
class Instrument extends PIXI.Sprite {

    /* VARS */
    #canMove = false;
    #switchElement;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.visible = false;
        this.interactive = true;
        this.width = 200;
        this.height = 200;
        this.anchor.set(0.5, 0.5);
        this.position.set(100, 100);
        this.assignEvents();
    }

    /* METHODS */
    assignEvents() {
        this.on('mousedown', () => this.#canMove = true);
        this.on('mouseup', () => this.#canMove = false);
        this.on('mousemove', (e) => {
            if (this.#canMove) {
                this.position.set(e.data.global.x, e.data.global.y);
            }
        });
    }

    /* PROPERTIES */
    get switchElement() {
        return this.#switchElement
    };
    set switchElement(value) {
        this.#switchElement = value;

        this.#switchElement.checked = this.visible;
        this.#switchElement.onchange = () => {
            this.visible = this.#switchElement.checked;
        }
    };
}

/* DIRECTIONAL GYRO */
class DirectionalGyro extends Instrument {

    /* VARS */
    #compassRose;
    #isReady = false;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentDG;

        this.createCompassRose();
        this.#isReady = true;
    }

    /* METHODS */
    createCompassRose() {
        this.#compassRose = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassRose.texture);
        this.#compassRose.width = this.width;
        this.#compassRose.height = this.height;
        this.#compassRose.anchor = this.anchor;
        this.#compassRose.position.set(0, 0);

        this.addChild(this.#compassRose);
    }

    renderCompass() {
        if (this.#isReady)
            this.#compassRose.rotation = -player.rotation;
    }

}

/* RELATIVE BEARING INDICATOR */
class RBIndicator extends Instrument {

    /* VARS */
    #compassArrow;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentRBI;
        this.position.set(100, 300);
        this.visible = true;

        this.createCompassArrow();
    }

    /* METHODS */
    createCompassArrow() {
        this.#compassArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrow.texture);
        this.#compassArrow.width = 10;
        this.#compassArrow.height = 140;
        this.#compassArrow.anchor = this.anchor;
        this.#compassArrow.position.set(0, 0);

        this.addChild(this.#compassArrow);
    }

    renderCompass() {
        let deltaY = NDB.y - player.y;
        let deltaX = NDB.x - player.x;
        let rotation = Math.PI / 2 + Math.atan2(deltaY, deltaX) - player.rotation

        this.#compassArrow.rotation = rotation;
    }

}