interface Props {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialValue?: number;
  description?: string;
}

class Stock {
  numberOfUnits: number;
  pricePerUnit: number;
  rateOfReturn: number;
  initialValue?: number;
  description?: string;

  constructor({
    numberOfUnits,
    pricePerUnit,
    rateOfReturn,
    initialValue,
    description,
  }: Props) {
    this.numberOfUnits = numberOfUnits;
    this.pricePerUnit = pricePerUnit;
    this.rateOfReturn = rateOfReturn;
    this.initialValue = initialValue || numberOfUnits * pricePerUnit;
    this.description = description;
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

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  getProps(): Props {
    /* istanbul ignore next */
    if (this.description !== undefined) {
      return {
        numberOfUnits: this.numberOfUnits,
        pricePerUnit: this.pricePerUnit,
        rateOfReturn: this.rateOfReturn,
        description: this.description,
      };
    }

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
