
class Instrument extends PIXI.Sprite {
    /* VARS */
    #_canMove = false;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.visible = true; // set to false for default
        this.interactive = true;
        this.width = 200;
        this.height = 200;
        this.anchor.set(0.5, 0.5);
        this.position.set(200, 200);
        this.assignEvents();
    }

    /* METHODS */
    assignEvents() {
        this.on('mousedown', () => this._canMove = true);
        this.on('mouseup', () => this._canMove = false);
        this.on('mousemove', (e) => {
            if (this._canMove) {
                this.position.set(e.data.global.x, e.data.global.y);
            }
        });
    }
}

class DirectionalGyro extends Instrument {

    constructor(texture) {
        super(texture);
    }



}
