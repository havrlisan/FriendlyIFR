/* NDB */
class NonDirectionalBeacon extends PIXI.Sprite {
    /* VARS */
    #canMove = false;

    /* CONSTRUCTOR */
    constructor(texture) {
        super(texture);

        this.interactive = true;
        this.width = 50;
        this.height = 50;
        this.anchor.set(0.5, 0.5);
        this.position.set(700, 200);
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
}