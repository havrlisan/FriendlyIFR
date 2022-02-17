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
    this.#speed = value;
    edWindSpeed.value = value;
  };

  get direction() {
    return this.#direction
  };
  set direction(value) {
    this.#direction = value;
    edWindDirection.value = value;
  };
}