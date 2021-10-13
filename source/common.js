/* common.js contains root classes that should be accessible to everyone */

/* CONSTANTS */

const TRAIL_INTERVAL = 60;

/* VARS */

let app;
let appParent;
let appLoaded;

let player;
let wind;

let instrDG;

let lblPause;
let lblStopwatch;

/* METHODS */

const degrees_to_radians = deg => (deg * Math.PI) / 180;