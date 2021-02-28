import Stock from "../src/stock";

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
});

test("correct monthly rate of return", () => {
  expect(
    stock.getTotalValue() * Math.pow(1 + stock.getMonthlyRateOfReturn(), 12)
  ).toBeCloseTo(stock.getTotalValue() * (1 + stock.getRateOfReturn()), 10);
});

test("compounding correctly", () => {
  expect(
    stock
      .waitOneMonth()
      .waitOneMonth()
      .waitOneMonth()
      .waitOneMonth()
      .waitOneMonth()
      .getTotalValue()
  ).toBeCloseTo(
    stock.getTotalValue() * Math.pow(1 + stock.getMonthlyRateOfReturn(), 5),
    10
  );
});

test("correct number of units", () => {
  expect(stock.getNumberOfUnits()).toEqual(10);
});
