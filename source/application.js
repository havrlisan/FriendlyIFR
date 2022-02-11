/* INITIALIZATION */

let isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
if (isMobile) {
    loadingText.innerText = 'Sorry, FriendlyIFR is not for mobile devices!';
    throw new Error('Mobile devices not supported.');
}

app = new PIXI.Application({
    backgroundColor: 0xDDDDDD,
    resizeTo: appParent,
});
appParent.appendChild(app.view);

PIXI.Loader.shared.onProgress.add(loader => { loadingText.innerText = 'Loading ' + Math.floor(loader.progress) + '%'; });
PIXI.Loader.shared
    .add('airplane', 'static/application/airplane.png')
    .add('NonDirectionalBeacon', 'static/application/NDB.png')
    .add('VORa', 'static/application/VORa.png')
    .add('VORb', 'static/application/VORb.png')
    .add('CompassRose', 'static/application/compass_rose.png')
    .add('CompassArrow', 'static/application/compass_arrow.png')
    .add('CompassArrowBroken', 'static/application/compass_arrow_broken.png')
    .add('CompassArrowCenter', 'static/application/compass_arrow_center.png')
    .add('CompassArrowCenterWhite', 'static/application/compass_arrow_center_white.png')
    .add('CompassDots', 'static/application/compass_dots.png')
    .add('DMEa', 'static/application/DMEa.png')
    .add('DMEb', 'static/application/DMEb.png')
    .add('FlagOff', 'static/application/flag_off.png')
    .add('FlagTo', 'static/application/flag_to.png')
    .add('FlagFrom', 'static/application/flag_from.png')
    .add('CRSBackground', 'static/application/CRS_background.png')
    .add('CRSArrow', 'static/application/CRS_arrow.png')
    .add('DirectionalGyro', 'static/application/DG.png')
    .add('RBIndicator', 'static/application/RBI.png')
    .load(setup);

/* SETUP */

function setup() {
    initiateViewport();

    // Sprite creation
    player = new Airplane(PIXI.Loader.shared.resources.airplane.texture);
    wind = new Wind(0, 0);
    NDB = new NonDirectionalBeacon(PIXI.Loader.shared.resources.NonDirectionalBeacon.texture);
    VORa = new VORBeacon(PIXI.Loader.shared.resources.VORa.texture);
    VORb = new VORBeacon(PIXI.Loader.shared.resources.VORb.texture);
    instrDG = new DirectionalGyro(PIXI.Loader.shared.resources.DirectionalGyro.texture);
    instrRBI = new RBI(PIXI.Loader.shared.resources.RBIndicator.texture);
    instrRMI = new RMI(PIXI.Loader.shared.resources.RBIndicator.texture);
    instrHSI = new HSI(PIXI.Loader.shared.resources.RBIndicator.texture);
    instrCDI = new CDI(PIXI.Loader.shared.resources.RBIndicator.texture);

    // Pause message
    lblPause = new PIXI.Text('II', new PIXI.TextStyle({
        fontFamily: 'SF Pro Rounded',
        fontSize: 68,
        fill: 'white',
        stroke: 'black',
        strokeThickness: 6,
        letterSpacing: 2,
    }));
    lblPause.visible = false;
    lblPause.position.set((app.renderer.view.width / 2) - (lblPause.width / 2), (app.renderer.view.height / 2) - (lblPause.height / 2));

    // Add objects to viewport
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

function resizeToContent() {
    if (!appLoaded)
        return;
        
    // weird hack needed for flexbox to work correctly
    app.renderer.resize(0, 0);
    viewport.resize(appParent.offsetWidth, appParent.offsetHeight);
    app.renderer.resize(appParent.offsetWidth, appParent.offsetHeight);
    viewport.dirty = true;

    // disabled until positioning fixed
    // clampViewportZoom();

    lblPause.position.set((app.renderer.view.width / 2) - (lblPause.width / 2), (app.renderer.view.height / 2) - (lblPause.height / 2));
}

/* RESIZING */

// Resize app for sidebar toggling
new ResizeObserver(resizeToContent).observe(appParent);

// Resize app for whole page resizing
window.addEventListener('resize', () => {
    resizeToContent();
});

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

window.addEventListener('keydown', (event) => {
    if (!appLoaded) { return false };
    if (document.activeElement.nodeName === 'INPUT') { return false };
    let key = event.key.toUpperCase();

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

    // movement control
    if (rotationBinds.hasOwnProperty(key) && player.rotationSpeed === rotationBinds[key])
        player.rotationSpeed = 0
    else if (fastRotationBinds.hasOwnProperty(key) && player.rotationSpeed === fastRotationBinds[key])
        player.rotationSpeed = 0;
});
