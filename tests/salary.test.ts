import { Tax } from "../src/tax";
import { Salary } from "../src/salary";


test('correct yearly salary increases', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearSalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getSalary(12 * 0)).toBeCloseTo(120_000 * Math.pow(1.05, 0), 10);
    expect(salary.getSalary(12 * 1)).toBeCloseTo(120_000 * Math.pow(1.05, 1), 10);
    expect(salary.getSalary(12 * 2)).toBeCloseTo(120_000 * Math.pow(1.05, 2), 10);
    expect(salary.getSalary(12 * 3)).toBeCloseTo(120_000 * Math.pow(1.05, 3), 10);
});

test('correct gross monthly salary', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(),
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearSalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getMonthlyGrossSalary(0)).toEqual(10_000);
});

test('correct net monthly salary', () => {
    const tax = new Tax({
        incomeTaxBrackets: new Array(
            [[0.0, 20_000], 0.0],
            [[20_001, 60_000], 0.2],
            [[60_001, Infinity], 0.5],
        ),
        declared: new Array(),
        paid: new Array()
    });

    const salary = new Salary({
        tax: tax,
        salary: 120_000,
        yearSalaryIncrease: 0.05,
        creationTime: 0
    });

    expect(salary.getMonthlyNetSalary(0)).toEqual(salary.getMonthlyGrossSalary(0) - tax.getMonthlyIncomeTax(120_000));
    expect(salary.getMonthlyNetSalary(10)).toEqual(salary.getMonthlyGrossSalary(10) - tax.getMonthlyIncomeTax(salary.getSalary(10)));
});
