/* common.js contains root classes that should be accessible to everyone */

/* CONSTANTS */

const TRAIL_INTERVAL = 60;

/* VARS */

let app;
let appLoaded = false;

let player;
let wind;

let instrDG;

let messagePause;

/* METHODS */

const degrees_to_radians = deg => (deg * Math.PI) / 180;