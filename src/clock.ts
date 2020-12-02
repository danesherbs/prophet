class Clock {

    time: number;

    constructor(time: number) {
        this.time = time;
    }

    tick() {
        return new Clock(this.time + 1);
    }

    getTime() {
        return this.time;
    }
}

export default Clock;