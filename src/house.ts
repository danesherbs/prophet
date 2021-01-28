interface Props {
  houseValue: number;
  loan: number;
  yearlyInterestRate: number;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  purchaseTime: number;
  description?: string;
}

class House {
  houseValue: number;
  loan: number;
  yearlyInterestRate: number;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  purchaseTime: number;
  description?: string;

  constructor({
    houseValue,
    loan,
    yearlyInterestRate,
    yearlyAppreciationRate,
    monthlyGrossRentalIncome,
    yearlyRentalIncomeIncrease,
    buildingDepreciationRate,
    purchaseTime,
    description,
  }: Props) {
    this.houseValue = houseValue;
    this.loan = loan;
    this.yearlyInterestRate = yearlyInterestRate;
    this.yearlyAppreciationRate = yearlyAppreciationRate;
    this.monthlyGrossRentalIncome = monthlyGrossRentalIncome;
    this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
    this.buildingDepreciationRate = buildingDepreciationRate;
    this.purchaseTime = purchaseTime;
    this.description = description;
  }

  getYearlyInterestRate() {
    /* istanbul ignore next */
    return this.yearlyInterestRate;
  }

  getYearlyRentalIncomeIncrease() {
    /* istanbul ignore next */
    return this.yearlyRentalIncomeIncrease;
  }

  getLoan() {
    /* istanbul ignore next */
    return this.loan;
  }

  getYearlyAppreciationRate() {
    /* istanbul ignore next */
    return this.yearlyAppreciationRate;
  }

  getBuildingDepreciationRate() {
    /* istanbul ignore next */
    return this.buildingDepreciationRate;
  }

  getPurchaseTime() {
    /* istanbul ignore next */
    return this.purchaseTime;
  }

  getDescription() {
    /* istanbul ignore next */
    return this.description;
  }

  getProps(): Props {
    /* istanbul ignore next */
    return {
      houseValue: this.houseValue,
      loan: this.loan,
      yearlyInterestRate: this.yearlyInterestRate,
      yearlyAppreciationRate: this.yearlyAppreciationRate,
      monthlyGrossRentalIncome: this.monthlyGrossRentalIncome,
      yearlyRentalIncomeIncrease: this.yearlyRentalIncomeIncrease,
      buildingDepreciationRate: this.buildingDepreciationRate,
      purchaseTime: this.purchaseTime,
      description: this.description,
    };
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getMonthlyInterestPayment() {
    return (this.loan * this.yearlyInterestRate) / 12;
  }

  getMonthlyGrossRentalIncome(time: number) {
    return (
      this.monthlyGrossRentalIncome *
      Math.pow(
        1 + this.yearlyRentalIncomeIncrease,
        Math.floor((time - this.purchaseTime) / 12)
      )
    );
  }

  getHouseValue(time: number) {
    return (
      this.houseValue *
      Math.pow(1 + this.getMonthlyAppreciationRate(), time - this.purchaseTime)
    );
  }

  getMonthlyDepreciationRate() {
    return Math.pow(1 + this.buildingDepreciationRate, 1 / 12) - 1;
  }

  getMonthlyDepreciationAmount(time: number) {
    return 0.66 * this.getHouseValue(time) * this.getMonthlyDepreciationRate();
  }

  getEquity(time: number) {
    return this.getHouseValue(time) - this.loan;
  }

  getCapitalGain(time: number) {
    return this.getEquity(time) - this.getEquity(0);
  }

  getMonthlyAppreciationRate() {
    return Math.pow(1 + this.yearlyAppreciationRate, 1 / 12) - 1;
  }
}

export default House;
export type { Props };
