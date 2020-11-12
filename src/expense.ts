import { Clock } from "./clock";


class Expense {

    clock: Clock;
    yearlyIncrease: number;
    monthlyAmount: number;
    description: string;
    initialTime: number;

    constructor({ clock, yearlyIncrease, amount, description }: { clock: Clock; yearlyIncrease: number; amount: number; description: string; }) {
        this.clock = clock;
        this.yearlyIncrease = yearlyIncrease;
        this.monthlyAmount = amount;
        this.description = description;
        this.initialTime = clock.getTime();
    }

    getMonthlyAmount() {
        return this.monthlyAmount * (1 + this.yearlyIncrease) ** this.clock.yearsPassedSince(this.initialTime);
    }

    getDescription() {
        return this.description;
    }

}

export { Expense };