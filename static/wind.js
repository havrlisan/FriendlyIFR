/* WIND - Singleton */

class Wind {

    /* VARS */
    #_speed;
    #_direction;

    /* CONSTRUCTOR */
    constructor(speed, direction) {
        if (Wind.instance) { return Wind.instance };

        this.speed = speed;
        this.direction = direction;
        Wind.instance = this;
    }

    /* PROPERTIES */
    get speed() { return this._speed };
    set speed(value) {
        this._speed = value // TODO: EnsureRange from 0 to 50 (?)
    };

    get direction() { return this._direction };
    set direction(value) {
        this._direction = value // TODO: EnsureRange from 0 to 360
    };
}