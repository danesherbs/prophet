interface Props {
  houseValue: number;
  loan: number;
  interestRate: number;
  yearlyAppreciationRate: number;
  monthlyRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  purchaseTime: number;
}

class House {
  houseValue: number;
  loan: number;
  interestRate: number;
  yearlyAppreciationRate: number;
  monthlyRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  purchaseTime: number;

  constructor({
    houseValue,
    loan,
    interestRate,
    yearlyAppreciationRate,
    monthlyRentalIncome,
    yearlyRentalIncomeIncrease,
    buildingDepreciationRate,
    purchaseTime,
  }: Props) {
    this.houseValue = houseValue;
    this.loan = loan;
    this.interestRate = interestRate;
    this.yearlyAppreciationRate = yearlyAppreciationRate;
    this.monthlyRentalIncome = monthlyRentalIncome;
    this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
    this.buildingDepreciationRate = buildingDepreciationRate;
    this.purchaseTime = purchaseTime;
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.interestRate, 1 / 12) - 1;
  }

  getMonthlyInterestPayment() {
    return (this.loan * this.interestRate) / 12;
  }

  getMonthlyGrossRentalIncome(time: number) {
    return (
      this.monthlyRentalIncome *
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

  getLoan() {
    /* istanbul ignore next */
    return this.loan;
  }

  getYearlyAppreciationRate() {
    /* istanbul ignore next */
    return this.yearlyAppreciationRate;
  }

  getMonthlyAppreciationRate() {
    return Math.pow(1 + this.yearlyAppreciationRate, 1 / 12) - 1;
  }
}

export default House;
export { Props };
