/* common.js contains root classes that should be accessible to everyone */

/* CONSTANTS */

const TRAIL_INTERVAL = 60;

const MAX_SPEED = 999;
const MAX_WIND_SPEED = 500;
const MIN_SPEED = 0;
const MAX_ANGLE = 360;

const BEACON_WIDTH = 80;
const BEACON_HEIGHT = 80;

const INSTR_WIDTH = 200;
const INSTR_HEIGHT = 200;
const INSTR_ARROW_WIDTH = 140 * (INSTR_WIDTH / 200);
const INSTR_ARROW_HEIGHT = 140 * (INSTR_HEIGHT / 200);
const INSTR_ARROW_CENTER_LIMIT = 65 * (INSTR_HEIGHT / 200);
const INSTR_DME_WIDTH = 47 * (INSTR_WIDTH / 200);
const INSTR_DME_HEIGHT = 35 * (INSTR_HEIGHT / 200);
const INSTR_CRS_WIDTH = 35 * (INSTR_WIDTH / 200);
const INSTR_CRS_HEIGHT = 35 * (INSTR_HEIGHT / 200);

/* VARS */

let app;
let appLoaded = false;

let player;
let wind;

let NDB;
let VORa;
let VORb;

let instrDG;
let instrRBI;
let instrRMI;

let lblPause;

/* METHODS */

const degrees_to_radians = deg => (deg * Math.PI) / 180;

/* CLASSES */

class MovableSprite extends PIXI.Sprite {
    /* VARS */
    #mouseMove = false;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);

        this.on('mousedown', () => this.#mouseMove = true);
        this.on('mouseup', () => this.#mouseMove = false);
        this.on('mousemove', (e) => {
            if (this.#mouseMove) {
                this.setPosition(e.data.global.x, e.data.global.y);
            }
        });
    }

    /* METHODS */
    setPosition(x, y) {
        this.position.set(x, y);
    }

    /* PROPERTIES */
    get mouseMove() {
        return this.#mouseMove;
    }
    set mouseMove(value) {
        this.#mouseMove = value;
    }
}