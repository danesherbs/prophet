import Tax from "./tax";

type Transaction = [number, number];

interface Props {
  tax: Tax;
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  contributionRate: number;
  description?: string;
}

class Super {
  tax: Tax;
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  contributionRate: number;
  description?: string;

  constructor({
    tax,
    transactions,
    yearlyInterestRate,
    contributionRate,
    description,
  }: Props) {
    this.tax = tax;
    this.transactions = transactions;
    this.yearlyInterestRate = yearlyInterestRate;
    this.contributionRate = contributionRate;
    this.description = description;
  }

  getTax() {
    /* istanbul ignore next */
    return this.tax;
  }

  getTransactions() {
    /* istanbul ignore next */
    return this.transactions;
  }

  getYearlyInterestRate() {
    /* istanbul ignore next */
    return this.yearlyInterestRate;
  }

  getContributionRate() {
    /* istanbul ignore next */
    return this.contributionRate;
  }

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  deposit(time: number, amount: number) {
    return new Super({
      tax: this.tax,
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        amount,
      ]),
      yearlyInterestRate: this.yearlyInterestRate,
      contributionRate: this.contributionRate,
    });
  }

  getMonthlyGrossSuperContribution(yearlyGrossSalary: number) {
    return (this.contributionRate * yearlyGrossSalary) / 12;
  }

  getMonthlyNetSuperContribution(yearlyGrossSalary: number) {
    return (
      this.getMonthlyGrossSuperContribution(yearlyGrossSalary) -
      this.tax.getMonthlySuperTax(
        this.getMonthlyGrossSuperContribution(yearlyGrossSalary)
      )
    );
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getBalance(time: number) {
    return this.transactions
      .map(
        ([then, amount]) =>
          amount * Math.pow(1 + this.getMonthlyInterestRate(), time - then)
      )
      .reduce((acc, amount) => acc + amount, 0);
  }
}

export default Super;
export { Props };
