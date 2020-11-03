class Clock {

    time = 0;

    tick() {
        this.time += 1;
    }

    getTime() {
        return this.time;
    }

    monthsPassedSince(time: number) {
        return this.time - time;
    }

    yearsPassedSince(time: number) {
        return Math.floor((this.getTime() - time) / 12);
    }

}

export { Clock };