import Tax, { Props as TaxProps } from "./tax";

type Transaction = [number, number];

interface Props {
  tax: TaxProps;
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  contributionRate: number;
  initialBalance?: number;
}

class Super {
  tax: Tax;
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  contributionRate: number;
  initialBalance?: number;

  constructor({
    tax,
    transactions,
    yearlyInterestRate,
    contributionRate,
    initialBalance,
  }: Props) {
    this.tax = new Tax(tax);
    this.transactions = transactions;
    this.yearlyInterestRate = yearlyInterestRate;
    this.contributionRate = contributionRate;
    this.initialBalance = initialBalance;
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

  getInitialBalance() {
    /* istanbul ignore next */
    return this.initialBalance === undefined ? 0 : this.initialBalance;
  }

  getProps() {
    /* istanbul ignore next */
    if (this.initialBalance) {
      return {
        tax: this.tax.getProps(),
        transactions: this.transactions,
        yearlyInterestRate: this.yearlyInterestRate,
        contributionRate: this.contributionRate,
        initialBalance: this.initialBalance,
      };
    }

    return {
      tax: this.tax.getProps(),
      transactions: this.transactions,
      yearlyInterestRate: this.yearlyInterestRate,
      contributionRate: this.contributionRate,
    };
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
      initialBalance: this.initialBalance,
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
    return (
      this.transactions
        .map(
          ([then, amount]) =>
            amount * Math.pow(1 + this.getMonthlyInterestRate(), time - then)
        )
        .reduce((acc, amount) => acc + amount, 0) +
      this.getInitialBalance() *
        Math.pow(1 + this.getMonthlyInterestRate(), time)
    );
  }
}

export default Super;
export type { Props };
