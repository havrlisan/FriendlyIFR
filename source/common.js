/* common.js contains root classes that should be accessible to everyone */

/* CONSTANTS */

const TRAIL_INTERVAL = 60;

const MAX_SPEED = 999;
const MAX_WIND_SPEED = 500;
const MIN_SPEED = 0;
const MAX_ANGLE = 360;

const INSTR_WIDTH = 200;
const INSTR_HEIGHT = 200;
const INSTR_ARROW_WIDTH = 10 * (INSTR_WIDTH / 200);
const INSTR_ARROW_HEIGHT = 140 * (INSTR_HEIGHT / 200);

/* VARS */

let app;
let appLoaded;

let player;
let wind;

let NDB;

let instrDG;
let instrRBI;
let instrRMI;

let lblPause;

/* METHODS */

const degrees_to_radians = deg => (deg * Math.PI) / 180;