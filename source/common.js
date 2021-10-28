/* common.js contains root classes that should be accessible to everyone */

/* CONSTANTS */
const TRAIL_INTERVAL = 60;
const MAX_SPEED = 999;
const MAX_WIND_SPEED = 500;
const MIN_SPEED = 0;
const MAX_ANGLE = 360;
const DISTANCE_SCALE = 20;
const BEACON_WIDTH = 80;
const BEACON_HEIGHT = 80;
const INSTR_WIDTH = 200;
const INSTR_HEIGHT = 200;
const INSTR_ARROW_WIDTH = 140;
const INSTR_ARROW_HEIGHT = 140;
const INSTR_ARROW_CENTER_LIMIT = 65;
const INSTR_DME_WIDTH = 47;
const INSTR_DME_HEIGHT = 35;
const INSTR_CRS_WIDTH = 35;
const INSTR_CRS_HEIGHT = 35;

/* VARS */
let app;
let appLoaded;
let fpsDisplay;
let player;
let wind;
let VORdrawingRadial;
let movingRadial;
let NDB;
let VORa;
let VORb;
let instrDG;
let instrRBI;
let instrRMI;
let instrHSI;
let instrCDI;
let lblPause;
let testModeEnabled;

/* METHODS */
const degrees_to_radians = deg => deg * (Math.PI / 180);
const radians_to_degrees = rad => rad * (180 / Math.PI);
const calcDistance = (obj, p1, p2) => pDistance(obj.x, obj.y, p1.x, p1.y, p2.x, p2.y);
/* pDistance function - https://stackoverflow.com/a/6853926/6619251 */
const pDistance = (x, y, x1, y1, x2, y2) => {
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

/* CLASSES */

class MovableSprite extends PIXI.Sprite {
    /* VARS */
    #mouseMove = false;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.interactive = true;
        this.assignEvents();
    }

    /* METHODS */
    setPosition(x, y) {
        this.position.set(x, y)
    };

    assignEvents() {
        this.on('mousedown', () => { this.#mouseMove = true });
        this.on('mouseup', () => { this.#mouseMove = false });
        this.on('mousemove', (e) => { if (this.#mouseMove) this.setPosition(e.data.global.x, e.data.global.y) });
    }

    /* PROPERTIES */
    get mouseMove() { return this.#mouseMove };
    set mouseMove(value) { this.#mouseMove = value };
}