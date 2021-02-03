import Tax from "../../src/tax";
import parser, { parseTaxBrackets } from "../../src/parsers/tax";

const incomeTaxBrackets = [
  [[0.0, 50_000], 0.0],
  [[50_001, Infinity], 0.2],
];

const tax = new Tax({
  incomeTaxBrackets: [
    [[0.0, 50_000], 0.0],
    [[50_001, Infinity], 0.2],
  ],
  superTaxRate: 0.15,
  declared: new Array(),
  paid: new Array(),
});

const data = JSON.parse(JSON.stringify(tax));

test("tax object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(tax);
});

test("tax bracket parser is correctly parsing empty tax brackets", () => {
  expect(parseTaxBrackets(JSON.parse(JSON.stringify([])))).toStrictEqual([]);
});

test("tax bracket parser is correctly parsing", () => {
  expect(
    parseTaxBrackets(JSON.parse(JSON.stringify(incomeTaxBrackets)))
  ).toStrictEqual(incomeTaxBrackets);
});
