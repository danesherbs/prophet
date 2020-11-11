import { Clock } from "./clock";


type Transaction = [number, number];

class Super {

    transactions: Array<Transaction>;
    interestRate: number;
    clock: Clock;

    constructor(clock: Clock, transactions: Array<Transaction>, interestRate: number) {
        this.transactions = transactions;
        this.interestRate = interestRate;
        this.clock = clock;
    }

    deposit(amount: number) {
        return new Super(
            this.clock,
            new Array<Transaction>(...this.transactions, [this.clock.getTime(), amount]),
            this.interestRate);
    }

    getMonthlySuperContribution(amount: number) {
        return 0.125 * amount;
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

export { Super };