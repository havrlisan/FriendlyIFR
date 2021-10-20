/* INITIALIZATION */

// utils.skipHello();

appLoaded = false;
app = new PIXI.Application({ backgroundAlpha: 0 });
appParent.appendChild(app.view);
// document.body.appendChild(app.view);

PIXI.Loader.shared.onProgress.add((loader, resource) => { console.log("Loading: " + resource.url + " (" + loader.progress + "%)") });
PIXI.Loader.shared
    .add("airplaneImage", "static/airplane.png")
    .add("DirectionalGyro", "static/DG.png")
    .add("CompassRose", "static/compass_rose.png")
    .load(setup);

/* SETUP */

function setup() {
    // App
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoDensity = true;
    app.resizeTo = appParent;

    // Airplane
    player = new Airplane(PIXI.Loader.shared.resources.airplaneImage.texture);
    // Airplane trail
    player.trail = new PIXI.Graphics();
    // Wind
    wind = new Wind(0, 0);

    // Directional Gyro
    instrDG = new DirectionalGyro(PIXI.Loader.shared.resources.DirectionalGyro.texture);

    // Pause message
    lblPause = new PIXI.Text("Paused", new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 40,
        fill: "white",
        stroke: 'black',
        strokeThickness: 4,
    }));
    lblPause.visible = false;
    lblPause.position.set((app.renderer.view.width / 2) - (lblPause.width / 2), (app.renderer.view.height / 2) - (lblPause.height / 2));

    // Add objects to stage (the latter ones added are on top layer, hence we first add trail and then the player)
    app.stage.addChild(player.trail);
    app.stage.addChild(player);
    app.stage.addChild(instrDG);
    app.stage.addChild(lblPause);

    // create a loop (called 60 times per second)
    app.ticker.add(delta => renderLoop(delta));

    // Enable controls
    appLoaded = true;
}

/* RENDER LOOP */
function renderLoop(delta) {
    player
        .rotate(delta)
        .advance();

    renderTrail();
    instrDG.renderCompass();
}

let trailCounter = 0;
function renderTrail() {
    if (player.paused) { return false };

    let trail_speed = (player.speed === 0) ? wind.speed : player.speed;

    trailCounter++;
    if (trailCounter > (TRAIL_INTERVAL / trail_speed) * 3000) { // 3000 is scale
        player.drawTrail();
        trailCounter = 0;
    }
}

/* PAUSE MOVEMENT */

function pauseMovement(value) {
    if (value === undefined)
        value = !player.paused;

    player.paused = value;
    lblPause.visible = value;
    swPaused.checked = value;
}

/* KEYBINDS */

const PAUSE_KEY = 'P';
const VISIBILITY_KEY = 'V';
const keyBinds = {
    'B': Airplane.rotations.LEFT(),
    'M': Airplane.rotations.RIGHT(),
    'A': Airplane.rotations.FAST_LEFT(),
    'D': Airplane.rotations.FAST_RIGHT(),
};

window.addEventListener('keydown', (event) => {
    if (!appLoaded) { return false };
    if (document.activeElement.nodeName === 'INPUT') { return false };

    let key = event.key.toUpperCase();
    if (key == PAUSE_KEY)
        pauseMovement()
    else if (key == VISIBILITY_KEY)
        player.setVisible(!player.visible)
    else if (keyBinds.hasOwnProperty(key))
        player.rotationSpeed = keyBinds[key];
});

window.addEventListener('keyup', (event) => {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    // prevents short pause when two keys are pressed
    if (keyBinds.hasOwnProperty(key) && player.rotationSpeed === keyBinds[key])
        player.rotationSpeed = 0;
});