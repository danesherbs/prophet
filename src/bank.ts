type Transaction = [number, number, string];

interface Props {
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  initialBalance?: number;
}

class Bank {
  transactions: Array<Transaction>;
  yearlyInterestRate: number;
  initialBalance?: number;

  constructor({ transactions, yearlyInterestRate, initialBalance }: Props) {
    this.transactions = transactions;
    this.yearlyInterestRate = yearlyInterestRate;
    this.initialBalance = initialBalance;
  }
  getYearlyInterestRate() {
    /* istanbul ignore next */
    return this.yearlyInterestRate;
  }

  getTransactions() {
    /* istanbul ignore next */
    return this.transactions;
  }

  getInitialBalance() {
    return this.initialBalance === undefined ? 0 : this.initialBalance;
  }

  getProps(): Props {
    /* istanbul ignore next */
    if (this.initialBalance) {
      return {
        transactions: this.transactions,
        yearlyInterestRate: this.yearlyInterestRate,
        initialBalance: this.initialBalance,
      };
    }

    return {
      transactions: this.transactions,
      yearlyInterestRate: this.yearlyInterestRate,
    };
  }

  deposit(time: number, amount: number, description: string) {
    return new Bank({
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        amount,
        description,
      ]),
      yearlyInterestRate: this.yearlyInterestRate,
      initialBalance: this.initialBalance,
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
      initialBalance: this.initialBalance,
    });
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getBalance(now: number) {
    return (
      this.transactions
        .map(
          ([then, amount]) =>
            amount * Math.pow(1 + this.getMonthlyInterestRate(), now - then)
        )
        .reduce((acc, amount) => acc + amount, 0) +
      this.getInitialBalance() *
        Math.pow(1 + this.getMonthlyInterestRate(), now)
    );
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
