import Tax from "./tax";


interface Props {
    yearlyGrossSalary: number,
    yearlySalaryIncrease: number,
    tax: Tax,
    creationTime: number,
}

class Salary {

    yearlyGrossSalary: number;
    yearlySalaryIncrease: number;
    tax: Tax;
    creationTime: number;

    constructor({ yearlyGrossSalary, yearlySalaryIncrease, tax, creationTime }: Props) {
        this.yearlyGrossSalary = yearlyGrossSalary;
        this.yearlySalaryIncrease = yearlySalaryIncrease;
        this.tax = tax;
        this.creationTime = creationTime;
    }

    getYearlyGrossSalary(time: number) {
        return this.yearlyGrossSalary * Math.pow(1 + this.yearlySalaryIncrease, Math.floor((time - this.creationTime) / 12));
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


export default Salary;
export type { Props };
