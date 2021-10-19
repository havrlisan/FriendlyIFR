/* WIND - Singleton */

class Wind {

    /* VARS */
    #speed;
    #direction;

    /* CONSTRUCTOR */
    constructor(speed, direction) {
        if (Wind.instance) { return Wind.instance };

        this.speed = speed;
        this.direction = direction;
        Wind.instance = this;
    }

    /* PROPERTIES */
    get speed() {
        return this.#speed
    };
    set speed(value) {
        if (!isNaN(value)) {
            if (value >= 0 && value <= MAX_WIND_SPEED) {
                this.#speed = value;
                edWindSpeed.value = value;
            }
        };
    };

    get direction() {
        return this.#direction
    };
    set direction(value) {        
        if (!isNaN(value)) {
            if (value >= 0 && value <= MAX_ANGLE) {
                this.#direction = value;
                edWindDirection.value = value;
            }
        };
    };
}