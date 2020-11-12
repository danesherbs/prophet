enum DeclarationType {
    Income = "Income",
    Loss = "Loss",
}

enum TaxType {
    Income = "Income",
    Super = "Super",
}

class Tax {

    declared: Array<[number, number, DeclarationType]>;
    paid: Array<[number, number, TaxType]>;

    constructor(declared: Array<[number, number, DeclarationType]>, paid: Array<[number, number, TaxType]>) {
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

    declareIncome(time: number, amount: number) {
        return new Tax(
            new Array(...this.declared, [time, amount, DeclarationType.Income]),
            this.paid);
    }

    declareLoss(time: number, amount: number) {
        return new Tax(
            new Array(...this.declared, [time, amount, DeclarationType.Loss]),
            this.paid);
    }

    payTax(time: number, amount: number, type: TaxType) {
        return new Tax(
            this.declared,
            new Array(...this.paid, [time, amount, type]));
    }

}

export { Tax, TaxType };