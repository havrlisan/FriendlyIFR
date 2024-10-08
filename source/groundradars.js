function resetGroundRadars() {
  if (NDB != null)
    NDB.destroyRadials();
  if (VORa != null)
    VORa.destroyRadials();
  if (VORb != null)
    VORb.destroyRadials();
}

/* GROUNDRADAR CLASS */
class GroundRadar extends MovableSprite {

  /* VARS */
  #currentRadial;

  /* CONSTRUCTOR */
  constructor(texture) {
    super(texture);
    let position = random_position(BEACON_WIDTH + BEACON_HEIGHT);
    this.position.set(position.x, position.y);
    this.alpha = 0.9;
    this.width = BEACON_WIDTH;
    this.height = BEACON_HEIGHT;
    this.anchor.set(0.5, 0.5);
  }

  /* METHODS */
  assignEvents() {
    this.on('mousedown', (e) => {
      if (objectMoving !== null) { return false };
      // ensure the actual sprite was clicked, not its children
      if (!this.containsPoint(new PIXI.Point(e.data.global.x, e.data.global.y))) { return false };

      if (this.canDraw() || !isInTestMode())
        setObjectMoving(this);
    });
    this.on('mousemove', (e) => {
      if (objectMoving !== this) { return false };
      if (this.canDraw())
        this.drawRadial(new PIXI.Point(Math.round(e.data.global.x), Math.round(e.data.global.y)))
      else
        this.setPosition(Math.round(e.data.global.x), Math.round(e.data.global.y), true);
    });
    this.on('mouseup', () => {
      this.#currentRadial = null;
    });
  }

  canDraw() {
    return btnDrawRadial.classList.contains('active');
  }

  drawRadial(position) {
    if (this.#currentRadial == null)
      this.#currentRadial = this.addChild(new Radial());
    else
      this.#currentRadial.waypoint = position;
  }

  loadRadial(x, y) {
    this.addChild(new Radial()).waypoint = viewport.toGlobal(new PIXI.Point(x, y));
  }

  destroyRadials() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i] instanceof Radial)
        this.children[i].destroy();
    }
  }

  getRadialsJSON() {
    let list = [];
    for (let i = this.children.length - 1; i >= 0; i--) {
      if (this.children[i] instanceof Radial) {
        let position = _v(this.children[i].toGlobal(this.children[i].waypoint));
        list.push({
          x: position.x,
          y: position.y
        })
      }
    }
    return list;
  }
}

/* NDB */
class NonDirectionalBeacon extends GroundRadar {

  /* CONSTRUCTOR */
  constructor(texture) {
    super(texture);
  }
}

/* VOR */
class VORBeacon extends GroundRadar {

  /* VARS */
  #courseLines = null;
  #blindCones = null;
  #arcCurve = null;
  #arcCurveData = {
    radius: 0,
    start: 0,
    length: 0,
  }
  #radius = 10000;
  #courseLinePoints = {
    topPoint: {
      x: 0,
      y: -this.#radius,
    },
    bottomPoint: {
      x: 0,
      y: this.#radius,
    }
  }

  /* CONSTRUCTOR */
  constructor(texture) {
    super(texture);
    this.createCourseLines();
    this.createBlindCones();
    this.createArcCurve();
  }

  createCourseLines() {
    this.#courseLines = new PIXI.smooth.SmoothGraphics();
    this.#courseLines
      .lineStyle({ width: 2, color: 0xFF0000, alpha: 0.6 })  // red line
      .moveTo(this.#courseLinePoints.topPoint.x, this.#courseLinePoints.topPoint.y)
      .lineTo(0, 0)
      .lineStyle({ width: 2, color: 0x0000FF, alpha: 0.6 })  // blue line
      .lineTo(this.#courseLinePoints.bottomPoint.x, this.#courseLinePoints.bottomPoint.y);

    this.addChild(this.#courseLines);
  }

  createBlindCones() {
    this.#blindCones = new PIXI.smooth.SmoothGraphics();
    this.#blindCones
      .beginFill(0x000000, 0) // 0.12) // hide blind cones
      .moveTo(0, 0)
      .drawPolygon([
        20000, -(20000 * Math.tan(degrees_to_radians(5))),  // right-up              
        20000, (20000 * Math.tan(degrees_to_radians(5))),   // right-down
        0, 0                                                // center
      ])
      .drawPolygon([
        -20000, -(20000 * Math.tan(degrees_to_radians(5))), // left-up
        -20000, (20000 * Math.tan(degrees_to_radians(5))),  // left-down
        0, 0                                                // center
      ])
      .endFill();
    this.#blindCones.hitArea = new PIXI.Polygon([]);

    this.addChild(this.#blindCones);
  }

  createArcCurve() {
    this.#arcCurve = new PIXI.smooth.SmoothGraphics();
    this.addChild(this.#arcCurve);

    this.arcCurveRadius = 0;
    this.arcCurveStart = 0;
    this.arcCurveLength = 0;
  }

  isInNegativeDistance(point) {
    let p1 = _v(this.#courseLines.toGlobal(new PIXI.Point(this.#courseLinePoints.topPoint.x, this.#courseLinePoints.topPoint.y)))
    let p2 = _v(this.#courseLines.toGlobal(new PIXI.Point(this.#courseLinePoints.bottomPoint.x, this.#courseLinePoints.bottomPoint.y)))
    return ((p2.x - p1.x) * (point.y - p1.y) - (p2.y - p1.y) * (point.x - p1.x)) > 0;
  }

  isInFlagToArea(point) {
    let p1 = _v(this.#courseLines.toGlobal(new PIXI.Point(-this.#radius, 0)))
    let p2 = _v(this.#courseLines.toGlobal(new PIXI.Point(this.#radius, 0)))
    return ((p2.x - p1.x) * (point.y - p1.y) - (p2.y - p1.y) * (point.x - p1.x)) < 0;
  }

  isInBlindCone(point) {
    let position = this.#blindCones.toLocal(viewport.toGlobal(point));
    return this.#blindCones.geometry.containsPoint(position);
  }

  setLineVisibility(value) {
    this.#courseLines.visible = value;
    this.#blindCones.visible = value;
  }

  updateArcCurve() {
    if (this.#arcCurve == null) { this.createArcCurve() };

    let radius = this.#arcCurveData.radius * DISTANCE_SCALE - 1, // scale is off by 1 for some reason
      start = this.#arcCurveData.start,
      length = this.#arcCurveData.length;

    start = degrees_to_radians(start) - Math.PI / 2;
    length = degrees_to_radians(length);
    this.#arcCurve
      .clear()
      .lineStyle(2, 0x000000, 0.3)
      .arc(0, 0, radius, start, start + length, false)
  }

  drawArcCurve(radius, start, length) {
    this.arcCurveRadius = radius;
    this.arcCurveStart = start;
    this.arcCurveLength = length;
  }

  /* PROPERTIES */
  get blindCones() {
    return this.#blindCones;
  }
  get courseLines() {
    return this.#courseLines;
  }
  get courseLinePoints() {
    let cos = Math.cos(this.#courseLines.rotation),
      sin = Math.sin(this.#courseLines.rotation);

    let topPoint = {
      x: this.#courseLinePoints.topPoint.x * cos - (this.#courseLinePoints.topPoint.y) * sin,
      y: this.#courseLinePoints.topPoint.x * sin + (this.#courseLinePoints.topPoint.y) * cos,
    };
    let bottomPoint = {
      x: this.#courseLinePoints.bottomPoint.x * cos - (this.#courseLinePoints.bottomPoint.y) * sin,
      y: this.#courseLinePoints.bottomPoint.x * sin + (this.#courseLinePoints.bottomPoint.y) * cos,
    };

    return [_v(this.toGlobal(topPoint)), _v(this.toGlobal(bottomPoint))];
  }
  get arcCurveData() {
    return this.#arcCurveData;
  }
  /**
   * @param {number} value
   */
  set arcCurveRadius(value) {
    this.#arcCurveData.radius = value;
    edVORRadius.value = value;
    this.updateArcCurve();
  }
  /**
   * @param {number} value
   */
  set arcCurveStart(value) {
    this.#arcCurveData.start = value;
    edVORStart.value = value;
    this.updateArcCurve();
  }
  /**
   * @param {number} value
   */
  set arcCurveLength(value) {
    this.#arcCurveData.length = value;
    edVORLength.value = value;
    this.updateArcCurve();
  }
}

/* RADIALS */
class Radial extends PIXI.smooth.SmoothGraphics {
  /* VARS */
  #lblAngle;
  #lblDistance;
  #waypoint;

  /* CONSTRUCTOR */
  constructor(geometry) {
    super(geometry);
    this.interactive = true;
    this.assignEvents();
    this.createText();
  }

  /* METHODS */
  assignEvents() {
    this.on('mousedown', () => {
      if (btnDrawRadial.classList.contains('active') && objectMoving === null)
        setObjectMoving(this);
    });
    this.on('mousemove', (e) => {
      if (objectMoving === this)
        this.waypoint = new PIXI.Point(e.data.global.x, e.data.global.y);
    });
    this.on('mouseup', (e) => {
      if (objectMoving === this)
        this.finishMoving();
    });
  }

  createText() {
    let textStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: '600',
      fill: 'black',
      stroke: 'white',
      strokeThickness: 0.5,
    })
    this.#lblAngle = this.addChild(new PIXI.Text('', textStyle));
    this.#lblAngle.anchor.set(0, 0)
    this.#lblDistance = this.addChild(new PIXI.Text('', textStyle));
    this.#lblDistance.anchor.set(0.5, 1)
  }

  drawRadial() {
    this.clear()
      .lineStyle({ width: 2, color: 0x000000, alpha: 0.3 })
      .moveTo(0, 0)
      .lineTo(this.#waypoint.x, this.#waypoint.y)
      .lineStyle({ width: 2, color: 0x0000FF, alpha: 0.7 })
      .drawCircle(this.#waypoint.x, this.#waypoint.y, 6)
    this.hitArea = new PIXI.Rectangle(this.#waypoint.x - 6, this.#waypoint.y - 6, 12, 12);
  }

  drawText() {
    // convert to global 
    let thisPos = _v(this.toGlobal(this.position));
    let waypointPos = _v(this.toGlobal(this.#waypoint));
    let deltaX = thisPos.x - waypointPos.x;
    let deltaY = thisPos.y - waypointPos.y;

    let distance = Math.hypot(deltaX, deltaY) / DISTANCE_SCALE;
    this.#lblDistance.text = (Math.round(distance * 10) / 10).toFixed(1);

    let angle = radians_to_degrees(Math.atan2(deltaY, deltaX) - Math.PI / 2);
    angle = angle < 0 ? angle + 360 : angle;
    this.#lblAngle.text = Math.round(angle * 10) / 10 + '°';

    // round coordinates to prevent blurring
    this.#lblDistance.position.set(Math.round(this.#waypoint.x), Math.round(this.#waypoint.y - 9)); // -9 to seperate the text from waypoint circle
    this.#lblAngle.position.set(Math.round(this.#waypoint.x / 2), Math.round(this.#waypoint.y / 2));
  }

  finishMoving() {
    if (this.parent.containsPoint(this.toGlobal(this.#waypoint)))
      this.destroy()
  }

  /* PROPERTIES */
  get waypoint() {
    return this.#waypoint;
  }
  set waypoint(value) {
    this.#waypoint = this.toLocal(value);
    this.drawRadial();
    this.drawText();
  }
}