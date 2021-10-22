/* INSTRUMENT CLASS */
class Instrument extends MovableSprite {

    /* VARS */
    #switchElement;
    #compassArrow = null;
    #compassRose = null;
    #DMEDisplay = null;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.visible = false;
        this.interactive = true;
        this.width = INSTR_WIDTH;
        this.height = INSTR_HEIGHT;
        this.anchor.set(0.5, 0.5);
        this.position.set(100, 100);
    }

    /* METHODS */
    createCompassRose() {
        this.#compassRose = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassRose.texture);
        this.#compassRose.size = this.size;
        this.#compassRose.anchor = this.anchor;
        this.#compassRose.position.set(0, 0);

        this.addChild(this.#compassRose);
    }

    createCompassArrow(beacon) {
        if (beacon == null)
            return console.log('Skipping compass arrow, beacon not provided!');

        this.#compassArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrow.texture)
        this.#compassArrow.width = INSTR_ARROW_WIDTH;
        this.#compassArrow.height = INSTR_ARROW_HEIGHT;
        this.#compassArrow.anchor = this.anchor;
        this.#compassArrow.position.set(0, 0);
        this.#compassArrow.beacon = beacon;

        this.addChild(this.#compassArrow);
    }

    createDMEDisplay(beacon) {
        if (beacon == null)
            return console.log('Skipping range display, beacon not provided!');

        this.#DMEDisplay = new PIXI.Sprite(PIXI.Loader.shared.resources.DMEDisplay.texture);
        this.#DMEDisplay.width = INSTR_DME_WIDTH;
        this.#DMEDisplay.height = INSTR_DME_HEIGHT;
        this.#DMEDisplay.anchor.set(0.25, 0.25);
        this.#DMEDisplay.position.set(-this.width / 2, -this.height / 2);
        this.#DMEDisplay.beacon = beacon;

        this.#DMEDisplay.lblDistance = new PIXI.Text('', new PIXI.TextStyle({
            fontFamily: 'Digital-7',
            fontSize: 22,
            fill: 'orange',
            letterSpacing: 1,
        }));
        this.#DMEDisplay.lblDistance.position.set(this.#DMEDisplay.width / 2 + 8, 0);
        this.#DMEDisplay.lblDistance.anchor.set(1, -0.06);

        this.addChild(this.#DMEDisplay);
        this.#DMEDisplay.addChild(this.#DMEDisplay.lblDistance);
    }

    renderCompass() {
        if (this.#compassRose != null)
            this.#compassRose.rotation = -player.rotation;

        if (this.#compassArrow != null) {
            let deltaY = this.#compassArrow.beacon.y - player.y;
            let deltaX = this.#compassArrow.beacon.x - player.x;
            this.#compassArrow.rotation = Math.PI / 2 + Math.atan2(deltaY, deltaX) - player.rotation;
        }

        if (this.#DMEDisplay != null) {
            let deltaX = this.#DMEDisplay.beacon.x - player.x;
            let deltaY = this.#DMEDisplay.beacon.y - player.y;
            let distance = Math.hypot(deltaX, deltaY) / 20; // 20 is scale
            this.#DMEDisplay.lblDistance.text = (Math.round(distance * 10) / 10).toFixed(1);
        }
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

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentDG;

        this.createCompassRose();
    }
}

/* RBI - RELATIVE BEARING INDICATOR */
class RBI extends Instrument {

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentRBI;
        this.position.set(100, 300);

        this.createCompassArrow(NDB);
    }
}

/* RMI - RADIO MAGNETIC INDICATOR */
class RMI extends Instrument {

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentRMI;
        this.position.set(100, 500);

        this.createCompassRose();
        this.createCompassArrow(NDB);
    }
}

/* HSI - HORIZONTAL SITUATION INDICATOR */
class HSI extends Instrument {
    /* VARS */
    #compassArrowBroken = null;
    #compassArrowCenter = null;
    #CRSButton = null;
    #CRSArrow = null;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentHSI;
        this.position.set(300, 150);
        this.visible = true;

        this.createCompassRose();
        this.createDMEDisplay(VORa);
        this.createCRS(VORa);
        this.createBrokenCompassArrow();
    }

    /* METHODS */
    createBrokenCompassArrow() {
        this.#compassArrowBroken = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrowBroken.texture);
        this.#compassArrowBroken.width = INSTR_ARROW_WIDTH;
        this.#compassArrowBroken.height = INSTR_ARROW_HEIGHT;
        this.#compassArrowBroken.anchor = this.anchor;
        this.#compassArrowBroken.position.set(0, 0);

        this.addChild(this.#compassArrowBroken);

        // TODO: Create dots that is child of #compassArrow

        // this.#compassArrowCenter = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrowBroken.texture);
    }

    createCRS(beacon) {
        if (beacon == null)
            return console.log('Skipping CRS button, beacon not provided!');

        this.#CRSButton = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSBackground.texture);
        this.#CRSButton.width = INSTR_CRS_WIDTH;
        this.#CRSButton.height = INSTR_CRS_HEIGHT;
        this.#CRSButton.anchor.set(1, 1);
        this.#CRSButton.position.set(this.width / 2, this.height / 2);
        this.#CRSButton.beacon = beacon;

        this.#CRSButton.arrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSArrow.texture);
        this.#CRSButton.arrow.width = 150;
        this.#CRSButton.arrow.height = 150;
        this.#CRSButton.arrow.anchor.set(0.5, 0.5);
        this.#CRSButton.arrow.position.set(-this.width / 1.8, -this.height / 2);

        this.#CRSArrow = this.#CRSButton.arrow;

        this.interactiveMousewheel = true;

        this.on('mousewheel', (delta) => {
            this.#CRSArrow.angle -= delta * 1.1;
            this.#CRSButton.beacon.angle = this.#CRSArrow.angle;
        });

        this.addChild(this.#CRSButton);
        this.#CRSButton.addChild(this.#CRSArrow);
    }

    renderCompass() {
        super.renderCompass();
        if (this.#compassArrowBroken != null)
            this.#compassArrowBroken.angle = this.#CRSArrow.angle - player.angle;
    }

}