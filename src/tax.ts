enum DeclarationType {
    Income = "Income",
    Loss = "Loss",
}

enum TaxType {
    Income = "Income",
    Super = "Super",
}

type IncomeBracket = [number, number];
type TaxRate = number;
type TaxBracket = [IncomeBracket, TaxRate];

class Tax {

    incomeTaxBrackets: Array<TaxBracket>;
    declared: Array<[number, number, DeclarationType]>;
    paid: Array<[number, number, TaxType]>;

    constructor({ incomeTaxBrackets, declared, paid }: { incomeTaxBrackets: Array<TaxBracket>; declared: Array<[number, number, DeclarationType]>; paid: Array<[number, number, TaxType]>; }) {
        this.incomeTaxBrackets = incomeTaxBrackets;
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
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                declared: new Array(...this.declared, [time, amount, DeclarationType.Income]),
                paid: this.paid
            });
    }

    declareLoss(time: number, amount: number) {
        return new Tax(
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                declared: new Array(...this.declared, [time, amount, DeclarationType.Loss]),
                paid: this.paid
            });
    }

    payTax(time: number, amount: number, type: TaxType) {
        return new Tax(
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                declared: this.declared,
                paid: new Array(...this.paid, [time, amount, type])
            });
    }

}

export { Tax, TaxType };