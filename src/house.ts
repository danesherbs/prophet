interface Props {
  houseValue: number;
  loan: number;
  yearlyInterestRate: number;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  monthsSincePurchase?: number;
  initialHouseValue?: number;
}

class House {
  houseValue: number;
  loan: number;
  yearlyInterestRate: number;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  monthsSincePurchase: number;
  initialHouseValue: number;

  constructor({
    houseValue,
    loan,
    yearlyInterestRate,
    yearlyAppreciationRate,
    monthlyGrossRentalIncome,
    yearlyRentalIncomeIncrease,
    buildingDepreciationRate,
    monthsSincePurchase,
    initialHouseValue,
  }: Props) {
    this.houseValue = houseValue;
    this.loan = loan;
    this.yearlyInterestRate = yearlyInterestRate;
    this.yearlyAppreciationRate = yearlyAppreciationRate;
    this.monthlyGrossRentalIncome = monthlyGrossRentalIncome;
    this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
    this.buildingDepreciationRate = buildingDepreciationRate;
    this.monthsSincePurchase = monthsSincePurchase || 0;
    this.initialHouseValue = initialHouseValue || houseValue;
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
      monthsSincePurchase: this.monthsSincePurchase,
      initialHouseValue: this.initialHouseValue,
    };
  }

  getMonthlyInterestRate() {
    return Math.pow(1 + this.yearlyInterestRate, 1 / 12) - 1;
  }

  getMonthlyInterestPayment() {
    return (this.loan * this.yearlyInterestRate) / 12;
  }

  getMonthlyGrossRentalIncome() {
    return this.monthlyGrossRentalIncome;
  }

  getHouseValue() {
    return this.houseValue;
  }

  getMonthlyDepreciationRate() {
    return Math.pow(1 + this.buildingDepreciationRate, 1 / 12) - 1;
  }

  getMonthlyDepreciationAmount() {
    return 0.66 * this.houseValue * this.getMonthlyDepreciationRate();
  }

  getEquity() {
    return this.houseValue - this.loan;
  }

  getCapitalGain() {
    return this.houseValue - this.initialHouseValue;
  }

  getMonthlyAppreciationRate() {
    return Math.pow(1 + this.yearlyAppreciationRate, 1 / 12) - 1;
  }

  waitOneMonth() {
    return new House({
      houseValue: this.houseValue * (1 + this.getMonthlyAppreciationRate()),
      loan: this.loan,
      yearlyInterestRate: this.yearlyInterestRate,
      yearlyAppreciationRate: this.yearlyAppreciationRate,
      monthlyGrossRentalIncome:
        (this.monthsSincePurchase + 1) % 12 === 0
          ? this.monthlyGrossRentalIncome *
            (1 + this.getYearlyRentalIncomeIncrease())
          : this.monthlyGrossRentalIncome,
      yearlyRentalIncomeIncrease: this.yearlyRentalIncomeIncrease,
      buildingDepreciationRate: this.buildingDepreciationRate,
      monthsSincePurchase: this.monthsSincePurchase + 1,
      initialHouseValue: this.initialHouseValue,
    });
  }

  waitOneYear() {
    let house: House = this;

    for (let i = 0; i < 12; i++) {
      house = house.waitOneMonth();
    }

    return house;
  }
}

export default House;
export type { Props };
