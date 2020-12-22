type Time = number;
type Units = number;
type Transaction = [Time, Units];

interface Props {
  rateOfReturn: number;
  initialTime: number;
  initialPrice: number;
  transactions: Array<Transaction>;
  description?: string;
}

class Stock {
  rateOfReturn: number;
  initialPrice: number;
  initialTime: number;
  transactions: Array<Transaction>;
  description?: string;

  constructor({
    rateOfReturn,
    initialTime,
    initialPrice,
    transactions,
    description,
  }: Props) {
    this.rateOfReturn = rateOfReturn;
    this.initialPrice = initialPrice;
    this.initialTime = initialTime;
    this.transactions = transactions;
    this.description = description;
  }

  getRateOfReturn() {
    /* istanbul ignore next */
    return this.rateOfReturn;
  }

  getInitialPrice() {
    /* istanbul ignore next */
    return this.initialPrice;
  }

  getInitialTime() {
    /* istanbul ignore next */
    return this.initialTime;
  }

  getTransactions() {
    /* istanbul ignore next */
    return this.transactions;
  }

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  getMonthlyRateOfReturn() {
    return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
  }

  getNumberOfUnits() {
    return this.transactions.reduce((acc, [_, units]) => acc + units, 0);
  }

  getPrice(time: number) {
    return (
      this.getInitialPrice() *
      Math.pow(1 + this.getMonthlyRateOfReturn(), time - this.getInitialTime())
    );
  }

  buyUnits(time: number, number: number) {
    if (!Number.isInteger(time)) {
      throw new TypeError("Excpect time to be an integer but got " + time);
    }

    if (!Number.isInteger(number)) {
      throw new TypeError(
        "Excpect number of units to be an integer but got " + number
      );
    }

    if (number <= 0) {
      throw new RangeError(
        "Excpect number of units to be non-negative but got " + number
      );
    }

    return new Stock({
      rateOfReturn: this.rateOfReturn,
      initialTime: this.getInitialTime(),
      initialPrice: this.getInitialPrice(),
      transactions: new Array(...this.transactions, [time, number]),
    });
  }

  sellUnits(time: number, number: number) {
    if (!Number.isInteger(time)) {
      throw new TypeError("Excpect time to be an integer but got " + time);
    }

    if (!Number.isInteger(number)) {
      throw new TypeError(
        "Excpect number of units to be an integer but got " + number
      );
    }

    if (number <= 0) {
      throw new RangeError(
        "Excpect number of units to be non-negative but got " + number
      );
    }

    if (number > this.getNumberOfUnits()) {
      throw new RangeError(
        "Tried to sell " +
          number +
          " units but only have " +
          this.getNumberOfUnits()
      );
    }

    return new Stock({
      rateOfReturn: this.rateOfReturn,
      initialTime: this.getInitialTime(),
      initialPrice: this.getInitialPrice(),
      transactions: new Array(...this.transactions, [time, -number]),
    });
  }
}

export default Stock;
export type { Props };
