type Transaction = [number, number, string];

class Bank {

    transactions: Array<Transaction>;
    interestRate: number;

    constructor({ transactions, interestRate }: { transactions: Array<Transaction>; interestRate: number; }) {
        this.transactions = transactions;
        this.interestRate = interestRate;
    }

    deposit(time: number, amount: number, description: string) {
        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            { transactions: new Array<Transaction>(...this.transactions, [time, amount, description]), interestRate: this.interestRate });
    }

    withdraw(time: number, amount: number, description: string) {
        // Throw a warning if withdrawing more than balance?

        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            { transactions: new Array<Transaction>(...this.transactions, [time, -amount, description]), interestRate: this.interestRate });
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getTransactions() {
        return this.transactions;
    }

    getBalance(now: number) {
        return this.transactions
            .map(([then, amount]) => amount * Math.pow(1 + this.getMonthlyInterestRate(), now - then))
            .reduce((acc, amount) => acc + amount, 0)
    }

}

export { Bank };