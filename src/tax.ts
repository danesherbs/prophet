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
    superTaxRate: number;
    declared: Array<[number, number, DeclarationType]>;
    paid: Array<[number, number, TaxType]>;

    constructor({ incomeTaxBrackets, superTaxRate, declared, paid }: { incomeTaxBrackets: Array<TaxBracket>; superTaxRate: number, declared: Array<[number, number, DeclarationType]>; paid: Array<[number, number, TaxType]>; }) {
        this.incomeTaxBrackets = incomeTaxBrackets;
        this.superTaxRate = superTaxRate;
        this.declared = declared;
        this.paid = paid;
    }

    getYearlyIncomeTax(income: number) {
        return this.incomeTaxBrackets.reduce((acc, [[lo, hi], rate]) => {
            return acc + Math.min(Math.max(0, income - lo), hi - lo) * rate;
        }, 0)
    }

    getMonthlyIncomeTax(income: number) {
        return this.getYearlyIncomeTax(income) / 12;
    }

    getMonthlySuperTax(monthlyGrossSuperContribution: number) {
        return this.superTaxRate * monthlyGrossSuperContribution;
    }

    getDeclaredIncomeOverLastTwelveMonths(time: number) {
        /*
        Gets declared income in last 12 months, upto and including the current month.

        Example:
        --------
        If called on June 2020, it'd calculate the declared income from July 2019 to June 2020.
        */
        return this.declared
            .filter(([t, , type]) => time - 12 < t && t <= time && type === DeclarationType.Income)
            .reduce((acc, [, amount,]) => acc + amount, 0);
    }

    getLossesOverLastTwelveMonths(time: number) {
        /*
        Gets losses in last 12 months, upto and including the current month.

        Example:
        --------
        If called on June 2020, it'd calculate the losses from July 2019 to June 2020.
        */
        return this.declared
            .filter(([t, , type]) => time - 12 < t && t <= time && type === DeclarationType.Loss)
            .reduce((acc, [, amount]) => acc + amount, 0)
    }

    getPaidIncomeTaxOverLastTwelveMonths(time: number) {
        /*
        Gets paid income tax in last 12 months, upto and including the current month.

        Example:
        --------
        If called on June 2020, it'd calculate the paid income tax from July 2019 to June 2020.
        */
        return this.paid
            .filter(([t, , type]) => time - 12 < t && t <= time && type === TaxType.Income)
            .reduce((acc, [, amount]) => acc + amount, 0)
    }

    getNetUnpaidTaxOverLastTwelveMonths(time: number) {
        return this.getYearlyIncomeTax(this.getDeclaredIncomeOverLastTwelveMonths(time))
            - this.getPaidIncomeTaxOverLastTwelveMonths(time)
            - this.getLossesOverLastTwelveMonths(time);
    }

    declareIncome(time: number, amount: number) {
        return new Tax(
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                superTaxRate: this.superTaxRate,
                declared: new Array(...this.declared, [time, amount, DeclarationType.Income]),
                paid: this.paid
            });
    }

    declareLoss(time: number, amount: number) {
        return new Tax(
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                superTaxRate: this.superTaxRate,
                declared: new Array(...this.declared, [time, amount, DeclarationType.Loss]),
                paid: this.paid
            });
    }

    payTax(time: number, amount: number, type: TaxType) {
        return new Tax(
            {
                incomeTaxBrackets: this.incomeTaxBrackets,
                superTaxRate: this.superTaxRate,
                declared: this.declared,
                paid: new Array(...this.paid, [time, amount, type])
            });
    }

}

export { Tax, TaxType };