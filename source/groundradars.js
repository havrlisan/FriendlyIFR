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
    #courseLinesRadius = 10000;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.position.set(600, 200);
        this.createCourseLines();
        this.createBlindCones();
    }

    /* METHODS */
    createCourseLines() {
        this.#courseLines = new PIXI.Graphics();
        this.#courseLines.lineStyle({ width: 20, color: 0xFF0000, alpha: 0.7 })
            .moveTo(0, -this.#courseLinesRadius)
            .lineTo(0, 0)
            .lineStyle({ width: 20, color: 0x0000FF, alpha: 0.7 })
            .lineTo(0, this.#courseLinesRadius);

        this.addChild(this.#courseLines);
    }

    createBlindCones() {
        this.#blindCones = new PIXI.Graphics();
        this.#blindCones.hitArea = new PIXI.Polygon([
            20000, -(20000 * Math.tan(degrees_to_radians(5))),  // right-up              
            20000, (20000 * Math.tan(degrees_to_radians(5))),   // right-down
            0, 0,                                                // center
            -20000, -(20000 * Math.tan(degrees_to_radians(5))), // left-up
            -20000, (20000 * Math.tan(degrees_to_radians(5))),  // left-down
            0, 0                                                // center
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

    isInBlindCone(obj) {
        let position = this.#blindCones.toLocal(obj.position);
        return this.#blindCones.hitArea.contains(position.x, position.y);
    }

    setLineVisibility(value) {
        this.#courseLines.visible = value;
        this.#blindCones.visible = value;
    }

    /* PROPERTIES */
    get blindCones() {
        return this.#blindCones;
    }
    get courseLines() {
        return this.#courseLines;
    }
}