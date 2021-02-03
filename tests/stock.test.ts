import Stock from "../src/stock";

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
  initialTime: 0,
});

test("correct monthly rate of return", () => {
  expect(
    stock.getTotalValue(0) * Math.pow(1 + stock.getMonthlyRateOfReturn(), 12)
  ).toBeCloseTo(stock.getTotalValue(0) * (1 + stock.getRateOfReturn()), 10);
});

test("compounding correctly", () => {
  expect(stock.getTotalValue(36)).toBeCloseTo(
    stock.getTotalValue(0) * Math.pow(1.1, 3),
    10
  );
});

test("correct number of units", () => {
  expect(stock.getNumberOfUnits()).toEqual(10);
});
