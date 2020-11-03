import { Clock } from "./clock";


class Stock {

    clock: Clock;
    rateOfReturn: number;
    initialPrice: number;
    timeOfPurchase: number;
    numberOfUnits: number;

    constructor(clock: Clock, timeOfPurchase: number, rateOfReturn: number, initialPrice: number, numberOfUnits: number) {
        this.clock = clock;
        this.timeOfPurchase = timeOfPurchase;
        this.rateOfReturn = rateOfReturn;
        this.initialPrice = initialPrice;
        this.numberOfUnits = numberOfUnits;
    }

    getNumberOfUnits() {
        return this.numberOfUnits;
    }

    getMonthlyRateOfReturn() {
        return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
    }

    getPrice() {
        return this.initialPrice * (1 + this.getMonthlyRateOfReturn()) ** this.clock.monthsPassedSince(this.timeOfPurchase);
    }

    buyUnits(number: number) {
        // throw warning if not integer?
        return new Stock(this.clock, this.timeOfPurchase, this.rateOfReturn, this.initialPrice, this.numberOfUnits + number);
    }

}

export { Stock };