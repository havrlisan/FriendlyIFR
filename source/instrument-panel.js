class InstrumentPanel extends PIXI.Container {
  /* METHODS */
  updateInstrumentPositions() {
    let position = { x: 100, y: 100 }; // take their width and height into account
    for (let i = 0; i < this.children.length; i++)
      if (this.children[i].visible) {
        this.children[i].position.set(position.x, position.y);
        position.y += 200;
        if (position.y + 100 > appParent.offsetHeight) {
          position.x += 200;
          position.y = 100;
        }
      }
  }
}

function initiateInstrumentPanel() {
  instrPanel = new InstrumentPanel();
  app.stage.addChild(instrPanel);
}