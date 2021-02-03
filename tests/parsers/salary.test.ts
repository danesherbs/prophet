import Salary from "../../src/salary";
import Tax from "../../src/tax";
import parser from "../../src/parsers/salary";

const tax = new Tax({
  incomeTaxBrackets: new Array(),
  superTaxRate: 0.15,
  declared: new Array(),
  paid: new Array(),
});

const salary = new Salary({
  tax: tax,
  yearlyGrossSalary: 120_000,
  yearlySalaryIncrease: 0.05,
  creationTime: 0,
});

const data = JSON.parse(JSON.stringify(salary));

test("salary object is correctly parsed", () => {
  expect(parser(data)).toStrictEqual(salary);
});
