import Tax from "./tax";

interface Props {
  tax: Tax;
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  creationTime: number;
  description?: string;
}

class Salary {
  tax: Tax;
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  creationTime: number;
  description?: string;

  constructor({
    tax,
    yearlyGrossSalary,
    yearlySalaryIncrease,
    creationTime,
    description,
  }: Props) {
    this.tax = tax;
    this.yearlyGrossSalary = yearlyGrossSalary;
    this.yearlySalaryIncrease = yearlySalaryIncrease;
    this.creationTime = creationTime;
    this.description = description;
  }

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  getTax() {
    /* istanbul ignore next */
    return this.tax;
  }

  getCreationTime() {
    /* istanbul ignore next */
    return this.creationTime;
  }

  getYearlySalaryIncrease() {
    /* istanbul ignore next */
    return this.yearlySalaryIncrease;
  }

  getProps(): Props {
    /* istanbul ignore next */
    return {
      yearlyGrossSalary: this.yearlyGrossSalary,
      yearlySalaryIncrease: this.yearlySalaryIncrease,
      tax: this.tax,
      creationTime: this.creationTime,
      description: this.description,
    };
  }

  getYearlyGrossSalary(time: number) {
    return (
      this.yearlyGrossSalary *
      Math.pow(
        1 + this.yearlySalaryIncrease,
        Math.floor((time - this.creationTime) / 12)
      )
    );
  }

  getYearlyNetSalary(time: number) {
    return (
      this.getYearlyGrossSalary(time) -
      this.tax.getYearlyIncomeTax(this.yearlyGrossSalary)
    );
  }

  getMonthlyGrossSalary(time: number) {
    return this.getYearlyGrossSalary(time) / 12.0;
  }

  getMonthlyNetSalary(time: number) {
    return (
      this.getMonthlyGrossSalary(time) -
      this.tax.getMonthlyIncomeTax(this.getYearlyGrossSalary(time))
    );
  }

  getMonthlyNetSuperContribution(time: number) {
    return (
      this.getMonthlyGrossSalary(time) -
      this.tax.getMonthlySuperTax(this.getMonthlyGrossSalary(time))
    );
  }
}

export default Salary;
export type { Props };
