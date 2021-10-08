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
    airplane.obj = new PIXI.Sprite(PIXI.Loader.shared.resources.airplaneImage.texture);
    airplane.obj.width = 30;
    airplane.obj.height = 30;
    airplane.obj.anchor.set(0.5, 0.5);
    airplane.obj.position.set((app.renderer.view.width / 2) - (airplane.obj.width / 2), (app.renderer.view.height / 2) - (airplane.obj.height / 2));
    app.stage.addChild(airplane.obj);

    // Airplane trail
    airplane.trail = new PIXI.Graphics();
    app.stage.addChild(airplane.trail);
    airplane.lastPosition.x = airplane.obj.x;
    airplane.lastPosition.y = airplane.obj.y;

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
    rotateAirplane();
    if (airplane.paused) { return false };
    advanceAirplane();

    trailCounter++;
    if (trailCounter > (TRAIL_INTERVAL / airplane.speed) * 150) {
        drawTrail();
        trailCounter = 0;
    }
}

/* EVENT LISTENERS */

window.addEventListener('resize', resize);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);