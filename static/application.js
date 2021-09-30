/* INITIALIZATION */

appParent.appendChild(app.view);

loader
  .add("airplaneImage", "static/images/airplane.png")
  .on("progress", loadProgressHandler)
  .load(setup);

/* SETUP */

function setup() {
  // App
  app.renderer.view.width = appParent.offsetWidth;
  app.renderer.view.height = appParent.offsetHeight;

  // Airplane
  airplane.obj = new Sprite(loader.resources.airplaneImage.texture);
  airplane.obj.width = 30;
  airplane.obj.height = 30;
  airplane.obj.anchor.set(0.5, 0.5);
  airplane.obj.position.set((app.renderer.view.width / 2) - (airplane.obj.width / 2), (app.renderer.view.height / 2) - (airplane.obj.height / 2));

  // Airplane trail
  airplane.trail = new Graphics();
  airplane.trail.moveTo(airplane.obj.x, airplane.obj.y);

  // Pause message
  messagePause = new Text("Paused", messageStyle);
  messagePause.visible = false;
  messagePause.position.set((app.renderer.view.width / 2) - (messagePause.width / 2), (app.renderer.view.height / 2) - (messagePause.height / 2));

  // Add contents to stage 
  app.stage.addChild(airplane.obj);
  app.stage.addChild(airplane.trail);
  app.stage.addChild(messagePause);

  // create a loop (called 60 times per second)
  app.ticker.add(delta => renderLoop(delta));

  // create another loop for trace  
  setInterval(drawTrail, TRAIL_INTERVAL);

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
  if (!airplane.paused)
    pauseMovement(); // TEMP (should not be possible in test mode)

  app.renderer.view.width = appParent.offsetWidth;
  app.renderer.view.height = appParent.offsetHeight;
}

/* RENDER LOOP */

function renderLoop(delta) {
  rotateAirplane();
  if (airplane.paused) { return false };
  advanceAirplane();
}

/* EVENT LISTENERS */

window.addEventListener('resize', resize);
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)