import { Clock } from "./clock";
import { Tax } from "./tax";


class House {

    clock: Clock;
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
        clock: Clock,
        tax: Tax,
        downPayment: number,
        loan: number,
        interestRate: number,
        appreciation: number,
        monthlyRentalIncome: number,
        yearlyRentalIncomeIncrease: number,
        buildingDepreciation: number) {
        this.clock = clock;
        this.tax = tax;
        this.downPayment = downPayment;
        this.loan = loan;
        this.interestRate = interestRate;
        this.appreciation = appreciation;
        this.monthlyRentalIncome = monthlyRentalIncome;
        this.yearlyRentalIncomeIncrease = yearlyRentalIncomeIncrease;
        this.buildingDepreciation = buildingDepreciation;
        this.purchaseTime = clock.getTime()
    }

    getMonthlyInterestRate() {
        return Math.pow(1 + this.interestRate, 1 / 12) - 1;
    }

    getMonthlyInterestPayment() {
        return this.loan * this.getMonthlyInterestRate();
    }

    getMonthlyGrossRentalIncome() {
        return this.monthlyRentalIncome * (1 + this.yearlyRentalIncomeIncrease) ** this.clock.yearsPassedSince(this.purchaseTime);
    }

    getMonthlyNetRentalIncome() {
        return this.getMonthlyGrossRentalIncome() - this.tax.getMonthlyIncomeTax(this.getMonthlyGrossRentalIncome());
    }

    getHouseValue() {
        return (this.downPayment + this.loan) * (1 + this.getMonthlyInterestRate()) ** this.clock.monthsPassedSince(this.purchaseTime);
    }

    getYearlyDepreciation() {
        return this.getHouseValue() * this.buildingDepreciation;
    }

}

export { House };