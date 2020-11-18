import { Tax } from "./tax";


class House {

    tax: Tax;
    downPayment: number;
    loan: number;
    interestRate: number;
    appreciation: number;
    monthlyRentalIncome: number;
    yearlyRentalIncomeIncrease: number;
    buildingDepreciation: number;
    purchaseTime: number;

    constructor(
        { tax, downPayment, loan, interestRate, appreciation, monthlyRentalIncome, yearlyRentalIncomeIncrease, buildingDepreciation, purchaseTime }: { tax: Tax; downPayment: number; loan: number; interestRate: number; appreciation: number; monthlyRentalIncome: number; yearlyRentalIncomeIncrease: number; buildingDepreciation: number; purchaseTime: number; }) {
        this.tax = tax;
        this.downPayment = downPayment;
        this.loan = loan;
        this.interestRate = interestRate;
        this.appreciation = appreciation;
        this.monthlyRentalIncome = monthlyRentalIncome;
        this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
        this.buildingDepreciation = buildingDepreciation;
        this.purchaseTime = purchaseTime;
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getMonthlyInterestPayment() {
        return this.loan * this.getMonthlyInterestRate();
    }

    getMonthlyGrossRentalIncome(time: number) {
        return this.monthlyRentalIncome * Math.pow(1 + this.yearlyRentalIncomeIncrease, Math.floor((time - this.purchaseTime) / 12));
    }

    getMonthlyNetRentalIncome(time: number) {
        return this.getMonthlyGrossRentalIncome(time) - this.tax.getMonthlyIncomeTax(this.getMonthlyGrossRentalIncome(time));
    }

    getHouseValue(time: number) {
        return (this.downPayment + this.loan) * Math.pow(1 + this.getMonthlyInterestRate(), time - this.purchaseTime);
    }

    getYearlyDepreciation(time: number) {
        return this.getHouseValue(time) * this.buildingDepreciation;
    }

    getEquity(time: number) {
        return this.getHouseValue(time) - this.loan;
    }

    getDownPayment() {
        return this.downPayment;
    }

    getLoan() {
        return this.loan;
    }

}

export { House };