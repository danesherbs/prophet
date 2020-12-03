type Transaction = [number, number, string];

class Bank {
  transactions: Array<Transaction>;
  interestRate: number;

  constructor({
    transactions,
    interestRate,
  }: {
    transactions: Array<Transaction>;
    interestRate: number;
  }) {
    this.transactions = transactions;
    this.interestRate = interestRate;
  }

  deposit(time: number, amount: number, description: string) {
    return new Bank({
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        amount,
        description,
      ]),
      interestRate: this.interestRate,
    });
  }

  withdraw(time: number, amount: number, description: string) {
    return new Bank({
      transactions: new Array<Transaction>(...this.transactions, [
        time,
        -amount,
        description,
      ]),
      interestRate: this.interestRate,
    });
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.interestRate, 1 / 12) - 1;
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
    return 0 <= this.interestRate && this.interestRate <= 0.07;
  }

  isValid() {
    return this.isValidInterestRate() && this.isValidTransactions();
  }
}

export default Bank;
