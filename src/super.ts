import Tax from "./tax";

type Transaction = [number, number];

interface Props {
  tax: Tax;
  transactions: Array<Transaction>;
  interestRate: number;
  contributionRate: number;
}

class Super {
  tax: Tax;
  transactions: Array<Transaction>;
  interestRate: number;
  contributionRate: number;

  constructor({ tax, transactions, interestRate, contributionRate }: Props) {
    this.tax = tax;
    this.transactions = transactions;
    this.interestRate = interestRate;
    this.contributionRate = contributionRate;
  }

  deposit(time: number, amount: number) {
    return new Super({
      tax: this.tax,
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        amount,
      ]),
      interestRate: this.interestRate,
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
    return Math.pow(1 + this.interestRate, 1 / 12) - 1;
  }

  getTransactions() {
    return this.transactions;
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
