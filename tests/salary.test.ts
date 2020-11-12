import { Tax } from "../src/tax";
import { Salary } from "../src/salary";


test('correct yearly salary increases', () => {
    const tax = new Tax(new Array(), new Array());
    const salary = new Salary({ salary: 120_000, yearSalaryIncrease: 0.05, tax: tax, creationTime: 0 });

    expect(salary.getSalary(12 * 0)).toBeCloseTo(120_000 * Math.pow(1.05, 0), 10);
    expect(salary.getSalary(12 * 1)).toBeCloseTo(120_000 * Math.pow(1.05, 1), 10);
    expect(salary.getSalary(12 * 2)).toBeCloseTo(120_000 * Math.pow(1.05, 2), 10);
    expect(salary.getSalary(12 * 3)).toBeCloseTo(120_000 * Math.pow(1.05, 3), 10);
});
