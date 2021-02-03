import Super from "../../src/super";
import Tax from "../../src/tax";
import parser from "../../src/parsers/super";

const tax = new Tax({
  incomeTaxBrackets: [],
  superTaxRate: 0.15,
  declared: [],
  paid: [],
});

const superan = new Super({
  tax: tax,
  transactions: [],
  yearlyInterestRate: 0.1,
  contributionRate: 0.125,
});

const data = JSON.parse(JSON.stringify(superan));

test("super object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(superan);
});
