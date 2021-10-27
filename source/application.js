/* INITIALIZATION */

PIXI.utils.skipHello();

app = new PIXI.Application({ backgroundAlpha: 0 });
appParent.appendChild(app.view);

PIXI.Loader.shared.onProgress.add((loader, resource) => { console.log("Loading " + Math.floor(loader.progress) + "%") }); // resource.url
PIXI.Loader.shared
    .add("airplaneImage", "static/airplane.png")
    .add("NonDirectionalBeacon", "static/NDB.png")
    .add("VORa", "static/VORa.png")
    .add("VORb", "static/VORb.png")
    .add("CompassRose", "static/compass_rose.png")
    .add("CompassArrow", "static/compass_arrow.png")
    .add("CompassArrowBroken", "static/compass_arrow_broken.png")
    .add("CompassArrowCenter", "static/compass_arrow_center.png")
    .add("CompassArrowCenterWhite", "static/compass_arrow_center_white.png")
    .add("CompassDots", "static/compass_dots.png")
    .add("DMEa", "static/DMEa.png")
    .add("DMEb", "static/DMEb.png")
    .add("FlagOff", "static/flag_off.png")
    .add("FlagTo", "static/flag_to.png")
    .add("FlagFrom", "static/flag_from.png")
    .add("CRSBackground", "static/CRS_background.png")
    .add("CRSArrow", "static/CRS_arrow.png")
    .add("DirectionalGyro", "static/DG.png")
    .add("RBIndicator", "static/RBI.png")
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
    // Wind
    wind = new Wind(0, 0);
    // NDB
    NDB = new NonDirectionalBeacon(PIXI.Loader.shared.resources.NonDirectionalBeacon.texture);
    // VORa
    VORa = new VORBeacon(PIXI.Loader.shared.resources.VORa.texture);
    // VORb
    VORb = new VORBeacon(PIXI.Loader.shared.resources.VORb.texture);
    VORb.position.set(500, 200);
    // Directional Gyro
    instrDG = new DirectionalGyro(PIXI.Loader.shared.resources.DirectionalGyro.texture);
    // RBI
    instrRBI = new RBI(PIXI.Loader.shared.resources.RBIndicator.texture);
    // RMI
    instrRMI = new RMI(PIXI.Loader.shared.resources.RBIndicator.texture);
    // HSI
    instrHSI = new HSI(PIXI.Loader.shared.resources.RBIndicator.texture);
    // CDI
    instrCDI = new CDI(PIXI.Loader.shared.resources.RBIndicator.texture);

    // Pause message
    lblPause = new PIXI.Text("II", new PIXI.TextStyle({
        fontFamily: "SF Pro Rounded",
        fontSize: 68,
        fill: "white",
        stroke: 'black',
        strokeThickness: 6,
        letterSpacing: 2,
    }));
    lblPause.visible = false;
    lblPause.position.set((app.renderer.view.width / 2) - (lblPause.width / 2), (app.renderer.view.height / 2) - (lblPause.height / 2));

    app.stage.addChild(NDB);
    app.stage.addChild(VORa);
    app.stage.addChild(VORb);
    app.stage.addChild(player);
    app.stage.addChild(instrDG);
    app.stage.addChild(instrRBI);
    app.stage.addChild(instrRMI);
    app.stage.addChild(instrHSI);
    app.stage.addChild(instrCDI);
    app.stage.addChild(lblPause);

    // Add FPS display
    fpsDisplay = new FPS.FPS({
        meter: false,
        side: 'bottom-left',
        meterWidth: 60,
        meterHeight: 10,
        styles: {
            'background': 'rgba(0, 0, 0, 0.5)',
            'color': 'white',
        },
        stylesFPS: {
            'padding': '0.1em 0.5em',
        },
    })

    // create a 60 FPS loop (delta accounted for different monitor's framerate)
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
    instrRBI.renderCompass();
    instrRMI.renderCompass();
    instrHSI.renderCompass();
    instrCDI.renderCompass();

    fpsDisplay.frame()
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