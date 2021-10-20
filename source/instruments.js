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
        this.width = INSTR_WIDTH;
        this.height = INSTR_HEIGHT;
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

/* DG - DIRECTIONAL GYRO */
class DirectionalGyro extends Instrument {

    /* VARS */
    #compassRose;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentDG;

        this.createCompassRose();
    }

    /* METHODS */
    createCompassRose() {
        this.#compassRose = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassRose.texture);
        this.#compassRose.size = this.size;
        this.#compassRose.anchor = this.anchor;
        this.#compassRose.position.set(0, 0);

        this.addChild(this.#compassRose);
    }

    renderCompass() {
        this.#compassRose.rotation = -player.rotation;
    }

}

/* RBI - RELATIVE BEARING INDICATOR */
class RBIndicator extends Instrument {

    /* VARS */
    #compassArrow;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentRBI;
        this.position.set(100, 300);

        this.createCompassArrow();
    }

    /* METHODS */
    createCompassArrow() {
        this.#compassArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrow.texture);
        this.#compassArrow.width = INSTR_ARROW_WIDTH;
        this.#compassArrow.height = INSTR_ARROW_HEIGHT;
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

/* RMI - RADIO MAGNETIC INDICATOR */
class RMIndicator extends Instrument {

    /* VARS */
    #compassArrow;
    #compassRose;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentRMI;
        this.position.set(100, 500);

        this.createCompassArrow();
        this.createCompassRose();
    }

    /* METHODS */
    createCompassArrow() {
        this.#compassArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrow.texture);
        this.#compassArrow.width = INSTR_ARROW_WIDTH;
        this.#compassArrow.height = INSTR_ARROW_HEIGHT;
        this.#compassArrow.anchor = this.anchor;
        this.#compassArrow.position.set(0, 0);

        this.addChild(this.#compassArrow);
    }

    createCompassRose() {
        this.#compassRose = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassRose.texture);
        this.#compassRose.size = this.size;
        this.#compassRose.anchor = this.anchor;
        this.#compassRose.position.set(0, 0);

        this.addChild(this.#compassRose);
    }

    renderCompass() {
        let deltaY = NDB.y - player.y;
        let deltaX = NDB.x - player.x;
        let rotation = Math.PI / 2 + Math.atan2(deltaY, deltaX) - player.rotation

        this.#compassArrow.rotation = rotation;
        this.#compassRose.rotation = -player.rotation;
    }
}