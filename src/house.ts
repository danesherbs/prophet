import Loan, { Props as LoanProps } from "./loan";

interface Props {
  houseValue: number;
  loan: LoanProps;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  monthsSincePurchase?: number;
  initialHouseValue?: number;
}

class House {
  houseValue: number;
  loan: Loan;
  yearlyAppreciationRate: number;
  monthlyGrossRentalIncome: number;
  yearlyRentalIncomeIncrease: number;
  buildingDepreciationRate: number;
  monthsSincePurchase: number;
  initialHouseValue: number;

  constructor({
    houseValue,
    loan,
    yearlyAppreciationRate,
    monthlyGrossRentalIncome,
    yearlyRentalIncomeIncrease,
    buildingDepreciationRate,
    monthsSincePurchase,
    initialHouseValue,
  }: Props) {
    this.houseValue = houseValue;
    this.loan = new Loan(loan);
    this.yearlyAppreciationRate = yearlyAppreciationRate;
    this.monthlyGrossRentalIncome = monthlyGrossRentalIncome;
    this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
    this.buildingDepreciationRate = buildingDepreciationRate;
    this.monthsSincePurchase = monthsSincePurchase || 0;
    this.initialHouseValue = initialHouseValue || houseValue;
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
      yearlyAppreciationRate: this.yearlyAppreciationRate,
      monthlyGrossRentalIncome: this.monthlyGrossRentalIncome,
      yearlyRentalIncomeIncrease: this.yearlyRentalIncomeIncrease,
      buildingDepreciationRate: this.buildingDepreciationRate,
      monthsSincePurchase: this.monthsSincePurchase,
      initialHouseValue: this.initialHouseValue,
    };
  }

  getMonthlyInterestPayment() {
    return this.loan.getMonthlyPayment();
  }

  getMonthlyGrossRentalIncome() {
    return this.monthlyGrossRentalIncome;
  }

  getInitialHouseValue() {
    return this.initialHouseValue;
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
    return this.houseValue - this.loan.getAmountBorrowed();
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
