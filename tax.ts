import { Clock } from "./clock";

enum TaxType {
    Income,
    CapitalGains,
    Super
}

class Tax {

    clock: Clock;
    declared: Array<[number, number]>;
    paid: Array<[number, number]>;

    constructor(clock: Clock, declared: Array<[number, number]>, paid: Array<[number, number]>) {
        this.clock = clock;
        this.declared = declared;
        this.paid = paid;
    }

    getIncomeTax(income: number) {
        return 0.3 * income;
    }

    getTaxRecords() {
        return this.declared;
    }

    getDeclaredIncomeInCalendarYear(time: number) {
        return this.declared
            .filter(([t, _]) => time - (time % 12) <= t && t <= time)
            .reduce((acc, [_, amount]) => acc + amount, 0)
    }

    getPaidIncomeTaxInCalendarYear(time: number) {
        return this.paid
            .filter(([t, _]) => time - (time % 12) <= t && t <= time)
            .reduce((acc, [_, amount]) => acc + amount, 0)
    }

    getEndOfYearNetTax(time: number, deductions: number) {
        return this.getIncomeTax(this.getDeclaredIncomeInCalendarYear(time))
            - this.getPaidIncomeTaxInCalendarYear(time)
            - deductions;
    }

    declareIncome(amount: number) {
        return new Tax(
            this.clock,
            new Array<[number, number]>(...this.declared, [this.clock.getTime(), amount]),
            this.paid);
    }

    payTax(amount: number) {
        return new Tax(
            this.clock,
            this.declared,
            new Array<[number, number]>(...this.paid, [this.clock.getTime(), amount]));
    }

}

export { Tax };