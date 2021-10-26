/* GROUNDRADAR CLASS */
class GroundRadar extends MovableSprite {

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);

        this.interactive = true;
        this.width = BEACON_WIDTH;
        this.height = BEACON_HEIGHT;
        this.anchor.set(0.5, 0.5);
    }
}

/* NDB */
class NonDirectionalBeacon extends GroundRadar {

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.position.set(700, 200);
    }
}

/* VOR */
class VORBeacon extends GroundRadar {

    /* VARS */
    #courseLines = null;
    #blindCones = null;
    #arcCurve = null;
    #arcCurveData = {
        radius: 0,
        start: 0,
        length: 0,
    }
    #radius = 10000;
    #courseLinePoints = {
        topPoint: {
            x: 0,
            y: -this.#radius,
        },
        bottomPoint: {
            x: 0,
            y: this.#radius,
        }
    }

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.interactiveChildren = false;
        this.position.set(600, 200);
        this.createCourseLines();
        this.createBlindCones();
        this.createArcCurve();
    }

    /* METHODS */
    createCourseLines() {
        this.#courseLines = new PIXI.Graphics();
        this.#courseLines.hitArea = new PIXI.Polygon([
            this.#courseLinePoints.topPoint.x, this.#courseLinePoints.topPoint.y,                       // up-center
            this.#courseLinePoints.topPoint.x + this.#radius, this.#courseLinePoints.topPoint.y,        // up-right
            this.#courseLinePoints.bottomPoint.x + this.#radius, this.#courseLinePoints.bottomPoint.y,  // down-right
            this.#courseLinePoints.bottomPoint.x, this.#courseLinePoints.bottomPoint.y,                 // down-center
        ]);
        this.#courseLines.flagToArea = new PIXI.Polygon([
            -this.#radius, 0,
            this.#radius, 0,
            this.#radius, this.#radius,
            -this.#radius, this.#radius,
        ]);
        this.#courseLines
            .lineStyle({ width: 10, color: 0xFF0000, alpha: 0.6 })  // red line
            .moveTo(this.#courseLinePoints.topPoint.x, this.#courseLinePoints.topPoint.y)
            .lineTo(0, 0)
            .lineStyle({ width: 10, color: 0x0000FF, alpha: 0.6 })  // blue line
            .lineTo(this.#courseLinePoints.bottomPoint.x, this.#courseLinePoints.bottomPoint.y);

        this.addChild(this.#courseLines);
    }

    createBlindCones() {
        this.#blindCones = new PIXI.Graphics();
        this.#blindCones.hitArea = new PIXI.Polygon([
            20000, -(20000 * Math.tan(degrees_to_radians(5))),  // right-up              
            20000, (20000 * Math.tan(degrees_to_radians(5))),   // right-down
            0, 0,                                               // center
            -20000, -(20000 * Math.tan(degrees_to_radians(5))), // left-up
            -20000, (20000 * Math.tan(degrees_to_radians(5))),  // left-down
        ]);
        this.#blindCones
            .beginFill(0x000000, 0.12)
            .moveTo(0, 0)
            .drawPolygon([
                20000, -(20000 * Math.tan(degrees_to_radians(5))),  // right-up              
                20000, (20000 * Math.tan(degrees_to_radians(5))),   // right-down
                0, 0                                                // center
            ])
            .drawPolygon([
                -20000, -(20000 * Math.tan(degrees_to_radians(5))), // left-up
                -20000, (20000 * Math.tan(degrees_to_radians(5))),  // left-down
                0, 0                                                // center
            ])
            .endFill();

        this.addChild(this.#blindCones);
    }

    createArcCurve() {
        this.#arcCurve = new PIXI.Graphics();
        this.addChild(this.#arcCurve);

        this.arcCurveRadius = 0;
        this.arcCurveStart = 0;
        this.arcCurveLength = 0;
    }

    isInNegativeDistance(obj) {
        let position = this.#courseLines.toLocal(obj.position);
        return this.#courseLines.hitArea.contains(position.x, position.y);
    }

    isInFlagToArea(obj) {
        let position = this.#courseLines.toLocal(obj.position);
        return this.#courseLines.flagToArea.contains(position.x, position.y);
    }

    isInBlindCone(obj) {
        let position = this.#blindCones.toLocal(obj.position);
        return this.#blindCones.hitArea.contains(position.x, position.y);
    }

    setLineVisibility(value) {
        this.#courseLines.visible = value;
        this.#blindCones.visible = value;
    }

    updateArcCurve() {
        if (this.#arcCurve == null) { this.createArcCurve() };

        let radius = this.#arcCurveData.radius * 2, // multiply for scale
            start = this.#arcCurveData.start,
            length = this.#arcCurveData.length;

        start = degrees_to_radians(start) - Math.PI / 2;
        length = degrees_to_radians(length);
        this.#arcCurve
            .clear()
            .lineStyle(20, 0x000000, 0.3)
            .arc(0, 0, radius, start, start + length, false)
    }

    /* PROPERTIES */
    get blindCones() {
        return this.#blindCones;
    }
    get courseLines() {
        return this.#courseLines;
    }
    get courseLinePoints() {
        let cos = Math.cos(this.#courseLines.rotation),
            sin = Math.sin(this.#courseLines.rotation);

        let topPoint = {
            x: this.#courseLinePoints.topPoint.x * cos - (this.#courseLinePoints.topPoint.y) * sin,
            y: this.#courseLinePoints.topPoint.x * sin + (this.#courseLinePoints.topPoint.y) * cos,
        };
        let bottomPoint = {
            x: this.#courseLinePoints.bottomPoint.x * cos - (this.#courseLinePoints.bottomPoint.y) * sin,
            y: this.#courseLinePoints.bottomPoint.x * sin + (this.#courseLinePoints.bottomPoint.y) * cos,
        };

        return [this.toGlobal(topPoint), this.toGlobal(bottomPoint)];
    }
    get arcCurveData() {
        return this.#arcCurveData;
    }
    /**
     * @param {number} value
     */
    set arcCurveRadius(value) {
        this.#arcCurveData.radius = value;
        edVORRadius.value = value;
        this.updateArcCurve();
    }
    /**
     * @param {number} value
     */
    set arcCurveStart(value) {
        this.#arcCurveData.start = value;
        edVORStart.value = value;
        this.updateArcCurve();
    }
    /**
     * @param {number} value
     */
    set arcCurveLength(value) {
        this.#arcCurveData.length = value;
        edVORLength.value = value;
        this.updateArcCurve();
    }
}