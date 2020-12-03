import Stock from "../src/stock";

const stock = new Stock({
  rateOfReturn: 0.1,
  initialTime: 0,
  initialPrice: 500,
  transactions: new Array(),
});

test("correct monthly rate of return", () => {
  expect(500 * Math.pow(1 + stock.getMonthlyRateOfReturn(), 12)).toBeCloseTo(
    500 * 1.1,
    10
  );
});

test("compounding correctly", () => {
  expect(stock.getPrice(36)).toBeCloseTo(500 * Math.pow(1.1, 3), 10);
});

test("correct number of units", () => {
  const stock = new Stock({
    rateOfReturn: 0.1,
    initialTime: 0,
    initialPrice: 500,
    transactions: [
      [0, 10],
      [14, 2],
    ],
  });

  expect(stock.getNumberOfUnits()).toEqual(12);
});

test("buy units buys correct number", () => {
  expect(stock.buyUnits(0, 5).getNumberOfUnits()).toEqual(5);
  expect(() => {
    stock.buyUnits(0, 0);
  }).toThrow(RangeError);
  expect(() => {
    stock.buyUnits(0, -10);
  }).toThrow(RangeError);
  expect(() => {
    stock.buyUnits(0.1, 1);
  }).toThrow(TypeError);
  expect(() => {
    stock.buyUnits(1, 1.2);
  }).toThrow(TypeError);
});

test("sell units sells correct number", () => {
  const stock = new Stock({
    rateOfReturn: 0.1,
    initialTime: 0,
    initialPrice: 500,
    transactions: [
      [0, 10],
      [14, 2],
    ],
  });

  expect(stock.sellUnits(0, 5).getNumberOfUnits()).toEqual(7);
  expect(() => {
    stock.sellUnits(0, 0);
  }).toThrow(RangeError);
  expect(() => {
    stock.sellUnits(0, -10);
  }).toThrow(RangeError);
  expect(() => {
    stock.sellUnits(1, 14);
  }).toThrow(RangeError);
  expect(() => {
    stock.sellUnits(0.1, 1);
  }).toThrow(TypeError);
  expect(() => {
    stock.sellUnits(1, 1.2);
  }).toThrow(TypeError);
});
