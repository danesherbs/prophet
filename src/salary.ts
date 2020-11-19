import { Tax } from "./tax";


class Salary {

    yearlyGrossSalary: number;
    yearSalaryIncrease: number;
    tax: Tax;
    creationTime: number;

    constructor({
        yearlyGrossSalary,
        yearlySalaryIncrease,
        tax,
        creationTime
    }: {
        yearlyGrossSalary: number;
        yearlySalaryIncrease: number;
        tax: Tax;
        creationTime: number;
    }) {
        this.yearlyGrossSalary = yearlyGrossSalary;
        this.yearSalaryIncrease = yearlySalaryIncrease;
        this.tax = tax;
        this.creationTime = creationTime;
    }

    getYearlyGrossSalary(time: number) {
        return this.yearlyGrossSalary * Math.pow(1 + this.yearSalaryIncrease, Math.floor((time - this.creationTime) / 12));
    }

    getYearlyNetSalary(time: number) {
        return this.getYearlyGrossSalary(time) - this.tax.getYearlyIncomeTax(this.yearlyGrossSalary);
    }

    getMonthlyGrossSalary(time: number) {
        return this.getYearlyGrossSalary(time) / 12.0;
    }

    getMonthlyNetSalary(time: number) {
        return this.getMonthlyGrossSalary(time) - this.tax.getMonthlyIncomeTax(this.getYearlyGrossSalary(time));
    }

    getMonthlyNetSuperContribution(time: number) {
        return this.getMonthlyGrossSalary(time) - this.tax.getMonthlySuperTax(this.getMonthlyGrossSalary(time));
    }

}

export { Salary };