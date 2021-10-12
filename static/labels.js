class Stopwatch extends PIXI.Text {

    /* VARS */
    #_defaultValue;
    #_active;
    #_hr;
    #_min;
    #_sec;

    /* CONSTRUCTOR */
    constructor(text, style, canvas) {
        super(text, style, canvas);

        this._defaultValue = '00:00:00'
        this.reset();

        this.position.set((app.renderer.view.width / 2) - (this.width / 2), (this.height / 2));
        this.interactive = true;
        this.on('click', () => {
            this._active = !this._active;
            if (this._active) { this.startTimer() };
        });
    }

    /* METHODS */
    reset() {
        this._active = false;
        this._hr = 0;
        this._min = 0;
        this._sec = 0;
        this.text = this._defaultValue;
    }

    startTimer() {
        setTimeout(this.timerCycle.bind(this), 1000);
    }

    timerCycle() {
        if (!this._active) { return false };

        this._sec = parseInt(this._sec);
        this._min = parseInt(this._min);
        this._hr = parseInt(this._hr);

        this._sec = this._sec + 1;
        if (this._sec == 60) {
            this._min = this._min + 1;
            this._sec = 0;
        }
        if (this._min == 60) {
            this._hr = this._hr + 1;
            this._min = 0;
            this._sec = 0;
        }

        const check_display = value => { return (value < 10) ? '0' + value : value };
        this._sec = check_display(this._sec);
        this._min = check_display(this._min);
        this._hr = check_display(this._hr);

        this.text = this._hr + ':' + this._min + ':' + this._sec;

        setTimeout(this.timerCycle.bind(this), 1000);
    }
}