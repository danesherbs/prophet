import { Clock } from "../src/clock";


test('clock ticking correctly', () => {
    const clock = new Clock();

    for (let i = 0; i < 50; i++) {
        clock.tick();
    }

    expect(clock.getTime()).toEqual(50);
});


test('calculating months passed since time correctly', () => {
    const clock = new Clock();

    for (let i = 0; i < 50; i++) {
        clock.tick();
    }

    expect(clock.monthsPassedSince(0)).toEqual(50);
});
