/* INITIALIZATION */

let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

if (isMobile) {
    loadingText.innerText = 'Sorry, FriendlyIFR is not for mobile devices!';
    throw new Error('Mobile devices not supported.');
}

PIXI.utils.skipHello();

app = new PIXI.Application({ backgroundAlpha: 0 });
appParent.appendChild(app.view);

PIXI.Loader.shared.onProgress.add((loader, resource) => { console.log("Loading " + Math.floor(loader.progress) + "%") }); // resource.url
PIXI.Loader.shared
    .add("airplaneImage", "static/airplane.png")
    .add("leftArrow", "static/left_arrow.png")
    .add("rightArrow", "static/right_arrow.png")
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
    app.renderer.resize(appParent.offsetWidth, appParent.offsetHeight);

    // Viewport
    viewport = new pixi_viewport.Viewport({ passiveWheel: false });
    viewport.resize(appParent.offsetWidth, appParent.offsetHeight, WORLD_WIDTH, WORLD_HEIGHT)
    viewport.drag()
        .wheel()
        .clamp({ direction: 'all' })
        .clampZoom({
            minWidth: appParent.offsetWidth,
            minHeight: appParent.offsetHeight,
            maxWidth: WORLD_WIDTH,
            maxHeight: WORLD_HEIGHT,
        })
        .on('mouseup', () => {
            setObjectMoving(null)
        });
    app.stage.addChild(viewport);

    // Sprite creation
    player = new Airplane(PIXI.Loader.shared.resources.airplaneImage.texture);
    wind = new Wind(0, 0);
    NDB = new NonDirectionalBeacon(PIXI.Loader.shared.resources.NonDirectionalBeacon.texture);
    VORa = new VORBeacon(PIXI.Loader.shared.resources.VORa.texture);
    VORb = new VORBeacon(PIXI.Loader.shared.resources.VORb.texture);
    VORb.position.set(500, 200);
    instrDG = new DirectionalGyro(PIXI.Loader.shared.resources.DirectionalGyro.texture);
    instrRBI = new RBI(PIXI.Loader.shared.resources.RBIndicator.texture);
    instrRMI = new RMI(PIXI.Loader.shared.resources.RBIndicator.texture);
    instrHSI = new HSI(PIXI.Loader.shared.resources.RBIndicator.texture);
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

    // Movement arrows
    leftArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.leftArrow.texture);
    leftArrow.visible = false;
    leftArrow.height = 50;
    leftArrow.width = 50;
    leftArrow.position.set((app.renderer.view.width / 2) - (leftArrow.width), (app.renderer.view.height / 1.2) - (leftArrow.height / 2));
    rightArrow = new PIXI.Sprite(PIXI.Loader.shared.resources.rightArrow.texture);
    rightArrow.visible = false;
    rightArrow.height = 50;
    rightArrow.width = 50;
    rightArrow.position.set((app.renderer.view.width / 2) + (leftArrow.width), (app.renderer.view.height / 1.2) - (rightArrow.height / 2));

    viewport.addChild(NDB);
    viewport.addChild(VORa);
    viewport.addChild(VORb);
    viewport.addChild(player);
    viewport.addChild(instrDG);
    viewport.addChild(instrRBI);
    viewport.addChild(instrRMI);
    viewport.addChild(instrHSI);
    viewport.addChild(instrCDI);
    app.stage.addChild(lblPause);
    app.stage.addChild(leftArrow);
    app.stage.addChild(rightArrow);

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
    showLoadingScreen(false);
}

/* RENDER LOOP */
function renderLoop(delta) {
    player
        .rotate(delta)
        .advance(delta)
        .renderTrail(delta);

    instrDG.renderCompass();
    instrRBI.renderCompass();
    instrRMI.renderCompass();
    instrHSI.renderCompass();
    instrCDI.renderCompass();

    fpsDisplay.frame()
}

/* METHODS */

function pauseMovement(value) {
    if (value === undefined)
        value = !player.paused;

    player.paused = value;
    lblPause.visible = value;
    swPaused.checked = value;
}

function setCourseLinesVisible(value) {
    VORa.setLineVisibility(value);
    VORb.setLineVisibility(value);
    swCourseLinesVisible.checked = value;
}

/* KEYBINDS */

const PAUSE_KEY = 'P';
const VISIBILITY_KEY = 'V';
const rotationBinds = {
    'B': Airplane.rotations.LEFT(),
    'M': Airplane.rotations.RIGHT(),
};
const fastRotationBinds = {
    'A': Airplane.rotations.FAST_LEFT(),
    'D': Airplane.rotations.FAST_RIGHT(),
};

/* EVENTS */

window.addEventListener('resize', () => {
    // weird hack needed for flexbox to work correctly
    app.renderer.resize(0, 0);
    viewport.resize(appParent.offsetWidth, appParent.offsetHeight);
    app.renderer.resize(appParent.offsetWidth, appParent.offsetHeight);
    viewport.dirty = true;

    lblPause.position.set((app.renderer.view.width / 2) - (lblPause.width / 2), (app.renderer.view.height / 2) - (lblPause.height / 2));
    leftArrow.position.set((app.renderer.view.width / 2) - (leftArrow.width), (app.renderer.view.height / 1.2) - (leftArrow.height / 2));
    rightArrow.position.set((app.renderer.view.width / 2) + (leftArrow.width), (app.renderer.view.height / 1.2) - (rightArrow.height / 2));
});

window.addEventListener('keydown', (event) => {
    if (!appLoaded) { return false };
    if (document.activeElement.nodeName === 'INPUT') { return false };
    let key = event.key.toUpperCase();

    // arrows
    if (key === 'B') {
        leftArrow.visible = true;
    }
    if (key === 'M') {
        rightArrow.visible = true;
    }

    // movement control
    if ((key == PAUSE_KEY) && !isInTestMode())
        pauseMovement()
    else if ((key == VISIBILITY_KEY) && !isInTestMode())
        player.setVisible(!player.visible)
    else if (rotationBinds.hasOwnProperty(key))
        player.rotationSpeed = rotationBinds[key]
    else if (fastRotationBinds.hasOwnProperty(key) && !isInTestMode())
        player.rotationSpeed = fastRotationBinds[key]
});

window.addEventListener('keyup', (event) => {
    if (!appLoaded) { return false };
    let key = event.key.toUpperCase();

    // arrows
    if (key === 'B') {
        leftArrow.visible = false;
    }
    if (key === 'M') {
        rightArrow.visible = false;
    }

    // movement control
    if (rotationBinds.hasOwnProperty(key) && player.rotationSpeed === rotationBinds[key])
        player.rotationSpeed = 0
    else if (fastRotationBinds.hasOwnProperty(key) && player.rotationSpeed === fastRotationBinds[key])
        player.rotationSpeed = 0;
});
