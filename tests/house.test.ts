import { Clock } from "../src/clock";
import { House } from "../src/house";
import { Tax } from "../src/tax";


test('house value appreciating correctly', () => {
    const clock = new Clock();
    const tax = new Tax(clock, new Array(), new Array());
    const house = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02);

    for (let i = 0; i < 36; i++) {
        clock.tick();
    }

    expect(house.getHouseValue()).toBeCloseTo(600_000 * Math.pow(1.03, 3), 8);
});

test('house equity is value minus loan', () => {
    const clock = new Clock();
    const tax = new Tax(clock, new Array(), new Array());
    const house = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02);

    expect(house.getEquity()).toEqual(50_000);

    for (let i = 0; i < 36; i++) {
        clock.tick();
    }

    expect(house.getEquity()).toBeCloseTo(600_000 * Math.pow(1.03, 3) - 550_000, 8);
});

test('house rental income grows correctly', () => {
    const clock = new Clock();
    const tax = new Tax(clock, new Array(), new Array());
    const house = new House(clock, tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02);

    expect(house.getMonthlyGrossRentalIncome()).toEqual(2_500);

    for (let i = 0; i < 36; i++) {
        clock.tick();
    }

    expect(house.getMonthlyGrossRentalIncome()).toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});
