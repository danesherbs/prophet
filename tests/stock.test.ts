import { Stock } from "../src/stock";


test('correct monthly rate of return', () => {
    const stock = new Stock(0.10, 0, 500, new Array());

    expect(500 * Math.pow(1 + stock.getMonthlyRateOfReturn(), 12)).toBeCloseTo(500 * 1.10, 10);
});

test('compounding correctly', () => {
    const stock = new Stock(0.10, 0, 500, new Array());

    expect(stock.getPrice(36)).toBeCloseTo(500 * Math.pow(1.10, 3), 10);
});
