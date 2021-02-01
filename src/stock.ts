interface Props {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialTime: number;
}

class Stock {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialTime: number;

  constructor({
    numberOfUnits,
    pricePerUnit,
    rateOfReturn,
    initialTime,
  }: Props) {
    this.numberOfUnits = numberOfUnits;
    this.pricePerUnit = pricePerUnit;
    this.rateOfReturn = rateOfReturn;
    this.initialTime = initialTime;
  }

  getNumberOfUnits() {
    /* istanbul ignore next */
    return this.numberOfUnits;
  }

  getPricePerUnit() {
    /* istanbul ignore next */
    return this.pricePerUnit;
  }

  getRateOfReturn() {
    /* istanbul ignore next */
    return this.rateOfReturn;
  }

  getInitialTime() {
    /* istanbul ignore next */
    return this.initialTime;
  }

  getProps(): Props {
    /* istanbul ignore next */
    return {
      numberOfUnits: this.numberOfUnits,
      pricePerUnit: this.pricePerUnit,
      rateOfReturn: this.rateOfReturn,
      initialTime: this.initialTime,
    };
  }

  getMonthlyRateOfReturn() {
    return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
  }

  getTotalValue(time: number) {
    return (
      this.getNumberOfUnits() *
      this.getPricePerUnit() *
      Math.pow(1 + this.getMonthlyRateOfReturn(), time - this.getInitialTime())
    );
  }
}

export default Stock;
export type { Props };
