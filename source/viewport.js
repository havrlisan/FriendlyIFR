// Convert to class?

function initiateViewport() {
  // init
  viewport = new pixi_viewport.Viewport({
    passiveWheel: false,
    divWheel: appParent,
  });

  // resize
  viewport.resize(appParent.offsetWidth, appParent.offsetHeight, WORLD_WIDTH, WORLD_HEIGHT);

  // assign props
  viewport
    .drag()
    .decelerate({ friction: 0.92 })
    .clamp({ direction: 'all' })
    .moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2)
    .on('mouseup', () => { setObjectMoving(null) })
    .wheel({
      percent: 0.2,
      smooth: 10
    });
  clampViewportZoom();

  // add to stage
  app.stage.addChild(viewport);
}

function clampViewportZoom() {
  // TODO: Fix screen positioning when clamp updated on resize
  viewport.clampZoom({
    minWidth: appParent.offsetWidth,
    minHeight: appParent.offsetHeight,
    maxWidth: Math.min(appParent.offsetWidth * 3, WORLD_WIDTH),
    maxHeight: Math.min(appParent.offsetHeight * 3, WORLD_HEIGHT),
  })
}