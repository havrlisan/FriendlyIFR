/* common.js contains root classes that should be accessible to everyone */

// CONSTANTS

const TRAIL_INTERVAL = 30; // TODO: make dependent of airplane speed
const PAUSE_KEY = "P";
const VISIBILITY_KEY = "V";

// utils.skipHello();

let app = new PIXI.Application({
  backgroundColor: 0xA9A9A9,
});

let appLoaded = false;
let appParent = document.body;
// let appParent = document.getElementById("pixi-app-container");

let messagePause;

let messageStyle = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 42,
  fill: "white",
  stroke: 'black',
  strokeThickness: 4,
});