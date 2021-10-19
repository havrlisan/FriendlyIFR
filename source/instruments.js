/* INSTRUMENT CLASS */
class Instrument extends PIXI.Sprite {

    /* VARS */
    #canMove = false;
    #switchElement;

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
        this.on('mousedown', () => this.#canMove = true);
        this.on('mouseup', () => this.#canMove = false);
        this.on('mousemove', (e) => {
            if (this.#canMove) {
                this.position.set(e.data.global.x, e.data.global.y);
            }
        });
    }

    /* PROPERTIES */
    get switchElement() {
        return this.#switchElement
    };
    set switchElement(value) {
        this.#switchElement = value;

        this.#switchElement.checked = this.visible;
        this.#switchElement.onchange = () => {
            this.visible = this.#switchElement.checked;
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
