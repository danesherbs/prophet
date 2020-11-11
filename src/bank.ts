import { Clock } from "./clock";


type Transaction = [number, number, string];

class Bank {

    transactions: Array<Transaction>;
    interestRate: number;
    clock: Clock;

    constructor(clock: Clock, transactions: Array<Transaction>, interestRate: number) {
        this.transactions = transactions;
        this.interestRate = interestRate;
        this.clock = clock;
    }

    deposit(amount: number, description: string) {
        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            this.clock,
            new Array<Transaction>(...this.transactions, [this.clock.getTime(), amount, description]),
            this.interestRate);
    }

    withdraw(amount: number, description: string) {
        // Throw a warning if withdrawing more than balance?

        if (Math.abs(amount) <= 1e-6) {
            return this;
        }

        return new Bank(
            this.clock,
            new Array<Transaction>(...this.transactions, [this.clock.getTime(), -amount, description]),
            this.interestRate);
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getTransactions() {
        return this.transactions;
    }

    getBalance() {
        return this.transactions
            .map(([time, amount]) => amount * (1 + this.getMonthlyInterestRate()) ** this.clock.monthsPassedSince(time))
            .reduce((acc, amount) => acc + amount, 0)
    }

}

export { Bank };