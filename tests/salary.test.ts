import Tax from "../src/tax";
import Salary from "../src/salary";

test("correct yearly salary increases", () => {
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

  expect(salary.getYearlyGrossSalary(12 * 0)).toBeCloseTo(
    120_000 * Math.pow(1.05, 0),
    10
  );

  expect(salary.getYearlyGrossSalary(12 * 1)).toBeCloseTo(
    120_000 * Math.pow(1.05, 1),
    10
  );

  expect(salary.getYearlyGrossSalary(12 * 2)).toBeCloseTo(
    120_000 * Math.pow(1.05, 2),
    10
  );

  expect(salary.getYearlyGrossSalary(12 * 3)).toBeCloseTo(
    120_000 * Math.pow(1.05, 3),
    10
  );
});

test("correct gross monthly salary", () => {
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

  expect(salary.getMonthlyGrossSalary(0)).toEqual(10_000);

  expect(salary.getMonthlyGrossSalary(36)).toEqual(
    (120_000 * Math.pow(1.05, 3)) / 12
  );
});

test("correct net monthly salary", () => {
  const tax = new Tax({
    incomeTaxBrackets: new Array(
      [[0.0, 60_000], 0.0],
      [[60_001, Infinity], 0.2]
    ),
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

  expect(salary.getMonthlyNetSalary(0)).toEqual(
    10_000 - ((60_000 - 1) * 0.2) / 12
  );

  expect(salary.getMonthlyNetSalary(36)).toEqual(
    salary.getMonthlyGrossSalary(36) -
      tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(36))
  );
});

test("correct yearly net salary with rough ATO tax rates", () => {
  const tax = new Tax({
    incomeTaxBrackets: new Array(
      [[0.0, 18_200], 0.0],
      [[18_201, 37_000], 0.19],
      [[37_001, 87_000], 0.325],
      [[87_001, 180_000], 0.37],
      [[180_001, Infinity], 0.45]
    ),
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

  expect(salary.getYearlyNetSalary(0)).toBeCloseTo(87_968.885, 2);
});

test("correct net super contributions", () => {
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

  expect(salary.getMonthlyNetSuperContribution(0)).toEqual(
    (120_000 / 12) * 0.85
  );

  expect(salary.getMonthlyNetSuperContribution(36)).toEqual(
    ((120_000 * Math.pow(1.05, 3)) / 12) * 0.85
  );
});
