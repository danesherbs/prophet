import { House } from "../src/house";
import { Tax } from "../src/tax";


test('house value appreciating correctly', () => {
    const tax = new Tax(new Array(), new Array());
    const house = new House(tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02, 0);

    expect(house.getHouseValue(36)).toBeCloseTo(600_000 * Math.pow(1.03, 3), 8);
});

test('house equity is value minus loan', () => {
    const tax = new Tax(new Array(), new Array());
    const house = new House(tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02, 0);

    expect(house.getEquity(0)).toEqual(50_000);
    expect(house.getEquity(36)).toBeCloseTo(600_000 * Math.pow(1.03, 3) - 550_000, 8);
});

test('house rental income grows correctly', () => {
    const tax = new Tax(new Array(), new Array());
    const house = new House(tax, 50_000, 550_000, 0.03, 0.03, 2_500, 0.03, 0.02, 0);

    expect(house.getMonthlyGrossRentalIncome(0)).toEqual(2_500);
    expect(house.getMonthlyGrossRentalIncome(36)).toBeCloseTo(2_500 * Math.pow(1.03, 3), 8);
});
