type Time = number;
type Units = number;
type Transaction = [Time, Units];

class Stock {

    rateOfReturn: number;
    initialPrice: number;
    initialTime: number;
    transactions: Array<Transaction>;

    constructor(rateOfReturn: number, initialTime: number, initialPrice: number, transactions: Array<Transaction>) {
        this.rateOfReturn = rateOfReturn;
        this.initialPrice = initialPrice;
        this.initialTime = initialTime;
        this.transactions = transactions;
    }

    getInitialPrice() {
        return this.initialPrice;
    }

    getInitialTime() {
        return this.initialTime;
    }

    getMonthlyRateOfReturn() {
        return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
    }

    getNumberOfUnits() {
        return this.transactions
            .reduce((acc, [_, units]) => acc + units, 0);
    }

    getPrice(time: number) {
        return this.getInitialPrice() * Math.pow(1 + this.getMonthlyRateOfReturn(), time - this.getInitialTime());
    }

    buyUnits(time: number, number: number) {
        // throw warning if not integer?
        return new Stock(
            this.rateOfReturn,
            this.getInitialTime(),
            this.getInitialPrice(),
            new Array(...this.transactions, [time, number]));
    }

    sellUnits(time: number, number: number) {
        // throw warning if not integer?
        if (number > this.getNumberOfUnits()) {
            console.error("Sold", number, "units but only have", this.getNumberOfUnits());
        }

        return new Stock(
            this.rateOfReturn,
            this.getInitialTime(),
            this.getInitialPrice(),
            new Array(...this.transactions, [time, -number]));
    }
}

export { Stock };