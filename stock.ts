import { Clock } from "./clock";

type Time = number;
type Units = number;
type Transaction = [Time, Units];

class Stock {

    clock: Clock;
    rateOfReturn: number;
    initialPrice: number;
    transactions: Array<Transaction>;

    constructor(clock: Clock, rateOfReturn: number, initialPrice: number, transactions: Array<Transaction>) {
        this.clock = clock;
        this.rateOfReturn = rateOfReturn;
        this.initialPrice = initialPrice;
        this.transactions = transactions;
    }

    getNumberOfUnits() {
        return this.transactions
            .reduce((acc, [_, units]) => acc + units, 0);
    }

    getMonthlyRateOfReturn() {
        return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
    }

    getPrice() {
        return this.initialPrice * (1 + this.getMonthlyRateOfReturn()) ** this.clock.monthsPassedSince(this.clock.getTime());
    }

    buyUnits(number: number) {
        // throw warning if not integer?
        return new Stock(
            this.clock,
            this.rateOfReturn,
            this.initialPrice,
            new Array(...this.transactions, [this.clock.getTime(), number]));
    }

    sellUnits(number: number) {
        // throw warning if not integer?
        if (number > this.getNumberOfUnits()) {
            console.error("Sold", number, "units but only have", this.getNumberOfUnits());
        }

        return new Stock(
            this.clock,
            this.rateOfReturn,
            this.initialPrice,
            new Array(...this.transactions, [this.clock.getTime(), -number]));
    }

}

export { Stock };