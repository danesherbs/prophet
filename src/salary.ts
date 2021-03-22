import Tax, { Props as TaxProps } from "./tax";

interface Props {
  tax: TaxProps;
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  monthsSincePurchase?: number;
}

class Salary {
  tax: Tax;
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  monthsSincePurchase: number;

  constructor({
    tax,
    yearlyGrossSalary,
    yearlySalaryIncrease,
    monthsSincePurchase,
  }: Props) {
    this.tax = new Tax(tax);
    this.yearlyGrossSalary = yearlyGrossSalary;
    this.yearlySalaryIncrease = yearlySalaryIncrease;
    this.monthsSincePurchase = monthsSincePurchase || 0;
  }

  getTax() {
    /* istanbul ignore next */
    return this.tax;
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
      tax: this.tax.getProps(),
      monthsSincePurchase: this.monthsSincePurchase,
    };
  }

  getYearlyGrossSalary() {
    return this.yearlyGrossSalary;
  }

  getYearlyNetSalary() {
    return (
      this.yearlyGrossSalary -
      this.tax.getYearlyIncomeTax(this.yearlyGrossSalary)
    );
  }

  getMonthlyGrossSalary() {
    return this.yearlyGrossSalary / 12.0;
  }

  getMonthlyNetSalary() {
    return (
      this.getMonthlyGrossSalary() -
      this.tax.getMonthlyIncomeTax(this.yearlyGrossSalary)
    );
  }

  getMonthlyNetSuperContribution() {
    return (
      this.getMonthlyGrossSalary() -
      this.tax.getMonthlySuperTax(this.getMonthlyGrossSalary())
    );
  }

  waitOneMonth() {
    return new Salary({
      tax: this.tax,
      yearlyGrossSalary:
        (this.monthsSincePurchase + 1) % 12 === 0
          ? this.yearlyGrossSalary * (1 + this.getYearlySalaryIncrease())
          : this.yearlyGrossSalary,
      yearlySalaryIncrease: this.yearlySalaryIncrease,
      monthsSincePurchase: this.monthsSincePurchase + 1,
    });
  }

  waitOneYear() {
    let salary: Salary = this;

    for (let i = 0; i < 12; i++) {
      salary = salary.waitOneMonth();
    }

    return salary;
  }
}

export default Salary;
export type { Props };
