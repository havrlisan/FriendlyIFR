/* INSTRUMENT CLASS */
class Instrument extends PIXI.Sprite {

    /* VARS */
    #_canMove = false;
    #_switchElement;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.visible = true; // should be false
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

    /* PROPERTIES */
    get switchElement() {
        return this._switchElement
    };
    set switchElement(value) {
        this._switchElement = value;

        this._switchElement.checked = this.visible;
        this._switchElement.onchange = () => {
            this.visible = this._switchElement.checked;
        }
    };
}

class DirectionalGyro extends Instrument {

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);
        this.switchElement = swInstrumentDG;
    }

}
