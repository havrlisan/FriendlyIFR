/* INITIALIZATION */

appParent.appendChild(app.view);

PIXI.Loader.shared.onProgress.add(loadProgressHandler);
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
    app.stage.addChild(player);

    // Airplane trail
    player.trail = new PIXI.Graphics();
    app.stage.addChild(player.trail);

    // Pause message
    messagePause = new PIXI.Text("Paused", messageStyle);
    messagePause.visible = false;
    messagePause.position.set((app.renderer.view.width / 2) - (messagePause.width / 2), (app.renderer.view.height / 2) - (messagePause.height / 2));
    app.stage.addChild(messagePause);

    // create a loop (called 60 times per second)
    app.ticker.add(delta => renderLoop(delta));

    // Enable controls
    appLoaded = true;
}

/* PROGRESS HANDLER */

function loadProgressHandler(loader, resource) {
    console.log("Loading: " + resource.url);
    console.log("Loading: " + loader.progress + "%");
}

/* WINDOW RESIZING */

function resize() {
    let scale = scaleToWindow(app.renderer.view); // scale can be used to get proper position of an object after resizing
}

/* RENDER LOOP */
let trailCounter = 0;
function renderLoop(delta) {
    player.rotate();
    if (player.paused) { return false };
    player.advance();

    trailCounter++;
    if (trailCounter > (TRAIL_INTERVAL / player.speed) * 150) {
        drawTrail();
        trailCounter = 0;
    }
}

/* EVENT LISTENERS */

window.addEventListener('resize', resize);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);