import Stock from "../../src/stock";
import parser from "../../src/parsers/stock";

const stock = new Stock({
  numberOfUnits: 10,
  pricePerUnit: 500,
  rateOfReturn: 0.1,
  initialTime: 0,
});

const data = JSON.parse(JSON.stringify(stock));

test("stock object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(stock);
});
