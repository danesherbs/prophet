type Transaction = [number, number, string];

interface Props {
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  description?: string;
}

class Bank {
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  description?: string;

  constructor({ transactions, yearlyInterestRate, description }: Props) {
    this.transactions = transactions;
    this.yearlyInterestRate = yearlyInterestRate;
    this.description = description;
  }

  deposit(time: number, amount: number, description: string) {
    return new Bank({
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        amount,
        description,
      ]),
      yearlyInterestRate: this.yearlyInterestRate,
    });
  }

  withdraw(time: number, amount: number, description: string) {
    return new Bank({
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        -amount,
        description,
      ]),
      yearlyInterestRate: this.yearlyInterestRate,
    });
  }

  getYearlyInterestRate() {
    return this.yearlyInterestRate;
  }

  getDescription() {
    return this.description;
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getTransactions() {
    return this.transactions;
  }

  getBalance(now: number) {
    return this.transactions
      .map(
        ([then, amount]) =>
          amount * Math.pow(1 + this.getMonthlyInterestRate(), now - then)
      )
      .reduce((acc, amount) => acc + amount, 0);
  }

  isValidTransactions() {
    let balance = 0;

    for (var [, amount] of this.transactions) {
      balance += amount;

      if (balance < 0) {
        return false;
      }
    }

    return true;
  }

  isValidInterestRate() {
    return 0 <= this.yearlyInterestRate && this.yearlyInterestRate <= 0.07;
  }

  isValid() {
    return this.isValidInterestRate() && this.isValidTransactions();
  }
}

export default Bank;
export type { Props };
