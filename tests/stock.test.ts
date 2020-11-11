import { Clock } from "../src/clock";
import { Stock } from "../src/stock";


test('initial price doesnt change over time', () => {
    const clock = new Clock();
    const stock = new Stock(clock, 0.10, clock.getTime(), 500, new Array());

    for (let i = 0; i < 50; i++) {
        clock.tick();
    }

    expect(stock.getInitialPrice()).toEqual(500);
});

test('correct monthly rate of return', () => {
    const clock = new Clock();
    const stock = new Stock(clock, 0.10, clock.getTime(), 500, new Array());

    for (let i = 0; i < 12; i++) {
        clock.tick();
    }

    expect(500 * Math.pow(1 + stock.getMonthlyRateOfReturn(), 12)).toBeCloseTo(500 * 1.10, 10);
});

test('compounding correctly', () => {
    const clock = new Clock();
    const stock = new Stock(clock, 0.10, clock.getTime(), 500, new Array());

    for (let i = 0; i < 36; i++) {
        clock.tick();
    }

    expect(stock.getPrice()).toBeCloseTo(500 * Math.pow(1.10, 3), 10);
});
