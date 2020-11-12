type Transaction = [number, number];

class Super {

    transactions: Array<Transaction>;
    interestRate: number;

    constructor(transactions: Array<Transaction>, interestRate: number) {
        this.transactions = transactions;
        this.interestRate = interestRate;
    }

    deposit(time: number, amount: number) {
        return new Super(
            new Array<Transaction>(...this.transactions, [time, amount]),
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

    getBalance(time: number) {
        return this.transactions
            .map(([then, amount]) => amount * Math.pow(1 + this.getMonthlyInterestRate(), time - then))
            .reduce((acc, amount) => acc + amount, 0)
    }

}

export { Super };