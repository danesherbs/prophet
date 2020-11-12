import { Clock } from "../src/clock";


test('clock ticking correctly', () => {
    const clock = new Clock(0);

    expect(clock.getTime()).toEqual(0);
    expect(clock.tick().getTime()).toEqual(1);
});
