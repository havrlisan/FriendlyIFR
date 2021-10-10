/* INITIALIZATION */

// utils.skipHello();

app = new PIXI.Application({ backgroundColor: 0xA9A9A9 });

// document.getElementById("pixi-app-container").appendChild(app.view);
document.body.appendChild(app.view);

PIXI.Loader.shared.onProgress.add((loader, resource) => { console.log("Loading: " + resource.url + " (" + loader.progress + "%)") });
PIXI.Loader.shared
    .add("airplaneImage", "static/images/airplane.png")
    .load(setup);

/* SETUP */

function setup() {
    // App
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoDensity = true;
    app.resizeTo = window;

    // Airplane
    player = new Airplane(PIXI.Loader.shared.resources.airplaneImage.texture);
    player.setPosition((app.renderer.view.width / 2) - (player.width / 2), (app.renderer.view.height / 2) - (player.height / 2));

    // Airplane trail
    player.trail = new PIXI.Graphics();

    // Wind
    wind = new Wind(0, 0);
    
    // Pause message
    messagePause = new PIXI.Text("Paused", new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 40,
        fill: "white",
        stroke: 'black',
        strokeThickness: 4,
    }));
    messagePause.visible = false;
    messagePause.position.set((app.renderer.view.width / 2) - (messagePause.width / 2), (app.renderer.view.height / 2) - (messagePause.height / 2));

    // Add objects to stage
    app.stage.addChild(player);
    app.stage.addChild(player.trail);
    app.stage.addChild(messagePause);

    // create a loop (called 60 times per second)
    app.ticker.add(delta => renderLoop(delta));

    // Enable controls
    appLoaded = true;
}

/* RENDER LOOP */
function renderLoop(delta) {
    player
        .rotate()
        .advance();

    renderTrail();
}

let trailCounter = 0;
function renderTrail() {
    if (player.paused) { return false };

    let trail_speed = (player.speed === 0) ? wind.speed : player.speed;

    trailCounter++;
    if (trailCounter > (TRAIL_INTERVAL / trail_speed) * 150) {
        player.drawTrail();
        trailCounter = 0;
    }
}

/* PAUSE MOVEMENT */

function pauseMovement() {
    player.paused = !player.paused;
    messagePause.visible = !messagePause.visible;
}

/* EVENT LISTENERS */

window.addEventListener('resize', () => {
    let scale = scaleToWindow(app.renderer.view); // scale can be used to get proper position of an object after resizing
});

// key binds
const PAUSE_KEY = 'P';
const VISIBILITY_KEY = 'V';
const keyBinds = {
    'B': Airplane.rotations.LEFT,
    'M': Airplane.rotations.RIGHT,
    'A': Airplane.rotations.FAST_LEFT,
    'D': Airplane.rotations.FAST_RIGHT,
};

window.addEventListener('keydown', (event) => {
    if (!appLoaded) { return false };

    let key = event.key.toUpperCase();
    if (key == PAUSE_KEY)
        pauseMovement()
    else if (key == VISIBILITY_KEY)
        player.toggleVisibility()
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