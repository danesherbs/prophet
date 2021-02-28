interface Props {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialValue?: number;
}

class Stock {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialValue?: number;

  constructor({
    numberOfUnits,
    pricePerUnit,
    rateOfReturn,
    initialValue,
  }: Props) {
    this.numberOfUnits = numberOfUnits;
    this.pricePerUnit = pricePerUnit;
    this.rateOfReturn = rateOfReturn;
    this.initialValue = initialValue || numberOfUnits * pricePerUnit;
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

  getProps(): Props {
    /* istanbul ignore next */
    return {
      numberOfUnits: this.numberOfUnits,
      pricePerUnit: this.pricePerUnit,
      rateOfReturn: this.rateOfReturn,
    };
  }

  getMonthlyRateOfReturn() {
    return Math.pow(1 + this.rateOfReturn, 1 / 12) - 1;
  }

  getTotalValue() {
    return this.getNumberOfUnits() * this.getPricePerUnit();
  }

  getInitialValue() {
    return this.initialValue || this.getTotalValue();
  }

  waitOneMonth() {
    return new Stock({
      numberOfUnits: this.numberOfUnits,
      pricePerUnit: this.pricePerUnit * (1 + this.getMonthlyRateOfReturn()),
      rateOfReturn: this.rateOfReturn,
      initialValue: this.initialValue,
    });
  }
}

export default Stock;
export type { Props };
