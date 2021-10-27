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

        return this.#compassRose;
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

    createDMEDisplay(texture, beacon) {
        if (beacon == null)
            return console.log('Skipping range display, beacon not provided!');

        this.#DMEDisplay = new PIXI.Sprite(texture);
        this.#DMEDisplay.width = INSTR_DME_WIDTH;
        this.#DMEDisplay.height = INSTR_DME_HEIGHT;
        this.#DMEDisplay.anchor.set(0.25, 0.25);
        this.#DMEDisplay.position.set(-this.width / 2, -this.height / 2);
        this.#DMEDisplay.beacon = beacon;

        this.#DMEDisplay.lblDistance = new PIXI.Text('', new PIXI.TextStyle({
            fontFamily: 'SF Pro Rounded',
            fontSize: 17,
            fill: '#dbc01e',
            letterSpacing: 1,
        }));
        this.#DMEDisplay.lblDistance.position.set(this.#DMEDisplay.width / 2 + 8, 0);
        this.#DMEDisplay.lblDistance.anchor.set(1, -0.2);

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
            let distance = Math.hypot(deltaX, deltaY) / DISTANCE_SCALE;
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
    get compassArrow() {
        return this.#compassArrow;
    }
    get compassRose() {
        return this.#compassRose;
    }
    get DMEDisplay() {
        return this.#DMEDisplay;
    }
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
    #flagOff = null;
    #flagTo = null;
    #flagFrom = null;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentHSI;
        this.position.set(300, 150);
        this.interactiveMousewheel = true;

        this.createCompassRose();
        this.createDMEDisplay(PIXI.Loader.shared.resources.DMEa.texture, VORa);
        this.createCRS(VORa);
        this.createCompassArrowComplex();
        this.createCourseFlags();
    }

    /* METHODS */
    createCompassArrowComplex() {
        this.#compassArrowBroken = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrowBroken.texture);
        this.#compassArrowBroken.width = INSTR_ARROW_WIDTH;
        this.#compassArrowBroken.height = INSTR_ARROW_HEIGHT;
        this.#compassArrowBroken.anchor = this.anchor;
        this.#compassArrowBroken.position.set(0, 0);

        this.addChild(this.#compassArrowBroken);

        this.#compassArrowCenter = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrowCenter.texture);
        this.#compassArrowCenter.width = INSTR_ARROW_WIDTH;
        this.#compassArrowCenter.height = INSTR_ARROW_HEIGHT;
        this.#compassArrowCenter.anchor = this.anchor;

        this.#compassArrowBroken.addChild(this.#compassArrowCenter);
    }

    createCourseFlags() {
        this.#flagOff = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagOff.texture);
        this.#flagOff.width = 34;
        this.#flagOff.height = 16;
        this.#flagOff.anchor = this.anchor;
        this.#flagOff.position.set(this.#compassArrowBroken.width / 4, this.#compassArrowBroken.height / 7);

        this.#flagTo = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagTo.texture);
        this.#flagTo.width = 34;
        this.#flagTo.height = 16;
        this.#flagTo.anchor = this.anchor;
        this.#flagTo.position.set(this.#compassArrowBroken.width / 4, - this.#compassArrowBroken.height / 7);
        
        this.#flagFrom = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagFrom.texture);
        this.#flagFrom.width = 34;
        this.#flagFrom.height = 16;
        this.#flagFrom.anchor = this.anchor;
        this.#flagFrom.position.set(this.#compassArrowBroken.width / 4, this.#compassArrowBroken.height / 7);

        this.#compassArrowBroken.addChild(this.#flagOff);
        this.#compassArrowBroken.addChild(this.#flagTo);
        this.#compassArrowBroken.addChild(this.#flagFrom);
    }

    createCRS(beacon) {
        if (beacon == null)
            return console.log('Skipping CRS button, beacon not provided!');
        if (beacon.courseLines == null)
            return console.log('Skipping CRS button, beacon provided must be VOR!');

        this.#CRSButton = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSBackground.texture);
        this.#CRSButton.width = INSTR_CRS_WIDTH;
        this.#CRSButton.height = INSTR_CRS_HEIGHT;
        this.#CRSButton.anchor.set(1, 1);
        this.#CRSButton.position.set(this.width / 2, this.height / 2);
        this.#CRSButton.beacon = beacon;

        this.#CRSArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSArrow.texture);
        this.#CRSArrow.width = 150;
        this.#CRSArrow.height = 150;
        this.#CRSArrow.anchor.set(0.5, 0.5);
        this.#CRSArrow.position.set(-this.width / 1.8, -this.height / 2);

        this.on('mousewheel', (delta) => {
            this.#CRSArrow.angle -= delta * 1.1;
            this.#CRSButton.beacon.courseLines.angle = this.#CRSArrow.angle;
            this.#CRSButton.beacon.blindCones.angle = this.#CRSArrow.angle;
        });

        this.addChild(this.#CRSButton);
        this.#CRSButton.addChild(this.#CRSArrow);
    }

    renderCompass() {
        super.renderCompass();
        if (this.#compassArrowBroken != null) {
            this.#compassArrowBroken.angle = this.#CRSArrow.angle - player.angle;

            let courseLinePoints = this.#CRSButton.beacon.courseLinePoints;
            let distance = calcDistance(player, courseLinePoints[0], courseLinePoints[1]);
            distance *= 3; // multiply for scale
            distance = distance > INSTR_ARROW_CENTER_LIMIT ? INSTR_ARROW_CENTER_LIMIT : distance;
            distance = this.#CRSButton.beacon.isInNegativeDistance(player) ? -distance : distance;
            this.#compassArrowCenter.x = distance;
        }

        if (this.#flagOff != null) {
            this.#flagOff.visible = this.#CRSButton.beacon.isInBlindCone(player);
            this.#flagTo.visible = !this.#flagOff.visible && this.#CRSButton.beacon.isInFlagToArea(player);
            this.#flagFrom.visible = !this.#flagOff.visible && !this.#flagTo.visible;
        }
    }
}

/* CDI - COURSE DEVIATION INDICATOR */
class CDI extends Instrument {
    /* VARS */
    #compassDots = null;
    #deviationArrow = null;
    #OBSButton = null;
    #OBSArrow = null;
    #flagOff = null;
    #flagTo = null;
    #flagFrom = null;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentCDI;
        this.position.set(300, 350);
        this.interactiveMousewheel = true;

        this.createCompassDots();
        this.createCourseFlags();
        this.createCompassRose(VORb);
        this.createDeviationArrow(VORb);
        this.createDMEDisplay(PIXI.Loader.shared.resources.DMEb.texture, VORb);
        this.createOBS(VORb);
    }

    /* METHODS */
    createCompassDots() {
        this.#compassDots = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassDots.texture);
        this.#compassDots.width = 130;
        this.#compassDots.height = 21;
        this.#compassDots.anchor = this.anchor;

        this.addChild(this.#compassDots);
    }
    
    createCourseFlags() {
        this.#flagOff = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagOff.texture);
        this.#flagOff.visible = false;
        this.#flagOff.width = 34;
        this.#flagOff.height = 16;
        this.#flagOff.anchor = this.anchor;
        this.#flagOff.position.set(this.width / 6, this.height / 8.5);

        this.#flagTo = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagTo.texture);
        this.#flagTo.visible = false;
        this.#flagTo.width = 34;
        this.#flagTo.height = 16;
        this.#flagTo.anchor = this.anchor;
        this.#flagTo.position.set(this.width / 6, - this.height / 8.5);
        
        this.#flagFrom = new PIXI.Sprite(PIXI.Loader.shared.resources.FlagFrom.texture);
        this.#flagFrom.visible = false;
        this.#flagFrom.width = 34;
        this.#flagFrom.height = 16;
        this.#flagFrom.anchor = this.anchor;
        this.#flagFrom.position.set(this.width / 6, this.height / 8.5);

        this.addChild(this.#flagOff);
        this.addChild(this.#flagTo);
        this.addChild(this.#flagFrom);
    }

    createCompassRose(beacon) {
        if (beacon == null)
            return console.log('(CDI) Skipping compass rose, beacon not provided!');
        super.createCompassRose().beacon = beacon;
    }

    createDeviationArrow(beacon) {
        this.#deviationArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CompassArrowCenterWhite.texture);
        this.#deviationArrow.width = INSTR_ARROW_WIDTH;
        this.#deviationArrow.height = INSTR_ARROW_HEIGHT;
        this.#deviationArrow.anchor = this.anchor;
        this.#deviationArrow.beacon = beacon;

        this.addChild(this.#deviationArrow);
    }

    createOBS(beacon) {
        if (beacon == null)
            return console.log('Skipping OBS button, beacon not provided!');
        if (beacon.courseLines == null)
            return console.log('Skipping OBS button, beacon provided must be VOR!');

        this.#OBSButton = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSBackground.texture);
        this.#OBSButton.width = INSTR_CRS_WIDTH;
        this.#OBSButton.height = INSTR_CRS_HEIGHT;
        this.#OBSButton.anchor.set(1, 1);
        this.#OBSButton.position.set(this.width / 2, this.height / 2);
        this.#OBSButton.beacon = beacon;

        this.#OBSArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.CRSArrow.texture);
        this.#OBSArrow.width = 150;
        this.#OBSArrow.height = 150;
        this.#OBSArrow.anchor.set(0.5, 0.5);
        this.#OBSArrow.position.set(-this.width / 1.8, -this.height / 2);

        this.on('mousewheel', (delta) => {
            this.#OBSArrow.angle -= delta * 1.1;
            this.#OBSButton.beacon.courseLines.angle = this.#OBSArrow.angle;
            this.#OBSButton.beacon.blindCones.angle = this.#OBSArrow.angle;
        });

        this.addChild(this.#OBSButton);
        this.#OBSButton.addChild(this.#OBSArrow);
    }

    renderCompass() {
        if (this.compassRose != null)
            this.compassRose.rotation = - this.compassRose.beacon.courseLines.rotation;

        if (this.#deviationArrow != null && this.#OBSButton != null) {
            let courseLinePoints = this.#OBSButton.beacon.courseLinePoints;
            let distance = calcDistance(player, courseLinePoints[0], courseLinePoints[1]);
            distance *= 3; // multiply for scale
            distance = distance > INSTR_ARROW_CENTER_LIMIT ? INSTR_ARROW_CENTER_LIMIT : distance;
            distance = this.#OBSButton.beacon.isInNegativeDistance(player) ? -distance : distance;
            this.#deviationArrow.x = distance;
        }

        if (this.DMEDisplay != null) {
            let deltaX = this.DMEDisplay.beacon.x - player.x;
            let deltaY = this.DMEDisplay.beacon.y - player.y;
            let distance = Math.hypot(deltaX, deltaY) / 20; // 20 is scale
            this.DMEDisplay.lblDistance.text = (Math.round(distance * 10) / 10).toFixed(1);
        }
  
        if (this.#flagOff != null && this.#flagTo != null && this.#flagFrom != null) {
            this.#flagOff.visible = this.#OBSButton.beacon.isInBlindCone(player);
            this.#flagTo.visible = !this.#flagOff.visible && this.#OBSButton.beacon.isInFlagToArea(player);
            this.#flagFrom.visible = !this.#flagOff.visible && !this.#flagTo.visible;
        }
    }
}