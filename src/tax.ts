import { Clock } from "./clock";

enum DeclarationType {
    Income = "Income",
    Loss = "Loss",
}

enum TaxType {
    Income = "Income",
    Super = "Super",
}

class Tax {

    clock: Clock;
    declared: Array<[number, number, DeclarationType]>;
    paid: Array<[number, number, TaxType]>;

    constructor(clock: Clock, declared: Array<[number, number, DeclarationType]>, paid: Array<[number, number, TaxType]>) {
        this.clock = clock;
        this.declared = declared;
        this.paid = paid;
    }

    getMonthlyIncomeTax(income: number) {
        return 0.3 * income;
    }

    getYearlyIncomeTax(income: number) {
        return 0.3 * income;
    }

    getMonthlySuperTax(income: number) {
        return 0.15 * income;
    }

    getTaxRecords() {
        return this.declared;
    }

    getTaxPaid() {
        return this.paid;
    }

    getDeclaredIncomeInCalendarYear(time: number) {
        return this.declared
            .filter(([t, _, type]) => time - (time % 12) <= t && t <= time && type === DeclarationType.Income)
            .reduce((acc, [_, amount]) => acc + amount, 0)
    }

    getPaidIncomeTaxInCalendarYear(time: number) {
        return this.paid
            .filter(([t, _, type]) => time - (time % 12) <= t && t <= time && type === TaxType.Income)
            .reduce((acc, [_, amount]) => acc + amount, 0)
    }

    getEndOfYearNetTax(time: number, deductions: number) {
        return this.getYearlyIncomeTax(this.getDeclaredIncomeInCalendarYear(time))
            - this.getPaidIncomeTaxInCalendarYear(time)
            - deductions;
    }

    declareIncome(amount: number) {
        return new Tax(
            this.clock,
            new Array(...this.declared, [this.clock.getTime(), amount, DeclarationType.Income]),
            this.paid);
    }

    declareLoss(amount: number) {
        return new Tax(
            this.clock,
            new Array(...this.declared, [this.clock.getTime(), amount, DeclarationType.Loss]),
            this.paid);
    }

    payTax(amount: number, type: TaxType) {
        return new Tax(
            this.clock,
            this.declared,
            new Array(...this.paid, [this.clock.getTime(), amount, type]));
    }

}

export { Tax, TaxType };