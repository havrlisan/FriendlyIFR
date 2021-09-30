/* common.js contains root classes that should be accessible to everyone */

// CONSTANTS

const TRAIL_INTERVAL = 10; // TODO: make dependent of airplane speed
const PAUSE_KEY = "P";

/* DEFINITIONS */

let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  Graphics = PIXI.Graphics,
  Text = PIXI.Text,
  TextStyle = PIXI.TextStyle,
  utils = PIXI.utils;

utils.skipHello();

let app = new Application({
  // autoResize: true, /* TEMP SOLUTION - should resize all the time */
  resolution: devicePixelRatio,
  backgroundColor: 0xA9A9A9,
});

let appLoaded = false;
let appParent = document.getElementById("pixi-app-container");

let messagePause;

let messageStyle = new TextStyle({
  fontFamily: "Arial",
  fontSize: 42,
  fill: "white",
  stroke: 'black',
  strokeThickness: 4,
});