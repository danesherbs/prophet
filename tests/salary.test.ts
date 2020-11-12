import { Tax } from "../src/tax";
import { Salary } from "../src/salary";


test('correct yearly salary increases', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearlySalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getYearlyGrossSalary(12 * 0)).toBeCloseTo(120_000 * Math.pow(1.05, 0), 10);
    expect(salary.getYearlyGrossSalary(12 * 1)).toBeCloseTo(120_000 * Math.pow(1.05, 1), 10);
    expect(salary.getYearlyGrossSalary(12 * 2)).toBeCloseTo(120_000 * Math.pow(1.05, 2), 10);
    expect(salary.getYearlyGrossSalary(12 * 3)).toBeCloseTo(120_000 * Math.pow(1.05, 3), 10);
});

test('correct gross monthly salary', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearlySalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getMonthlyGrossSalary(0)).toEqual(10_000);
});

test('correct net monthly salary', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 60_000], 0.0],
            [[60_001, Infinity], 0.2],
        ),
        superTaxRate: 0.15,
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearlySalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getMonthlyNetSalary(0)).toEqual(10_000 - (60_000 - 1) * 0.2 / 12);
    expect(salary.getMonthlyNetSalary(10)).toEqual(salary.getMonthlyGrossSalary(10) - tax.getMonthlyIncomeTax(salary.getYearlyGrossSalary(10)));
});
