import Tax, { Props as TaxProps } from "./tax";

interface Props {
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  monthsSincePurchase?: number;
}

class Salary {
  yearlyGrossSalary: number;
  yearlySalaryIncrease: number;
  monthsSincePurchase: number;

  constructor({
    yearlyGrossSalary,
    yearlySalaryIncrease,
    monthsSincePurchase,
  }: Props) {
    this.yearlyGrossSalary = yearlyGrossSalary;
    this.yearlySalaryIncrease = yearlySalaryIncrease;
    this.monthsSincePurchase = monthsSincePurchase || 0;
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
      monthsSincePurchase: this.monthsSincePurchase,
    };
  }

  getYearlyGrossSalary() {
    return this.yearlyGrossSalary;
  }

  getYearlyNetSalary({ tax }: { tax: TaxProps }) {
    return (
      this.yearlyGrossSalary -
      new Tax(tax).getYearlyIncomeTax(this.yearlyGrossSalary)
    );
  }

  getMonthlyGrossSalary() {
    return this.yearlyGrossSalary / 12.0;
  }

  getMonthlyNetSalary({ tax }: { tax: TaxProps }) {
    return (
      this.getMonthlyGrossSalary() -
      new Tax(tax).getMonthlyIncomeTax(this.yearlyGrossSalary)
    );
  }

  getMonthlyNetSuperContribution({ tax }: { tax: TaxProps }) {
    return (
      this.getMonthlyGrossSalary() -
      new Tax(tax).getMonthlySuperTax(this.getMonthlyGrossSalary())
    );
  }

  waitOneMonth() {
    return new Salary({
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
