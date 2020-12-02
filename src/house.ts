import Tax from "./tax";


class House {

    tax: Tax;
    houseValue: number;
    loan: number;
    interestRate: number;
    appreciation: number;
    monthlyRentalIncome: number;
    yearlyRentalIncomeIncrease: number;
    buildingDepreciationRate: number;
    purchaseTime: number;

    constructor(
        { tax, houseValue, loan, interestRate, appreciation, monthlyRentalIncome, yearlyRentalIncomeIncrease, buildingDepreciationRate, purchaseTime }: { tax: Tax; houseValue: number; loan: number; interestRate: number; appreciation: number; monthlyRentalIncome: number; yearlyRentalIncomeIncrease: number; buildingDepreciationRate: number; purchaseTime: number; }) {
        this.tax = tax;
        this.houseValue = houseValue;
        this.loan = loan;
        this.interestRate = interestRate;
        this.appreciation = appreciation;
        this.monthlyRentalIncome = monthlyRentalIncome;
        this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
        this.buildingDepreciationRate = buildingDepreciationRate;
        this.purchaseTime = purchaseTime;
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getMonthlyInterestPayment() {
        return this.loan * this.interestRate / 12;
    }

    getMonthlyGrossRentalIncome(time: number) {
        return this.monthlyRentalIncome * Math.pow(1 + this.yearlyRentalIncomeIncrease, Math.floor((time - this.purchaseTime) / 12));
    }

    getHouseValue(time: number) {
        return this.houseValue * Math.pow(1 + this.getMonthlyInterestRate(), time - this.purchaseTime);
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

}


export default House;
