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
    get speed() {
        return this._speed
    };
    set speed(value) {
        if (!isNaN(value)) {
            if (value >= 0 && value <= MAX_WIND_SPEED) {
                this._speed = value;
                edWindSpeed.value = value;
            }
        };
    };

    get direction() {
        return this._direction
    };
    set direction(value) {        
        if (!isNaN(value)) {
            if (value >= 0 && value <= MAX_ANGLE) {
                this._direction = value;
                edWindDirection.value = value;
            }
        };
    };
}