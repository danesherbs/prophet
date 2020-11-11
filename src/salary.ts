import { Tax } from "./tax";
import { Clock } from "./clock";


class Salary {

    clock: Clock;
    salary: number;
    yearSalaryIncrease: number;
    tax: Tax;
    creationTime: number;

    constructor(clock: Clock, salary: number, yearSalaryIncrease: number, tax: Tax) {
        this.clock = clock;
        this.salary = salary;
        this.yearSalaryIncrease = yearSalaryIncrease;
        this.tax = tax;
        this.creationTime = clock.getTime()
    }

    getSalary() {
        return this.salary * (1 + this.yearSalaryIncrease) ** this.clock.yearsPassedSince(this.creationTime);
    }

    getMonthlyGrossSalary() {
        return this.getSalary() / 12.0;
    }

    getMonthlyNetSalary() {
        return this.getMonthlyGrossSalary() - this.tax.getMonthlyIncomeTax(this.getMonthlyGrossSalary());
    }

    getMonthlyNetSuperContribution() {
        return this.getMonthlyGrossSalary() - this.tax.getMonthlySuperTax(this.getMonthlyGrossSalary());
    }

}

export { Salary };