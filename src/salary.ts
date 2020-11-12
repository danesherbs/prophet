import { Tax } from "./tax";


class Salary {

    salary: number;
    yearSalaryIncrease: number;
    tax: Tax;
    creationTime: number;

    constructor({ salary, yearSalaryIncrease, tax, creationTime }: { salary: number; yearSalaryIncrease: number; tax: Tax; creationTime: number; }) {
        this.salary = salary;
        this.yearSalaryIncrease = yearSalaryIncrease;
        this.tax = tax;
        this.creationTime = creationTime;
    }

    getSalary(time: number) {
        return this.salary * Math.pow(1 + this.yearSalaryIncrease, Math.floor((time - this.creationTime) / 12));
    }

    getMonthlyGrossSalary(time: number) {
        return this.getSalary(time) / 12.0;
    }

    getMonthlyNetSalary(time: number) {
        return this.getMonthlyGrossSalary(time) - this.tax.getMonthlyIncomeTax(this.getMonthlyGrossSalary(time));
    }

    getMonthlyNetSuperContribution(time: number) {
        return this.getMonthlyGrossSalary(time) - this.tax.getMonthlySuperTax(this.getMonthlyGrossSalary(time));
    }

}

export { Salary };