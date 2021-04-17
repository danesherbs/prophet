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
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  expect(salary.getYearlyGrossSalary()).toBeCloseTo(
    120_000 * Math.pow(1.05, 0),
    10
  );

  expect(salary.waitOneYear().getYearlyGrossSalary()).toBeCloseTo(
    120_000 * Math.pow(1.05, 1),
    10
  );

  expect(salary.waitOneYear().waitOneYear().getYearlyGrossSalary()).toBeCloseTo(
    120_000 * Math.pow(1.05, 2),
    10
  );

  expect(
    salary.waitOneYear().waitOneYear().waitOneYear().getYearlyGrossSalary()
  ).toBeCloseTo(120_000 * Math.pow(1.05, 3), 10);
});

test("correct gross monthly salary", () => {
  const tax = new Tax({
    incomeTaxBrackets: new Array(),
    superTaxRate: 0.15,
    declared: new Array(),
    paid: new Array(),
  });

  const salary = new Salary({
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  expect(salary.getMonthlyGrossSalary()).toEqual(10_000);

  expect(
    salary.waitOneYear().waitOneYear().waitOneYear().getMonthlyGrossSalary()
  ).toBeCloseTo((120_000 * Math.pow(1.05, 3)) / 12, 8);
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
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  expect(salary.getMonthlyNetSalary({ tax })).toEqual(
    10_000 - ((60_000 - 1) * 0.2) / 12
  );

  const future = salary.waitOneYear().waitOneYear().waitOneYear();

  expect(future.getMonthlyNetSalary({ tax })).toEqual(
    future.getMonthlyGrossSalary() -
      tax.getMonthlyIncomeTax(future.getYearlyGrossSalary())
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
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  expect(salary.getYearlyNetSalary({ tax })).toBeCloseTo(87_968.885, 2);
});

test("correct net super contributions", () => {
  const tax = new Tax({
    incomeTaxBrackets: new Array(),
    superTaxRate: 0.15,
    declared: new Array(),
    paid: new Array(),
  });

  const salary = new Salary({
    yearlyGrossSalary: 120_000,
    yearlySalaryIncrease: 0.05,
  });

  expect(salary.getMonthlyNetSuperContribution({ tax })).toEqual(
    (120_000 / 12) * 0.85
  );

  expect(
    salary
      .waitOneYear()
      .waitOneYear()
      .waitOneYear()
      .getMonthlyNetSuperContribution({ tax })
  ).toBeCloseTo(((120_000 * Math.pow(1.05, 3)) / 12) * 0.85, 8);
});
