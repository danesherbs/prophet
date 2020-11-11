import { Clock } from "../src/clock";
import { Stock } from "../src/stock";

test('compounding correctly', () => {
    const clock = new Clock();
    const stock = new Stock(clock, 0.10, 500, new Array());

    for (let i = 0; i < 100; i++) {
        clock.tick();
    }

    expect(stock.getPrice()).toEqual(500 * Math.pow(1.1, 100));
});
