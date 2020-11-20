import { Clock } from "../src/clock";


const clock = new Clock(0);

test('clock ticking correctly', () => {
    expect(clock.getTime()).toEqual(0);
    expect(clock.tick().getTime()).toEqual(1);
});
