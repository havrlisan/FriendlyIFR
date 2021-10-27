/* GROUNDRADAR CLASS */
class GroundRadar extends MovableSprite {

    /* VARS */
    #currentRadial;
    #radialList;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);

        this.width = BEACON_WIDTH;
        this.height = BEACON_HEIGHT;
        this.anchor.set(0.5, 0.5);
    }

    /* METHODS */
    assignEvents() {
        this.on('mousedown', (e) => {
            // check if some radial is being moved
            if (movingRadial != null) { return false };
            // ensure the actual sprite was clicked, not its children
            if (!this.containsPoint(new PIXI.Point(e.data.global.x, e.data.global.y))) { return false };

            if (btnDrawRadial.classList.contains('active'))
                VORdrawingRadial = this;
            else
                this.mouseMove = true;
        });
        this.on('mouseup', () => {
            this.mouseMove = false
        });
        this.on('mousemove', (e) => {
            if (this.mouseMove)
                this.position = new PIXI.Point(e.data.global.x, e.data.global.y);
            else if (VORdrawingRadial == this)
                this.drawRadial(new PIXI.Point(e.data.global.x, e.data.global.y))
        });
    }

    drawRadial(position) {
        if (this.#currentRadial == null)
            this.#currentRadial = this.addChild(new Radial());
        else
            this.#currentRadial.waypoint = position;
    }

    finishRadial() {
        this.#currentRadial = null;
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
        this.position.set(600, 200);
        this.createCourseLines();
        this.createBlindCones();
        this.createArcCurve();
    }

    createCourseLines() {
        this.#courseLines = new PIXI.smooth.SmoothGraphics();
        this.#courseLines.negativeArea = new PIXI.Polygon([
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
        this.#blindCones = new PIXI.smooth.SmoothGraphics();
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
        this.#blindCones.hitArea = new PIXI.Polygon([]);

        this.addChild(this.#blindCones);
    }

    createArcCurve() {
        this.#arcCurve = new PIXI.smooth.SmoothGraphics();
        this.addChild(this.#arcCurve);

        this.arcCurveRadius = 0;
        this.arcCurveStart = 0;
        this.arcCurveLength = 0;
    }

    isInNegativeDistance(obj) {
        let position = this.#courseLines.toLocal(obj.position);
        return this.#courseLines.negativeArea.contains(position.x, position.y);
    }

    isInFlagToArea(obj) {
        let position = this.#courseLines.toLocal(obj.position);
        return this.#courseLines.flagToArea.contains(position.x, position.y);
    }

    isInBlindCone(obj) {
        let position = this.#blindCones.toLocal(obj.position);
        return this.#blindCones.geometry.containsPoint(position);
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

/* RADIALS */
class Radial extends PIXI.smooth.SmoothGraphics {
    /* VARS */
    #lblAngle;
    #lblDistance;
    #waypoint;

    /* CONSTRUCTOR */
    constructor(geometry) {
        super(geometry);
        this.interactive = true;
        this.assignEvents();
        this.createText();
    }

    /* METHODS */
    assignEvents() {
        this.on('mousedown', () => {
            if (btnDrawRadial.classList.contains('active'))
                movingRadial = this;
        });
        this.on('mousemove', (e) => {
            if (movingRadial == this)
                this.waypoint = new PIXI.Point(e.data.global.x, e.data.global.y);
        });
    }

    createText() {
        let textStyle = new PIXI.TextStyle({
            fontFamily: 'SF Pro Rounded',
            fontSize: 140,
            fill: 0x0000FF
        })
        this.#lblAngle = this.addChild(new PIXI.Text('', textStyle));
        this.#lblAngle.anchor.set(0, 0)
        this.#lblDistance = this.addChild(new PIXI.Text('', textStyle));
        this.#lblDistance.anchor.set(0.5, 1)
    }

    setWaypoint(position) {
        this.#waypoint = this.toLocal(position);
        this.drawRadial();
        this.drawText();
    }

    drawRadial() {
        this.clear()
            .lineStyle({ width: 15, color: 0x000000, alpha: 0.6 })
            .moveTo(0, 0)
            .lineTo(this.#waypoint.x, this.#waypoint.y)
            .lineStyle({ width: 15, color: 0x0000FF, alpha: 0.6 })
            .drawCircle(this.#waypoint.x, this.#waypoint.y, 50)
        this.hitArea = new PIXI.Rectangle(this.#waypoint.x - 50, this.#waypoint.y - 50, 100, 100);
    }

    drawText() {
        // convert to global 
        let thisPos = this.toGlobal(this.position);
        let waypointPos = this.toGlobal(this.#waypoint);
        let deltaX = thisPos.x - waypointPos.x;
        let deltaY = thisPos.y - waypointPos.y;

        let distance = Math.hypot(deltaX, deltaY) / DISTANCE_SCALE;
        this.#lblDistance.text = (Math.round(distance * 10) / 10).toFixed(1);

        let angle = radians_to_degrees(Math.atan2(deltaY, deltaX) - Math.PI / 2);
        angle = angle < 0 ? angle + 360 : angle;
        this.#lblAngle.text = Math.round(angle) + '°';

        this.#lblDistance.position.set(this.#waypoint.x, this.#waypoint.y - 50); // -50 to seperate the text from waypoint circle
        this.#lblAngle.position.set(this.#waypoint.x / 2, this.#waypoint.y / 2);
    }

    finishMoving() {
        if (this.parent.containsPoint(this.toGlobal(this.#waypoint)))
            this.destroy();
    }

    /* PROPERTIES */
    get waypoint() {
        return this.#waypoint;
    }
    set waypoint(value) {
        this.setWaypoint(value);
    }
}